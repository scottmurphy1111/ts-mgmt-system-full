<script lang="ts">
	import { getContext, type SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';
	import { states_and_provinces } from '$lib/helpers/states_and_provinces';
	import type { ProducerWithIncludes } from '$lib/types/types';
	import PhoneInput from '../core/PhoneInput.svelte';
	import EmailInput from '../core/EmailInput.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import type { Writable } from 'svelte/store';
	import CloseIcon from '$lib/assets/icons/close.svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	$: console.log('parent', parent);

	const modalStore = getModalStore();
	const toastStore = getToastStore();

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
			.then(async (res) => await res.json())
			.then((data) => {
				console.log('data', data);
				return data as ProducerWithIncludes[];
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	$: producers = getProducers();

	$: console.log('modalStore', $modalStore);

	$: error = {} as { type: 'failure'; status: number; data?: Record<string, unknown> | undefined };

	$: console.log('error', error);

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
			<h3 class="h3 mb-4">Add Location</h3>
			<!-- {@html $modalStore[0].body} -->
			<form
				method="post"
				action="?/saveLocation"
				use:enhance={() => {
					return async ({ result, update }) => {
						console.log('result', result);

						if (result?.status === 200) {
							await update();
							parent.onClose();
							toastStore.trigger({ message: '👍 Location saved successfully' });
						} else {
							await applyAction(result);
							if (result.type === 'failure') {
								error = { ...result };
							}

							// toastStore.trigger({ message: '❗️ Location save failed' });
						}
						// parent.onClose();
						// editingProducerStore.set(false);
						// creatingLocationStore.set(false);
					};
				}}
			>
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					{#if $modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'ts_rep'}
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="name">Producer</label>
							<select class="select" name="producerId" required>
								<option
									selected={$modalStore[0]?.meta.producerId}
									value={$modalStore[0]?.meta.producerId}
									>{$modalStore[0]?.meta.producerName}</option
								>
							</select>
						</span>
					{/if}
					{#if $modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'admin'}
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="name">Producer</label>
							<select class="select" name="producerId" required>
								<option disabled selected>Select Producer</option>
								{#await producers}
									<!-- Show loading state -->
								{:then producers}
									{#if producers}
										{#each producers as producer}
											<option
												selected={producer.id === $modalStore[0]?.meta.producerId}
												value={$modalStore[0]?.meta.producerId}>{producer.name}</option
											>
										{/each}
									{/if}
								{/await}
							</select>
						</span>
					{/if}
					{#if $modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'ts_rep'}
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep*</label>
							<!-- disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
							<select
								class="select"
								id="tsSalesRepId"
								name="tsSalesRepId"
								value={$modalStore[0]?.meta.userData?.id ?? ''}
								required
							>
								<option value={$modalStore[0]?.meta.userData?.id}
									>{$modalStore[0]?.meta.userData?.firstName}
									{$modalStore[0]?.meta.userData?.lastName}</option
								>
							</select>
						</span>
					{/if}
					{#if $modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'admin'}
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep*</label>
							<!-- disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
							<select
								class="select"
								id="tsSalesRepId"
								name="tsSalesRepId"
								value={$modalStore[0]?.meta.userData?.id ?? ''}
								required
							>
								<option disabled selected>Select a Sales Rep</option>
								{#each $modalStore[0]?.meta?.reps as rep}
									<option value={rep.publicUserData?.userId}
										>{rep.publicUserData?.firstName} {rep.publicUserData?.lastName}</option
									>
								{/each}
							</select>
						</span>
					{/if}
				</div>
				<!-- <input hidden type="text" name="producerId" value={$modalStore[0]?.meta.producerId} /> -->
				<!-- <input hidden type="text" name="locationId" value={location.id} /> -->
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="name">Location Name*</label>
						<input class="input" type="text" id="name" name="name" required />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<PhoneInput name="phone" required={true} error={Boolean(error.data?.invalidPhone)} />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<EmailInput name="email" required={true} error={Boolean(error.data?.invalidEmail)} />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="website">Website</label>
						<input class="input" type="text" id="website" name="website" />
					</span>
				</div>
				<div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
					<div>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="address">Address*</label>
							<input class="input" type="text" id="address" name="address" />
						</span>
					</div>
					<div class="flex gap-2">
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="city">City*</label>
							<input class="input" type="text" id="city" name="city" />
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="state">State*</label>
							<select class="select" name="state">
								<option selected disabled>Select State</option>
								{#each states_and_provinces as state}
									<option value={state.abbreviation}>{state.name}</option>
								{/each}
							</select>
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="zip">Zip*</label>
							<input class="input" type="text" id="zip" name="zip" />
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="country">Country*</label>
							<select class="select" name="country">
								<option value={'USA'} selected>United States</option>
								<option value={'CAN'}>Canada</option>
							</select></span
						>
					</div>
					<div class="flex gap-2">
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="main">Main Location?</label>
							<input class="checkbox" type="checkbox" id="main" name="main" />
						</span>
					</div>
				</div>
				<div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
					<div>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="mailingAddress">Mailing Address</label>
							<input class="input" type="text" id="mailingAddress" name="mailingAddress" />
						</span>
					</div>
					<div class="flex gap-2">
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="mailingCity">City</label>
							<input class="input" type="text" id="mailingCity" name="mailingCity" />
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="mailingState">State</label>
							<select class="select" name="mailingState">
								<option selected disabled>Select State</option>
								{#each states_and_provinces as state}
									<option value={state.abbreviation}>{state.name}</option>
								{/each}
							</select>
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="mailingZip">Zip</label>
							<input class="input" type="text" id="mailingZip" name="mailingZip" />
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="mailingCountry">Country</label>
							<select class="select" name="mailingCountry">
								<option value={'USA'} selected>United States</option>
								<option value={'CAN'}>Canada</option>
							</select></span
						>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<!-- {#if $creatingLocationStore} -->
						<button
							type="submit"
							class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
							>Save Location</button
						>
						<!-- {/if} -->
					</span>
				</div>
			</form>
		</div>
	</div>
{/if}
