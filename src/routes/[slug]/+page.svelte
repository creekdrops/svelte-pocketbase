<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.metadata?.title || 'Component'}</title>
</svelte:head>

<main class="mb-8">
	<svelte:component this={data.content} />
</main>
<div class="flex justify-between">
	{#if data.metadata?.prevUrl && data.metadata?.prevButton}
		<a class="btn btn-primary" href={data.metadata?.prevUrl}>{data.metadata?.prevButton}</a>
	{/if}
	{#if data.metadata?.nextUrl && data.metadata?.nextButton}
		<a class="btn btn-primary" href={data.metadata?.nextUrl}>{data.metadata?.nextButton}</a>
	{/if}
</div>
