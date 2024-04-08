<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import type { ProducerWithIncludes, LocationWithIncludes } from '$lib/types/types';
	import { format } from 'date-fns';

	import CreateProducer from './_CreateProducer.svelte';

	import CreateLocation from './_CreateLocation.svelte';

	import { reload } from '$lib/components/datatables/api';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import DeleteOutput from '$lib/components/DeleteOutput.svelte';
	import { appHost } from '$lib/helpers/helpers';
	import { goto } from '$app/navigation';
	import Search from '$lib/components/datatables/Search.svelte';
	import RowsPerPage from '$lib/components/datatables/RowsPerPage.svelte';
	import RowCount from '$lib/components/datatables/RowCount.svelte';
	import Pagination from '$lib/components/datatables/Pagination.svelte';
	import ThSort from '$lib/components/datatables/ThSort.svelte';
	import Datatable from '$lib/components/datatables/Datatable.svelte';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import StatusBadge from '$lib/components/core/StatusBadge.svelte';

	// import ThFilter from '$lib/components/datatables/ThFilter.svelte';

	export let data;
	$: ({ count, producers, userData, reps, ratesheets } = data);

	$: console.log('🥶 producers', producers);
	$: console.log('count', count);

	export let form: {
		producer: ProducerWithIncludes;
		location: LocationWithIncludes;
	};

	$: console.log('form', form);

	const createdProducerStore = writable<ProducerWithIncludes | null>(null);
	setContext('createdProducerContext', createdProducerStore);

	$: if (form?.producer?.id) {
		createdProducerStore.set(form?.producer);
	}

	// $: ({ userData, reps, ratesheets } = data);

	$: fullRatesheets = [
		...ratesheets,
		{
			name: 'class_8_diesel_-_60_Day',
			title: 'Class 8 Diesel - 60 Day'
		},
		{
			name: 'class_8_diesel_-_90_Day',
			title: 'Class 8 Diesel - 90 Day'
		},
		{
			name: 'class_8_diesel_-_180_Day',
			title: 'Class 8 Diesel - 180 Day'
		},
		{
			name: 'class_8_diesel_-engine_only',
			title: 'Class 8 Diesel - Engine Only'
		}
	];

	// $: console.log('fullRatesheets', fullRatesheets);
	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalProducersSigning',
		title: 'Create a New Producer Process',
		body: `In order to Create a New Producer, you must first Send Producers Agreement for E-signature.`,
		backdropClasses: 'opacity-95',
		modalClasses: 'p-8'
	};

	onMount(() => {
		// modalStore.trigger(modal); //❗️❗️❗️❗️❗️❗️❗️❗️ ADD back in when ready
	});

	// Finish Implementing this
	$: mainSelected = $createdProducerStore?.locations?.some((location: LocationWithIncludes) => {
		return location.main;
	});

	const handler = new DataHandler<ProducerWithIncludes>(producers, {
		rowsPerPage: 20,
		totalRows: count
	});
	const rows = handler.getRows();

	$: console.log(' r$ows', $rows);
	$: salesRepId = userData?.publicMetadata?.ts_role === 'ts_rep' ? userData.id : undefined;

	$: if (salesRepId) {
		handler.invalidate();
	}

	handler.onChange((state: State) => reload(state, salesRepId));

	$: if (userData?.publicMetadata?.ts_role !== 'ts_rep') {
		handler.invalidate();
	}
	// handler.invalidate();
	// $: console.log('rows', $rows);
</script>

