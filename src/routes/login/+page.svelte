<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pbStore } from '$lib/stores';
</script>

<form
	method="POST"
	class="card bg-base-200 px-8 py-12 max-w-xl mx-auto shadow-2xl mt-12 border-base-100 border-4"
	use:enhance={() => {
		return async ({ result }) => {
			$pbStore.authStore.loadFromCookie(document.cookie);
			await applyAction(result);
		};
	}}
>
	<h1 class="text-3xl mb-0 text-center">Log in</h1>
	<p class="text-base">
		To demonstrate the login functionality, login with <strong>test@example.com</strong> and
		<strong>test123456</strong> as the password.
	</p>
	<div class="form-control gap-2 mb-4 w-full">
		<input
			type="email"
			name="email"
			placeholder="Email"
			class="input input-bordered my-1 bg-base-300 "
		/>
		<input
			type="password"
			name="password"
			placeholder="Password"
			class="input input-bordered my-1 bg-base-300"
		/>
		<button class="btn btn-primary my-1">Log in</button>
	</div>
</form>
