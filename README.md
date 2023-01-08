# svelte-pocketbase

> Hold up! This library is currently experimental, and in early
> development. Be careful if you intend on using this in production.

**Supercharge your Sveltekit + PocketBase project!**

**Svelte-Pocketbase** is the perfect companion to your next Sveltekit + PocketBase project. This library provides declarative components that effortlessly query data from your PocketBase database.

## Getting Started

```bash
# install svelte-pocketbase with pnpm, npm or yarn
pnpm i -D svelte-pocketbase
```

## PocketBase Store

To get started, instantiate a new `pbStore` in a `+page.svelte` or `+layout.svelte`.

```typescript
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

### Components

- `Record`
- `List`
- `FullList`
- `FirstListItem`

Every data retrieval component receives a `collection` prop, and an optional `query` prop that can be used to sort and filter the results. Each component also contains an `error` slot that can be used to notify the user.

## Retrieving Data

### Individual Records by ID

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

### Paginated Lists

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

Need to retrieve a list of records from your PocketBase database? Check out the `List` component! You can easily paginate through your data just like you would with the `getList` function in the PocketBase JavaScript SDK.

The component defaults to displaying 50 records per page, starting at page 1, but you can customize the current page and results per page to fit your needs using the `page` and `perPage` props.

#### Declarative Pagination

You can even break the `List` down even further using the `Pagination` helper to cut down on the { #each } blocks within your markup. Simply pass your items array into the `items`. The component will loop over any items in the array, and expose the individual item data via the `let:item` directive.

You can also pass content to the `pages slot` provided that you also include a pages array to the `pages` prop. This is helpful if you want to have a list of pagination buttons. The `pages slot` is optional, since you may want to provide your own pagination navigation.

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

### Full List

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

If you want to retrieve all records from a collection as you would using the `getFullList` function, you can use the `FullList` component.

By default, the component will return a `batch` of 100 records, but you are free to increase or decrease this to fit your specific needs.

### First Item Within a List

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

If you are looking to find that one specific record that matches a certain parameter, the `FirstListItem` component has got your back! Set the `collection` prop and provide a `filter`, and it will return the first record that fits the bill. It's like the `firstListItem` function, but without all the chaining.

## Conditional User Rendering

```typescript
<script>
  import { User } from 'svelte-pocketbase';
</script>

<User let:user>
  <div>
    <p>Name: {user?.name}</p>
    <p>Email: {user?.email}</p>
  </div>
  <div slot="signedout">
    <li><a href="/login">Log in</a></li>
    <li><a href="/register">Register</a></li>
  </div>
</User>

```

Need to show (or hide) certain parts of your UI based on a user's authentication status? Simply wrap any content you want to conditionally render with the `User` component, and it will only appear if there is a valid user object in the `authStore`.

If you want a fallback element for signed-out users? Just assign it to the `signedout` slot.

Also, if you want to render a placeholder during the loading phase, assign an element to the `loading slot` as we do for all other components.

To access the user's data, just use the `let:user` directive to pass it down to any child elements.

### Protecting Specific Routes

The User component is pretty sweet, but it is not a sufficient method for protecting critical areas of your application. If you need to protect specific routes, you should consider using a `hooks.server.(ts|js)` alongside `load` functions inside your `+page.server.(ts|js)`.

To save you the hassle of looking it up yourself, I've included a few examples below that can help get you started.

#### hooks.server.ts

```typescript
//	src/hooks.server.ts

import { env } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(env.PUBLIC_POCKETBASE_URL);

	// Grab the cookie from request headers
	const cookie = event.request.headers.get('cookie');

	// load the store data from the request cookie string
	event.locals.pb.authStore.loadFromCookie(cookie || '');

	try {
		// get an up-to-date auth store state by verifying and refreshing
		// the loaded auth model (if any)
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the
	// latest store state
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie());

	return response;
};
```

#### +page.server.ts

```typescript
//	src/routes/protected-route/+page.server.ts

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ locals }) => {
	//	check to see if the user is authenticated
	if (!locals.pb.authStore.isValid) {
		//	if not, redirect them to "/login"
		throw redirect(303, '/login');
	}
}) satisfies PageServerLoad;
```

## Contribute

This library is still very much work-in-progress. As mentioned before, you may want to avoid using this in a production setting until things are a bit more polished. I hope to add additional features such as realtime features and CRUD helpers in the near future.

Feel free to contribute to this project if you have ideas or suggestions for improvements.
