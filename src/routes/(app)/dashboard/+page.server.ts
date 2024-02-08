import { client } from '$lib/server/prisma';
import type { ProducerGroup } from '@prisma/client';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const tsSalesRepId = locals.session?.userId as string;
	const producers = await client.producerGroup.findMany({
		where: {
			tsSalesRepId: tsSalesRepId
		}
	});

	return {
		producers: producers as ProducerGroup[]
	};
};
