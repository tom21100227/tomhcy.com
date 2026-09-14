import { listEssays } from '$lib/server/content';

export function load() {
	return { essays: listEssays() };
}
