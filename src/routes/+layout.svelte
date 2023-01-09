<script>
	import { applyAction, enhance } from '$app/forms';
	import { pbStore } from '$lib/stores';
	import Auth from '$lib/Auth.svelte';
	import { env } from '$env/dynamic/public';
	import { fileUrl } from '$lib/actions';
	import '../app.css';

	pbStore.set(env.PUBLIC_POCKETBASE_URL);

	const components = [
		{ link: '/record', name: 'Record' },
		{ link: '/list', name: 'List' },
		{ link: '/full-list', name: 'Full List' },
		{ link: '/first-list-item', name: 'First List Item' },
		{ link: '/auth', name: 'Auth' }
	];

  	const actions = [
		{ link: '/actions#create-record-store', name: 'createRecordStore' },
		{ link: '/actions#create', name: 'create' },
		{ link: '/actions#update', name: 'update' },
		{ link: '/actions#delete', name: 'delete' },
		{ link: '/actions#get-one', name: 'getOne' },
		{ link: '/actions#get-list', name: 'getList' },
		{ link: '/actions#get-first-list-item', name: 'getFirstListItem' },
		{ link: '/actions#file-url', name: 'fileUrl' },
	];
</script>

<div class="navbar bg-base-200 shadow-md">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-md lg:text-xl mr-4 hover:text-white">Svelte-Pocketbase</a>
		<a href="/" class="dropdown dropdown-hover">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn text-xs lg:text-sm bg-base-200 border-transparent m-1">Components</label>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-300 rounded-md w-52">
				{#each components as component}
					<li><a class="text-sm lg:text-base text-white hover:text-secondary" href={component.link}>{component.name}</a></li>
				{/each}
			</ul>
		</a>
		<a href="/actions" class="dropdown dropdown-hover">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn text-xs lg:text-sm bg-base-200 border-transparent m-1">Actions</label>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-300 rounded-md w-52">
				{#each actions as action}
					<li><a class="text-sm lg:text-base text-white hover:text-secondary" href={action.link}>{action.name}</a></li>
				{/each}
			</ul>
		</a>
	</div>
	<div class="flex-none gap-2">
		<Auth let:user>
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn btn-ghost btn-circle avatar mr-2">
					<div class="w-10 rounded-full">
						<img
							use:fileUrl={{ pb: $pbStore, record: user, filename: user.avatar }}
							alt="user-avatar"
						/>
					</div>
				</label>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="mt-3 p-2 shadow-lg menu menu-compact dropdown-content bg-base-300 rounded-md w-52"
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
		</Auth>
	</div>
</div>

<div class="container max-w-4xl mx-auto p-8">
	<slot />
</div>
