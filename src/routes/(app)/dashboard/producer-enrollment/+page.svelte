<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount, setContext } from 'svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import ProducerAgreementPdf from '$lib/assets/pdfs/ProducerAgreementCombined-02.02.24.pdf';
	import { writable } from 'svelte/store';
	import type { ProducerLocationWithIncludes } from '$lib/types/types';
	import Location from './Location.svelte';
	import { goto } from '$app/navigation';
	import InfoCircleIcon from '$lib/assets/icons/info-circle.svelte';
	import paSigned from '$lib/assets/images/pa-signed.jpeg';

	export let data;

	$: ({ userData, reps, ratesheets } = data);

	// $: console.log(userData);
	// $: console.log(reps);

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalAuto',
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

	const instructionsModal: ModalSettings = {
		type: 'component',
		component: 'modalImage',
		image: paSigned
	};

	function openInstructions() {
		modalStore.trigger(instructionsModal);
	}
	onMount(() => {
		modalStore.trigger(modal); //❗️❗️❗️❗️❗️❗️❗️❗️ ADD back in when ready
	});

	$: locations = [] as ProducerLocationWithIncludes[];

	$: console.log('locations', locations);

	const creatingLocationStore = writable(false);
	const addLocationStore = writable<ProducerLocationWithIncludes | Record<string, string>>({});

	setContext('creatingLocation', addLocationStore);

	let emptyLocation: ProducerLocationWithIncludes = {
		id: 'new',
		createdAt: new Date(),
		updatedAt: new Date(),
		name: 'name',
		phone: 'phone',
		email: 'email',
		website: 'website',
		address: 'address',
		city: 'city',
		state: 'NC',
		zip: 'zip',
		country: 'USA',
		programs: [],
		producerGroupId: 'producerGroupId',
		portalUsers: [],
		notes: [],
		main: false
	};

	const addLocation = () => {
		// locations = emptyLocation;
		creatingLocationStore.set(true);
	};

	const saveLocation = () => {
		creatingLocationStore.set(false);
		locations = [...locations, emptyLocation];
		console.log('locations func', locations);
		locations = locations;
	};

	// Finish Implementing this
	$: mainSelected = locations.some((location: ProducerLocationWithIncludes) => {
		return location.main;
	});
</script>

{#if userData}
	<div class="flex flex-col p-8">
		<div class="flex flex-col mb-8 gap-8 justify-between">
			<h2 class="h2">Producer Enrollment</h2>

			<!-- <button class="btn variant-outline-primary" type="submit">Upload</button> -->
			<form method="post" action="?/enroll" enctype="multipart/form-data" use:enhance>
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
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
				</div>
				{#if locations.length}
					<h3 class="h3 mb-4">Locations</h3>
					{#each locations as location}
						<Location {location} {ratesheets} />
					{/each}
				{/if}
				{#if $creatingLocationStore}
					<h3 class="h3 mb-4">New Location</h3>
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
				</div>
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
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
				</div>
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
				</div>
			</form>
		</div>
	</div>
{/if}
