import type PocketBase from 'pocketbase';
import {
  ClientResponseError,
  type FileQueryParams,
  type ListResult,
  type Record,
  type RecordQueryParams
} from 'pocketbase';
import { derived, writable } from 'svelte/store';

interface CollectionParams {
	collection: string;
	query?: RecordQueryParams;
}

interface FileUrlActionParams {
	pb: PocketBase;
	record: Record;
	filename: string;
	thumb?: FileQueryParams;
}

interface SingleRecordParams extends CollectionParams {
	id: string;
}

interface ListResultParams extends CollectionParams {
	page: number;
	perPage: number;
}

interface FullListParams extends CollectionParams {
	batch: number;
}

interface FirstListItemParams extends CollectionParams {
	filter: string;
}

/**
 * @param  {PocketBase} pb PocketBase instance
 * @returns a store with crud actions
 */
export function createRecordStore(pb: PocketBase) {
	type State = {
		loading: boolean;
		error: string | null;
		success: boolean;
		data: Record | Record[] | ListResult<Record> | null;
	};

	let state: State = {
		loading: false,
		error: null,
		success: false,
		data: null
	};

	const store = writable<State>(state);

	const set = (part: Partial<State>) => store.set((state = { ...state, ...part }));

	/**
	 * @desc Action that returns a single record
	 * @example
	 * <h1 use:record.getOne={{collection: "posts", id: "RECORD_ID"}}>
	 *  {$record.data.title}
	 * </h1>
	 */
	async function getOne(_: HTMLElement, params: SingleRecordParams) {
		set({ loading: true });
		try {
			const { collection, query, id } = params;
			const data = await pb.collection(collection).getOne(id, query);
			set({ loading: false, error: null, data });
		} catch (e) {
			set({ error: getErrorMessage(e), success: false, loading: false });
		}
	}

	/**
	 * @desc Action that returns a list of iterable record items
	 * @example
	 * <ul use:record.getList={{collection: "posts", page: 1, perPage: 10}}>
	 *  {#each $record.data.records as record}
	 *    <li>{record.title}</li>
	 *  {/each}
	 * </ul>
	 */
	async function getList(_: HTMLElement, params: ListResultParams) {
		set({ loading: true });
		try {
			const { collection, query, page, perPage } = params;
			const data = await pb.collection(collection).getList(page, perPage, query);
			set({ loading: false, error: null, data });
		} catch (e) {
			set({ error: getErrorMessage(e), success: false, loading: false });
		}
	}

	/**
	 * @desc Action that returns all records in a collection
	 * @example
	 * <ul use:record.getFullList={{collection: "posts", batch: 10}}>
	 *  {#each $record.data.records as record}
	 *    <li>{record.title}</li>
	 *  {/each}
	 * </ul>
	 */
	async function getFullList(_: HTMLElement, params: FullListParams) {
		set({ loading: true });
		try {
			const { collection, query, batch } = params;
			const data = await pb.collection(collection).getFullList(batch, query);
			set({ loading: false, error: null, data });
		} catch (e) {
			set({ error: getErrorMessage(e), success: false, loading: false });
		}
	}

	/**
	 * @desc Action that returns the first record in a collection
	 * @example
	 * <h1 use:record.getFirstListItem={{collection: "posts", filter: "title", query: 'slug="my-post"'}>
	 *  {$record.data.title}
	 * </h1>
	 */
	async function getFirstListItem(_: HTMLElement, params: FirstListItemParams) {
		set({ loading: true });
		try {
			const { collection, query, filter } = params;
			const data = await pb.collection(collection).getFirstListItem(filter, query);
			set({ loading: false, error: null, data });
		} catch (e) {
			set({ error: getErrorMessage(e), success: false, loading: false });
		}
	}

	/**
	 * @desc Form action that creates a new record
	 * @example
	 * <form use:record.create={{collection: "comments"}}>
	 *   <textarea name="comment" />
	 *   <button type="submit">Submit</button>
	 * </form>
	 */
	function create(form: HTMLFormElement, params: CollectionParams) {
		const { collection, query } = params;

		async function handleCreate(e: SubmitEvent) {
			e.preventDefault();
			set({ loading: true });
			const data = getFormData(form);
			try {
				const result = await pb.collection(collection).create(data, query);
				form.dispatchEvent(new CustomEvent('success'));
				form.reset();
				set({ success: true, loading: false, error: null, data: result });
			} catch (e) {
				set({ error: getErrorMessage(e), success: false, loading: false });
			}
		}

		form.addEventListener('submit', handleCreate);
		return {
			destroy() {
				form.removeEventListener('submit', handleCreate);
			}
		};
	}

	/**
	 * @desc Form action that updates a record
	 * @example
	 * <form use:record.update={{collection: "comments", id: "RECORD_ID"}}>
	 *   <textarea name="comment" />
	 *   <button type="submit">Update</button>
	 * </form>
	 */
	function update(form: HTMLFormElement, params: SingleRecordParams) {
		const { collection, query, id } = params;

		async function handleUpdate(e: SubmitEvent) {
      e.preventDefault();
      set({ loading: true });
			const data = getFormData(form);
			try {
        const result = await pb.collection(collection).update(id, data, query);
        set({ success: true, loading: false, error: null, data: result });
			} catch (e) {
				set({ error: getErrorMessage(e), success: false, loading: false });
			}
		}

		form.addEventListener('submit', handleUpdate);
		return {
			destroy() {
				form.removeEventListener('submit', handleUpdate);
			}
		};
	}

	/**
	 * @desc Form action that deletes a record
	 * @example
	 * <form use:record.delete={{collection: "comments", id: "RECORD_ID"}}>
	 *   <button type="submit">Delete</button>
	 * </form>
	 */
	function deleteRecord(form: HTMLFormElement, params: SingleRecordParams) {
		async function handleDelete() {
      const { collection, id, query } = params;
      set({ loading: true });
			try {
        await pb.collection(collection).delete(id, query);
        set({ success: true, loading: false, error: null });
			} catch (e) {
				set({ error: getErrorMessage(e), success: false, loading: false });
			}
		}

		form.addEventListener('submit', handleDelete);
		return {
			destroy() {
				form.removeEventListener('submit', handleDelete);
			}
		};
	}

	function getFormData(node: HTMLFormElement) {
		const formData = new FormData(node);
		return Object.fromEntries(formData.entries());
	}

	const { subscribe } = derived(store, ($store) => {
		return {
			...$store,
			create,
			update,
			delete: deleteRecord
		};
	});

	return {
		subscribe,
		create,
		update,
		delete: deleteRecord,
		getOne,
		getList,
		getFullList,
		getFirstListItem
	};
}

/**
 * @desc Action that returns the url of a file. It can be used on an image or anchor tag.
 * If it is used on an image tag, it will set the src attribute. If it is used on an anchor tag, it
 * will set the href attribute.
 * @example
 * <img use:fileUrl={{pb: $pb, record, filename: "image.jpg", thumb: '100x100'} />
 */
export function fileUrl(node: HTMLImageElement | HTMLAnchorElement, params: FileUrlActionParams) {
	getFileUrl(params, (url) => {
		if (node instanceof HTMLImageElement) {
			node.src = url;
		}
		if (node instanceof HTMLAnchorElement) {
			node.href = url;
		}
	});
}

function getFileUrl(params: FileUrlActionParams, cb: (url: string) => void) {
	const { pb, record, filename, thumb } = params;

	cb(pb.getFileUrl(record, filename, thumb));
}

function getErrorMessage(error: unknown) {
	if (error instanceof ClientResponseError) return error.message;
	return String(error);
}
