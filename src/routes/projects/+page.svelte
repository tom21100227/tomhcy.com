<script lang="ts">
	import { site } from '$lib/site';

	let { data } = $props();
</script>

<svelte:head>
	<title>Tinkering · {site.title}</title>
	<meta name="description" content="Things Tom Han has built, for work and for fun." />
	<link rel="canonical" href="{site.url}/projects/" />
</svelte:head>

<h2 class="page-title">Tinkering</h2>
<p class="lede">Things I've built, for work and for fun.</p>

<ul class="list">
	{#each data.projects as project (project.slug)}
		<li>
			<span class="when">{project.dates}</span>
			<div>
				<div class="t"><a href="/projects/{project.slug}">{@html project.title}</a></div>
				{#if project.summary}<p class="d">{@html project.summary}</p>{/if}
				{#if project.labels.length}<p class="tags">{project.labels.join(' · ')}</p>{/if}
			</div>
		</li>
	{/each}
</ul>
