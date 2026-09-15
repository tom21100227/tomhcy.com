import { listProjects } from '$lib/server/content';

export function load() {
	return { projects: listProjects() };
}
