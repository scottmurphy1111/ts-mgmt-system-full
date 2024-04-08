<script lang="ts">
	import { page } from '$app/stores';

	console.log('page', $page);
</script>

<h1>{$page.status}:</h1>
