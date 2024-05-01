<script lang="ts">
	import type { ProducerWithIncludes, LocationWithIncludes, Ratesheet } from '$lib/types/types';

	import Location from './_Location.svelte';
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import NewLocation from './_NewLocation.svelte';
	import type { User, OrganizationMembership } from '@clerk/clerk-sdk-node';

	export let ratesheets: Ratesheet[];
	export let locations: LocationWithIncludes[] | undefined;
	export let userData: User;
	export let reps: OrganizationMembership[];

	const createdProducerContext =
		getContext<Writable<ProducerWithIncludes>>('createdProducerContext');
	// $: console.log('createdProducerContext', $createdProducerContext);

	const creatingLocationStore = writable(false);
	// $: console.log('creatingLocationStore', $creatingLocationStore);
	setContext('creatingLocationContext', creatingLocationStore);

	const addLocationStore = writable<LocationWithIncludes | Record<string, string>>({});
	setContext('creatingLocation', addLocationStore);

	let emptyLocation: LocationWithIncludes = {
		id: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		name: 'name',
		phone: 'phone',
		email: 'email',
		website: 'website',
		address: 'address',
		city: 'city',
		state: 'NC',
		zip: 'zip',
		country: 'USA',
		mailingAddress: 'mailingAddress',
		mailingCity: '',
		mailingState: '',
		mailingZip: '',
		mailingCountry: '',
		locationPrograms: [],
		producerId: $createdProducerContext?.id,
		locationContacts: [],
		locationNotes: [],
		tsSalesRepId: 'repId',
		main: false
	};

	const saveLocation = () => {};
</script>

{#if $createdProducerContext}
	<h3 class="h3">Create Producer Locations</h3>
	{#if locations?.length}
		<!-- <h4 class="h4 font-semibold mb-4">Locations</h4> -->
		{#each locations as location}
			<Location {userData} {reps} {location} {ratesheets} />
		{/each}
	{/if}
	{#if !$creatingLocationStore}
		<button type="button" on:click={() => creatingLocationStore.set(true)} class="btn-primary w-min"
			>+ Add Location</button
		>
	{/if}
	{#if $creatingLocationStore}
		<h4 class="h4 font-semibold mb-4">New Location</h4>
		<NewLocation {userData} {reps} location={emptyLocation} {ratesheets} />
	{/if}
	<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
		<span class="flex flex-col items-baseline gap-1">
			{#if !$creatingLocationStore}
				<button
					type="button"
					on:click={addLocation}
					class="btn-primary w-min"
					>+ Add Location</button
				>
			{/if}
			{#if $creatingLocationStore}
				<button type="submit" class="btn-primary w-min"
					>Save Location</button
				>
			{/if}
		</span>
	</div> -->
{/if}
