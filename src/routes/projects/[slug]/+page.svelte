<script lang="ts">
	import { site } from '$lib/site';

	let { data } = $props();
	const project = $derived(data.project);
</script>

<svelte:head>
	<title>{project.title} · {site.title}</title>
	{#if project.summary}<meta name="description" content={project.summary.replace(/<[^>]+>/g, '')} />{/if}
	<link rel="canonical" href="{site.url}/projects/{project.slug}" />
</svelte:head>

<article>
	<header class="article-head">
		<h2 class="page-title">{@html project.title}</h2>
		<p class="article-meta">
			<span>{project.dates}</span>
			{#if project.labels.length}<span>{project.labels.join(' · ')}</span>{/if}
			{#if project.projecturl}<a href={project.projecturl} rel="noopener">source ↗</a>{/if}
		</p>
	</header>
	<div class="prose">
		{#if project.summary}<p>{@html project.summary}</p>{/if}
		{#if project.image && !project.hasBody}
			<p><img src={project.image} alt="" loading="lazy" /></p>
		{/if}
		{@html project.html}
	</div>
</article>
