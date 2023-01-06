import type PocketBase from "pocketbase";
import { writable, type Writable } from "svelte/store";

export const pbStore: Writable<PocketBase> = writable()
