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

	const producerStatus = await client.producer.findFirst({
		where: {
			id: location?.producerId as string
		},
		select: {
			status: true
		}
	});

	return {
		location: location as LocationWithIncludes,
		producerStatus: producerStatus
	};
};

export const actions: Actions = {
	saveContact: async ({ request, params }) => {
		const formData = await request.formData();

		console.log('formData', formData);

		const locationId = params.id as string;
		const id = formData.get('id') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const phone = formData.get('phone') as string;
		const email = formData.get('email') as string;
		const title = formData.get('title') as string;
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
						title: title,
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
						title: title,
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
			console.log('e', e);
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
	},
	saveLocation: async ({ request }) => {
		const formData = await request.formData();

		console.log('formData', formData);

		const locationId = formData.get('locationId') as string;
		console.log('locationId', locationId);
		const producerId = formData.get('producerId') as string;
		console.log('producerId', producerId);
		const name = formData.get('name') as string;
		const phone = formData.get('phone') as string;
		const email = formData.get('email') as string;
		const website = formData.get('website') as string;
		const address = formData.get('address') as string;
		const city = formData.get('city') as string;
		const state = formData.get('state') as string;
		const zip = formData.get('zip') as string;
		const country = formData.get('country') as string;
		const mailingAddress = formData.get('mailingAddress') as string;
		const mailingCity = formData.get('mailingCity') as string;
		const mailingState = formData.get('mailingState') as string;
		const mailingZip = formData.get('mailingZip') as string;
		const mailingCountry = formData.get('mailingCountry') as string;
		const tsSalesRepId = formData.get('tsSalesRepId') as string;
		console.log('tsSalesRepId', tsSalesRepId);
		const main = formData.get('main');
		console.log('main', main);

		if (!phone.match(/^(\+|)(1|)\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
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
			let location;
			if (!locationId) {
				location = await client.tsLocation.create({
					data: {
						name: name as string,
						phone: phone as string,
						email: email as string,
						website: website as string,
						address: address as string,
						city: city as string,
						state: state as string,
						zip: zip as string,
						country: country as string,
						mailingAddress: mailingAddress as string,
						mailingCity: mailingCity as string,
						mailingState: mailingState as string,
						mailingZip: mailingZip as string,
						mailingCountry: mailingCountry as string,
						tsSalesRepId: tsSalesRepId as string,
						producerId: producerId as string,
						main: main === 'on' ? true : false
						// programs: {
						// 	create: formattedProducerPrograms.map((program) => {
						// 		return {
						// 			name: program[Object.keys(program)[0]].name,
						// 			markups: {
						// 				create: program[Object.keys(program)[0]].markups.map((markup) => {
						// 					return {
						// 						termValue: markup.termValue,
						// 						markupValue: markup.markupValue
						// 					};
						// 				})
						// 			}
						// 		};
						// 	})
						// }
					}
				});
			} else {
				location = await client.tsLocation.update({
					where: {
						id: locationId as string
					},
					data: {
						name: name as string,
						phone: phone as string,
						email: email as string,
						website: website as string,
						address: address as string,
						city: city as string,
						state: state as string,
						zip: zip as string,
						country: country as string,
						mailingAddress: mailingAddress as string,
						mailingCity: mailingCity as string,
						mailingState: mailingState as string,
						mailingZip: mailingZip as string,
						mailingCountry: mailingCountry as string,
						tsSalesRepId: tsSalesRepId as string,
						producerId: producerId as string,
						main: main === 'on' ? true : false
						// programs: {
						// 	create: formattedProducerPrograms.map((program) => {
						// 		return {
						// 			name: program[Object.keys(program)[0]].name,
						// 			markups: {
						// 				create: program[Object.keys(program)[0]].markups.map((markup) => {
						// 					return {
						// 						termValue: markup.termValue,
						// 						markupValue: markup.markupValue
						// 					};
						// 				})
						// 			}
						// 		};
						// 	})
						// }
					}
				});
			}
			const producer = await client.producer.findUnique({
				where: {
					id: producerId as string
				},
				include: {
					locations: true
				}
			});

			return { location, producer };
		} catch (e) {
			return fail(422, {
				saveLocationError: `Error Saving Location, Please try again! ${e}`
			});
		}

		// saveContact: async ({ request }) => {
		// 	const formData = await request.formData();

		// 	console.log('formData', formData);

		// 	const locationId = formData.get('locationId');
		// 	console.log('locationId', locationId);
		// 	const id = formData.get('id');
		// 	const firstName = formData.get('firstName');
		// 	const lastName = formData.get('lastName');
		// 	const phone = formData.get('phone');
		// 	const email = formData.get('email');
		// 	const role = formData.get('role');

		// 	let contact;

		// 	if (!id) {
		// 		contact = await client.locationContact.create({
		// 			data: {
		// 				firstName: firstName as string,
		// 				lastName: lastName as string,
		// 				phone: phone as string,
		// 				email: email as string,
		// 				role: role as string,
		// 				locationId: locationId as string
		// 			}
		// 		});
		// 	} else {
		// 		contact = await client.locationContact.update({
		// 			where: {
		// 				id: id as string
		// 			},
		// 			data: {
		// 				firstName: firstName as string,
		// 				lastName: lastName as string,
		// 				phone: phone as string,
		// 				email: email as string,
		// 				role: role as string,
		// 				locationId: locationId as string
		// 			}
		// 		});
		// 	}

		// 	const location = await client.tsLocation.findUnique({
		// 		where: {
		// 			id: locationId as string
		// 		}
		// 	});

		// 	return { contact, location };
		// }
	}
};
