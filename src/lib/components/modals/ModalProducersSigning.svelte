<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import CloseIcon from '$lib/assets/icons/close.svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

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
				<a
					href="/dashboard/producers/send-agreement"
					class="btn-primary text-wrap"
					on:click={parent.onClose}>Send Producer Agreement for e-signature</a
				>
				<a href="/dashboard/producers/new" class="btn-success text-wrap" on:click={parent.onClose}
					>Proceed with Create a New Producer</a
				>
			</div>
		</div>
	</div>
{/if}