{#if userData}
	<div class="flex flex-col gap-4 p-8">
		<h2 class="h2">Producers</h2>
		<div class="flex items-start gap-4 mb-4">
			<button
				class="btn bg-gradient-to-br variant-gradient-primary-secondary text-wrap"
				on:click={() => goto('/dashboard/producers/send-agreement')}
				>Send Producer Agreements</button
			>
			<button
				class="btn bg-gradient-to-br variant-gradient-primary-secondary text-wrap"
				on:click={() => modalStore.trigger(modal)}>Create a New Producer</button
			>
		</div>
		<div class="flex flex-col gap-8">
			<div class="flex flex-col w-full md:w-full gap-4">
				<Datatable {handler}>
					<!-- <header class="flex justify-between mb-4">
						<Search {handler} />
						<RowsPerPage {handler} />
					</header> -->
					<table class="table mb-4">
						<thead>
							<tr>
								<ThSort orderBy="name" {handler}>Name</ThSort>
								<ThSort orderBy="primaryContactName" {handler}>Primary Contact</ThSort>
								<th>Actions</th>
							</tr>
							<!-- <tr>
								<ThFilter {handler} filterBy="name" />
								<ThFilter {handler} filterBy="createdAt" />
							</tr> -->
						</thead>
						<!-- {#if userData?.publicMetadata?.ts_role === 'ts_rep'}
							<tbody>
								{#await filterRows}
									<tr>
										<td>Loading...</td>
									</tr>
								{:then filterRows}
									{#each filterRows as producer}
										<tr>
											<td>
												<span class="flex items-center">{producer.name}</span>
											</td>
											<td>
												<span class="flex items-center">{producer.primaryContactName}</span>
											</td>
											<td class="flex gap-4 justify-end">
												<a
													class="flex text-primary-500 items-center"
													href={`/dashboard/producers/${producer.id}`}>View</a
												>
												<a
													class="flex text-primary-500 items-center"
													href={`/dashboard/producer-enrollment/${producer.id}`}>Complete</a
												>
											</td></tr
										>
									{/each}
								{/await}
							</tbody>
						{:else} -->
						<tbody>
							{#await $rows}
								<tr>
									<td colspan="3">Loading...</td>
								</tr>
							{:then $rows}
								{#if $rows.length === 0}
									<tr>
										<td colspan="3">No Producers Found</td>
									</tr>
								{:else}
									{#each $rows as producer}
										<tr>
											<td>
												<span class="flex items-center gap-2"
													>{producer.name}<StatusBadge status={producer.status} /></span
												>
											</td>
											<td>
												<span class="flex items-center">{producer.primaryContactName}</span>
											</td>
											<td class="flex gap-4 items-center">
												<a
													class="flex text-primary-500 items-center"
													href={`/dashboard/producers/${producer.id}`}>View</a
												>
												<a
													class="flex text-primary-500 items-center"
													href={`/dashboard/producer-enrollment/${producer.id}`}
													>Complete Enrollment</a
												>
											</td></tr
										>
									{/each}
								{/if}
							{/await}
						</tbody>
						<!-- {/if} -->
					</table>
					<!-- <footer class="flex justify-between">
						<RowCount {handler} />
						<Pagination {handler} />
					</footer> -->
				</Datatable>
			</div>

			<!-- <h3 class="h3">Create Producer</h3>
			<CreateProducer {userData} {reps} producer={$createdProducerStore} />
			<CreateLocation
				{userData}
				{reps}
				ratesheets={fullRatesheets}
				locations={$createdProducerStore?.locations}
			/> -->
			<!-- <AssignPrograms {userData} {reps} createdProducer={form?.producer} /> -->
			<!-- <button class="btn variant-outline-primary" type="submit">Upload</button> -->
			<!-- <form method="post" action="?/enroll" enctype="multipart/form-data" use:enhance> -->
			<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="name">Name</label>
						<input class="input" type="text" id="name" name="name" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="dba">Dba</label>
						<input class="input" type="text" id="dba" name="dba" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="taxId">Tax Id</label>
						<input class="input" type="text" id="taxId" name="taxId" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="website">Website</label>
						<input class="input" type="text" id="website" name="website" />
					</span>
				</div>
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactName">Primary Contact Name</label>
						<input class="input" type="text" id="primaryContactName" name="primaryContactName" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactPhone">Phone</label>
						<input class="input" type="text" id="primaryContactPhone" name="primaryContactPhone" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactEmail">Email</label>
						<input class="input" type="text" id="primaryContactEmail" name="primaryContactEmail" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactTitle">Title</label>
						<input class="input" type="text" id="primaryContactTitle" name="primaryContactTitle" />
					</span>
				</div> -->
			<!-- {#if locations.length}
				<h4 class="h4 font-semibold mb-4">Locations</h4>
				{#each locations as location}
					<Location {location} {ratesheets} />
				{/each}
			{/if}
			{#if $creatingLocationStore}
				<h4 class="h4 font-semibold mb-4">New Location</h4>
				<Location location={emptyLocation} {ratesheets} />
			{/if}
			<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
				<span class="flex flex-col items-baseline gap-1">
					{#if !$creatingLocationStore}
						<button
							type="button"
							on:click={addLocation}
							class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
							>+ Add Location</button
						>
					{/if}
					{#if $creatingLocationStore}
						<button
							type="button"
							on:click={saveLocation}
							class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
							>Save Location</button
						>
					{/if}
				</span>
			</div> -->
			<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
				{#if userData?.publicMetadata?.ts_role === 'ts_rep'}
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
						<select class="select" id="tsSalesRepId" name="tsSalesRepId">
							<option value={userData.id}>{userData?.firstName} {userData.lastName}</option>
						</select>
					</span>
				{/if}
				{#if userData?.publicMetadata?.ts_role === 'admin'}
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
						<select class="select" id="tsSalesRepId" name="tsSalesRepId">
							<option disabled selected>Select a Sales Rep</option>
							{#each reps as rep}
								<option value={rep.publicUserData?.userId}
									>{rep.publicUserData?.firstName} {rep.publicUserData?.lastName}</option
								>
							{/each}
						</select>
					</span>
				{/if}
			</div> -->
			<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<label class="flex gap-1 font-semibold" for="upload"
							>Upload Signed Producer Agreement <button
								type="button"
								class="flex"
								on:click={openInstructions}
							>
								<span class="flex w-4 h-4 mr-2">
									<svelte:component this={InfoCircleIcon} />
								</span>
							</button>
						</label>
						<input type="file" id="upload" name="upload" accept="application/pdf" />
					</span>
				</div>
				<div class="flex gap-2">
					<div class="flex">
						<button type="submit" class="btn bg-gradient-to-br variant-gradient-primary-secondary"
							>Submit</button
						>
					</div>
					<div class="flex">
						<button
							type="button"
							class="btn bg-gradient-to-br from-error-500 to-error-700 text-white"
							on:click={() => goto('/dashboard')}>Cancel</button
						>
					</div>
				</div> -->
			<!-- </form> -->
		</div>
	</div>
{/if}
