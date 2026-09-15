<script lang="ts">
	import { site } from '$lib/site';

	let { data } = $props();
</script>

<svelte:head>
	<title>Thoughts · {site.title}</title>
	<meta name="description" content="Essays by Tom Han, mostly about tools and the making of this site." />
	<link rel="canonical" href="{site.url}/essays/" />
</svelte:head>

<h2 class="page-title">Thoughts</h2>
<p class="lede">Essays, mostly about tools and the making of this site.</p>

<ul class="list">
	{#each data.essays as essay (essay.slug)}
		<li>
			{#if essay.date.iso}
				<time class="when" datetime={essay.date.iso}>{essay.date.display}</time>
			{:else}
				<span class="when">{essay.date.display}</span>
			{/if}
			<div>
				<div class="t"><a href="/essays/{essay.slug}">{essay.title}</a></div>
				{#if essay.lastUpdated}
					<p class="d">Updated {essay.lastUpdated.display}</p>
				{/if}
				{#if essay.labels.length}
					<p class="tags">{essay.labels.join(' · ')}</p>
				{/if}
			</div>
		</li>
	{/each}
</ul>
