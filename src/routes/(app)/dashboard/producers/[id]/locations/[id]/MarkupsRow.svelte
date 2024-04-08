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

<span class="flex items-center">
	{#each sortedMarkups as markup, i}
		{markup.termValue} - ${markup.markupValue}{#if i !== sortedMarkups.length - 1}{@html ',&nbsp;&nbsp;'}{/if}
	{/each}
</span>
