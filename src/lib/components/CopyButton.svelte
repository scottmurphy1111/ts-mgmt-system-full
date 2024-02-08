<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';
	export let copyData: string;
	let copied = false;

	function onClickHandler(): void {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	}
</script>

<button class="btn variant-ghost-secondary w-min" use:clipboard={copyData} on:click={onClickHandler}
	>{copied ? 'Copied 👍' : 'Copy Link'}</button
>
