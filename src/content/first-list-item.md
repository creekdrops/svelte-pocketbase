---
title: First List Item
prevUrl: '/full-list'
prevButton: 'Full List'
nextUrl: '/user'
nextButton: 'User'
---

# { title }

If you are looking to find that one specific record that matches a certain parameter, the `FirstListItem` component has got your back! Set the `collection` prop and provide a `filter`, and it will return the first record that fits the bill. It's like the `firstListItem` function, but without all the chaining.

```typescript
<script>
  import { FirstListItem } from 'svelte-pocketbase';
</script>

<FirstListItem
  collection="posts"
  filter={'slug="my-post"'}
  let:record>
    <h1>{record.title}</h1>
    <span slot="error" let:error>{error}</span>
</FirstListItem>
```
