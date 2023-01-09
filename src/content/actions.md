---
title: Actions
prevUrl: '/auth'
prevButton: 'Auth'
---

# { title }

Svelte-Pocketbase also ships a number of actions to help with creating, reading, updating and deleting records within your database. Using these actions, developers can easily manage the data in their PocketBase database and perform common API tasks, but in a more "Svelty" way!

<section id="create-record-store" class="py-8">

## createRecordStore

To use these actions, you'll first create a record store using `createRecordStore`. Once instantiated, you can start interacting with the database using the `use:actions` directive throughout your code.

```javascript
<script>
	import { env } from '$env/dynamic/public';
	import { pbStore } from '$lib/stores';
	import { createRecordStore } from '$lib/actions';

	pbStore.set(env.PUBLIC_POCKETBASE_URL);

	const record = createRecordStore($pbStore);
</script>

<form use:record.create={{collection: "comments"}}>
  <textarea name="comment" />
  <button type="submit">Submit</button>
</form>
```

</section>

<section id="create" class="py-8">

  ## .create

  Creates a new record in a collection.

  ```javascript
  <form use:record.create={{collection: "comments"}}>
    <textarea name="comment" />
    <button type="submit">Submit</button>
  </form>
  ```
</section>

<section id="update" class="py-8">

  ## .update

  Updates an existing record in a collection that matches the `id` parameter.

  ```javascript
  <form use:record.update={{collection: "comments", id: "RECORD_ID"}}>
    <textarea name="comment" />
    <button type="submit">Update</button>
  </form>
  ```
</section>

<section id="delete" class="py-8">

  ## .delete

  Deletes an existing record from a collection that matches the `id` parameter.

  ```javascript
  <form use:record.delete={{collection: "comments", id: "RECORD_ID"}}>
    <button type="submit">Delete</button>
  </form>

  ```
  `.create`, `.update`, and `.delete` are designed to work with `form` elements.
</section>

<section id="get-one" class="py-8">

  ## .getOne

  Returns a single record that matches the `id` parameter.

  ```javascript
  <h1 use:record.getOne={{collection: "posts", id: "RECORD_ID"}}>
    {$record.data.title}
  </h1>
  ```
</section>

<section id="get-list" class="py-8">

  ## .getList

  Returns a paginated list of iterable record items, and receives optional `page` and `perPage` parameters.

  ```javascript
  <ul use:record.getList={{collection: "posts", page: 1, perPage: 10}}>
    {#each $record.data.records as record}
      <li>{record.title}</li>
    {/each}
  </ul>
  ```
</section>

<section id="get-full-list" class="py-8">

  ## .getFullList

  Returns all records in a collection, and receives and optional `batch` parameter.

  ```javascript
  <ul use:record.getFullList={{collection: "posts", batch: 10}}>
    {#each $record.data.records as record}
      <li>{record.title}</li>
    {/each}
  </ul>
  ```
</section>

<section id="get-first-list-item" class="py-8">

  ## .getFirstListItem

  Returns the first record in a collection that matches a given filter.

  ```javascript
  <h1 use:record.getFirstListItem={{collection: "posts", filter: 'slug="my-post"'}}>
    {$record.data.title}
  </h1>
  ```
</section>

### Additional Parameters

All actions accept an optional `query` parameter. You are also given access to the internal state of the record store which contains `loading`, `error`, `success`, and `data`.

```javascript
<form use:record.create={{ collection: 'subscribers' }}>
	<input type="email" name="email" />
	<button disabled={$record.loading} type="submit">Sign Up</button>
</form>

{#if $record.success}
  <div>Thanks for joining our spam list!</div>
{/if}

{#if $record.error}
  <div>Error: {$record.error}</div>
{/if}

{#if $record.data}
  <pre>{JSON.stringify($record.data, null, 2)}</pre>
{/if}

```
<section id="file-url" class="py-8">

## fileUrl

File handling with PocketBase can be a little tricky, but the `fileUrl` action makes things a little easier! It can be used on an `img` or `a` tag. If it is used on an image tag, it will set the `src` attribute. If it is used on an anchor tag, it will set the `href` attribute.

```javascript
<Auth let:user>
  <img use:fileUrl={{
    pb: $pbStore,
    record: user,
    filename: user.avatar,
    thumb: '100x100'
  }}/>
</Auth>
```
</section>



