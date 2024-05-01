<script lang="ts">
	import type { LocationContact } from '@prisma/client';

	export let locationId: string;
	export let locationContacts: LocationContact[] = [];

	$: creatingLocationContact = false;
</script>

<div class="flex flex-col gap-4 mb-8 pb-8 border-b border-surface-200">
	<h4 class="h4 font-semibold">Portal Users</h4>
	<input hidden type="text" name="locationId" value={locationId} />
	<button type="button" on:click={() => (creatingLocationContact = true)} class="btn-primary w-min"
		>+ Add Portal User</button
	>
	{#if creatingLocationContact}
		<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactFirstName">First Name</label>
				<input
					class="input"
					type="text"
					id="locationContactFirstName"
					name="locationContactFirstName"
				/>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactLastName">Last Name</label>
				<input
					class="input"
					type="text"
					id="locationContactLastName"
					name="locationContactLastName"
				/>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactPhone">Phone</label>
				<input class="input" type="text" id="locationContactPhone" name="locationContactPhone" />
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactEmail">Email</label>
				<input class="input" type="text" id="locationContactEmail" name="locationContactEmail" />
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactRole">Role</label>
				<select class="select" id="locationContactRole" name="locationContactRole">
					<option value="sales">Sales</option>
					<option value="admin">Admin</option>
				</select>
			</span>
			<span></span>
			<button
				type="button"
				on:click={() => (creatingLocationContact = false)}
				class="btn-primary w-min"
			>
				Save
			</button>
		</div>
	{/if}
	{#each locationContacts as locationContact}
		<input hidden type="text" name="locationId" value={locationId} />
		<div class="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-surface-200">
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactFirstName">First Name</label>
				<input
					class="input"
					type="text"
					id="locationContactFirstName"
					name="locationContactFirstName"
					value={locationContact.firstName}
				/>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactLastName">Last Name</label>
				<input
					class="input"
					type="text"
					id="locationContactLastName"
					name="locationContactLastName"
					value={locationContact.lastName}
				/>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactPhone">Phone</label>
				<input
					class="input"
					type="text"
					id="locationContactPhone"
					name="locationContactPhone"
					value={locationContact.phone}
				/>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactEmail">Email</label>
				<input
					class="input"
					type="text"
					id="locationContactEmail"
					name="locationContactEmail"
					value={locationContact.email}
				/>
			</span>
			<span class="flex flex-col items-baseline gap-1">
				<label class="font-semibold" for="locationContactRole">Role</label>
				<input
					class="input"
					type="text"
					id="locationContactRole"
					name="locationContactRole"
					value={locationContact.role}
				/>
			</span>
		</div>
	{/each}
	<div class=""></div>
</div>
