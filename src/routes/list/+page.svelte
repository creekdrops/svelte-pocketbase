<script lang="ts">
	import List from '$lib/List.svelte';
	import Pagination from '$lib/Pagination.svelte';

	let page = 1;

	function setPage(number: number) {
		page = number;
	}
</script>

<List collection="posts" {page} perPage={2} query={{ sort: '-created' }} let:items let:pages>
	<Pagination {items} {pages} let:item>
		<h1>{item.title}</h1>
		<button slot="pages" let:pageNumber on:click={() => setPage(pageNumber)}>{pageNumber}</button>
	</Pagination>
	<span slot="error" let:error>{error}</span>
</List>
