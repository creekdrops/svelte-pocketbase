import type { PageData } from "./$types";


export const load = (async () => {
  const post = await import(`./intro.md`);
	const { metadata } = post;
	const content = post.default;

	return {
		content,
		metadata
	};
}) satisfies PageData;
