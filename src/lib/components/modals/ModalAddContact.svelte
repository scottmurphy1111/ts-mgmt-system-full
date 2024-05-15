<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';
	import type { ProducerWithIncludes } from '$lib/types/types';
	import CloseIcon from '$lib/assets/icons/close.svelte';
	import PhoneInput from '$lib/components/core/PhoneInput.svelte';
	import EmailInput from '$lib/components/core/EmailInput.svelte';

	// Props
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	$: error = {} as { type: 'failure'; status: number; data?: Record<string, unknown> | undefined };

	const cBase =
		'bg-surface-100-800-token w-auto h-full p-16 flex justify-center items-center rounded-lg relative';
</script>

{#if $modalStore[0]}
	<div class="modal-example-fullscreen {cBase}">
		<button class="absolute w-4 h-4 top-4 right-4" type="button" on:click={parent.onClose}>
			<svelte:component this={CloseIcon} />
		</button>
		<div class="flex flex-col space-y-8 container">
			<h3 class="h3 font-semibold mb-4">Add Contact</h3>
			<form
				method="post"
				action="?/saveContact"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result?.status === 200) {
							await update();
							parent.onClose();
							toastStore.trigger({ message: '👍 Contact saved successfully' });
						} else {
							await applyAction(result);
							if (result.type === 'failure') {
								error = { ...result };
							}
						}
					};
				}}
			>
				<div class="flex flex-col gap-4 mb-8 pb-8">
					<input hidden name="id" value={$modalStore[0].meta.contact?.id ?? null} />
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="firstName">First Name*</label>
						<input
							class="input"
							type="text"
							id="firstName"
							name="firstName"
							value={$modalStore[0].meta.contact?.firstName ?? ''}
							required
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="lastName">Last Name*</label>
						<input
							class="input"
							type="text"
							id="lastName"
							name="lastName"
							value={$modalStore[0].meta.contact?.lastName ?? ''}
							required
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="title">Title</label>
						<input
							class="input"
							type="text"
							id="title"
							name="title"
							value={$modalStore[0].meta.contact?.title ?? ''}
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						{#if error.data?.saveContactError}
							<p class="text-error-500">{error.data?.saveContactError}</p>
						{/if}
						<EmailInput
							name="email"
							required={true}
							error={Boolean(error.data?.invalidEmail)}
							value={$modalStore[0].meta.contact?.email ?? ''}
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<PhoneInput
							name="phone"
							error={Boolean(error.data?.invalidPhone)}
							value={$modalStore[0].meta.contact?.phone ?? ''}
						/>
					</span>
					<span class="flex flex-col items-baseline gap-1">
						<label class="font-semibold" for="role">Role</label>
						<select
							class="select"
							id="role"
							name="role"
							value={$modalStore[0].meta.contact?.role ?? ''}
							required
						>
							<option value={'LOCATION ADMIN'}>Location Admin</option>
							<option value={'SALES MANAGER'}>Sales Manager</option>
							<option value={'SALES INDIVIDUAL'}>Sales (Individual)</option>
						</select>
					</span>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<span class="flex flex-col items-baseline gap-1">
						<button type="submit" class="btn-primary w-min">Save Contact</button>
					</span>
				</div>
			</form>
		</div>
	</div>
{/if}
