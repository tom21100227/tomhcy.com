<script lang="ts">
	import { site } from '$lib/site';

	let { data } = $props();
</script>

<svelte:head>
	<title>Now · {site.title}</title>
	<meta name="description" content="What Tom is doing, reading, and chewing on this season." />
	<link rel="canonical" href="{site.url}/now/" />
</svelte:head>

<h2 class="page-title">Now</h2>
<p class="lede">What I'm doing, reading, and chewing on this season. Updated whenever it changes.</p>
<div class="prose">{@html data.html}</div>
