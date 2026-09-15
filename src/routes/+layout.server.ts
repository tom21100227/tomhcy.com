import { execSync } from 'node:child_process';

/** Site-wide "Last updated": the date of the most recent commit, computed at build time. */
export function load() {
	let iso = new Date().toISOString();
	try {
		const out = execSync('git log -1 --format=%cI', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
		if (out) iso = out;
	} catch {
		/* not a git checkout: fall back to build time */
	}
	const lastUpdated = new Date(iso).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'America/Los_Angeles'
	});
	return { lastUpdated };
}
