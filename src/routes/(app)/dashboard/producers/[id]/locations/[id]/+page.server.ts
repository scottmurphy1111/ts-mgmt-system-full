import { client } from '$lib/server/prisma';
import type { RouteParamsApp, LocationWithIncludes } from '$lib/types/types';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params }) => {
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
	saveContact: async ({ request }) => {
		const formData = await request.formData();

		console.log('formData', formData);

		const locationId = formData.get('locationId');
		console.log('locationId', locationId);
		const id = formData.get('id');
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const phone = formData.get('phone');
		const email = formData.get('email');
		const role = formData.get('role');

		try {
			let contact;
			if (!id) {
				contact = await client.locationContact.create({
					data: {
						firstName: firstName as string,
						lastName: lastName as string,
						phone: phone as string,
						email: email as string,
						role: role as string,
						locationId: locationId as string
					}
				});
			} else {
				contact = await client.locationContact.update({
					where: {
						id: id as string
					},
					data: {
						firstName: firstName as string,
						lastName: lastName as string,
						phone: phone as string,
						email: email as string,
						role: role as string,
						locationId: locationId as string
					}
				});
			}

			const location = await client.tsLocation.findUnique({
				where: {
					id: locationId as string
				}
			});

			return { contact, location };
		} catch (e) {
			return fail(422, {
				saveContactError: 'Error Saving Contact, make sure the Email is unique!'
			});
		}
	},
	savePrograms: async ({ request }) => {
		const formData = await request.formData();

		const locationId = formData.get('locationId') as string;
		const programIds = formData.getAll('programId') as string[];
		const programNames = formData.getAll('programName') as string[];
		const termValues = formData.getAll('termValue') as string[];
		const markupValues = formData.getAll('markupValue') as string[];

		console.log('locationId', locationId);
		console.log('programIds', programIds);
		console.log('programNames', programNames);
		console.log('termValues', termValues);
		console.log('markupValues', markupValues);

		const formattedPrograms = programNames.reduce(
			(acc, current, index) => {
				acc[current] = {
					id: programIds[index],
					markups: {
						[termValues[index * 4 + 0]]: markupValues[index * 4 + 0],
						[termValues[index * 4 + 1]]: markupValues[index * 4 + 1],
						[termValues[index * 4 + 2]]: markupValues[index * 4 + 2],
						[termValues[index * 4 + 3]]: markupValues[index * 4 + 3]
					}
				};

				console.log('acc', acc);
				return acc;
			},
			{} as Record<string, { id: string; markups: Record<string, string> }>
		);

		try {
			const createPrograms = Object.entries(formattedPrograms).map(([programName, program], i) => {
				return client.locationProgram.upsert({
					where: {
						id: program.id === programIds[i] ? program.id : undefined
					},
					update: {
						locationMarkups: {
							updateMany: Object.entries(program.markups).map(([termValue, markupValue]) => {
								return {
									where: {
										termValue
									},
									data: {
										markupValue
									}
								};
							})
						}
					},
					create: {
						name: programName,
						locationId,
						locationMarkups: {
							create: Object.entries(program.markups).map(([termValue, markupValue]) => {
								return {
									termValue,
									markupValue
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

			return {
				createPrograms
			};
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
