<script lang="ts">
	import type { ProducerWithIncludes, LocationWithIncludes, Ratesheet } from '$lib/types/types';
	import { states_and_provinces } from '$lib/helpers/states_and_provinces';

	import LocationNotes from './_LocationNotes.svelte';
	import LocationContacts from './_LocationContacts.svelte';
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';

	import type { Writable } from 'svelte/store';
	import type { OrganizationMembership, User } from '@clerk/clerk-sdk-node';

	export let location: LocationWithIncludes;
	export let userData: User;
	export let reps: OrganizationMembership[];
	// console.log('location', location);
	export let ratesheets: Ratesheet[];

	const createdProducerContext =
		getContext<Writable<ProducerWithIncludes>>('createdProducerContext');

	const creatingLocationStore = getContext<Writable<boolean>>('creatingLocationContext');
	// $: console.log('🇦🇪 $createdProducerContext', $createdProducerContext);
</script>

<!-- enctype="multipart/form-data" -->
<form
	method="post"
	action="?/saveLocation"
	use:enhance={() => {
		return async ({ update }) => {
			await update();
			// editingProducerStore.set(false);
			creatingLocationStore.set(false);
		};
	}}
>
	<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
		<input hidden type="text" name="producerId" value={$createdProducerContext?.id} />
		<input hidden type="text" name="locationId" value={location.id} />
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="name">Location Name</label>
			<input class="input" type="text" id="name" name="name" bind:value={location.name} />
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="phone">Phone</label>
			<input class="input" type="text" id="phone" name="phone" bind:value={location.phone} />
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="email">Email</label>
			<input class="input" type="text" id="email" name="email" bind:value={location.email} />
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="website">Website</label>
			<input class="input" type="text" id="website" name="website" bind:value={location.website} />
		</span>
	</div>
	<div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
		<div>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="address">Address</label>
				<input
					class="input"
					type="text"
					id="address"
					name="address"
					bind:value={location.address}
				/>
			</span>
		</div>
		<div class="flex gap-2">
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="city">City</label>
				<input class="input" type="text" id="city" name="city" bind:value={location.city} />
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="state">State</label>
				<select class="select" name="state" bind:value={location.state}>
					<option selected>Select State</option>
					{#each states_and_provinces as state}
						<option value={state.abbreviation}>{state.name}</option>
					{/each}
				</select>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="zip">Zip</label>
				<input class="input" type="text" id="zip" name="zip" bind:value={location.zip} />
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="country">Country</label>
				<select class="select" name="country" bind:value={location.country}>
					<option value={'USA'} selected>United States</option>
					<option value={'CAN'}>Canada</option>
				</select></span
			>
		</div>
		<div class="flex gap-2">
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="main">Main Location?</label>
				<input
					class="checkbox"
					type="checkbox"
					id="main"
					name="main"
					bind:checked={location.main}
					value={location.main}
				/>
			</span>
		</div>
		{#if userData?.publicMetadata?.ts_role === 'ts_rep'}
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
				<!-- disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
				<select
					class="select"
					id="tsSalesRepId"
					name="tsSalesRepId"
					value={location?.tsSalesRepId ?? ''}
					required
				>
					<option value={userData.id}>{userData?.firstName} {userData.lastName}</option>
				</select>
			</span>
		{/if}
		{#if userData?.publicMetadata?.ts_role === 'admin'}
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
				<!-- disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
				<select
					class="select"
					id="tsSalesRepId"
					name="tsSalesRepId"
					value={location?.tsSalesRepId ?? ''}
					required
				>
					<option disabled selected>Select a Sales Rep</option>
					{#each reps as rep}
						<option value={rep.publicUserData?.userId}
							>{rep.publicUserData?.firstName} {rep.publicUserData?.lastName}</option
						>
					{/each}
				</select>
			</span>
		{/if}
	</div>
	<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
		<span class="flex flex-col items-baseline gap-1">
			{#if $creatingLocationStore}
				<button type="submit" class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
					>Save Location</button
				>
			{/if}
		</span>
	</div>
</form>
<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200"> -->

<!-- <Programs locationId={location.id} {ratesheets} /> -->
<!-- <input class="input" type="text" id="programs" name="programs" bind:value={emptyLocation.programs} /> ADD PROGRAMS COMPONENT-->
<!-- </div> -->
<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="producerId">Producer Id</label>
		<input
			class="input"
			type="text"
			id="producerId"
			name="producerId"
			bind:value={location.producerId}
		/>
	</span>
</div> -->

<!-- <LocationContacts portalUsers={location.portalUsers} locationId={location.id} /> -->

<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="portalUsers">Portal Users</label>
	</span>
</div> -->

<!-- <LocationNotes notes={location.notes} locationId={location.id} /> -->

<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="notes">Notes</label>
		
	</span>
</div> -->
