import { appHost } from '$lib/helpers/helpers';
import type { State } from '@vincjo/datatables/remote';

export const reload = async <T>(state: State, salesRepId?: string, type: string = 'producers') => {
	const response = await fetch(`${appHost}/api/${type}?${getParams(state, salesRepId)}`);
	return response.json() as T;
};

const getParams = (state: State, salesRepId?: string) => {
	const { pageNumber, rowsPerPage, sort, search } = state;

	let params = `_page=${pageNumber}`;

	if (rowsPerPage) {
		params += `&_limit=${rowsPerPage}`;
	}
	if (sort) {
		params += `&_sort=${sort.orderBy}&_order=${sort.direction}`;
	}

	// if (filters) {
	// 	params += filters.map(({ filterBy, value }) => `&${filterBy}=${value}`).join();
	// }

	if (search) {
		params += `&q=${search}`;
	}

	if (salesRepId) {
		params += `&salesRepId=${salesRepId}`;
	}
	return params;
};
