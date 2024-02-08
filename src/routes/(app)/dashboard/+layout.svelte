<script lang="ts">
	import ClerkLoaded from 'clerk-sveltekit/client/ClerkLoaded.svelte';
	import ClerkLoading from 'clerk-sveltekit/client/ClerkLoading.svelte';
	import SpinnerIcon from '$lib/assets/icons/spinner.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
</script>

<ClerkLoading>
	<div class="flex fixed w-screen h-screen top-0 justify-center items-center z-20">
		<div class="w-8 z-10 relative">
			<svelte:component this={SpinnerIcon} />
		</div>
		<div class="bg-surface-500 opacity-50 w-full h-full absolute top-0 left-0"></div>
	</div>
</ClerkLoading>
<ClerkLoaded>
	<svelte:component this={Breadcrumb} />
	<slot />
</ClerkLoaded>
