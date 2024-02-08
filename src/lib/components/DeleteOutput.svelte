<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';

	export let outputId: string;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	const deleteOutput = () => {
		pendingStore.set(true);
		if (outputId === undefined) {
			pendingStore.set(false);
			return;
		}

		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				title: 'Delete Output',
				body: 'Are you sure you want to delete this output (this is irreversible)?',
				response: (r: boolean) => resolve(r)
			});
		}).then(async (r) => {
			if (!r) {
				pendingStore.set(false);
				return;
			}

			await fetch(`/api/rateOutput?id=${outputId}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						invalidateAll(); //fix?
						toastStore.trigger({ message: '👍 Output deleted successfully' });
						pendingStore.set(false);
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting output ${err}` });
					pendingStore.set(false);
				});
		});
	};
</script>

<button class="btn-icon text-error-500 w-6 h-6" on:click={deleteOutput}>
	<svelte:component this={DeleteIcon} />
</button>
