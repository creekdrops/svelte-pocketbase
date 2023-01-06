<script lang="ts">
	import type { Record } from 'pocketbase';

	export let items: Record[];
	export let pages: number[] | undefined = undefined;
</script>

{#each items as item}
	<slot {item} />
{/each}
{#if pages && $$slots.pages}
	{#each pages as pageNumber}
		<slot name="pages" {pageNumber} />
	{/each}
{/if}
