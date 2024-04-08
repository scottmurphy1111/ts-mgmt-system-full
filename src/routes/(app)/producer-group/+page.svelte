<script lang="ts">
	import type { PageData } from '../$types';

	export let data: any;

	// $: console.log('data', data);

	$: ({ producer } = data);
</script>

{#if producer}
	{JSON.stringify(producer, null, 2)}
{/if}
