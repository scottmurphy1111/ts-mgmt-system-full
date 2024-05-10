<script lang="ts">
	export let data;

	$: ({ producer } = data);
</script>

{#if producer}
	{JSON.stringify(producer, null, 2)}
{/if}
