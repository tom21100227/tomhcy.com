<script lang="ts">
	import { onMount } from 'svelte';
	import { theme, loadTheme, cycleTheme } from '$lib/theme.svelte';

	/** Extra class so the nav and footer instances can be shown at different widths. */
	let { class: className = '' }: { class?: string } = $props();

	onMount(loadTheme);
</script>

<button
	type="button"
	class="theme {className}"
	onclick={cycleTheme}
	aria-label="Switch color theme (currently {theme.pref})"
>
	theme: {theme.pref}
</button>
