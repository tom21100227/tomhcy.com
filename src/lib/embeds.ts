/**
 * Third-party embeds inside rendered markdown.
 *
 * Markdown is turned into an HTML string at build time and injected with
 * {@html}. On a client-side navigation that insertion goes through innerHTML,
 * and a <script> tag inserted that way never executes. So the script Strava
 * hands you in its embed dialog works on a direct page load and silently does
 * nothing when a visitor clicks through from another page. We load it here
 * instead, only on pages that actually contain an embed.
 */

const STRAVA_SRC = 'https://strava-embeds.com/embed.js';

/**
 * Replace any `.strava-embed-placeholder` with Strava's iframe. Safe to call on
 * every navigation: the bootstrap only looks for placeholders, and each one is
 * replaced by the iframe it creates.
 */
export function mountStravaEmbeds() {
	if (!document.querySelector('.strava-embed-placeholder')) return;

	// The script exposes its scan as a global, so later navigations reuse it.
	if (window.__STRAVA_EMBED_BOOTSTRAP__) {
		window.__STRAVA_EMBED_BOOTSTRAP__();
		return;
	}
	if (document.querySelector(`script[src="${STRAVA_SRC}"]`)) return;

	const script = document.createElement('script');
	script.src = STRAVA_SRC;
	script.async = true;
	document.head.appendChild(script);
}

/** Run every embed integration for the page that just rendered. */
export function mountEmbeds() {
	mountStravaEmbeds();
}
