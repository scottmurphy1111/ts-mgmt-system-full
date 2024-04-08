import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	console.log('load 🥶', event.request);
	console.log('session', event.locals.session);
	return {
		// props: {
		//   name: params.name
		// }
	};
};
