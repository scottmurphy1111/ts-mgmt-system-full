<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Datatable from '$lib/components/datatables/Datatable.svelte';
	import ThSort from '$lib/components/datatables/ThSort.svelte';
	import { reload } from '$lib/components/datatables/api';
	import type { LocationWithIncludes } from '$lib/types/types';
	import type { LocationContact } from '@prisma/client';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import { getContext } from 'svelte';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';
	import EditIcon from '$lib/assets/icons/edit.svelte';

	import type { Writable } from 'svelte/store';

	export let location: LocationWithIncludes;
	export let error: string | undefined;

	let contacts: LocationContact[] = [];
	$: if (location.locationContacts) {
		contacts = location.locationContacts;
	}

	const modalStore = getModalStore();
	const toastStore = getToastStore();
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

	const editContact = (contact: LocationContact) => {
		modalStore.trigger({
			type: 'component',
			component: 'modalAddContact',
			meta: {
				locationId: location.id,
				contact
			},
			response: (response) => {
				console.log('response', response);
				if (!response) {
					handler.invalidate();
				}
			}
		});
	};

	const deleteContact = (id: string) => {
		pendingStore.set(true);

		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				title: 'Delete Contact',
				body: 'Are you sure you want to delete this contact?',
				response: (r: boolean) => resolve(r)
			});
		}).then(async (r) => {
			if (!r) {
				pendingStore.set(false);
				return;
			}

			await fetch(`/api/location-contacts?id=${id}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						invalidateAll(); //fix?
						toastStore.trigger({ message: '👍 Contact deleted successfully' });
						pendingStore.set(false);
						handler.invalidate();
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting contact ${err}` });
					pendingStore.set(false);
				});
		});
	};

	const handler = new DataHandler<LocationContact>(contacts, {
		rowsPerPage: 9999,
		totalRows: contacts.length
	});

	const rows = handler.getRows();

	handler.onChange((state: State) =>
		reload(state, 'location-contacts', { locationId: location.id })
	);
	$: if (contacts) {
		handler.invalidate();
	}
	// handler.invalidate();
</script>

<Datatable {handler} rowsPerPage={false} pagination={false} search={false}>
	<table class="table mb-4">
		<thead>
			<tr>
				<ThSort orderBy="lastName" {handler}>Name</ThSort>
				<ThSort orderBy="email" {handler}>Email</ThSort>
				<ThSort orderBy="phone" {handler}>Phone</ThSort>
				<ThSort orderBy="title" {handler}>Title</ThSort>
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
					<td colspan="6">Loading...</td>
				</tr>
			{:then $rows}
				{#if $rows.length === 0}
					<tr>
						<td colspan="6">No Contacts Found</td>
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
								<span class="flex items-center">{contact.title}</span>
							</td>
							<td>
								<span class="flex items-center">{contact.role}</span>
							</td>
							<td class="flex gap-4 items-center">
								<button
									title="Edit Contact"
									class="btn-icon text-primary-500 w-6 h-6"
									on:click={() => editContact(contact)}
								>
									<svelte:component this={EditIcon} />
								</button>
								<button
									title="Delete Contact"
									class="btn-icon text-error-500 w-6 h-6"
									on:click={() => deleteContact(contact.id)}
								>
									<svelte:component this={DeleteIcon} />
								</button>
							</td>
						</tr>
					{/each}
				{/if}
			{/await}
		</tbody>
		<!-- {/if} -->
	</table>
</Datatable>
<button type="button" on:click={addContact} class="btn-primary w-min">+ Add Contact</button>
