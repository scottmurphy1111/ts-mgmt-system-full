import { client } from '$lib/server/prisma';
import type { ProducerWithIncludes } from '$lib/types/types';
import type { PageServerLoad } from '../dashboard/$types';

export const load: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');

	const producer = await client.producer.findUnique({
		where: {
			id: id as string
		},
		include: {
			locations: true
		}
	});

	return {
		producer: producer as ProducerWithIncludes
	};
};
