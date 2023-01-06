<script lang="ts">
	import type { RecordListQueryParams } from 'pocketbase';
	import { pbStore } from './stores';

	export let collection: string;
	export let page: number | undefined = 1;
	export let perPage: number | undefined = 50;
	export let query: RecordListQueryParams | undefined = undefined;

	function numToArray(num: number): number[] {
		const array = [];
		for (let i = 1; i <= num; i++) {
			array.push(i);
		}
		return array;
	}

	$: resultList = $pbStore.collection(collection).getList(page, perPage, query);
</script>

{#await resultList then data}
	{#if !data}
		<slot name="loading" />
	{/if}
	<slot records={data} items={data.items} pages={numToArray(data.totalPages)} />
{:catch error}
	<slot name="error" {error} />
{/await}
