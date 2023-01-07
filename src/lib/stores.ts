import { browser } from '$app/environment';
import PocketBase, { BaseAuthStore } from 'pocketbase';
import { writable } from 'svelte/store';

function createPbStore(
	baseUrl?: string | undefined,
	authStore?: BaseAuthStore | null | undefined,
	lang?: string | undefined
) {
	const store = writable<PocketBase>();

	function set(
		baseUrl?: string | undefined,
		authStore?: BaseAuthStore | null | undefined,
		lang?: string | undefined
	) {
		const pb = new PocketBase(baseUrl, authStore, lang);

		if (browser) {
			pb.authStore.loadFromCookie(document.cookie);
		}
		store.set(pb);
	}

	set(baseUrl, authStore, lang);

	return {
		subscribe: store.subscribe,
		set
	};
}

export const pbStore = createPbStore();
