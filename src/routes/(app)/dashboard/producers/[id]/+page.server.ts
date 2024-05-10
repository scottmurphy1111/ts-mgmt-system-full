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

	return {
		producer: producer as ProducerWithIncludes
	};
};

export const actions: Actions = {
	saveLocation: async ({ request }) => {
		const formData = await request.formData();

		const locationId = formData.get('locationId') as string;
		const producerId = formData.get('producerId') as string;
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
		const main = formData.get('main');

		if (!phone.match(/^(\+|)(1|)\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
			return fail(400, {
				phone,
				invalidPhone: true
			});
		}

		if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
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
	},
	updateProducer: async ({ request, params }) => {
		const formData = await request.formData();

		const producerId = params.id as string;
		const name = formData.get('name') as string;
		const dba = formData.get('dba') as string;
		const taxId = formData.get('taxId') as string;
		const website = formData.get('website') as string;
		const type = formData.get('type') as string;
		const address = formData.get('address') as string;
		const city = formData.get('city') as string;
		const state = formData.get('state') as string;
		const zip = formData.get('zip') as string;
		const country = formData.get('country') as string;
		const primaryContactName = formData.get('primaryContactName') as string;
		const primaryContactPhone = formData.get('primaryContactPhone') as string;
		const primaryContactEmail = formData.get('primaryContactEmail') as string;
		const primaryContactTitle = formData.get('primaryContactTitle') as string;
		const tsSalesRepId = formData.get('tsSalesRepId') as string;

		if (!primaryContactPhone.match(/^(\+|)(1|)\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
			return fail(400, {
				primaryContactPhone,
				invalidPhone: true
			});
		}

		if (!primaryContactEmail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
			return fail(400, {
				primaryContactEmail,
				invalidEmail: true
			});
		}

		try {
			const producer = await client.producer.update({
				where: {
					id: producerId
				},
				include: {
					locations: true
				},
				data: {
					name,
					dba,
					taxId,
					website,
					type,
					address,
					city,
					state,
					zip,
					country,
					primaryContactName,
					primaryContactPhone,
					primaryContactEmail,
					primaryContactTitle,
					tsSalesRepId
				}
			});

			return {
				producer
			};
		} catch (e) {
			return fail(422, {
				saveProducerError: `🥶 Cannot Save Producer ${e}`
			});
		}
	}
};
