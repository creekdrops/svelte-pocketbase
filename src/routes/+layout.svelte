<script>
	import { applyAction, enhance } from '$app/forms';
	import { pbStore } from '$lib/stores';
	import User from '$lib/User.svelte';
	import { env } from '$env/dynamic/public';
	import '../app.css';

	pbStore.set(env.PUBLIC_POCKETBASE_URL);

	const components = [
		{ link: '/record', name: 'Record' },
		{ link: '/list', name: 'List' },
		{ link: '/full-list', name: 'Full List' },
		{ link: '/first-list-item', name: 'First List Item' },
		{ link: '/user', name: 'User' }
	];
</script>

<div class="navbar bg-base-200">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl mr-4">Svelte-Pocketbase</a>
		<div class="dropdown dropdown-hover">
			<label tabindex="0" class="btn bg-base-200 border-transparent m-1">Components</label>
			<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-52">
				{#each components as component}
					<li><a href={component.link}>{component.name}</a></li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="flex-none gap-2">
		<User let:user>
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn btn-ghost btn-circle avatar mr-2">
					<div class="w-10 rounded-full">
						<img src={user && $pbStore.getFileUrl(user, user.avatar)} alt="user-avatar" />
					</div>
				</label>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52"
				>
					<li>
						<a href="/secret">Protected</a>
					</li>
					<li>
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
							<button>Logout</button>
						</form>
					</li>
				</ul>
			</div>
			<div slot="signedout">
				<a class="btn btn-sm mr-2" href="/login">Log in</a>
			</div>
		</User>
	</div>
</div>

<div class="container max-w-4xl mx-auto py-8">
	<slot />
</div>
