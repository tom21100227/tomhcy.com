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
		<!-- Phones hide the photo; the empty source keeps them from downloading it. -->
		<picture>
			<source media="(max-width: 640px)" srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
			<img src="/img/me.jpeg" alt="Tom Han on a bike ride along the boardwalk" width="900" height="1200" fetchpriority="high" />
		</picture>
	</div>
	<div class="bio">
		<p class="about">{@html bio.basics.summary}</p>
	</div>
	<NowBox />
</section>
