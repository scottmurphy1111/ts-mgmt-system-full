import { client } from '$lib/server/prisma';
import type { ProducerWithIncludes, RouteParamsApp } from '$lib/types/types';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params }) => {
	const producer = await client.producer.findUnique({
		where: {
			id: (params as RouteParamsApp).id as string
		},
		include: {
			locations: true
		}
	});

	// console.log('producer', producer);
	return {
		producer: producer as ProducerWithIncludes
	};
};

export const actions: Actions = {
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
