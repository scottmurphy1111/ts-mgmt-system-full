<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';
	import type { ProducerWithIncludes } from '$lib/types/types';
	import CloseIcon from '$lib/assets/icons/close.svelte';
	import PhoneInput from '$lib/components/core/PhoneInput.svelte';
	import EmailInput from '$lib/components/core/EmailInput.svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	$: console.log('modalStore', $modalStore);

	$: error = {} as { type: 'failure'; status: number; data?: Record<string, unknown> | undefined };

	$: console.log('error', error);
	const getSalesRepId = () => {
		return $modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'ts_rep'
			? `?salesRepId=${$modalStore[0]?.meta.userData?.id}`
			: '';
	};

	const getProducers = async () => {
		return await fetch(`/api/producersAll${getSalesRepId()}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((data) => {
				console.log('data', data);
				return data as ProducerWithIncludes[];
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	$: producers = getProducers();

	console.log('modalStore', $modalStore);

	// const sendToAgreements = () => {
	// 	console.log('sendToAgreements');
	// 	goto('/dashboard/producers/send-agreement');
	// 	parent.onClose();
	// };

	// const sendToNew = () => {
	// 	console.log('sendToNew');
	// 	goto('/dashboard/producers/new');
	// 	parent.onClose();
	// };

	// Notes: Use `w-screen h-screen` to fit the visible canvas size.
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
							console.log('🥶', result);
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
