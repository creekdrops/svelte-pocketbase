<script lang="ts">
	import type { RecordListQueryParams } from 'pocketbase';
	import { pbStore } from './stores';

	export let collection: string;
	export let batch: number | undefined = 100;
	export let query: RecordListQueryParams | undefined = undefined;

	const records = $pbStore.collection(collection).getFullList(batch, query);
</script>

{#await records then data}
	{#if !data}
		<slot name="loading" />
	{/if}
	<slot records={data} />
{:catch error}
	<slot name="error" {error} />
{/await}
