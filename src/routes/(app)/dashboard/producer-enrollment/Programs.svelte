<script lang="ts">
	import type { Ratesheet } from '$lib/types/types';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';

	// const fetchRatesheets = async (): Promise<Ratesheet[]> => {
	// 	return json;
	// };

	// $: ratesheets = fetchRatesheets();
	export let ratesheets: Ratesheet[];

	$: console.log('🥶', ratesheets);
</script>

{#await ratesheets}
	<p>Loading...</p>
{:then}
	<select class="select">
		<option selected disabled>Select Program</option>

		{#each ratesheets as ratesheet}
			<option value={ratesheet.id}>{ratesheet.title}</option>
		{/each}
	</select>
{/await}
