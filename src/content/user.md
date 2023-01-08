---
title: User
prevUrl: '/first-list-item'
prevButton: 'First List Item'
---

# { title }

Need to show (or hide) certain parts of your UI based on a user's authentication status? Simply wrap any content you want to conditionally render with the `User` component, and it will only appear if there is a valid user object in the `authStore`.

If you want a fallback element for signed-out users? Just assign it to the `signedout` slot.

Also, if you want to render a placeholder during the loading phase, assign an element to the `loading` slot as we do for all other components.

To access the user's data, just use the `let:user` directive to pass it down to any child elements.

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

## Protecting Specific Routes

The User component is pretty sweet, but it is not a sufficient method for protecting critical areas of your application. If you need to protect specific routes, you should consider using a `hooks.server.(ts|js)` alongside `load` functions inside your `+page.server.(ts|js)`.

To save you the hassle of looking it up yourself, I've included a few examples below that can help get you started.

### hooks.server.ts

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
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie());

	return response;
};
```

### +page.server.ts

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
