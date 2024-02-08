<script lang="ts">
	export let label: string;
	export let placeholder: string | undefined;
	export let name: string;
	export let value: string;
</script>

<label class="flex flex-col min-w-min gap-1 font-semibold text-base"
	>{label}
	<input
		size="1"
		type="text"
		class="border-b border-ts-gray-md font-normal"
		{name}
		{placeholder}
		bind:value
	/>
</label>
