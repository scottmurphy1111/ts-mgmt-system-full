import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const searchTerm = url.searchParams.get('q');
	const limit = url.searchParams.get('_limit');
	const page = url.searchParams.get('_page');
	const orderBy = url.searchParams.get('_sort');
	const order = url.searchParams.get('_order');
	const salesRepId = url.searchParams.get('salesRepId');

	if (id) {
		const producer = await client.producer.findUnique({
			where: {
				id: id as string
			}
		});
		return json(producer);
	}

	const producers = await client.producer.findMany({
		where: {
			...(salesRepId ? { tsSalesRepId: salesRepId } : {}),
			OR: [
				{
					name: {
						contains: searchTerm ?? ''
					}
				},
				{
					dba: {
						contains: searchTerm ?? ''
					}
				},
				{
					primaryContactName: {
						contains: searchTerm ?? ''
					}
				}
			]
		},
		skip: Number(page) > 1 ? (Number(page) - 1) * Number(limit) : 0,
		take: Number(limit),
		orderBy: {
			[(orderBy as string) ?? 'name']: order ? order : 'asc'
		},
		include: {
			locations: true
		}
	});

	return json(producers);
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const deleteProducer = client.producer.delete({
		where: {
			id: id as string
		}
	});

	await client.$transaction([deleteProducer]);

	return json({ message: '👍 Producer deleted successfully' });
};
