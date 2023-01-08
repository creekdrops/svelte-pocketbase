import { env } from "$env/dynamic/public";
import type { Handle } from '@sveltejs/kit';
import PocketBase from "pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(env.PUBLIC_POCKETBASE_URL)

  // Grab the cookie from request headers
  const cookie = event.request.headers.get('cookie')

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
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({httpOnly: false, secure: false}));

	return response;
};
