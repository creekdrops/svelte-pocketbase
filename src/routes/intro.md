---
title: Svelte-PocketBase
nextUrl: '/record'
nextButton: 'Record'
---

# {title}

**Supercharge your Sveltekit + PocketBase project!**

**Svelte-Pocketbase** is the perfect companion to your next Sveltekit + PocketBase project. This library provides declarative components that effortlessly query data from your PocketBase database.

## Getting Started

```bash
# install svelte-pocketbase with pnpm, npm or yarn

pnpm i -D svelte-pocketbase
```

## PocketBase Store

To get started, instantiate a new `pbStore` in a `+page.svelte` or `+layout.svelte`.

```javascript
// src/+layout.svelte OR src/+page.svelte
<script>
  import PocketBase from 'pocketbase';
  import { pbStore } from 'svelte-pocketbase';
  import { env } from '$env/dynamic/public';

  pbStore.set(env.PUBLIC_POCKETBASE_URL);
</script>

<slot />
```

The `pbStore` is the ultimate marriage of PocketBase and Svelte `Writable` magic! Simply create an instance of `pbStore` and you've got a PocketBase instance wrapped up in a shiny svelte store. Need to use it in your app? No problem! Just subscribe to `$pbStore` and you're good to go.

```typescript
// src/+page.svelte
<script>
  import { pbStore } from 'svelte-pocketbase';
  let id = "RECORD_ID"

  const record = $pbStore.collection('categories').getOne('RECORD_ID');
</script>

{#await record}
  <span>Loading...</span>
{:then data}
  <pre>{JSON.stringify(data, null, 2)}</pre>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
```

This is a fair amount of boilerplate for simply retrieving a bit of data from your database. Instead, maybe try out one of the data retrieval components, like `Record`. These components handle all the tedious bits of querying and data retrieval, leaving you free to focus on more important things (like obsessively fine-tuning your Tailwind CSS config).

### Data Retrieval Components

- [Record](/record)
- [List](/list)
- [FullList](/full-list)
- [FirstListItem](/first-list-item)

Every data retrieval component receives a `collection` prop, and an optional `query` prop that can be used to sort and filter the results. Each component also contains an `error` slot that can be used to notify the user.
