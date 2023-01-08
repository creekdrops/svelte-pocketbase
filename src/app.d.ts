// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import PocketBase, { Admin } from 'pocketbase';

declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			user: Record | Admin | null;
		}
		// interface PageData {}
		// interface Platform {}
  }
  declare module '*.md' {
    export const metadata: {
			title?: string;
			prevUrl?: string;
			prevButton?: string;
			nextUrl?: string;
			nextButton?: string;
		};
    const content: ConstructorOfATypedSvelteComponent;
    export default content
  };
}



