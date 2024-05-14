<script lang="ts">
	import { getContext, type SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';
	import { states_and_provinces } from '$lib/helpers/states_and_provinces';
	import PhoneInput from '$lib/components/core/PhoneInput.svelte';
	import EmailInput from '$lib/components/core/EmailInput.svelte';
	import { writable, type Writable } from 'svelte/store';
	import CloseIcon from '$lib/assets/icons/close.svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');
	const editingProducerStore = writable(false);

	$: error = {} as { type: 'failure'; status: number; data?: Record<string, unknown> | undefined };

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
			<h3 class="h3 font-semibold mb-4">Edit Producer</h3>
			<form
				method="post"
				action="?/updateProducer"
				use:enhance={({}) => {
					pendingStore.set(true);
					return async ({ update, result }) => {
						if (result?.status === 200) {
							await update();
							editingProducerStore.set(false);
							pendingStore.set(false);
							toastStore.trigger({ message: '👍 Producer saved successfully' });
							parent.onClose();
						} else {
							await applyAction(result);
							pendingStore.set(false);
							if (result.type === 'failure') {
								error = { ...result };
							}
							toastStore.trigger({ message: '❗️ Producer save failed' });
						}
					};
				}}
			>
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200 relative">
					<input hidden type="text" name="id" value={$modalStore[0]?.meta.producer.id} />
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="name">Producer Name*</label>
						<input
							class="input"
							type="text"
							id="name"
							name="name"
							value={$modalStore[0]?.meta.producer.name}
							required
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="dba">Dba</label>
						<input
							class="input"
							type="text"
							id="dba"
							name="dba"
							value={$modalStore[0]?.meta.producer.dba}
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="taxId">Tax Id</label>
						<input
							class="input"
							type="text"
							id="taxId"
							name="taxId"
							value={$modalStore[0]?.meta.producer.taxId}
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="website">Website</label>
						<input
							class="input"
							type="text"
							id="website"
							name="website"
							value={$modalStore[0]?.meta.producer.website}
						/>
					</span>
				</div>
				<div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
					<div>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="address">Address*</label>
							<input
								class="input"
								type="text"
								id="address"
								name="address"
								value={$modalStore[0]?.meta.producer.address}
							/>
						</span>
					</div>
					<div class="flex w-full gap-2">
						<span class="flex flex-col items-baseline gap-1 w-full">
							<label class="font-semibold" for="city">City*</label>
							<input
								class="input"
								type="text"
								id="city"
								name="city"
								value={$modalStore[0]?.meta.producer.city}
							/>
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="state">State*</label>
							<select class="select" name="state" value={$modalStore[0]?.meta.producer.state}>
								<option selected disabled>Select State</option>
								{#each states_and_provinces as state}
									<option value={state.abbreviation}>{state.name}</option>
								{/each}
							</select>
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="zip">Zip*</label>
							<input
								class="input"
								type="text"
								id="zip"
								name="zip"
								value={$modalStore[0]?.meta.producer.zip}
							/>
						</span>
						<span class="flex flex-col items-baseline gap-1 w-48">
							<label class="font-semibold" for="country">Country*</label>
							<select class="select" name="country" value={$modalStore[0]?.meta.producer.country}>
								<option value={'USA'} selected>United States</option>
								<option value={'CAN'}>Canada</option>
							</select></span
						>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactName">Primary Contact Name*</label>
						<input
							class="input"
							type="text"
							id="primaryContactName"
							name="primaryContactName"
							value={$modalStore[0]?.meta.producer.primaryContactName}
							required
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<PhoneInput
							name="primaryContactPhone"
							required={true}
							value={$modalStore[0]?.meta.producer.primaryContactPhone}
							error={Boolean(error.data?.invalidPhone)}
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<EmailInput
							name="primaryContactEmail"
							required={true}
							error={Boolean(error.data?.invalidEmail)}
							value={$modalStore[0]?.meta.producer.primaryContactEmail}
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactTitle">Title</label>
						<input
							class="input"
							type="text"
							id="primaryContactTitle"
							name="primaryContactTitle"
							value={$modalStore[0]?.meta.producer.primaryContactTitle}
						/>
					</span>
				</div>
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="type">Type*</label>
						<select
							class="select"
							id="type"
							name="type"
							value={$modalStore[0]?.meta.producer.type}
							required
						>
							<option value="dealership">DEALERSHIP</option>
							<option value="repair shop">REPAIR SHOP</option>
							<option value="lender">LENDER</option>
							<option value="fleet">FLEET</option>
							<option value="association">ASSOCIATION</option>
							<option value="travel center">TRAVEL CENTER</option>
							<option value="other">OTHER</option>
						</select>
					</span>

					{#if $modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'ts_rep'}
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep*</label>
							<select
								class="select"
								id="tsSalesRepId"
								name="tsSalesRepId"
								value={$modalStore[0]?.meta.producer.tsSalesRepId}
								required
							>
								<option value={$modalStore[0]?.meta.userData.id}
									>{$modalStore[0]?.meta.userData?.firstName}
									{$modalStore[0]?.meta.userData.lastName}</option
								>
							</select>
						</span>
					{/if}
					{#if $modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'admin'}
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep*</label>
							<select
								class="select"
								id="tsSalesRepId"
								name="tsSalesRepId"
								value={$modalStore[0]?.meta.producer.tsSalesRepId}
								required
							>
								<option disabled selected value={null}>Select a Sales Rep</option>
								{#each $modalStore[0]?.meta.reps as rep}
									<option value={rep.publicUserData?.userId}
										>{rep.publicUserData?.firstName} {rep.publicUserData?.lastName}</option
									>
								{/each}
							</select>
						</span>
					{/if}
				</div>
				<div class="flex gap-2">
					<div class="flex">
						<button type="submit" class="btn-primary">Save</button>
					</div>
					<div class="flex">
						<button type="button" class="btn-error" on:click={parent.onClose}>Cancel</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}
