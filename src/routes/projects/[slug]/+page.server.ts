import { error } from '@sveltejs/kit';
import { getProject, listProjects } from '$lib/server/content';

export function entries() {
	return listProjects().map((p) => ({ slug: p.slug }));
}

export async function load({ params }) {
	const project = await getProject(params.slug);
	if (!project) error(404, 'No such project');
	return { project };
}
