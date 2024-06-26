<script lang="ts">
	import Datatable from '$lib/components/datatables/Datatable.svelte';
	import ThSort from '$lib/components/datatables/ThSort.svelte';
	import { reload } from '$lib/components/datatables/api';
	import type {
		LocationProgramWithIncludes,
		LocationWithIncludes,
		Ratesheet
	} from '$lib/types/types';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import MarkupsRow from './MarkupsRow.svelte';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { getContext } from 'svelte';
	import { type Writable } from 'svelte/store';

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
				ratesheets,
				locationId: location.id,
				assignedPrograms: programs
			},
			response: (response) => {
				if (!response) {
					handler.invalidate();
					invalidate('data:location');
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

	handler.onChange((state: State) =>
		reload(state, 'location-programs', { locationId: location.id })
	);

	$: if (programs) {
		handler.invalidate();
	}
</script>

<Datatable {handler} rowsPerPage={false} pagination={false} search={false}>
	<table class="table mb-4">
		<thead>
			<tr>
				<ThSort orderBy="name" {handler}>Name</ThSort>
				<th>Markups</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#await $rows}
				<tr>
					<td colspan="5">Loading...</td>
				</tr>
			{:then $rows}
				{#if $rows.length === 0}
					<tr>
						<td colspan="3">No Programs assigned</td>
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
							<td class="flex gap-4 items-center">
								<button
									class="btn-icon text-error-500 w-6 h-6"
									on:click={() => deleteProgram(program.id)}
								>
									<svelte:component this={DeleteIcon} />
								</button>
							</td>
						</tr>
					{/each}
				{/if}
			{/await}
		</tbody>
	</table>
</Datatable>
{#if error}
	<p class="text-error-500">{error}</p>
{/if}
<button type="button" on:click={addPrograms} class="btn-primary w-min"
	>+ Edit / Assign Programs</button
>
