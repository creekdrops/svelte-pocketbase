<script lang="ts">
	import { writable } from 'svelte/store';
	import { pbStore } from './stores';

	const currentUser = writable($pbStore.authStore.model);
	$pbStore.authStore.onChange(() => {
		currentUser.set($pbStore.authStore.model);
	});
</script>

{#if $currentUser}
	<slot user={$currentUser} />
{:else}
	<slot name="signedout" />
{/if}
