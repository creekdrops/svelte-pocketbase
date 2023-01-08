---
title: Full List
prevUrl: '/list'
prevButton: 'List'
nextUrl: '/first-list-item'
nextButton: 'First List Item'
---

# { title }

If you want to retrieve all records from a collection as you would using the `getFullList` function, you can use the `FullList` component.

By default, the component will return a `batch` of 100 records, but you are free to increase or decrease this to fit your specific needs.

```typescript
<script>
  import { FullList } from 'svelte-pocketbase';
</script>

<FullList collection="posts" batch={50} let:records>
  {#each records as record}
    <p>{record.title}</p>
  {/each}
  <span slot="error" let:error>{error}</span>
</FullList>
```
