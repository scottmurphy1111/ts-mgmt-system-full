<script lang="ts">
	import Datatable from '$lib/components/datatables/Datatable.svelte';
	import ThSort from '$lib/components/datatables/ThSort.svelte';
	import { reload } from '$lib/components/datatables/api';
	import type { LocationWithIncludes } from '$lib/types/types';
	import type { LocationContact } from '@prisma/client';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let location: LocationWithIncludes;
	export let error: string | undefined;

	let contacts: LocationContact[] = [];
	$: if (location.locationContacts) {
		contacts = location.locationContacts;
	}

	const modalStore = getModalStore();
	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	let modal: ModalSettings;

	$: if (location) {
		modal = {
			type: 'component',
			component: 'modalAddContact',
			meta: {
				locationId: location?.id
			},
			response: (response) => {
				console.log('response', response);
				if (!response) {
					handler.invalidate();
				}
			}
		};
	}

	const addContact = () => {
		modalStore.trigger(modal);
	};
	const handler = new DataHandler<LocationContact>(contacts, {
		rowsPerPage: 9999,
		totalRows: contacts.length
	});

	const rows = handler.getRows();

	handler.onChange((state: State) => reload(state, undefined, 'location-contacts'));
	handler.invalidate();
</script>

<Datatable {handler} rowsPerPage={false} pagination={false}>
	<table class="table mb-4">
		<thead>
			<tr>
				<ThSort orderBy="lastName" {handler}>Name</ThSort>
				<ThSort orderBy="email" {handler}>Email</ThSort>
				<ThSort orderBy="phone" {handler}>Phone</ThSort>
				<ThSort orderBy="role" {handler}>Role</ThSort>
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
						<td colspan="5">No Contacts Found, Click below to Add Contacts</td>
					</tr>
				{:else}
					{#each $rows as contact}
						<tr>
							<td>
								<span class="flex items-center">{contact.firstName} {contact.lastName}</span>
							</td>
							<td>
								<span class="flex items-center">{contact.email}</span>
							</td>
							<td>
								<span class="flex items-center">{contact.phone}</span>
							</td>
							<td>
								<span class="flex items-center">{contact.role}</span>
							</td>
							<td class="flex gap-4 items-center">
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
	on:click={addContact}
	class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min">+ Add Contact</button
>
