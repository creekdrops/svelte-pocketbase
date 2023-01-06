<script lang="ts">
	import type { RecordListQueryParams } from 'pocketbase';
	import { pbStore } from './stores';

	export let collection: string;
	export let filter: string;
	export let query: RecordListQueryParams | undefined = undefined;

	const record = $pbStore.collection(collection).getFirstListItem(filter, query);
</script>

{#await record then data}
	{#if !data}
		<slot name="loading" />
	{/if}
	<slot record={data} />
{:catch error}
	<slot name="error" {error} />
{/await}
