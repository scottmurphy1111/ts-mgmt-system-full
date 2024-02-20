<script lang="ts">
	import type { ProducerLocationWithIncludes, Ratesheet } from '$lib/types/types';
	import { states_and_provinces } from '$lib/helpers/states_and_provinces';
	import Programs from './Programs.svelte';

	export let location: ProducerLocationWithIncludes;
	export let ratesheets: Ratesheet[];
</script>

<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="name">Location Name</label>
		<input class="input" type="text" id="name" name="name" bind:value={location.name} />
	</span>
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="phone">Phone</label>
		<input class="input" type="text" id="phone" name="phone" bind:value={location.phone} />
	</span>
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="email">Email</label>
		<input class="input" type="text" id="email" name="email" bind:value={location.email} />
	</span>
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="website">Website</label>
		<input class="input" type="text" id="website" name="website" bind:value={location.website} />
	</span>
</div>
<div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
	<div>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="address">Address</label>
			<input class="input" type="text" id="address" name="address" bind:value={location.address} />
		</span>
	</div>
	<div class="flex gap-2">
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="city">City</label>
			<input class="input" type="text" id="city" name="city" bind:value={location.city} />
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="state">State</label>
			<select class="select" name="state" bind:value={location.state}>
				<option selected disabled>Select State</option>
				{#each states_and_provinces as state}
					<option value={state.abbreviation}>{state.name}</option>
				{/each}
			</select>
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="zip">Zip</label>
			<input class="input" type="text" id="zip" name="zip" bind:value={location.zip} />
		</span>
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="country">Country</label>
			<select class="select" name="country" bind:value={location.country}>
				<option value={'USA'} selected>United States</option>
				<option value={'CAN'}>Canada</option>
			</select></span
		>
	</div>
	<div class="flex gap-2">
		<span class="flex flex-col items-baseline gap-1">
			<label class="font-semibold" for="main">Main Location?</label>
			<input class="checkbox" type="checkbox" id="main" name="main" bind:checked={location.main} />
		</span>
	</div>
</div>
<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="programs">Programs</label>
		Programs here
		<Programs {ratesheets} />
		<!-- <input class="input" type="text" id="programs" name="programs" bind:value={emptyLocation.programs} /> ADD PROGRAMS COMPONENT-->
	</span>
</div>
<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="producerGroupId">Producer Group Id</label>
		<input
			class="input"
			type="text"
			id="producerGroupId"
			name="producerGroupId"
			bind:value={location.producerGroupId}
		/>
	</span>
</div>
<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="portalUsers">Portal Users</label>
		<!-- <input class="input" type="text" id="portalUsers" name="portalUsers" bind:value={emptyLocation.portalUsers} /> ADD PORTAUSERS COMPONENT -->
	</span>
</div>
<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
	<span class="flex flex-col items-baseline gap-1">
		<label class="font-semibold" for="notes">Notes</label>
		<!-- <input class="input" type="text" id="notes" name="notes" bind:value={emptyLocation.notes} /> ADD NOTES COMPONENT -->
	</span>
</div>
