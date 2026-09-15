<script lang="ts">
	import { site } from '$lib/site';
</script>

<svelte:head>
	<title>Not found · {site.title}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<h2 class="page-title">Nothing here.</h2>
<p class="lede">
	The page you wanted moved or never existed. Try the <a href="/">front page</a>, or if you were
	looking for shenanigans, <a href={site.shenanigans}>tomtopia.com</a>.
</p>
