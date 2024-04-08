<script lang="ts">
	import Search from '$lib/components/datatables/Search.svelte';
	import RowsPerPage from '$lib/components/datatables/RowsPerPage.svelte';

	//Load remote data
	import { reload } from './api';

	//Import handler & Types from SSD remote
	import { DataHandler } from '@vincjo/datatables/remote';

	import type { State, Row } from '@vincjo/datatables/remote';
	import Pagination from './Pagination.svelte';

	//Init data handler - SERVER
	export let handler: DataHandler;

	export let search = true;
	export let rowsPerPage = true;
	export let pagination = true;

	// handler.onChange((state: State) => reload(state));
	// handler.invalidate();
</script>

<div class="overflow-y-auto space-y-4">
	<header class="flex justify-between">
		{#if search}
			<Search {handler} />
		{/if}
		{#if rowsPerPage}
			<RowsPerPage {handler} />
		{/if}
	</header>
	<slot />
	<footer class="flex justify-end">
		{#if pagination}
			<Pagination {handler} />
		{/if}
	</footer>
</div>
