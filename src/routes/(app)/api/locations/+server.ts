import { client } from '$lib/server/prisma';
import { type RequestHandler, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const searchTerm = url.searchParams.get('q');
	const limit = url.searchParams.get('_limit');
	const page = url.searchParams.get('_page');
	const orderBy = url.searchParams.get('_sort');
	const order = url.searchParams.get('_order');
	const producerId = url.searchParams.get('producerId');

	console.log('❤️producerId', producerId);

	if (id) {
		const location = await client.tsLocation.findUnique({
			where: {
				id: id as string
			}
		});
		return json(location);
	}

	const locations = await client.tsLocation.findMany({
		where: {
			...(producerId ? { producerId: producerId } : {}),
			OR: [
				{
					name: {
						contains: searchTerm ?? ''
					}
				},
				{
					address: {
						contains: searchTerm ?? ''
					}
				},
				{
					city: {
						contains: searchTerm ?? ''
					}
				},
				{
					state: {
						contains: searchTerm ?? ''
					}
				},
				{
					zip: {
						contains: searchTerm ?? ''
					}
				},
				{
					producer: {
						name: {
							contains: searchTerm ?? ''
						}
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
			locationPrograms: true,
			locationContacts: true,
			locationNotes: true
		}
	});

	// console.log('locations', locations);
	return json(locations);
};
