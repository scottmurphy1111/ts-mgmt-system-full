<script lang="ts">
	import { getContext, onMount, type SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import type {
		LocationProgramWithIncludes,
		ProducerWithIncludes,
		Ratesheet
	} from '$lib/types/types';
	import ProgramRow from '../ProgramRow.svelte';
	import RatesheetRow from '../RatesheetRow.svelte';
	import CloseIcon from '$lib/assets/icons/close.svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const getSalesRepId = () => {
		return $modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'ts_rep'
			? `?salesRepId=${$modalStore[0]?.meta.userData?.id}`
			: '';
	};

	$: allRatesheets = $modalStore[0]?.meta.ratesheets as Ratesheet[];
	// $: assignedPrograms = $modalStore[0]?.meta.assignedPrograms as LocationProgramWithIncludes[];

	$: assignedPrograms = $modalStore[0]?.meta.assignedPrograms as LocationProgramWithIncludes[];

	$: sortedRatesheets = allRatesheets
		?.filter((ratesheet) => {
			return !assignedPrograms?.some((program) => program.name === ratesheet.title);
		})
		.sort((a: { name: string }, b: { name: string }) => {
			if (a.name < b.name) {
				return 1;
			}
			if (a.name > b.name) {
				return -1;
			}
			return 0;
		});

	$: console.log('sortedRatesheets', sortedRatesheets);
	// const getRatesheets = async () => {
	// 	const response = await fetch(`https://ts-rates.netlify.app/api/ratesheets`, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		}
	// 	});

	// 	const data = (await response.json()) as Ratesheet[];
	// 	return data;
	// };

	// onMount(async () => {
	// 	const ratesheets = await getRatesheets();
	// 	console.log('ratesheets', ratesheets);
	// });

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
		'bg-surface-100-800-token w-full h-full p-16 flex justify-center items-center rounded-lg relative';
</script>

{#if $modalStore[0]}
	<div class="modal-example-fullscreen {cBase}">
		<button class="absolute w-4 h-4 top-4 right-4" type="button" on:click={parent.onClose}>
			<svelte:component this={CloseIcon} />
		</button>
		<div class="flex flex-col space-y-8 container">
			<h3 class="h3 font-semibold mb-4">Add Programs</h3>
			<!-- {@html $modalStore[0].body} -->
			<form
				method="post"
				action="?/savePrograms"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result?.status === 200) {
							toastStore.trigger({ message: '👍 Programs saved successfully' });
							parent.onClose();
						} else {
							toastStore.trigger({ message: '❗️ Programs save failed' });
							parent.onClose();
						}
						// parent.onClose();
						// editingProducerStore.set(false);
						// creatingLocationStore.set(false);
					};
				}}
			>
				<!-- <div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="name">Producer</label>
						<select
							class="select"
							name="producerId"
							disabled={$modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'ts_rep'}
						>
							<option disabled selected>Select Producer</option>
							{#await producers}
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
					{#if $modalStore[0]?.meta.userData?.publicMetadata?.ts_role === 'ts_rep'}
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
							<select
								class="select"
								id="tsSalesRepId"
								name="tsSalesRepId"
								value={$modalStore[0]?.meta.userData?.id ?? ''}
								required
								disabled
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
							<label class="font-semibold" for="tsSalesRepId">TruckSuite Sales Rep</label>
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
				</div> -->
				<!-- <input hidden type="text" name="producerId" value={$modalStore[0]?.meta.producerId} /> -->
				<div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
					{#if assignedPrograms?.length > 0}
						{#each assignedPrograms as program}
							<ProgramRow {program} />
						{/each}
					{/if}
					{#if sortedRatesheets}
						{#each sortedRatesheets as ratesheet}
							<RatesheetRow {ratesheet} />
						{/each}
					{/if}
				</div>
				<!-- <div class="flex flex-col gap-4 mb-8 pb-8">
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="firstName">First Name</label>
						<input class="input" type="text" id="firstName" name="firstName" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="lastName">Last Name</label>
						<input class="input" type="text" id="lastName" name="lastName" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="email">Email</label>
						<input class="input" type="text" id="email" name="email" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="phone">Phone</label>
						<input class="input" type="text" id="phone" name="phone" />
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="role">Role</label>
						<select class="select" id="role" name="role" required>
							<option value={'ADMIN'}>Admin</option>
							<option value={'SALES'}>Sales</option>
						</select>
					</span>
				</div> -->
				<!-- <div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
					<div>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="address">Address</label>
							<input class="input" type="text" id="address" name="address" />
						</span>
					</div>
					<div class="flex gap-2">
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="city">City</label>
							<input class="input" type="text" id="city" name="city" />
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="state">State</label>
							<select class="select" name="state">
								<option selected>Select State</option>
								{#each states_and_provinces as state}
									<option value={state.abbreviation}>{state.name}</option>
								{/each}
							</select>
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="zip">Zip</label>
							<input class="input" type="text" id="zip" name="zip" />
						</span>
						<span class="flex flex-col items-baseline gap-1">
							<label class="font-semibold" for="country">Country</label>
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
				</div> -->
				<div class="grid grid-cols-2 gap-4">
					<span class="flex flex-col items-baseline gap-1">
						<!-- {#if $creatingLocationStore} -->
						<button
							type="submit"
							class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
							>Save Programs</button
						>
						<!-- {/if} -->
					</span>
				</div>
			</form>
		</div>
	</div>
{/if}

<style lang="postcss">
	.markup {
		position: relative;
		width: 100%;
		&:before {
			position: absolute;
			z-index: 10;
			left: 0.5em;
			bottom: 8px;
			display: flex;
			align-items: center;
			content: '$';
			font-size: 1em;
			color: #1575cf;
		}
	}
</style>