<script lang="ts">
	import { getContext } from 'svelte';
	import Contacts from './Contacts.svelte';
	import Notes from './Notes.svelte';
	import Programs from './Programs.svelte';

	export let data;
	export let form;

	$: ({ location, ratesheets } = data);
</script>

<div class="flex flex-col gap-4 p-8">
	{#if location}
		<div class="flex gap-2 justify-between">
			<div class="flex flex-col gap-2 justify-between w-auto">
				<h2 class="h2">
					{location.name}
				</h2>
			</div>
		</div>
		<div class="flex justify-between w-full">
			<div class="flex gap-8 w-full mb-4 pb-8 border-b border-surface-200">
				<div class="flex flex-col gap-2">
					<h5 class="h5 font-semibold">Primary Address</h5>
					<span>{location.address}</span>
					<span>{location.city}, {location.state} {location.zip} {location.country}</span>
				</div>
				{#if location.main}
					<span class="flex gap-2 items-center text-base">
						<input type="checkbox" disabled checked={location.main} />
						<label class="label" for="main">Main Location</label>
					</span>
				{/if}
			</div>
			{#if location.mailingAddress && location.mailingCity && location.mailingState && location.mailingZip && location.mailingCountry}
				<div class="flex gap-8 w-full mb-4 pb-8 border-b border-surface-200">
					<div class="flex flex-col gap-2">
						<h5 class="h5 font-semibold">Mailing Address</h5>
						<span>{location.mailingAddress}</span>
						<span
							>{location.mailingCity}, {location.mailingState}
							{location.mailingZip}
							{location.mailingCountry}</span
						>
					</div>
				</div>
			{/if}
		</div>
		<div class="flex gap-8 w-full mb-4 pb-8 border-b border-surface-200">
			<div class="flex flex-col gap-2">
				<span class="font-semibold text-base">Phone</span>
				<p>{location.phone}</p>
			</div>
			<div class="flex flex-col gap-2">
				<span class="font-semibold text-base">Email</span>
				<p>{location.email}</p>
			</div>
			<div class="flex flex-col gap-2">
				<span class="font-semibold text-base">Website</span>
				<p>{location.website}</p>
			</div>
		</div>
		<h4 class="h4 font-semibold">Contacts</h4>
		<div class="flex flex-col gap-4 w-full pb-8 border-b border-surface-200">
			<Contacts {location} error={form?.saveContactError} />
		</div>
		<h4 class="h4 font-semibold">Programs</h4>
		<div class="flex flex-col gap-4 w-full pb-8 border-b border-surface-200">
			<Programs {location} {ratesheets} error={form?.saveProgramsError} />
		</div>
		<h4 class="h4 font-semibold">Notes</h4>
		<div class="flex flex-col gap-4 w-full pb-8">
			<Notes {location} error={form?.saveNoteError} />
		</div>
	{/if}
</div>
