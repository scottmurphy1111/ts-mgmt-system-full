<script lang="ts">
	import Datatable from '$lib/components/datatables/Datatable.svelte';
	import ThSort from '$lib/components/datatables/ThSort.svelte';
	import { reload } from '$lib/components/datatables/api';
	import type {
		LocationProgramWithIncludes,
		LocationWithIncludes,
		Ratesheet
	} from '$lib/types/types';
	import type { LocationContact, LocationMarkup, LocationProgram } from '@prisma/client';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import MarkupsRow from './MarkupsRow.svelte';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';
	import { invalidateAll } from '$app/navigation';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let location: LocationWithIncludes;
	export let ratesheets: Ratesheet[];
	export let error: string | undefined;

	let programs: LocationProgramWithIncludes[] = [];
	$: if (location.locationPrograms) {
		programs = location.locationPrograms;
	}

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	let modal: ModalSettings;

	$: if (location) {
		modal = {
			type: 'component',
			component: 'modalAddPrograms',
			backdropClasses: 'overflow-y-scroll',
			meta: {
				locationId: location?.id,
				ratesheets,
				assignedPrograms: programs
			},
			response: (response) => {
				console.log('response', response);
				if (!response) {
					handler.invalidate();
				}
			}
		};
	}

	const addPrograms = () => {
		modalStore.trigger(modal);
	};

	const deleteProgram = (id: string) => {
		pendingStore.set(true);

		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				title: 'Delete Program',
				body: 'Are you sure you want to delete this program (this is irreversible)?',
				response: (r: boolean) => resolve(r)
			});
		}).then(async (r) => {
			if (!r) {
				pendingStore.set(false);
				return;
			}

			await fetch(`/api/location-programs?id=${id}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						invalidateAll(); //fix?
						toastStore.trigger({ message: '👍 Program deleted successfully' });
						pendingStore.set(false);
						handler.invalidate();
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting program ${err}` });
					pendingStore.set(false);
				});
		});
	};
	const handler = new DataHandler<LocationProgramWithIncludes>(programs, {
		rowsPerPage: 9999,
		totalRows: programs.length
	});

	const rows = handler.getRows();

	handler.onChange((state: State) => reload(state, undefined, 'location-programs'));
	handler.invalidate();
</script>

<Datatable {handler} rowsPerPage={false} pagination={false} search={false}>
	<table class="table mb-4">
		<thead>
			<tr>
				<ThSort orderBy="name" {handler}>Name</ThSort>
				<th>Markups</th>

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
					<td colspan="5">Loading...</td>
				</tr>
			{:then $rows}
				{#if $rows.length === 0}
					<tr>
						<td colspan="3">No Programs assigned, Click below to Add Programs</td>
					</tr>
				{:else}
					{#each $rows as program}
						<tr>
							<td>
								<span class="flex items-center">{program.name}</span>
							</td>
							<td>
								<MarkupsRow {program} />
							</td>
							<!-- <td>
								<span class="flex items-center">{contact.phone}</span>
							</td>
							<td>
								<span class="flex items-center">{contact.role}</span>
							</td> -->
							<td class="flex gap-4 items-center">
								<button
									class="btn-icon text-error-500 w-6 h-6"
									on:click={() => deleteProgram(program.id)}
								>
									<svelte:component this={DeleteIcon} />
								</button>
								<!-- <a
									class="flex text-primary-500 items-center"
									href={`/dashboard/producers/${producer.id}/locations/${location.id}`}>View</a
								>
								<a
									class="flex text-primary-500 items-center"
									href={`/dashboard/producer-enrollment/${location.id}`}>Complete</a
								> -->
							</td>
						</tr>
					{/each}
				{/if}
			{/await}
		</tbody>
		<!-- {/if} -->
	</table>
</Datatable>
{#if error}
	<p class="text-error-500">{error}</p>
{/if}
<button
	type="button"
	on:click={addPrograms}
	class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
	>+ Edit / Assign Programs</button
>
