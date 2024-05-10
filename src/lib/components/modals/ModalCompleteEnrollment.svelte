<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import CloseIcon from '$lib/assets/icons/close.svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const cBase =
		'bg-surface-100-800-token w-auto h-full p-16 flex justify-center items-center rounded-lg relative';
</script>

{#if $modalStore[0]}
	<div class="modal-example-fullscreen {cBase}">
		<button class="absolute w-4 h-4 top-4 right-4" type="button" on:click={parent.onClose}>
			<svelte:component this={CloseIcon} />
		</button>
		<div class="flex flex-col space-y-8 container">
			<h3 class="h3 font-semibold mb-4">{$modalStore[0].title}</h3>
			{@html $modalStore[0].body}
			<div class="flex w-full gap-4 justify-start">
				<button class="btn-secondary text-wrap" on:click={parent.onClose}>Cancel</button>
				<form
					method="post"
					action="?/completeEnrollment"
					use:enhance={() => {
						return async ({ result, update }) => {
							await update();
							if (result?.status === 204) {
								toastStore.trigger({ message: '👍 Enrollment sent successfully' });
								parent.onClose();
							} else {
								toastStore.trigger({ message: '❗️ Enrollment did not send, please try again' });
								parent.onClose();
							}
						};
					}}
				>
					<input type="hidden" name="producerId" value={$modalStore[0].meta.producerId} />
					<button class="btn-primary text-wrap">Proceed with Enrollment</button>
				</form>
			</div>
		</div>
	</div>
{/if}
