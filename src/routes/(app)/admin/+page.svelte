<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	// import { session } from 'clerk-sveltekit/client';

	// $: console.log(session);
	// $: console.log($page);
let role = '';
	$: if (browser) {
		 role = window.Clerk?.user?.publicMetadata?.ts_role as string;
	}

	// onMount(() => {
	//   const unsubscribe = page.subscribe((value) => {
	//     if (value.path === '/admin') {
	//       if (!session.signedIn) {
	//         goto('/sign-in');
	//       }
	//     }
	//   });

	//   return unsubscribe;
	// });
</script>

Admin
{role}
