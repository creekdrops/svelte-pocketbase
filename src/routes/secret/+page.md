---
title: 'Protected Route'
---

# Protected Route

This route uses a combination of `hooks` and `+page.server.(t|s)`. Here is an example of how you can implement this in your app.

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
