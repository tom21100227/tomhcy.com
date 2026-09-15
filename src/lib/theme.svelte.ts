/**
 * Theme preference shared by every ThemeToggle on the page (there is one in the
 * nav for wide screens and one in the footer for phones). Persisted in
 * localStorage; src/app.html applies the saved value before first paint.
 */
export type ThemePref = 'system' | 'light' | 'dark';

const KEY = 'theme-preference';
const order: ThemePref[] = ['system', 'light', 'dark'];

export const theme = $state<{ pref: ThemePref }>({ pref: 'system' });

/** Read the saved preference once the DOM exists. */
export function loadTheme() {
	try {
		const saved = localStorage.getItem(KEY);
		if (saved === 'light' || saved === 'dark') theme.pref = saved;
	} catch {
		/* storage unavailable: stay on system */
	}
}

export function cycleTheme() {
	theme.pref = order[(order.indexOf(theme.pref) + 1) % order.length];
	const root = document.documentElement;
	if (theme.pref === 'system') root.removeAttribute('data-theme');
	else root.setAttribute('data-theme', theme.pref);
	try {
		localStorage.setItem(KEY, theme.pref);
	} catch {
		/* ignore */
	}
}
