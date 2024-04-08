<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import type { LocationWithIncludes } from '$lib/types/types';
	import type { LocationNote } from '@prisma/client';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { format } from 'date-fns';

	export let location: LocationWithIncludes;
	export let error: string | undefined;

	$: console.log('location', location);

	let notes: LocationNote[] = [];

	$: if (location.locationNotes) {
		notes = location.locationNotes;
	}

	const toastStore = getToastStore();
</script>

{#each notes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)) as note}
	<div class="flex items-center justify-between border-b border-surface-200 py-2">
		<div class="flex justify-between w-full">
			<div class="text-sm font-semibold">{note.note}</div>
			<div class="text-sm text-gray-500">{format(note.createdAt, 'MM/dd/yyyy - hh:mm:ss a')}</div>
		</div>
	</div>
{/each}
{#if error}
	<p class="text-error-500">{error}</p>
{/if}
<form
	method="post"
	action="?/saveNote"
	use:enhance={() => {
		return async ({ result, update }) => {
			await update();
			if (result?.status === 200) {
				toastStore.trigger({ message: '👍 Note saved successfully' });
				invalidateAll();
			} else {
				toastStore.trigger({ message: '❗️ Contact save failed' });
				invalidateAll();
			}
		};
	}}
>
	<textarea class="textarea" name="note" placeholder="Enter note here"></textarea>
	<button type="submit" class="btn bg-gradient-to-br variant-gradient-primary-secondary w-min"
		>+ Add Note</button
	>
</form>
