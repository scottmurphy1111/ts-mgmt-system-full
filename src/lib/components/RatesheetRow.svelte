<script lang="ts">
	import type { Ratesheet } from '$lib/types/types';

	export let ratesheet: Ratesheet;

	$: isSelected = false;

	const changeSelected = (e: Event) => {
		isSelected = (e.target as HTMLInputElement).checked;
	};
</script>

<div class="grid gap-4 content-center mb-4" style="grid-template-columns: 2fr 3fr;">
	<div class="flex items-center gap-2">
		<input hidden type="text" name="programId" value={'New'} disabled={!isSelected} />
		<input
			class="checkbox"
			type="checkbox"
			name="programName"
			id={ratesheet.name}
			value={ratesheet.title}
			checked={isSelected}
			on:change={changeSelected}
		/>
		<label for={ratesheet.name}>{ratesheet.title}</label>
	</div>
	{#if isSelected}
		<div class="flex items-center gap-2">
			<span class="flex flex-col items-baseline gap-1 markup">
				<input hidden type="text" name="markupId" value={'New'} />
				<input class="input" type="text" name="termValue" value="12 months" readonly />
				<input class="input pl-8" type="text" name="markupValue" value="" />
			</span>
			<span class="flex flex-col items-baseline gap-1 markup">
				<input hidden type="text" name="markupId" value={'New'} />
				<input class="input" type="text" name="termValue" value="24 months" readonly />
				<input class="input pl-8" type="text" name="markupValue" value="" />
			</span>
			<span class="flex flex-col items-baseline gap-1 markup">
				<input hidden type="text" name="markupId" value={'New'} />
				<input class="input" type="text" name="termValue" value="36 months" readonly />
				<input class="input pl-8" type="text" name="markupValue" value="" />
			</span>
			<span class="flex flex-col items-baseline gap-1 markup">
				<input hidden type="text" name="markupId" value={'New'} />
				<input class="input" type="text" name="termValue" value="48 months" readonly />
				<input class="input pl-8" type="text" name="markupValue" value="" />
			</span>
		</div>
	{:else}
		<div></div>
	{/if}
</div>

<style lang="postcss">
	.markup {
		position: relative;
		width: 100%;
		&:before {
			position: absolute;
			z-index: 10;
			left: 0.5em;
			bottom: 8px;
			display: flex;
			align-items: center;
			content: '$';
			font-size: 1em;
			color: #1575cf;
		}
	}
</style>
