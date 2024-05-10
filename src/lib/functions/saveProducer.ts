import { client } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
// import { uploadProducerAgreement } from './uploadProducerAgreement';

export const saveProducer = async (formData: FormData) => {
	const producerId = formData.get('producerId') as string;
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
		return fail(422, {
			saveProducerError: '🥶 Invalid Phone Number'
		});
	}

	try {
		const producer = await client.producer.upsert({
			where: {
				id: producerId
			},
			include: {
				locations: true
			},
			update: {
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
				primaryContactTitle
			},
			create: {
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
};
