<script lang="ts">
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';

	export let data;

	$: ({ userData } = data);
</script>

{#if userData && userData.publicMetadata.ts_role}
	<div class="flex flex-col p-8">
		<div class="flex mb-4 gap-8 justify-between items-center">
			<h2 class="h2 w-1/2">Dashboard</h2>
		</div>
		<div class="w-full flex flex-col gap-8 md:flex-row items-start">
			<div class="w-full flex gap-4 flex-wrap">
				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full h-min"
					href="/dashboard/producers"
					><header>
						<h4 class="h4">Producers</h4>
					</header>
					<footer>
						<button class="btn-primary">Launch</button>
					</footer></a
				>
				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full h-min"
					href="/dashboard/reports"
					><header>
						<h4 class="h4">Reports</h4>
					</header>
					<footer>
						<button class="btn-primary">Launch</button>
					</footer></a
				>
				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full h-min"
					href="/dashboard/marketing-tools"
					><header>
						<h4 class="h4">Marketing &amp; Tools</h4>
					</header>
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
						<h4 class="h4">TecAssured</h4>
					</header>
					<footer>
						<button class="btn-primary">Launch</button>
					</footer></a
				>
			</div>
		</div>
	</div>
{:else if userData && !userData.publicMetadata.ts_role}
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
