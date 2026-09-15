<script lang="ts">
	import '@fontsource-variable/newsreader';
	import '@fontsource-variable/newsreader/wght-italic.css';
	import '@fontsource/spline-sans-mono/400.css';
	import '@fontsource/spline-sans-mono/500.css';
	import '../app.css';

	import { afterNavigate } from '$app/navigation';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { mountEmbeds } from '$lib/embeds';

	let { children, data } = $props();

	// Runs after the first render too, not just later navigations.
	afterNavigate((nav) => {
		// metrics.js beacons on first load; client-side navigations need a nudge.
		if (nav.from && typeof window.__metricsPageview === 'function') window.__metricsPageview();
		mountEmbeds();
	});
</script>

<div class="wrap">
	<Nav />
	<main>
		{@render children()}
	</main>
	<Footer lastUpdated={data.lastUpdated} />
</div>
