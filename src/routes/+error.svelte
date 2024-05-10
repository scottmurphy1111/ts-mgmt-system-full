<script lang="ts">
	import { page } from '$app/stores';
	import TsAppBar from '$lib/components/TsAppBar.svelte';
	import TsFooter from '$lib/components/TsFooter.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';

	$: console.log($page);
</script>

<AppShell slotPageContent="bg-center bg-repeat bg-size-sm bg-surface-50-900-token">
	<svelte:fragment slot="header">
		<TsAppBar />
	</svelte:fragment>
	<div class="flex flex-col gap-4 justify-center items-center h-full">
		<h1>{$page.status}: {$page.error?.message}</h1>
	</div>
	<svelte:fragment slot="pageFooter"><TsFooter /></svelte:fragment>
</AppShell>
