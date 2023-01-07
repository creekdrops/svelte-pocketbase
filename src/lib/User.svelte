<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { pbStore } from './stores';

	let mounted = false;
	const user = writable($pbStore.authStore.model);

	$pbStore.authStore.onChange(() => {
		user.set($pbStore.authStore.model);
	});

	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	{#if $pbStore.authStore.isValid && $user}
		<slot user={$user} />
	{:else}
		<slot name="signedout" />
	{/if}
{:else}
	<slot name="loading" />
{/if}
