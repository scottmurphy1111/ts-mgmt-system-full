<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import InfoCircleIcon from '$lib/assets/icons/info-circle.svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import paSigned from '$lib/assets/images/pa-signed.jpeg';
	import type { User, OrganizationMembership } from '@clerk/clerk-sdk-node';
	import { writable, type Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { ProducerWithIncludes } from '$lib/types/types';

	export let userData: User;
	export let reps: OrganizationMembership[];
	export let producer: ProducerWithIncludes | null;

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	const createdProducerContext =
		getContext<Writable<ProducerWithIncludes>>('createdProducerContext');

	$: console.log('createdProducerContext', $createdProducerContext);

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

<form
	method="post"
	action="?/createProducer"
	enctype="multipart/form-data"
	use:enhance={() => {
		pendingStore.set(true);
		return async ({ update, result }) => {
			if (result?.status === 200) {
				await update();
				editingProducerStore.set(false);
				pendingStore.set(false);
				toastStore.trigger({ message: '👍 Producer saved successfully' });
			} else {
				pendingStore.set(false);
				toastStore.trigger({ message: '❗️ Producer save failed' });
			}
		};
	}}
>
	<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200 relative">
		{#if $createdProducerContext?.id}
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
		{/if}
		<input hidden type="text" name="producerId" value={$createdProducerContext?.id} />
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="name">Producer Name</label>
			<input
				class="input"
				type="text"
				id="name"
				name="name"
				value={$createdProducerContext?.name}
				disabled={!!$createdProducerContext?.id && !$editingProducerStore}
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
				value={$createdProducerContext?.dba}
				disabled={!!$createdProducerContext?.id && !$editingProducerStore}
			/>
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="taxId">Tax Id</label>
			<input
				class="input"
				type="text"
				id="taxId"
				name="taxId"
				value={$createdProducerContext?.taxId}
				disabled={!!$createdProducerContext?.id && !$editingProducerStore}
			/>
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="website">Website</label>
			<input
				class="input"
				type="text"
				id="website"
				name="website"
				value={$createdProducerContext?.website}
				disabled={!!$createdProducerContext?.id && !$editingProducerStore}
			/>
		</span>
	</div>
	<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="primaryContactName">Primary Contact Name</label>
			<input
				class="input"
				type="text"
				id="primaryContactName"
				name="primaryContactName"
				value={$createdProducerContext?.primaryContactName}
				disabled={!!$createdProducerContext?.id && !$editingProducerStore}
				required
			/>
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="primaryContactPhone">Phone</label>
			<input
				class="input"
				type="text"
				id="primaryContactPhone"
				name="primaryContactPhone"
				value={$createdProducerContext?.primaryContactPhone}
				disabled={!!$createdProducerContext?.id && !$editingProducerStore}
				required
			/>
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="primaryContactEmail">Email</label>
			<input
				class="input"
				type="text"
				id="primaryContactEmail"
				name="primaryContactEmail"
				value={$createdProducerContext?.primaryContactEmail}
				disabled={!!$createdProducerContext?.id && !$editingProducerStore}
				required
			/>
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="primaryContactTitle">Title</label>
			<input
				class="input"
				type="text"
				id="primaryContactTitle"
				name="primaryContactTitle"
				value={$createdProducerContext?.primaryContactTitle}
				disabled={!!$createdProducerContext?.id && !$editingProducerStore}
			/>
		</span>
	</div>
	<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="type">Type</label>
			<select
				class="select"
				id="type"
				name="type"
				value={$createdProducerContext?.type}
				disabled={!!$createdProducerContext?.id && !$editingProducerStore}
				required
			>
				<option value="dealership">Dealership</option>
				<option value="lender">Lender</option>
				<option value="fleet">Fleet</option>
				<option value="other">Other</option>
			</select>
		</span>

		{#if userData?.publicMetadata?.ts_role === 'ts_rep'}
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
				<select
					class="select"
					id="tsSalesRepId"
					name="tsSalesRepId"
					value={$createdProducerContext?.tsSalesRepId}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore}
					required
				>
					<option value={userData.id}>{userData?.firstName} {userData.lastName}</option>
				</select>
			</span>
		{/if}
		{#if userData?.publicMetadata?.ts_role === 'admin'}
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
				<select
					class="select"
					id="tsSalesRepId"
					name="tsSalesRepId"
					value={$createdProducerContext?.tsSalesRepId}
					disabled={!!$createdProducerContext?.id && !$editingProducerStore}
					required
				>
					<option disabled selected>Select a Sales Rep</option>
					{#each reps as rep}
						<option value={rep.publicUserData?.userId}
							>{rep.publicUserData?.firstName} {rep.publicUserData?.lastName}</option
						>
					{/each}
				</select>
			</span>
		{/if}
	</div>
	{#if !$createdProducerContext?.id}
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
				<input type="file" id="upload" name="upload" accept="application/pdf" />
				<!--  // ADD BAck Required ❗️❗️❗️❗️ ☝️ -->
			</span>
		</div>
	{/if}
	{#if !$createdProducerContext?.id}
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
					on:click={() => goto('/dashboard')}>Cancel</button
				>
			</div>
		</div>
	{/if}
</form>
