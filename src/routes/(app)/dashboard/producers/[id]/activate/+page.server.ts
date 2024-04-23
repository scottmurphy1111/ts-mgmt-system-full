import { client } from '$lib/server/prisma';
import { fail, type Actions } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const producer = await client.producer.findUnique({
		where: {
			id: params.id
		},
		include: {
			locations: true
		}
	});

	return {
		producer
	};
};

export const actions: Actions = {
	default: async ({ params }) => {
		try {
			await client.producer.update({
				where: {
					id: params.id
				},
				data: {
					status: 'ACTIVE'
				}
			});
			return {
				message: '👍 Producer activated successfully!'
			};
		} catch (error) {
			return fail(400, {
				activationError: `Activation failed ${error}`
			});
		}
	}
};
