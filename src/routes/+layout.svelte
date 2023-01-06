<script>
	import PocketBase from 'pocketbase';
	import { applyAction, enhance } from '$app/forms';
	import { pbStore } from '$lib/stores';
	import User from '$lib/User.svelte';
	import { env } from '$env/dynamic/public';

	pbStore.set(new PocketBase(env.PUBLIC_POCKETBASE_URL));
</script>

<User let:user>
	<h1>Welcome {user?.name}</h1>
	<p>Email: {user?.email}</p>
	<form
		method="POST"
		action="/logout"
		use:enhance={() => {
			return async ({ result }) => {
				$pbStore.authStore.clear();
				await applyAction(result);
			};
		}}
	>
		<button>Log out</button>
	</form>
	<div slot="signedout">
		<li><a href="/login">Log in</a></li>
		<li><a href="/register">Register</a></li>
	</div>
</User>
<div class="max-w-xl mx-auto py-8 px-4">
	<slot />
</div>
