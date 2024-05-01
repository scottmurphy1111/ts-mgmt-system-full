<script lang="ts">
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import type { PageData } from './$types';
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
	import { format } from 'date-fns';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import { appHost } from '$lib/helpers/helpers';
	import DeleteOutput from '$lib/components/DeleteOutput.svelte';

	export let data: PageData;
	$: console.log('🥶 ALL SHARED DATA', data);
	// $: ({ producers } = data);
</script>

{#if data.userData && data.userData.publicMetadata.ts_role}
	<div class="flex flex-col p-8">
		<div class="flex mb-4 gap-8 justify-between items-center">
			<h2 class="h2 w-1/2">Dashboard</h2>
			<!-- f -->
		</div>
		<div class="w-full flex flex-col gap-8 md:flex-row items-start">
			<div class="w-full flex gap-4 flex-wrap">
				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full h-min"
					href="/dashboard/producers"
					><header>
						<h3 class="flex gap-2 h3 items-center">Producers</h3>
					</header>
					<section></section>
					<footer>
						<button class="btn-primary">Launch</button>
					</footer></a
				>
				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full h-min"
					href="/dashboard/marketing-tools"
					><header>
						<h3 class="flex gap-2 h3 items-center">Marketing &amp; Tools</h3>
					</header>
					<section></section>
					<footer>
						<button class="btn-primary">Launch</button>
					</footer></a
				>
				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full h-min"
					href="https://trucksuite.tecassured.com/"
					target="_blank"
					rel="noopener"
					><header>
						<h3 class="flex gap-2 h3 items-center">TecAssured</h3>
					</header>
					<section></section>
					<footer>
						<button class="btn-primary">Launch</button>
					</footer></a
				>
				<!-- {#if data.userData?.publicMetadata?.ts_role === 'admin'}
					<a
						class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
						href="/dashboard/ratesheets"
						><header>
							<h3 class="flex gap-2 h3 items-center">Ratesheets</h3>
						</header>
						<section></section>
						<footer>
							<button class="btn-primary"
								>Launch</button
							>
						</footer></a
					>
					<a
						class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
						href="/dashboard/disclosures-sets"
						><header>
							<h3 class="flex gap-2 h3 items-center">Disclosures Sets</h3>
						</header>
						<section></section>
						<footer>
							<button class="btn-primary"
								>Launch</button
							>
						</footer></a
					>
					<a
						class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
						href="/dashboard/coverages-sets"
						><header>
							<h3 class="flex gap-2 h3 items-center">Coverages Sets</h3>
						</header>
						<section></section>
						<footer>
							<button class="btn-primary"
								>Launch</button
							>
						</footer></a
					>
				{/if} -->
			</div>
		</div>
	</div>
{:else if data.userData && !data.userData.publicMetadata.ts_role}
	<div class="flex flex-col">
		<div class="flex gap-4 justify-center items-center h-screen">
			<h3 class="h3">
				You do not have access yet, please email <span class="link">scott@trucksuite.com</span>
			</h3>
		</div>
	</div>
{:else}
	<div class="flex flex-col">
		<div class="flex gap-4 justify-center items-center">
			<SignedOut>
				<SignIn />
			</SignedOut>
		</div>
	</div>
{/if}
