import { client } from '$lib/server/prisma';
import type { RouteParamsApp, LocationWithIncludes } from '$lib/types/types';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, depends }) => {
	depends('data:location');
	const location = await client.tsLocation.findUnique({
		where: {
			id: (params as RouteParamsApp).id as string
		},
		include: {
			locationPrograms: {
				include: {
					locationMarkups: true
				}
			},
			locationContacts: true,
			locationNotes: true
		}
	});

	return {
		location: location as LocationWithIncludes
	};
};

export const actions: Actions = {
	saveContact: async ({ request, params }) => {
		const formData = await request.formData();

		console.log('formData', formData);

		const locationId = params.id as string;
		console.log('locationId', locationId);
		const id = formData.get('id') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const phone = formData.get('phone') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as string;

		if (phone && !phone.match(/^(\+|)(1|)\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
			console.log('invalid phone number', phone);
			return fail(400, {
				phone,
				invalidPhone: true
			});
		}

		if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
			console.log('invalid email', email);
			return fail(400, {
				email,
				invalidEmail: true
			});
		}

		try {
			let contact;
			if (!id) {
				contact = await client.locationContact.create({
					data: {
						firstName: firstName,
						lastName: lastName,
						phone: phone,
						email: email,
						role: role,
						locationId: locationId
					}
				});
			} else {
				contact = await client.locationContact.update({
					where: {
						id: id
					},
					data: {
						firstName: firstName,
						lastName: lastName,
						phone: phone,
						email: email,
						role: role,
						locationId: locationId
					}
				});
			}

			const location = await client.tsLocation.findUnique({
				where: {
					id: locationId
				}
			});

			return { contact, location };
		} catch (e) {
			return fail(422, {
				saveContactError: `Error Saving Contact, make sure the Email is unique!`
			});
		}
	},
	savePrograms: async ({ request, params }) => {
		console.log('params', params);
		const formData = await request.formData();

		const programIds = formData.getAll('programId') as string[];
		const programNames = formData.getAll('programName') as string[];
		const markupIds = formData.getAll('markupId') as string[];
		const termValues = formData.getAll('termValue') as string[];
		const markupValues = formData.getAll('markupValue') as string[];

		console.log('programIds', programIds);
		console.log('markupIds', markupIds);
		console.log('programNames', programNames);
		console.log('termValues', termValues);
		console.log('markupValues', markupValues);

		const formattedPrograms = programNames.reduce(
			(acc, current, index) => {
				acc[current] = {
					id: programIds[index],
					markups: [
						{
							id: markupIds[index * 4 + 0],
							termValue: termValues[index * 4 + 0],
							markupValue: markupValues[index * 4 + 0]
						},
						{
							id: markupIds[index * 4 + 1],
							termValue: termValues[index * 4 + 1],
							markupValue: markupValues[index * 4 + 1]
						},
						{
							id: markupIds[index * 4 + 2],
							termValue: termValues[index * 4 + 2],
							markupValue: markupValues[index * 4 + 2]
						},
						{
							id: markupIds[index * 4 + 3],
							termValue: termValues[index * 4 + 3],
							markupValue: markupValues[index * 4 + 3]
						}
					]
				};

				console.log('acc', acc);
				return acc;
			},
			{} as Record<
				string,
				{ id: string; markups: { id: string; termValue: string; markupValue: string }[] }
			>
		);

		console.log('formattedPrograms', formattedPrograms);
		try {
			const createPrograms = Object.entries(formattedPrograms).map(([programName, program], i) => {
				console.log('programName', programName);
				console.log('program', program);

				return client.locationProgram.upsert({
					where: {
						id: program.id === programIds[i] ? program.id : undefined
					},
					update: {
						locationMarkups: {
							update: program.markups.map((markup) => {
								return {
									where: {
										id: markup.id
									},
									data: {
										termValue: markup.termValue,
										markupValue: markup.markupValue
									}
								};
							})
						}
					},
					create: {
						name: programName,
						locationId: params.id as string,
						locationMarkups: {
							create: program.markups.map((markup) => {
								return {
									termValue: markup.termValue,
									markupValue: markup.markupValue
								};
							})
						}
					}
					// data: {
					// 	name: programName,
					// 	locationId,
					// 	locationMarkups: {
					// 		create: Object.entries(program.markups).map(([termValue, markupValue]) => {
					// 			return {
					// 				termValue,
					// 				markupValue
					// 			};
					// 		})
					// 	}
					// }
				});
			});

			client.$transaction(createPrograms);

			return { success: true };
		} catch (e) {
			return fail(422, {
				saveProgramsError: `Error Saving Programs, Please try again! ${e}`
			});
		}
	},
	saveNote: async ({ request, params }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const note = formData.get('note') as string;

		if (!note.trim())
			return fail(422, {
				saveNoteError: 'Note is required!'
			});

		try {
			let locationNote;
			if (!id) {
				locationNote = await client.locationNote.create({
					data: {
						note,
						locationId: params.id as string
					}
				});
			} else {
				locationNote = await client.locationNote.update({
					where: {
						id
					},
					data: {
						note
					}
				});
			}

			const location = await client.tsLocation.findUnique({
				where: {
					id: params.id as string
				}
			});

			return { locationNote, location };
		} catch (e) {
			return fail(422, {
				saveNoteError: 'Error Saving Note, Please try again!'
			});
		}
	}
};
