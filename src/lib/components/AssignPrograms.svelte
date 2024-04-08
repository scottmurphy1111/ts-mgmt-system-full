<script lang="ts">
	import type { LocationWithIncludes, Ratesheet } from '$lib/types/types';
	import { onMount } from 'svelte';

	import RatesheetRow from './RatesheetRow.svelte';
	import { enhance } from '$app/forms';

	// const fetchRatesheets = async (): Promise<Ratesheet[]> => {
	// 	return json;
	// };

	// $: ratesheets = fetchRatesheets();
	export let locationId: string;
	export let producerId: string;
	export let ratesheets: Ratesheet[];
	export let onClose: () => void;

	function savePrograms() {
		// console.log('savePrograms');
		onClose();
	}

	$: console.log('🥶', ratesheets);
</script>

{#await ratesheets}
	<p>Loading...</p>
{:then}
	<div class="mb-8 pb-8 border-b border-surface-200">
		<div class="grid grid-cols-2 gap-4">
			<h4 class="h4 font-semibold">Programs</h4>
			<span>Markups</span>
			<span></span>
			<div class="flex items-center gap-2">
				<span class="flex flex-col items-baseline gap-1 w-full">12 Month</span>
				<span class="flex flex-col items-baseline gap-1 w-full">24 Month</span>
				<span class="flex flex-col items-baseline gap-1 w-full">36 Month</span>
				<span class="flex flex-col items-baseline gap-1 w-full">48 Month</span>
			</div>
		</div>
		<form
			method="post"
			action="?/createPrograms"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					onClose();
				};
			}}
		>
			<input hidden type="text" name="locationId" value={locationId} />
			<input hidden type="text" name="producerId" value={producerId} />
			{#each ratesheets.sort( (a, b) => (a.name < b.name ? 1 : a.name > b.name ? -1 : 0) ) as ratesheet}
				<!-- <ProgramRow {ratesheet} /> -->
			{/each}
			<button type="submit" class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
				>Save</button
			>
		</form>
	</div>
{/await}
