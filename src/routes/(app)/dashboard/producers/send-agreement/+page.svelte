<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	export let data;

	$: ({ userData, reps } = data);
	export let form;
</script>

<div class="flex flex-col p-8">
	<div class="flex flex-col mb-8 gap-8 justify-between">
		<h2 class="h2">Send Producers Agreement for E-Signature</h2>
		<form
			action="?/sendAgreement"
			method="POST"
			class="flex flex-col justify-center gap-4"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result?.status === 204) {
						await update();
						goto('/dashboard/producers/send-agreement/success');
					} else {
						await applyAction(result);
					}
				};
			}}
		>
			<div class="flex gap-4 w-full">
				<span class="flex flex-col items-baseline gap-1 w-full">
					<label for="producerName">Producer Business Name</label>
					<input
						class="input"
						type="text"
						name="producerName"
						id="producerName"
						placeholder="Enter the Producer's Business Name"
					/>
				</span>
				<span class="flex flex-col items-baseline gap-1 w-full">
					<label for="producerEmail">Producer Email</label>
					<input
						class="input"
						type="text"
						name="producerEmail"
						id="producerEmail"
						placeholder="Enter the Producer's Primary Contact Email"
					/>
				</span>
				<input
					type="hidden"
					name="senderName"
					value={`${userData?.firstName} ${userData?.lastName}`}
				/>
				{#if userData?.publicMetadata?.ts_role === 'ts_rep'}
					<span class="flex flex-col items-baseline gap-1 w-full">
						<label for="tsSalesRepId">TruckSuite Sales Rep*</label>
						<select class="select" id="tsSalesRepId" name="tsSalesRepId" required>
							<option value={userData.id}>{userData?.firstName} {userData.lastName}</option>
						</select>
					</span>
				{/if}
				{#if userData?.publicMetadata?.ts_role === 'admin'}
					<span class="flex flex-col items-baseline gap-1 w-full">
						<label for="tsSalesRepId">TruckSuite Sales Rep*</label>
						<select class="select" id="tsSalesRepId" name="tsSalesRepId" required>
							<option disabled selected value={null}>Select a Sales Rep</option>
							{#each reps as rep}
								<option value={rep.publicUserData?.userId}
									>{rep.publicUserData?.firstName} {rep.publicUserData?.lastName}</option
								>
							{/each}
						</select>
					</span>
				{/if}
			</div>
			<div class="w-auto">
				<button class="btn-primary flex">Send Agreement</button>
				{#if form?.message}
					<p class="text-error-500">{form.message}</p>
				{/if}
			</div>
		</form>
	</div>
</div>
