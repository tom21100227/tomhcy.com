/**
 * Theme preference shared by every ThemeToggle on the page (there is one in the
 * nav for wide screens and one in the footer for phones). Persisted in
 * localStorage; src/app.html applies the saved value before first paint.
 */
export type ThemePref = 'system' | 'light' | 'dark';

const KEY = 'theme-preference';
const order: ThemePref[] = ['system', 'light', 'dark'];

/** Length of the palette cross-fade. Must match the duration in app.css. */
const SWAP_MS = 240;

export const theme = $state<{ pref: ThemePref }>({ pref: 'system' });

let swapTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Cross-fade the whole page between palettes. The attribute puts a colour
 * transition on every element, but only for the length of the swap, so it
 * never interferes with hover states or the live box's brat easter egg.
 *
 * The attribute has to land in the same tick as the colour change: a
 * transition reads its timing from the style the element ends up with, so
 * setting both together is what starts it.
 */
function withSwap(change: () => void) {
	const root = document.documentElement;
	root.setAttribute('data-theme-switching', '');
	change();
	clearTimeout(swapTimer);
	swapTimer = setTimeout(() => root.removeAttribute('data-theme-switching'), SWAP_MS);
}

/** Read the saved preference once the DOM exists, and follow OS changes. */
export function loadTheme() {
	try {
		const saved = localStorage.getItem(KEY);
		if (saved === 'light' || saved === 'dark') theme.pref = saved;
	} catch {
		/* storage unavailable: stay on system */
	}

	// On 'system' the palette changes with no click at all, when macOS flips at
	// sunset. Give those the same cross-fade.
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		if (theme.pref === 'system') withSwap(() => {});
	});
}

export function cycleTheme() {
	theme.pref = order[(order.indexOf(theme.pref) + 1) % order.length];
	withSwap(() => {
		const root = document.documentElement;
		if (theme.pref === 'system') root.removeAttribute('data-theme');
		else root.setAttribute('data-theme', theme.pref);
	});
	try {
		localStorage.setItem(KEY, theme.pref);
	} catch {
		/* ignore */
	}
}
