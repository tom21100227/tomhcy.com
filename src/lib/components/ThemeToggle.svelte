<script lang="ts">
	import { onMount } from 'svelte';

	type Pref = 'system' | 'light' | 'dark';
	const order: Pref[] = ['system', 'light', 'dark'];
	const KEY = 'theme-preference';

	let pref = $state<Pref>('system');

	onMount(() => {
		try {
			const saved = localStorage.getItem(KEY);
			if (saved === 'light' || saved === 'dark') pref = saved;
		} catch {
			/* storage unavailable: stay on system */
		}
	});

	function apply() {
		const root = document.documentElement;
		if (pref === 'system') root.removeAttribute('data-theme');
		else root.setAttribute('data-theme', pref);
		try {
			localStorage.setItem(KEY, pref);
		} catch {
			/* ignore */
		}
	}

	function cycle() {
		pref = order[(order.indexOf(pref) + 1) % order.length];
		apply();
	}
</script>

<button type="button" class="theme" onclick={cycle} aria-label="Switch color theme (currently {pref})">theme: {pref}</button>
