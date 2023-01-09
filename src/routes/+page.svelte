<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.metadata?.title || 'Component'}</title>
</svelte:head>

<main>
	<div class="bg-primary text-sm text-white p-4 rounded-md">
		Hold up! This library is currently experimental, and in early development. Be careful if you intend on using this in production.
	</div>
	<svelte:component this={data.content} />
	<div class="flex justify-end">
		<a class="btn btn-primary" href={data.metadata?.nextUrl}>{data.metadata?.nextButton}</a>
	</div>
</main>
