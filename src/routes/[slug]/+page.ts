import type { PageLoad } from './$types';

export const load = (async ({params}) => {
  const post = await import(`../../content/${params.slug}.md`);
	const { metadata } = post;
	const content = post.default;

	return {
		content,
		metadata
	};
}) satisfies PageLoad;
