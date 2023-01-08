---
title: List
prevUrl: '/record'
prevButton: 'Record'
nextUrl: '/full-list'
nextButton: 'Full List'
---

# { title }

Need to retrieve a list of records from your PocketBase database? Check out the `List` component! You can easily paginate through your data just like you would with the `getList` function in the PocketBase JavaScript SDK.

The component defaults to displaying 50 records per page, starting at page 1, but you can customize the current page and results per page to fit your needs using the `page` and `perPage` props.

**Example**

```typescript
<script lang="ts">
  import List from '$lib/List.svelte';

  let page = 1;

  function setPage(number: number) {
    page = number;
  }
</script>

<List collection="posts" {page} perPage={2} query={{ sort: '-created' }} let:items let:pages>
  {#each items as item}
    <h1>{item.title}</h1>
  {/each}
  {#each pages as pageNumber}
    <button on:click={() => setPage(pageNumber)}>{pageNumber}</button>
  {/each}
  <pre>{JSON.stringify(items, null, 2)}</pre>
  <span slot="error" let:error>{error}</span>
</List>

```

## Declarative Pagination

You can even break the `List` down even further using the `Pagination` helper to cut down on the `{#each}` blocks within your markup. Simply pass your items array into the `items`. The component will loop over any items in the array, and expose the individual item data via the `let:item` directive.

You can also pass content to the `pages slot` provided that you also include a pages array to the `pages` prop. This is helpful if you want to have a list of pagination buttons. The `pages slot` is optional, since you may want to provide your own pagination navigation.

**Example**

```typescript
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
```
