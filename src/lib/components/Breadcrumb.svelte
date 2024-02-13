<script lang="ts">
	import { page } from '$app/stores';

	const processPaths = (url: string) => {
		const pathArray = url.split('/');
		const pathArrayFiltered = pathArray.filter((item) => item !== '') ?? [];
		if (pathArrayFiltered?.length === 1) return [];
		return pathArrayFiltered?.reduce((acc: Record<string, string>[], current: string) => {
			const capitalized = current.split('-').map((item) => {
				const curr = item.charAt(0).toUpperCase() + item.slice(1);
				return curr;
			});
			acc.push({
				name: capitalized.join(' '),
				path: acc.length === 0 ? `/${current}` : `${acc[acc.length - 1].path}/${current}`
			});

			return acc as Record<string, string>[];
		}, []);
	};

	$: updatedUrl = processPaths($page.url.pathname);
</script>

<div class="relative" data-sveltekit-replacestate>
	<div class="pt-2 px-4 absolute top-0 right-4 text-xs">
		{#each updatedUrl as item, index}
			{#if index < updatedUrl.length - 1}
				<a class="link" href={`${item.path}`}>{item.name}</a>
				{#if index !== updatedUrl.length - 1}
					<span class="mr-1">&gt;</span>
				{/if}
			{:else}
				{item.name}
			{/if}
		{/each}
	</div>
</div>
