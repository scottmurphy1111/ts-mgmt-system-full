<script lang="ts">
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import type { PageData } from './$types';
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
	import { format } from 'date-fns';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import { appHost } from '$lib/helpers/helpers';
	import DeleteOutput from '$lib/components/DeleteOutput.svelte';

	export let data: PageData;
	$: ({ producers } = data);
</script>

{#if data.userData}
	<div class="flex flex-col p-8">
		<div class="flex mb-4 gap-8 justify-between items-center">
			<h2 class="h2 w-1/2">Dashboard</h2>
			<p class="italic text-sm w-1/2">My Producers</p>
		</div>
		<div class="w-full flex flex-col gap-8 md:flex-row items-start">
			<div class="w-full md:w-1/2 flex gap-4 flex-wrap">
				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
					href="/dashboard/producer-enrollment"
					><header>
						<h3 class="flex gap-2 h3 items-center">Producer Enrollment</h3>
					</header>
					<section></section>
					<footer>
						<button class="btn bg-gradient-to-br variant-gradient-primary-secondary">Launch</button>
					</footer></a
				>

				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
					href="/dashboard/marketing-tools"
					><header>
						<h3 class="flex gap-2 h3 items-center">Marketing &amp; Tools</h3>
					</header>
					<section></section>
					<footer>
						<button class="btn bg-gradient-to-br variant-gradient-primary-secondary">Launch</button>
					</footer></a
				>
				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
					href="https://trucksuite.tecassured.com/"
					target="_blank"
					rel="noopener"
					><header>
						<h3 class="flex gap-2 h3 items-center">TecAssured</h3>
					</header>
					<section></section>
					<footer>
						<button class="btn bg-gradient-to-br variant-gradient-primary-secondary">Launch</button>
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
							<button class="btn bg-gradient-to-br variant-gradient-primary-secondary"
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
							<button class="btn bg-gradient-to-br variant-gradient-primary-secondary"
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
							<button class="btn bg-gradient-to-br variant-gradient-primary-secondary"
								>Launch</button
							>
						</footer></a
					>
				{/if} -->
			</div>
			<div class="flex flex-col w-full md:w-1/2 gap-4">
				<div class="grid grid-cols-3 gap-4 place-content-center">
					<span class="font-semibold">Link</span>
					<span class="font-semibold">Created</span>
					<span></span>
					{#each producers.sort((a, b) => Number(b.createdAt) - Number(a.createdAt)) as producer}
						{producer.name}
						<!-- <a class="flex text-primary-500 items-center" href={`/output?id=${output.id}`}>
							{output.label ? output.label : 'No Label'}
						</a>
						<div class="flex gap-2 justify-between items-center">
							<span>{format(output.createdAt, 'MM/dd/yyyy - hh:mm:ss a')}</span>
						</div>
						<div class="flex gap-4 items-center">
							<CopyButton copyData={`${appHost}/output?id=${output.id}`} />
							<DeleteOutput outputId={output.id} />
						</div> -->
					{/each}
				</div>
			</div>
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
