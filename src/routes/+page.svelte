<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.metadata?.title || 'Component'}</title>
</svelte:head>

<main>
	<div class="bg-primary text-white p-4 rounded-md">
		This library is in early development. Be careful if you intend on using it in a production
		environment.
	</div>
	<svelte:component this={data.content} />
	<div class="flex justify-end">
		<a class="btn btn-primary" href={data.metadata?.nextUrl}>{data.metadata?.nextButton}</a>
	</div>
</main>
