<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables/remote';

	export let handler: DataHandler;
	export let orderBy: string;

	const sort = handler.getSort();
	const update = () => {
		handler.sort(orderBy);
		handler.invalidate();
	};
</script>

<th on:click={update} class="cursor-pointer select-none p-2 px-5">
	<div class="flex h-full items-center justify-start gap-x-2">
		<slot />
		{#if $sort === undefined}
			&updownarrow;
		{:else if $sort.orderBy === orderBy}
			{#if $sort.direction === 'asc'}
				&darr;
			{:else if $sort.direction === 'desc'}
				&uarr;
			{/if}
		{:else}
			&updownarrow;
		{/if}
	</div>
</th>
