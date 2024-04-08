// import { client } from '$lib/server/prisma';

// import type { PageServerLoad } from './$types';
// import type { ProducerWithIncludes } from '$lib/types/types';

// // export const load: PageServerLoad = async ({ locals }) => {
// // const tsSalesRepId = locals.session?.userId as string;
// // const producers = await client.producer.findMany({
// // 	where: {
// // 		tsSalesRepId: tsSalesRepId
// // 	},
// // 	include: {
// // 		locations: {
// // 			include: {
// // 				locationPrograms: true,
// // 				locationContacts: true,
// // 				locationNotes: true
// // 			}
// // 		}
// // 	}
// // });

// // return {
// // 	producers: producers as ProducerWithIncludes[]
// // };
// // };
