<script lang="ts">
	import type { LocationNote } from '@prisma/client';

	export let locationId: string;
	export let locationNotes: LocationNote[] = [];
</script>

<div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
	<h4 class="h4 font-semibold">LocationNotes</h4>
	<textarea class="textarea" name="locationNote" placeholder="Add a locationNote" />
	{#each locationNotes as locationNote}
		<input hidden type="text" name="locationId" value={locationId} />
		<div class="flex items-center gap-2">
			<span class="flex flex-col items-baseline gap-1 w-full">{locationNote.note}</span>
		</div>
	{/each}
	<div class=""></div>
</div>
