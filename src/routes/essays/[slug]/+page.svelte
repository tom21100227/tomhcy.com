<script lang="ts">
	import { onMount } from 'svelte';
	import { site } from '$lib/site';

	let { data } = $props();
	const essay = $derived(data.essay);

	onMount(async () => {
		if (!essay.mermaid) return;
		// Only the rare essay with a diagram pays for mermaid.
		const { default: mermaid } = await import(
			/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
		);
		const dark = matchMedia('(prefers-color-scheme: dark)').matches;
		mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral' });
		await mermaid.run({ querySelector: '.prose pre.mermaid' });
	});
</script>

<svelte:head>
	<title>{essay.title} · {site.title}</title>
	<link rel="canonical" href="{site.url}/essays/{essay.slug}" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={essay.title} />
	{#if essay.date.iso}<meta property="article:published_time" content={essay.date.iso} />{/if}
</svelte:head>

<article>
	<header class="article-head">
		<h2 class="page-title">{@html essay.title}</h2>
		<p class="article-meta">
			{#if essay.date.iso}
				<time datetime={essay.date.iso}>{essay.date.display}</time>
			{:else}
				<span>{essay.date.display}</span>
			{/if}
			{#if essay.lastUpdated}<span>updated {essay.lastUpdated.display}</span>{/if}
			{#if essay.labels.length}<span>{essay.labels.join(' · ')}</span>{/if}
		</p>
	</header>
	<div class="prose">{@html essay.html}</div>
</article>
