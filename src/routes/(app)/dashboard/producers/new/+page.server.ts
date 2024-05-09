import { client } from '$lib/server/prisma';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	createProducer: async ({ request }) => {
		const formData = await request.formData();

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
		// const upload = formData.get('upload') as File;

		if (!primaryContactPhone.match(/^(\+|)(1|)\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
			console.log('invalid phone number', primaryContactPhone);
			return fail(400, {
				primaryContactPhone,
				invalidPhone: true
			});
		}

		if (!primaryContactEmail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
			console.log('invalid email', primaryContactEmail);
			return fail(400, {
				primaryContactEmail,
				invalidEmail: true
			});
		}

		try {
			const producer = await client.producer.create({
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
				saveProducerError: `🥶 Cannot Save Producer ${JSON.stringify(e, null, 2)}`
			});
		}
	}
};
