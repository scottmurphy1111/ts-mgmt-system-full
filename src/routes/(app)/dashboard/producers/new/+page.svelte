<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import PhoneInput from '$lib/components/core/PhoneInput.svelte';
	import EmailInput from '$lib/components/core/EmailInput.svelte';
	import { states_and_provinces } from '$lib/helpers/states_and_provinces';
	import { getToastStore } from '@skeletonlabs/skeleton';

	export let data;
	export let form;

	$: ({ reps, userData } = data);

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	const toastStore = getToastStore();

	const editingProducerStore = writable(false);

	// Redirect to producer page after create
	$: if (form?.producer?.id) {
		goto(`/dashboard/producers/${form?.producer?.id}`);
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
				} else {
					await applyAction(result);
					pendingStore.set(false);
					toastStore.trigger({ message: '❗️ Producer save failed' });
				}
			};
		}}
	>
		<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200 relative">
			<input hidden type="text" name="producerId" value={undefined} />
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="name">Producer Name*</label>
				<input class="input" type="text" id="name" name="name" required />
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="dba">Dba</label>
				<input class="input" type="text" id="dba" name="dba" />
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="taxId">Tax Id</label>
				<input class="input" type="text" id="taxId" name="taxId" />
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
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<PhoneInput name="primaryContactPhone" required={true} error={form?.invalidPhone} />
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<EmailInput name="primaryContactEmail" required={true} error={form?.invalidEmail} />
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="primaryContactTitle">Title</label>
				<input class="input" type="text" id="primaryContactTitle" name="primaryContactTitle" />
			</span>
		</div>
		<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="type">Type*</label>
				<select class="select" id="type" name="type" required>
					<option value="dealership">DEALERSHIP</option>
					<option value="lender">LENDER</option>
					<option value="fleet">FLEET</option>
					<option value="other">OTHER</option>
				</select>
			</span>

			{#if userData?.publicMetadata?.ts_role === 'ts_rep'}
				<span class="flex flex-col items-baseline gap-1">
					<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep*</label>
					<select class="select" id="tsSalesRepId" name="tsSalesRepId" required>
						<option value={userData.id}>{userData?.firstName} {userData.lastName}</option>
					</select>
				</span>
			{/if}
			{#if userData?.publicMetadata?.ts_role === 'admin'}
				<span class="flex flex-col items-baseline gap-1">
					<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep*</label>
					<select class="select" id="tsSalesRepId" name="tsSalesRepId" required>
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
		<div class="flex gap-2">
			<div class="flex">
				<button type="submit" class="btn-primary">Save</button>
			</div>
			<div class="flex">
				<button type="button" class="btn-error" on:click={() => goto('/dashboard/producers')}
					>Cancel</button
				>
			</div>
		</div>
	</form>
</div>
