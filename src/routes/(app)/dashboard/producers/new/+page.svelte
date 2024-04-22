<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import InfoCircleIcon from '$lib/assets/icons/info-circle.svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import paSigned from '$lib/assets/images/pa-signed.jpeg';
	import type { User, OrganizationMembership } from '@clerk/clerk-sdk-node';
	import { writable, type Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { ProducerWithIncludes } from '$lib/types/types';
	import PhoneInput from '$lib/components/core/PhoneInput.svelte';
	import EmailInput from '$lib/components/core/EmailInput.svelte';
	import { page } from '$app/stores';
	import type { ActionData } from '../$types.js';
	import { states_and_provinces } from '$lib/helpers/states_and_provinces';

	export let data;
	export let form;

	$: console.log('form', form);

	$: console.log('$page', $page);
	// $: console.log('data', data);
	const { reps, userData } = data;
	// $: console.log('userData', userData);
	// export let reps: OrganizationMembership[];
	export let producer: ProducerWithIncludes | null;

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	// const createdProducerContext =
	// 	getContext<Writable<ProducerWithIncludes>>('createdProducerContext');

	// $: console.log('createdProducerContext', $createdProducerContext);

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const instructionsModal: ModalSettings = {
		type: 'component',
		component: 'modalImage',
		image: paSigned
	};

	const editingProducerStore = writable(false);

	function editingProducer() {
		editingProducerStore.set(true);
	}

	function openInstructions() {
		modalStore.trigger(instructionsModal);
	}
</script>

<div class="flex flex-col p-8 w-full">
	<h2 class="h2 mb-4">Create New Producer</h2>
	<form
		method="post"
		action="?/createProducer"
		use:enhance={({}) => {
			pendingStore.set(true);
			return async ({ update, result }) => {
				if (result?.status === 200) {
					await update();
					editingProducerStore.set(false);
					pendingStore.set(false);
					toastStore.trigger({ message: '👍 Producer saved successfully' });
					goto('/dashboard/producers');
				} else {
					await applyAction(result);
					pendingStore.set(false);
					toastStore.trigger({ message: '❗️ Producer save failed' });
				}
			};
		}}
	>
		<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200 relative">
			<!-- {#if $createdProducerContext?.id}
				<input hidden type="text" name="producerId" bind:value={$createdProducerContext.id} />

				{#if !$editingProducerStore}
					<button
						type="button"
						class="btn bg-gradient-to-br variant-gradient-primary-secondary absolute -top-16 right-0"
						on:click={editingProducer}
					>
						Edit
					</button>
				{/if}

				{#if $editingProducerStore}
					<button
						type="submit"
						class="btn bg-gradient-to-br variant-gradient-primary-secondary absolute -top-16 right-0"
						on:click={editingProducer}
					>
						Save
					</button>
				{/if}
			{/if} -->
			<input hidden type="text" name="producerId" value={undefined} />
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="name">Producer Name*</label>
				<input class="input" type="text" id="name" name="name" required />
				<!-- value={$createdProducerContext?.name}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="dba">Dba</label>
				<input class="input" type="text" id="dba" name="dba" />
				<!-- value={$createdProducerContext?.dba}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="taxId">Tax Id</label>
				<input class="input" type="text" id="taxId" name="taxId" />
				<!-- value={$createdProducerContext?.taxId}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="website">Website</label>
				<input class="input" type="text" id="website" name="website" />
				<!-- value={$createdProducerContext?.website}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
			</span>
		</div>
		<div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
			<div>
				<span class="flex flex-col items-baseline gap-1">
					<label class="font-semibold" for="address">Address*</label>
					<input class="input" type="text" id="address" name="address" />
				</span>
			</div>
			<div class="flex w-full gap-2">
				<span class="flex flex-col items-baseline gap-1 w-full">
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
				<span class="flex flex-col items-baseline gap-1 w-48">
					<label class="font-semibold" for="country">Country*</label>
					<select class="select" name="country">
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
					required
				/>
				<!-- value={$createdProducerContext?.primaryContactName}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<PhoneInput name="primaryContactPhone" required={true} error={form?.invalidPhone} />
				<!-- <input
					class="input"
					type="tel"
					id="primaryContactPhone"
					name="primaryContactPhone"
					pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
					required
				/> -->
				<!-- <MaskInput
					alwaysShowMask
					maskChar="_"
					mask="000-000-0000"
					class="input"
					type="text"
					id="primaryContactPhone"
					name="primaryContactPhone"
					required
				/> -->
				<!-- <MaskInput
					mask="(000) 000 - 0000"
					size={20}
					showMask
					alwaysShowMask
					maskChar="_"
					class="input"
					type="text"
					id="primaryContactPhone"
					name="primaryContactPhone"
					required
				/> -->
				<!-- value={$createdProducerContext?.primaryContactPhone}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<!-- <label class="font-semibold" for="primaryContactEmail">Email*</label> -->
				<EmailInput name="primaryContactEmail" required={true} error={form?.invalidEmail} />
				<!-- <input
					class="input"
					type="email"
					id="primaryContactEmail"
					name="primaryContactEmail"
					required
				/> -->
				<!-- value={$createdProducerContext?.primaryContactEmail}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="primaryContactTitle">Title</label>
				<input class="input" type="text" id="primaryContactTitle" name="primaryContactTitle" />
				<!-- value={$createdProducerContext?.primaryContactTitle}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
			</span>
		</div>
		<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="type">Type*</label>
				<select class="select" id="type" name="type" required>
					<!-- value={$createdProducerContext?.type}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
					<option value="dealership">Dealership</option>
					<option value="lender">Lender</option>
					<option value="fleet">Fleet</option>
					<option value="other">Other</option>
				</select>
			</span>

			{#if userData?.publicMetadata?.ts_role === 'ts_rep'}
				<span class="flex flex-col items-baseline gap-1">
					<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep*</label>
					<select class="select" id="tsSalesRepId" name="tsSalesRepId" required>
						<!-- value={$createdProducerContext?.tsSalesRepId}
						disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
						<option value={userData.id}>{userData?.firstName} {userData.lastName}</option>
					</select>
				</span>
			{/if}
			{#if userData?.publicMetadata?.ts_role === 'admin'}
				<span class="flex flex-col items-baseline gap-1">
					<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep*</label>
					<select class="select" id="tsSalesRepId" name="tsSalesRepId" required>
						<!-- value={$createdProducerContext?.tsSalesRepId}
						disabled={!!$createdProducerContext?.id && !$editingProducerStore} -->
						<option disabled selected value={null}>Select a Sales Rep</option>
						{#each reps as rep}
							<option value={rep.publicUserData?.userId}
								>{rep.publicUserData?.firstName} {rep.publicUserData?.lastName}</option
							>
						{/each}
					</select>
				</span>
			{/if}
		</div>
		<!-- {#if !$createdProducerContext?.id}
		<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
			<span class="flex flex-col items-baseline gap-1">
				<label class="flex gap-1 font-semibold" for="upload"
					>Upload Signed Producer Agreement <button
						type="button"
						class="flex"
						on:click={openInstructions}
					>
						<span class="flex w-4 h-4 mr-2">
							<svelte:component this={InfoCircleIcon} />
						</span>
					</button>
				</label>
				<input type="file" id="upload" name="upload" accept="application/pdf" /> -->
		<!--  // ADD BAck Required ❗️❗️❗️❗️ ☝️ -->
		<!-- </span>
		</div>
	{/if} -->
		<!-- {#if !$createdProducerContext?.id} -->
		<div class="flex gap-2">
			<div class="flex">
				<button type="submit" class="btn bg-gradient-to-br variant-gradient-primary-secondary"
					>Save</button
				>
			</div>
			<div class="flex">
				<button
					type="button"
					class="btn bg-gradient-to-br from-error-500 to-error-700 text-white"
					on:click={() => goto('/dashboard/producers')}>Cancel</button
				>
			</div>
		</div>
		<!-- {/if} -->
	</form>
</div>
