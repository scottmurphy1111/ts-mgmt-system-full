<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import AssignPrograms from './AssignPrograms.svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	const locationId = $modalStore[0]?.meta?.locationId;
	const producerId = $modalStore[0]?.meta?.producerId;
	const ratesheets = $modalStore[0]?.meta?.ratesheets;

	// Notes: Use `w-screen h-screen` to fit the visible canvas size.
	const cBase =
		'bg-surface-100-800-token w-auto h-full p-16 flex justify-center items-center rounded-lg';
</script>

{#if $modalStore[0]}
	<div class="modal-example-fullscreen {cBase}">
		<div class="flex flex-col items-center space-y-4">
			<h2 class="h2">{$modalStore[0].title}</h2>
			<!-- {@html $modalStore[0].body} -->
			<!-- <button class="btn variant-filled" on:click={parent.onClose}>Ok</button> -->
			<AssignPrograms {locationId} {ratesheets} onClose={parent.onClose} {producerId} />
		</div>
	</div>
{/if}
