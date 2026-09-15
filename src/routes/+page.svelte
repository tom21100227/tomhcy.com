<script lang="ts">
	import bio from '$lib/data/bio.json';
	import { site } from '$lib/site';
	import NowBox from '$lib/components/NowBox.svelte';
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />
	<link rel="canonical" href="{site.url}/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={site.title} />
	<meta property="og:description" content={site.description} />
	<meta property="og:url" content="{site.url}/" />
	<meta property="og:image" content="{site.url}/img/me.jpeg" />
</svelte:head>

<section class="hero">
	<div class="photo">
		<img src="/img/me.webp" alt="Tom Han on a bike ride along the boardwalk" width="900" height="1200" fetchpriority="high" />
	</div>
	<div class="bio">
		<p class="about">{@html bio.basics.summary}</p>
	</div>
	<NowBox />
</section>
