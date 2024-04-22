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
		const program = await client.locationProgram.findUnique({
			where: {
				id: id as string
			}
		});
		return json(program);
	}

	const programs = await client.locationProgram.findMany({
		where: {
			...(locationId ? { locationId: locationId } : {}),
			OR: [
				{
					name: {
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
			locationMarkups: true
		}
	});

	// console.log('locations', locations);
	return json(programs);
};

export const POST: RequestHandler = async ({ url, request }) => {
	const locationId = url.searchParams.get('locationId');

	const body = await request.formData();

	console.log('locationId', locationId);
	console.log('body', [...body]);

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	await client.locationMarkup.deleteMany({
		where: {
			locationProgramId: id as string
		}
	});

	const program = await client.locationProgram.delete({
		where: {
			id: id as string
		}
	});

	return json(program);
};
