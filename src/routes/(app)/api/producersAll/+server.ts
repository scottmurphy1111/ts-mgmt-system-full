import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const salesRepId = url.searchParams.get('salesRepId');

	let producers = [];
	if (salesRepId !== undefined) {
		producers = await client.producer.findMany({
			where: {
				...(salesRepId ? { tsSalesRepId: salesRepId } : {})
			},
			orderBy: {
				name: 'asc'
			},
			include: {
				locations: true
			}
		});

		return json(producers);
	} else {
		producers = await client.producer.findMany({
			orderBy: {
				name: 'asc'
			},
			include: {
				locations: true
			}
		});

		return json(producers);
	}
};
