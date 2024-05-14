<script lang="ts">
	import { setContext } from 'svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import type { ProducerWithIncludes, LocationWithIncludes } from '$lib/types/types';
	import { reload } from '$lib/components/datatables/api';
	import { goto, invalidate } from '$app/navigation';
	import ThSort from '$lib/components/datatables/ThSort.svelte';
	import Datatable from '$lib/components/datatables/Datatable.svelte';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import StatusBadge from '$lib/components/core/StatusBadge.svelte';

	export let data;

	$: ({ count, producers, userData } = data);

	export let form: {
		producer: ProducerWithIncludes;
		location: LocationWithIncludes;
	};

	const createdProducerStore = writable<ProducerWithIncludes | null>(null);
	setContext('createdProducerContext', createdProducerStore);

	$: if (form?.producer?.id) {
		createdProducerStore.set(form?.producer);
	}

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalProducersSigning',
		title: 'Create a New Producer Process',
		body: `In order to Create a New Producer, you must first Send Producers Agreement for E-signature.`,
		backdropClasses: 'opacity-95',
		modalClasses: 'p-8'
	};

	const handler = new DataHandler<ProducerWithIncludes>(producers, {
		rowsPerPage: 20,
		totalRows: count
	});
	const rows = handler.getRows();

	$: salesRepId = userData?.publicMetadata?.ts_role === 'ts_rep' ? userData.id : undefined;

	$: if (salesRepId) {
		handler.invalidate();
	}

	handler.onChange((state: State) => reload(state, 'producers', { salesRepId: salesRepId }));

	$: if (userData?.publicMetadata?.ts_role !== 'ts_rep') {
		handler.invalidate();
	}

	const triggerCompleteEnrollmentModal = (producerId: string) => {
		const modalCompleteEnrollment: ModalSettings = {
			type: 'component',
			component: 'modalCompleteEnrollment',
			meta: {
				producerId
			},
			title: 'Complete Enrollment',
			body: `Are you sure you want to complete the enrollment process for this producer? After submitting, the Producer's information can only be edited by an admin at TruckSuite HQ.`,
			backdropClasses: 'opacity-95',
			modalClasses: 'p-8',
			response: (response) => {
				console.log('response', response);
				if (!response) {
					handler.invalidate();
					invalidate('data:producer');
				}
			}
		};
		modalStore.trigger(modalCompleteEnrollment);
	};
</script>

{#if userData}
	<div class="flex flex-col gap-4 p-8">
		<h2 class="h2">Producers</h2>
		<div class="flex items-start gap-4 mb-8 pb-8 border-b border-surface-200">
			<button
				class="btn-primary text-wrap"
				on:click={() => goto('/dashboard/producers/send-agreement')}
				>Send Producer Agreements</button
			>
			<button class="btn-primary text-wrap" on:click={() => modalStore.trigger(modal)}
				>Create a New Producer</button
			>
		</div>

		<div class="flex flex-col gap-8">
			<div class="flex flex-col w-full md:w-full gap-4">
				<Datatable {handler}>
					<table class="table mb-4">
						<thead>
							<tr>
								<ThSort orderBy="name" {handler}>Name</ThSort>
								<ThSort orderBy="dba" {handler}>DBA</ThSort>
								<ThSort orderBy="type" {handler}>Type</ThSort>
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
										<td colspan="3">No Producers Found</td>
									</tr>
								{:else}
									{#each $rows as producer}
										<tr>
											<td>
												<a href={`/dashboard/producers/${producer.id}`}>
													<span class="flex items-center gap-2">
														{producer.name}<StatusBadge status={producer.status} />
													</span>
												</a>
											</td>
											<td>
												<a href={`/dashboard/producers/${producer.id}`}>
													<span class="flex items-center">{producer.dba}</span>
												</a>
											</td>
											<td>
												<a href={`/dashboard/producers/${producer.id}`}>
													<span class="flex items-center">{producer.type.toUpperCase()}</span>
												</a>
											</td>
											<td class="flex gap-4 items-center">
												<a
													class="flex text-primary-500 items-center"
													href={`/dashboard/producers/${producer.id}`}
													>View {#if producer.status === 'STARTED'}/ Edit{/if}</a
												>
												{#if producer.status === 'STARTED'}
													<button
														type="button"
														class="flex text-primary-500 items-center"
														on:click={() => triggerCompleteEnrollmentModal(producer.id)}
														>Complete Enrollment</button
													>{/if}
												{#if producer.status === 'PENDING' && userData?.publicMetadata?.ts_role === 'admin'}
													<a
														href={`/dashboard/producers/${producer.id}/activate`}
														class="flex text-primary-500 items-center">Activate</a
													>
												{/if}
											</td></tr
										>
									{/each}
								{/if}
							{/await}
						</tbody>
					</table>
				</Datatable>
			</div>
		</div>
	</div>
{/if}
