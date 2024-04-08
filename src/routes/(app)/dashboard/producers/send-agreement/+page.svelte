<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
</script>

<div class="flex flex-col p-8">
	<div class="flex flex-col mb-8 gap-8 justify-between">
		<h2 class="h2">Send Producers Agreement for E-Signature</h2>
		<!-- <a
			href="https://secure.na3.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhCMZEaXYs42F5WIT8184_dUi9gigYp9nz6tF-SE4fN818MLM3YnFzs8e9mLZiH3rD4*"
			target="_blank"
			rel="noopener"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary">Launch E-Signature</a
		>
		<iframe
			title="Adobe Sign Agreement"
			src="https://secure.na3.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhCMZEaXYs42F5WIT8184_dUi9gigYp9nz6tF-SE4fN818MLM3YnFzs8e9mLZiH3rD4*&hosted=false"
			width="100%"
			height="100%"
			frameborder="0"
			style="border: 0; overflow: hidden; min-height: 500px; min-width: 600px;"
		></iframe> -->

		<form
			action="?/sendAgreement"
			method="POST"
			class="flex flex-col justify-center gap-4"
			use:enhance
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
			</div>
			<div class="flex gap-4 w-1/2">
				<span class="flex flex-col items-baseline gap-1 w-full">
					<label for="salesRepEmail">TruckSuite Sales Rep Email</label>
					<input
						class="input"
						type="text"
						name="salesRepEmail"
						id="salesRepEmail"
						placeholder="Enter Trucksuite Sales Rep's Email "
					/>
				</span>
			</div>
			<div class="w-auto">
				<button class="btn flex bg-gradient-to-br variant-gradient-primary-secondary"
					>Send Agreement</button
				>
				{#if form?.message}
					<p class="text-error-500">{form.message}</p>
				{/if}
			</div>
		</form>
	</div>
</div>
