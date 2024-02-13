<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { LayoutData, PageData } from '../$types';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import ProducerAgreementPdf from '$lib/assets/pdfs/ProducerAgreementCombined-02.02.24.pdf';
	export let data;

	$: ({ userData, reps } = data);

	$: console.log(userData);
	$: console.log(reps);

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'alert',
		title: 'Producer Agreement',
		body: `In order to proceed, you must complete the following steps:
    <ol style="margin-left: 24px; list-style-type: auto;">
        <li><a class="link" href="${ProducerAgreementPdf}" target="_blank" rel="noopener">Download the latest Producer Agreement form</a></li>
        <li>Have your Producer sign the Producer Agreement form</li>
        <li>Email signed Producer Agreement to <span class="text-decoration: underline; color: text-ts-blue">alan@trucksuite.com</span> for vetting</li>
        <li>Receive the Countersigned Prodcuers Agreement</li>
        <li>Proceed to enroll Producer location (upload Producer Agreement at bottom of form)</li>
      </ol>`,
		buttonTextCancel: 'Ok'
	};

	onMount(() => {
		modalStore.trigger(modal);
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
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryAddress">Primary Address</label>
						<input class="input" type="text" id="primaryAddress" name="primaryAddress" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryCity">City</label>
						<input class="input" type="text" id="primaryCity" name="primaryCity" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryState">State</label>
						<input class="input" type="text" id="primaryState" name="primaryState" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryZip">Zip</label>
						<input class="input" type="text" id="primaryZip" name="primaryZip" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="primaryCountry">Country</label>
						<input class="input" type="text" id="primaryCountry" name="primaryCountry" />
					</span>
					<span class="flex flex-col items-baseline gap-1"></span>
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
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<button
							type="button"
							class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
							>+ Add Location</button
						>
					</span>
				</div>
				<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					{#if userData?.publicMetadata?.ts_role === 'rep'}
						<span class="flex flex-col items-baseline gap-1">
							<select class="select" id="tsSalesRepId" name="tsSalesRepId">
								<option value={userData.id}>{userData?.firstName} {userData.lastName}</option>
							</select>
						</span>
					{/if}
					{#if userData?.publicMetadata?.ts_role === 'admin'}
						<span class="flex flex-col items-baseline gap-1">
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
						<label class="font-semibold" for="upload">Upload Signed Producer Agreement</label>
						<input type="file" id="upload" name="upload" accept="application/pdf" />
					</span>
				</div>
				<div class="flex">
					<button type="submit" class="btn bg-gradient-to-br variant-gradient-primary-secondary"
						>Submit</button
					>
				</div>
			</form>
		</div>
	</div>
{/if}
