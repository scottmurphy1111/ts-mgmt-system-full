<script lang="ts">
	import type { LocationProgramWithIncludes } from '$lib/types/types';
	import type { LocationMarkup } from '@prisma/client';

	export let program: LocationProgramWithIncludes;

	const sortMarkups = (markups: LocationMarkup[]) => {
		return markups.sort((a, b) => {
			if (a.termValue < b.termValue) {
				return -1;
			}
			if (a.termValue > b.termValue) {
				return 1;
			}
			return 0;
		});
	};

	$: sortedMarkups = sortMarkups(program.locationMarkups);

	$: console.log('sortedMarkups', sortedMarkups);
</script>

<div class="grid grid-cols-2 items-start w-full">
	{#each sortedMarkups as markup}
		<div>
			{markup.termValue} -
			<span class="font-semibold"> ${Number(markup.markupValue).toLocaleString()}</span>
		</div>
	{/each}
</div>
