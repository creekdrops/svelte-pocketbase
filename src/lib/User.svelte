<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { pbStore } from './stores';
	import type { Record } from 'pocketbase';

	interface $$Slots {
		default: { user: Record };
		signedout: {};
		loading: {};
	}

	let mounted = false;
	const user = writable($pbStore.authStore.model as Record | null);

	$pbStore.authStore.onChange(() => {
		user.set($pbStore.authStore.model as Record | null);
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
