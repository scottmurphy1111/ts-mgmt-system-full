<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Datatable from '$lib/components/datatables/Datatable.svelte';
	import ThSort from '$lib/components/datatables/ThSort.svelte';
	import { reload } from '$lib/components/datatables/api.js';
	import type { LocationWithIncludes } from '$lib/types/types.js';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import { format } from 'date-fns';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import StatusBadge from '$lib/components/core/StatusBadge.svelte';
	import { getRepName } from '$lib/functions/getRepName';

	export let data;
	export let form;

	$: ({ producer, userData, reps } = data);

	$: console.log('🙆‍♀️producer', producer);
	$: console.log('userData', userData);

	const modalStore = getModalStore();
	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	let modal: ModalSettings;

	$: if (producer && userData && reps) {
		modal = {
			type: 'component',
			component: 'modalAddLocation',
			backdropClasses: 'overflow-y-scroll',
			meta: {
				producerId: producer?.id,
				producerName: producer?.name,
				tsSalesRepId: userData?.publicMetadata?.ts_role === 'ts_rep' ? userData?.id : undefined,
				userData,
				reps,
				form
			},
			response: (response) => {
				console.log('response', response);
				pendingStore.set(true);
				if (!response) {
					handler.invalidate();
					pendingStore.set(false);
				}
			}
		};
	}

	const addLocation = () => {
		modalStore.trigger(modal);
	};

	modalStore.subscribe((value) => {
		if (!value.length) {
			invalidateAll();
		}
	});

	// const getRepName = (id: string) => {
	// 	console.log('id', id);
	// 	const rep = reps?.find((rep) => {
	// 		return rep.publicUserData?.userId === id;
	// 	});
	// 	return `${rep?.publicUserData?.firstName} ${rep?.publicUserData?.lastName}`;
	// };

	let producerLocations: LocationWithIncludes[] = [];
	$: if (producer.locations) {
		producerLocations = producer?.locations;
	}

	$: console.log('producerLocations', producerLocations);

	const handler = new DataHandler<LocationWithIncludes>(producerLocations, {
		rowsPerPage: 9999,
		totalRows: producerLocations.length
	});

	const rows = handler.getRows();

	handler.onChange((state: State) => reload(state, 'locations', { producerId: producer.id }));
	$: if (producerLocations.length > 0) {
		handler.invalidate();
	}
</script>

<div class="flex flex-col gap-4 p-8">
	{#if producer}
		<div class="flex flex-col gap-2 justify-between">
			<div class="flex gap-4 items-center w-auto">
				<h2 class="h2">{producer.name}</h2>
				<StatusBadge status={producer.status} />
			</div>
		</div>
		<div class="flex gap-8 w-full mb-4 pb-8 border-b border-surface-200">
			{#if producer.dba}
				<div class="flex flex-col gap-2">
					<span class="font-semibold text-base">DBA</span>
					<p>{producer.dba}</p>
				</div>
			{/if}
			{#if producer.taxId}
				<div class="flex flex-col gap-2">
					<span class="font-semibold text-base">TaxId</span>
					<p>{producer.taxId}</p>
				</div>
			{/if}
			{#if producer.website}
				<div class="flex flex-col gap-2">
					<span class="font-semibold text-base">Website</span>
					<p>{producer.website}</p>
				</div>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<span>{producer.address}</span>
			<span>{producer.city}, {producer.state} {producer.zip} {producer.country}</span>
		</div>
		<div class="flex gap-8 w-full mb-4 pb-8 border-b border-surface-200">
			<div class="flex flex-col gap-2">
				<span class="font-semibold text-base">Name</span>
				<p>{producer.primaryContactName}</p>
			</div>
			{#if producer.primaryContactTitle}
				<div class="flex flex-col gap-2">
					<span class="font-semibold text-base">Title</span>
					<p>{producer.primaryContactTitle}</p>
				</div>
			{/if}
			<div class="flex flex-col gap-2">
				<span class="font-semibold text-base">Phone</span>
				<p>{producer.primaryContactPhone}</p>
			</div>
			<div class="flex flex-col gap-2">
				<span class="font-semibold text-base">Email</span>
				<p>{producer.primaryContactEmail}</p>
			</div>
		</div>
		<div class="flex gap-8 w-full mb-4 pb-8 border-b border-surface-200">
			<div class="flex flex-col gap-2">
				<span class="font-semibold text-base">Ts Sales Rep</span>
				<p>{getRepName(producer.tsSalesRepId, reps)}</p>
			</div>
		</div>
		<h4 class="h4 font-semibold">Locations</h4>
		<div class="flex flex-col gap-8 w-full pb-8 border-b border-surface-200">
			<!-- <div class="flex flex-col gap-2">
				{#each producer.locations as location}
					<div class="flex flex-col gap-2">
						<span class="font-semibold text-base">Name</span>
						<p>{location.name}</p>
					</div>
				{/each}
			</div> -->
			<Datatable {handler} rowsPerPage={false} pagination={false}>
				<table class="table mb-4">
					<thead>
						<tr>
							<ThSort orderBy="name" {handler}>Name</ThSort>
							<ThSort orderBy="state" {handler}>Location</ThSort>
							<ThSort orderBy="createdAt" {handler}>Date Created</ThSort>
							<th>Actions</th>
						</tr>
						<!-- <tr>
              <ThFilter {handler} filterBy="name" />
              <ThFilter {handler} filterBy="createdAt" />
            </tr> -->
					</thead>
					<tbody>
						{#await $rows}
							<tr>
								<td colspan="3">Loading...</td>
							</tr>
						{:then $rows}
							{#if $rows.length === 0}
								<tr>
									<td colspan="3">No Locations Found</td>
								</tr>
							{:else}
								{#each $rows as location}
									<tr>
										<td>
											<span class="flex items-center">{location.name}</span>
										</td>
										<td>
											<span class="flex items-center"
												>{location.address} {location.city}, {location.state}</span
											>
										</td>
										<td>
											<span class="flex items-center"
												>{format(location.createdAt, 'MM/dd/yyyy - hh:mm:ss a')}</span
											>
										</td>
										<td class="flex gap-4 items-center">
											<a
												class="flex text-primary-500 items-center"
												href={`/dashboard/producers/${producer.id}/locations/${location.id}`}
												>View</a
											>
											<a
												class="flex text-primary-500 items-center"
												href={`/dashboard/producer-enrollment/${location.id}`}>Complete</a
											>
										</td>
									</tr>
								{/each}
							{/if}
						{/await}
					</tbody>
					<!-- {/if} -->
				</table>
			</Datatable>
			<button
				type="button"
				on:click={addLocation}
				class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
				>+ Add Location</button
			>
		</div>
	{/if}
</div>
