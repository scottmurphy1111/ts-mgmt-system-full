<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import ProducerAgreementPdf from '$lib/assets/pdfs/ProducerAgreementCombined-02.02.24.pdf';
	import { writable } from 'svelte/store';
	import type { ProducerWithIncludes, LocationWithIncludes } from '$lib/types/types';
	import CreateLocation from '../_CreateLocation.svelte';
	import CreateProducer from '../_CreateProducer.svelte';
	import type { PageData } from '../$types';

	export let data;
	export let form: {
		producer: ProducerWithIncludes;
		location: LocationWithIncludes;
	};

	$: ({ existingProducer } = data);
	$: console.log('form', form);
	$: console.log('existingProducer', existingProducer);

	const createdProducerStore = writable<ProducerWithIncludes | null>(null);
	setContext('createdProducerContext', createdProducerStore);

	// $: if (form?.producer?.id) {
	// 	invalidate('data:producer');
	// 	createdProducerStore.set(producer);
	// } else {
	// 	invalidate('data:producer');
	// 	createdProducerStore.set(producer);
	// }

	// $: console.log('data', data);
	// $: console.log('form', form);
	// $: console.log('createdProducerStore', $createdProducerStore);

	$: ({ userData, reps, ratesheets } = data);

	// $: console.log(ratesheets);

	$: fullRatesheets = [
		...ratesheets,
		{
			name: 'class_8_diesel_-_60_Day',
			title: 'Class 8 Diesel - 60 Day'
		},
		{
			name: 'class_8_diesel_-_90_Day',
			title: 'Class 8 Diesel - 90 Day'
		},
		{
			name: 'class_8_diesel_-_180_Day',
			title: 'Class 8 Diesel - 180 Day'
		},
		{
			name: 'class_8_diesel_-engine_only',
			title: 'Class 8 Diesel - Engine Only'
		}
	];

	// $: console.log('fullRatesheets', fullRatesheets);
	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalProducersSigning',
		title: 'Producer Agreement Signing Process',
		body: `In order to proceed with Producer Enrollment, you must complete the following steps:
    <ol style="margin-left: 24px; list-style-type: auto;">
        <li><a class="link" href="${ProducerAgreementPdf}" target="_blank" rel="noopener"><span>Download the latest Producer Agreement form</span></a></li>
        <li>Have your Producer sign the Producer Agreement form</li>
        <li>Email signed Producer Agreement to <span class="link">alan@trucksuite.com</span> for vetting</li>
        <li>Receive the Countersigned Producers Agreement back from Alan</li>
        <li>Fill out Producer Enrollment form</li>
        <li>Upload the Countersigned Producer Agreement form in bottom section labeled 'Upload Signed Producer Agreement'</li>
      </ol>`,
		backdropClasses: 'opacity-95',
		modalClasses: 'p-8'
	};

	onMount(() => {
		modalStore.trigger(modal); //❗️❗️❗️❗️❗️❗️❗️❗️ ADD back in when ready
	});

	// Finish Implementing this
	$: mainSelected = $createdProducerStore?.locations?.some((location: LocationWithIncludes) => {
		return location.main;
	});
</script>

{#if userData}
	<div class="flex flex-col p-8">
		<div class="flex flex-col mb-8 gap-8 justify-between">
			<h2 class="h2">Producer Enrollment</h2>
			<h3 class="h3">Create Producer</h3>
			<CreateProducer {userData} {reps} producer={existingProducer} />
			<CreateLocation
				{userData}
				{reps}
				ratesheets={fullRatesheets}
				locations={$createdProducerStore?.locations}
			/>
			<!-- <AssignPrograms {userData} {reps} createdProducer={form?.producer} /> -->
			<!-- <button class="btn variant-outline-primary" type="submit">Upload</button> -->
			<!-- <form method="post" action="?/enroll" enctype="multipart/form-data" use:enhance> -->
			<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="name">Name</label>
						<input class="input" type="text" id="name" name="name" />
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
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactName">Primary Contact Name</label>
						<input class="input" type="text" id="primaryContactName" name="primaryContactName" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactPhone">Phone</label>
						<input class="input" type="text" id="primaryContactPhone" name="primaryContactPhone" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactEmail">Email</label>
						<input class="input" type="text" id="primaryContactEmail" name="primaryContactEmail" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryContactTitle">Title</label>
						<input class="input" type="text" id="primaryContactTitle" name="primaryContactTitle" />
					</span>
				</div> -->
			<!-- {#if locations.length}
				<h4 class="h4 font-semibold mb-4">Locations</h4>
				{#each locations as location}
					<Location {location} {ratesheets} />
				{/each}
			{/if}
			{#if $creatingLocationStore}
				<h4 class="h4 font-semibold mb-4">New Location</h4>
				<Location location={emptyLocation} {ratesheets} />
			{/if}
			<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
				<span class="flex flex-col items-baseline gap-1">
					{#if !$creatingLocationStore}
						<button
							type="button"
							on:click={addLocation}
							class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
							>+ Add Location</button
						>
					{/if}
					{#if $creatingLocationStore}
						<button
							type="button"
							on:click={saveLocation}
							class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
							>Save Location</button
						>
					{/if}
				</span>
			</div> -->
			<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
				{#if userData?.publicMetadata?.ts_role === 'ts_rep'}
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
						<select class="select" id="tsSalesRepId" name="tsSalesRepId">
							<option value={userData.id}>{userData?.firstName} {userData.lastName}</option>
						</select>
					</span>
				{/if}
				{#if userData?.publicMetadata?.ts_role === 'admin'}
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
						<select class="select" id="tsSalesRepId" name="tsSalesRepId">
							<option disabled selected>Select a Sales Rep</option>
							{#each reps as rep}
								<option value={rep.publicUserData?.userId}
									>{rep.publicUserData?.firstName} {rep.publicUserData?.lastName}</option
								>
							{/each}
						</select>
					</span>
				{/if}
			</div> -->
			<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
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
					</span>
				</div>
				<div class="flex gap-2">
					<div class="flex">
						<button type="submit" class="btn bg-gradient-to-br variant-gradient-primary-secondary"
							>Submit</button
						>
					</div>
					<div class="flex">
						<button
							type="button"
							class="btn bg-gradient-to-br from-error-500 to-error-700 text-white"
							on:click={() => goto('/dashboard')}>Cancel</button
						>
					</div>
				</div> -->
			<!-- </form> -->
		</div>
	</div>
{/if}
