<script lang="ts">
	export let status;
</script>
<span
					class="p-1 rounded text-xs"
					class:bg-surface-300={status === 'PENDING'}
					class:bg-warning-300={status === 'ENROLLED'}
					class:bg-success-300={status === 'ACTIVE'}
					class:bg-error-300={status === 'INACTIVE'}
				>
					{status}
				</span>
