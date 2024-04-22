<script lang="ts">
	import type { LocationProgramWithIncludes, Ratesheet } from '$lib/types/types';

	export let program: LocationProgramWithIncludes;

	$: isSelected = true;

	// $: console.log('isSelected', isSelected);
	const changeSelected = (e: Event) => {
		isSelected = (e.target as HTMLInputElement).checked;
	};
</script>

<!-- <div class="flex gap-2 items-end justify-between"> -->
<div class="grid gap-4 content-center mb-4" style="grid-template-columns: 2fr 3fr;">
	<!-- </div> -->
	<div class="flex items-center gap-2">
		<input hidden type="text" name="programId" value={program.id} />
		<input
			class="checkbox"
			type="checkbox"
			name="programName"
			value={program.name}
			checked={isSelected}
			on:change={changeSelected}
		/>
		<label for={program.name}>{program.name}</label>
	</div>
	{#if isSelected}
		<div class="flex items-center gap-2">
			{#each program.locationMarkups.sort( (a, b) => (a.termValue > b.termValue ? 1 : a.termValue < b.termValue ? -1 : 0) ) as markup}
				<span class="flex flex-col items-baseline gap-1 markup">
					<!-- <label for="termValue">Term</label> -->
					<input hidden type="text" name="markupId" value={markup.id} />
					<input class="input" type="text" name="termValue" value={markup.termValue} readonly />
					<input class="input pl-8" type="text" name="markupValue" value={markup.markupValue} />
				</span>
			{/each}

			<!-- <span class="flex flex-col items-baseline gap-1 markup">
				<input class="input" type="text" name="termValue" value="12 months" readonly />
				<input class="input pl-8" type="text" name="markupValue" value="" />
			</span>
			<span class="flex flex-col items-baseline gap-1 markup">
				<input class="input" type="text" name="termValue" value="24 months" readonly />
				<input class="input pl-8" type="text" name="markupValue" value="" />
			</span>
			<span class="flex flex-col items-baseline gap-1 markup">
				<input class="input" type="text" name="termValue" value="36 months" readonly />
				<input class="input pl-8" type="text" name="markupValue" value="" />
			</span>
			<span class="flex flex-col items-baseline gap-1 markup">
				<input class="input" type="text" name="termValue" value="48 months" readonly />
				<input class="input pl-8" type="text" name="markupValue" value="" />
			</span> -->
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
