import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const searchTerm = url.searchParams.get('q');
	const limit = url.searchParams.get('_limit');
	const page = url.searchParams.get('_page');
	const orderBy = url.searchParams.get('_sort');
	const order = url.searchParams.get('_order');
	const locationId = url.searchParams.get('locationId');

	if (id) {
		const contact = await client.locationContact.findUnique({
			where: {
				id: id as string
			}
		});
		return json(contact);
	}

	const contacts = await client.locationContact.findMany({
		where: {
			...(locationId ? { locationId: locationId } : {}),
			OR: [
				{
					firstName: {
						contains: searchTerm ?? ''
					}
				},
				{
					lastName: {
						contains: searchTerm ?? ''
					}
				},
				{
					email: {
						contains: searchTerm ?? ''
					}
				}
			]
		},
		skip: Number(page) > 1 ? (Number(page) - 1) * Number(limit) : 0,
		take: Number(limit),
		orderBy: {
			[(orderBy as string) ?? 'lastName']: order ? order : 'asc'
		}
	});

	return json(contacts);
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	await client.locationContact.delete({
		where: {
			id: id as string
		}
	});

	return json({ message: '👍 Contact deleted successfully' });
};
