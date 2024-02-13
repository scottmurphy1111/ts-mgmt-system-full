<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import SpinnerIcon from '$lib/assets/icons/spinner.svelte';
	import TsAppBar from '$lib/components/TsAppBar.svelte';
	import TsFooter from '$lib/components/TsFooter.svelte';
	import pattern from '$lib/assets/images/pattern.svg';
	import dark from '$lib/assets/images/patternDark.svg';
	import ClerkLoaded from 'clerk-sveltekit/client/ClerkLoaded.svelte';
	import ClerkLoading from 'clerk-sveltekit/client/ClerkLoading.svelte';

	$: patternStyle = $modeCurrent
		? `background-image: url('${pattern}')`
		: `background-image: url('${dark}')`;
</script>

<!-- App Shell -->
<AppShell slotPageContent="bg-center bg-repeat bg-size-sm bg-surface-50-900-token">
	<svelte:fragment slot="header">
		<TsAppBar />
	</svelte:fragment>

	<ClerkLoading>
		<div class="flex fixed w-screen h-screen top-0 justify-center items-center z-20">
			<div class="w-8 z-10 relative">
				<svelte:component this={SpinnerIcon} />
			</div>
			<div class="bg-surface-500 opacity-50 w-full h-full absolute top-0 left-0"></div>
		</div>
	</ClerkLoading>
	<ClerkLoaded let:clerk>
		<div class={`w-full h-full  bg-[length:6px_6px] bg-repeat`} style={patternStyle}>
			<slot />
		</div>
	</ClerkLoaded>

	<svelte:fragment slot="pageFooter"><TsFooter /></svelte:fragment>
</AppShell>
