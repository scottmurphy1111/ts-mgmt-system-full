<script lang="ts">
	import { writable } from 'svelte/store';

	export let name = '';
	export let required = false;
	export let placeholder = '';
	export let error = false;
	export let value = '';

	const formatInput = (val: string) => {
		const cleaned = ('' + val).replace(/\D/g, '');
		const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			const intlCode = match?.[1] ? '+1 ' : '';
			return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
		}
		return cleaned;
	};

	const updateValue = (val: string) => {
		formattedInput.set(formatInput(val));
	};

	const formattedInput = writable<string | null>(value || null);
</script>

<label class="font-semibold" for={name}
	>Phone{required ? '*' : ''}
	{#if error}
		<span class="text-error-500-400-token text-sm ml-4"> Phone Number is invalid </span>
	{/if}
</label>
<input
	type="tel"
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
