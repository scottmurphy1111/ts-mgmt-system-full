<script lang="ts">
	import { type SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import type { LocationProgramWithIncludes, Ratesheet } from '$lib/types/types';
	import ProgramRow from '../ProgramRow.svelte';
	import RatesheetRow from '../RatesheetRow.svelte';
	import CloseIcon from '$lib/assets/icons/close.svelte';

	// Props
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	$: allRatesheets = $modalStore[0]?.meta.ratesheets as Ratesheet[];
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
					};
				}}
			>
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
				<div class="grid grid-cols-2 gap-4">
					<span class="flex flex-col items-baseline gap-1">
						<button type="submit" class="btn-primary w-min">Save Programs</button>
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
