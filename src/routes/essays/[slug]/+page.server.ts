import { error } from '@sveltejs/kit';
import { getEssay, listEssays } from '$lib/server/content';

export function entries() {
	return listEssays().map((e) => ({ slug: e.slug }));
}

export async function load({ params }) {
	const essay = await getEssay(params.slug);
	if (!essay) error(404, 'No such essay');
	return { essay };
}
