<script lang="ts">
	import '@fontsource-variable/newsreader';
	import '@fontsource-variable/newsreader/wght-italic.css';
	import '@fontsource/spline-sans-mono/400.css';
	import '@fontsource/spline-sans-mono/500.css';
	import '../app.css';

	import { afterNavigate } from '$app/navigation';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children, data } = $props();

	// metrics.js beacons on first load; client-side navigations need a nudge.
	afterNavigate((nav) => {
		if (nav.from && typeof window.__metricsPageview === 'function') window.__metricsPageview();
	});
</script>

<div class="wrap">
	<Nav />
	<main>
		{@render children()}
	</main>
	<Footer lastUpdated={data.lastUpdated} />
</div>
