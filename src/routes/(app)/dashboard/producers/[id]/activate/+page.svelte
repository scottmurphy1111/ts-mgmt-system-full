<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	export let data;
	export let form;

	$: ({ producer } = data);

	let message: string;
</script>

<div class="flex flex-col p-8 w-full">
	{#if message}
		<p>{message}</p>
	{:else if form?.activationError}
		<p>{form?.activationError}</p>
	{:else}
		<form
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					await update();
					if (result?.status === 200) {
						message = '👍 Producer activated successfully';
					} else {
						await applyAction(result);
					}
				};
			}}
		>
			<button type="submit" class="btn-primary text-wrap">Activate {producer?.name}</button>
		</form>
	{/if}
</div>
