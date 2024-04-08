<script lang="ts">
	import type { ProducerWithIncludes, LocationWithIncludes, Ratesheet } from '$lib/types/types';
	import { states_and_provinces } from '$lib/helpers/states_and_provinces';

	import Notes from './_LocationNotes.svelte';
	import PortalUsers from './_LocationContacts.svelte';
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';

	import type { User, OrganizationMembership } from '@clerk/clerk-sdk-node';

	export let location: LocationWithIncludes;
	// console.log('location', location);
	export let ratesheets: Ratesheet[];
	export let userData: User;
	export let reps: OrganizationMembership[];

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	const createdProducerContext =
		getContext<Writable<ProducerWithIncludes>>('createdProducerContext');

	const creatingLocationStore = getContext<Writable<boolean>>('creatingLocationContext');
	// $: console.log('$createdProducerContext', $createdProducerContext);

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const assignProgramsModal: ModalSettings = {
		type: 'component',
		component: 'assignProgramsModal',
		title: 'Assign Programs',
		meta: {
			locationId: location?.id,
			producerId: $createdProducerContext?.id,
			ratesheets: ratesheets
		}
	};

	const createUsersModal: ModalSettings = {
		type: 'component',
		component: 'createUsersModal',
		title: 'Create Portal Users',
		meta: {
			locationId: location?.id
		}
	};

	function assignPrograms() {
		modalStore.trigger(assignProgramsModal);
	}

	function createUsers() {
		modalStore.trigger(createUsersModal);
	}

	const editingLocationStore = writable(false);

	function editingLocation() {
		editingLocationStore.set(true);
	}
</script>

<!-- enctype="multipart/form-data" -->
<form
	method="post"
	action="?/saveLocation"
	use:enhance={() => {
		pendingStore.set(true);
		return async ({ update, result }) => {
			if (result?.status === 200) {
				await update();
				// editingLocationStore.set(false);
				creatingLocationStore.set(false);
				pendingStore.set(false);
				toastStore.trigger({ message: '👍 Location saved successfully' });
			} else {
				pendingStore.set(false);
				toastStore.trigger({ message: '❗️ Location save failed' });
			}
		};
	}}
>
	<div class="grid grid-cols-2 gap-4 mb-4 relative">
		<span class="flex flex-col items-baseline gap-1 absolute top-0 right-0">
			{#if !$editingLocationStore}
				<button
					type="button"
					class="btn bg-gradient-to-br variant-gradient-primary-secondary"
					on:click={editingLocation}
				>
					Edit
				</button>
			{/if}

			{#if $editingLocationStore}
				<button
					type="submit"
					class="btn bg-gradient-to-br variant-gradient-primary-secondary"
					on:click={editingLocation}
				>
					Save
				</button>
			{/if}
		</span>
		<h3 class="h3">{location?.name}</h3>
		<span></span>
		<input hidden type="text" name="producerId" value={$createdProducerContext?.id} />
		<input hidden type="text" name="locationId" value={location?.id} />
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="name">Location Name</label>
			<input
				class="input"
				type="text"
				id="name"
				name="name"
				value={location?.name}
				disabled={!$editingLocationStore}
			/>
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="phone">Phone</label>
			<input
				class="input"
				type="text"
				id="phone"
				name="phone"
				value={location?.phone}
				disabled={!$editingLocationStore}
			/>
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="email">Email</label>
			<input
				class="input"
				type="text"
				id="email"
				name="email"
				value={location?.email}
				disabled={!$editingLocationStore}
			/>
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="website">Website</label>
			<input
				class="input"
				type="text"
				id="website"
				name="website"
				value={location?.website}
				disabled={!$editingLocationStore}
			/>
		</span>
	</div>
	<div class="flex flex-col gap-4 mb-8">
		<div>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="address">Address</label>
				<input
					class="input"
					type="text"
					id="address"
					name="address"
					value={location?.address}
					disabled={!$editingLocationStore}
				/>
			</span>
		</div>
		<div class="flex gap-2">
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="city">City</label>
				<input
					class="input"
					type="text"
					id="city"
					name="city"
					value={location?.city}
					disabled={!$editingLocationStore}
				/>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="state">State</label>
				<select
					class="select"
					name="state"
					value={location?.state}
					disabled={!$editingLocationStore}
				>
					<option selected disabled={!$editingLocationStore}>Select State</option>
					{#each states_and_provinces as state}
						<option value={state.abbreviation}>{state.name}</option>
					{/each}
				</select>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="zip">Zip</label>
				<input
					class="input"
					type="text"
					id="zip"
					name="zip"
					value={location?.zip}
					disabled={!$editingLocationStore}
				/>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="country">Country</label>
				<select
					class="select"
					name="country"
					value={location?.country}
					disabled={!$editingLocationStore}
				>
					<option value={'USA'} selected>United States</option>
					<option value={'CAN'}>Canada</option>
				</select></span
			>
		</div>
		<div class="flex gap-2">
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="main">Main Location?</label>
				<input
					disabled={!$editingLocationStore}
					class="checkbox"
					type="checkbox"
					id="main"
					name="main"
					checked={location?.main}
					value={location?.main}
				/>
			</span>
		</div>
		{#if userData?.publicMetadata?.ts_role === 'ts_rep'}
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
				<!-- disabled={!$editingLocationStore}={!!$createdProducerContext?.id && !$editingLocationStore} -->
				<select
					class="select"
					id="tsSalesRepId"
					name="tsSalesRepId"
					value={location?.tsSalesRepId ?? ''}
					required
					disabled={!$editingLocationStore}
				>
					<option value={userData.id}>{userData?.firstName} {userData.lastName}</option>
				</select>
			</span>
		{/if}
		{#if userData?.publicMetadata?.ts_role === 'admin'}
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
				<!-- disabled={!$editingLocationStore}={!!$createdProducerContext?.id && !$editingLocationStore} -->
				<select
					class="select"
					id="tsSalesRepId"
					name="tsSalesRepId"
					value={location?.tsSalesRepId ?? ''}
					required
					disabled={!$editingLocationStore}
				>
					<option disabled={!$editingLocationStore} selected>Select a Sales Rep</option>
					{#each reps as rep}
						<option value={rep.publicUserData?.userId}
							>{rep.publicUserData?.firstName} {rep.publicUserData?.lastName}</option
						>
					{/each}
				</select>
			</span>
		{/if}
	</div>
	{#if location?.id}
		<div class="flex gap-4 mb-8 pb-8 border-b border-surface-200">
			<span class="flex flex-col items-baseline gap-1">
				<button type="button" on:click={assignPrograms} class="btn variant-ghost-surface">
					Assign Programs to this Location
				</button>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<button type="button" on:click={createUsers} class="btn variant-ghost-surface">
					Create Portal Users
				</button>
			</span>
		</div>
	{/if}
</form>
<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200"> -->

<!-- <Programs locationId={location?.id} {ratesheets} /> -->
<!-- <input class="input" type="text" id="programs" name="programs" value={emptyLocation?.programs} /> ADD PROGRAMS COMPONENT-->
<!-- </div> -->
<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="producerId">Producer Id</label>
		<input
			class="input"
			type="text"
			id="producerId"
			name="producerId"
			value={location?.producerId}
		/>
	</span>
</div> -->

<!-- <PortalUsers portalUsers={location?.portalUsers} locationId={location?.id} /> -->

<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="portalUsers">Portal Users</label>
	</span>
</div> -->

<!-- <Notes notes={location?.notes} locationId={location?.id} /> -->

<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="notes">Notes</label>
		
	</span>
</div> -->
