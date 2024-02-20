<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	console.log('parent', parent);

	const modalStore = getModalStore();

	// Notes: Use `w-screen h-screen` to fit the visible canvas size.
	const cBase = 'bg-surface-100-800-token w-screen h-screen p-8 flex justify-center items-center';
</script>

{#if $modalStore[0]}
	<div class="modal-example-fullscreen {cBase}">
		<div class="flex flex-col items-center space-y-4">
			<h2 class="h2">{$modalStore[0].title}</h2>
			{@html $modalStore[0].body}
			<button class="btn variant-filled" on:click={parent.onClose}>Ok</button>
		</div>
	</div>
{/if}
