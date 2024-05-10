<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
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
	import { getRepName } from '$lib/functions/getRepName.js';

	export let data;
	export let form;

	$: ({ producer, userData, reps } = data);

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
				pendingStore.set(true);
				if (!response) {
					handler.invalidate();
					pendingStore.set(false);
				}
			}
		};
	}

	// Redirect to location page after saving in modal
	$: if (form?.location?.id) {
		goto(`/dashboard/producers/${producer?.id}/locations/${form?.location?.id}`);
	}

	let editProducerModal: ModalSettings;
	$: if (producer) {
		editProducerModal = {
			type: 'component',
			component: 'modalEditProducer',
			backdropClasses: 'overflow-y-scroll',
			meta: {
				producer,
				tsSalesRepId: userData?.publicMetadata?.ts_role === 'ts_rep' ? userData?.id : undefined,
				reps,
				userData
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

	const editProducer = () => {
		modalStore.trigger(editProducerModal);
	};

	modalStore.subscribe((value) => {
		if (!value.length) {
			invalidateAll();
		}
	});

	let producerLocations: LocationWithIncludes[] = [];
	$: if (producer.locations) {
		producerLocations = producer?.locations;
	}

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
		<div class="flex gap-2 justify-between">
			<div class="flex gap-4 items-center w-auto">
				<h2 class="h2">{producer.name}</h2>
				<StatusBadge status={producer.status} />
			</div>

			{#if userData?.publicMetadata.ts_role === 'admin' || (userData?.publicMetadata.ts_role === 'ts_rep' && producer.status === 'STARTED')}
				<div>
					<button type="button" class="btn-primary" on:click={editProducer}>Edit</button>
				</div>
			{/if}
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
		<div class="flex gap-8 w-full mb-4 pb-8 border-b border-surface-200">
			<div class="flex flex-col gap-2">
				<span class="font-semibold text-base">Address</span>
				<span>{producer.address}</span>
				<span>{producer.city}, {producer.state} {producer.zip} {producer.country}</span>
			</div>
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
				<span class="font-semibold text-base">Type</span>
				<p>{producer.type.toUpperCase()}</p>
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
			<Datatable {handler} rowsPerPage={false} pagination={false}>
				<table class="table mb-4">
					<thead>
						<tr>
							<ThSort orderBy="name" {handler}>Name</ThSort>
							<ThSort orderBy="state" {handler}>Location</ThSort>
							<ThSort orderBy="createdAt" {handler}>Date Created</ThSort>
							<th>Actions</th>
						</tr>
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
										</td>
									</tr>
								{/each}
							{/if}
						{/await}
					</tbody>
				</table>
			</Datatable>
			<button type="button" on:click={addLocation} class="btn-primary w-min">+ Add Location</button>
		</div>
	{/if}
</div>
