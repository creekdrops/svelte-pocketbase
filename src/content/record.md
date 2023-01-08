---
title: Record
prevUrl: '/'
prevButton: 'Intro'
nextUrl: '/list'
nextButton: 'List'
---

# Record

```typescript
<script>
  import { Record } from 'svelte-pocketbase';
</script>

<Record collection="posts" id="RECORD_ID" let:record >
  <span slot="loading">Loading...</span>
  <pre>{JSON.stringify(record, null, 2)}</pre>
  <span slot="error" let:error>{error}</span>
</Record>
```

The `Record` component is intended to retrieve single records from your database by their `RECORD_ID`.

Simply pass in the name of the collection to the `collection` prop and a `RECORD_ID` to the `id` prop and let the component do the heavy lifting.

You can also pass an `HTMLElement` into the `loading` slot in the event that your server is being naughty, and you need to keep your audience captivated with a fancy loading element.

Want to access the data? No problem, just use the handy `let:record` directive.

As an extra sprinkle of magic, there is no need to fuss about with `{ #await }` blocks. The `Record` component, along with all other data components handle the async action for you!
