<script lang="ts">
	import { writable } from 'svelte/store';

	export let name = '';
	export let required = false;
	export let placeholder = '';
	export let error = false;
	export let value = '';

	const formatInput = (val: string) => {
		const match = val.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/);
		if (match) {
			return match[0];
		}
		return val;
	};

	const updateValue = (val: string) => {
		formattedInput.set(formatInput(val));
	};

	const formattedInput = writable<string | null>(value || null);
</script>

<label class="font-semibold" for={name}
	>Email{required && '*'}
	{#if error}
		<span class="text-error-500-400-token text-sm ml-4"> Email is invalid </span>
	{/if}
</label>
<input
	type="email"
	class="input"
	{name}
	{placeholder}
	bind:value={$formattedInput}
	on:change={(val) => updateValue(val.currentTarget.value)}
	on:focus={() => (error = false)}
	{required}
	class:error
/>

<style lang="postcss">
	.error {
		@apply border-error-500;
	}
</style>
