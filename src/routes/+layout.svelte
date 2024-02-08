<script lang="ts">
	import '../app.postcss';
	import { Toast, Modal, initializeStores, type ModalComponent } from '@skeletonlabs/skeleton';
	import ModalImage from '$lib/components/ModalImage.svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import SpinnerIcon from '$lib/assets/icons/spinner.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		modalImage: { ref: ModalImage }
	};

	const pendingStore = writable<boolean>(false);
	setContext('pendingStore', pendingStore);

	initializeStores();
</script>

<Toast />
<Modal components={modalRegistry} />
{#if $pendingStore}
	<div class="flex fixed w-screen h-screen top-0 justify-center items-center z-20">
		<div class="w-8 z-10 relative">
			<svelte:component this={SpinnerIcon} />
		</div>
		<div class="bg-surface-500 opacity-50 w-full h-full absolute top-0 left-0"></div>
	</div>
{/if}
<slot />
