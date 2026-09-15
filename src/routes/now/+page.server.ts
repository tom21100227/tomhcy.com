import { getNow } from '$lib/server/content';

export async function load() {
	return await getNow();
}
