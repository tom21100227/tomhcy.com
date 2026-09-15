<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/site';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: '/now/', label: 'Now' },
		{ href: '/essays/', label: 'Thoughts' },
		{ href: '/projects/', label: 'Tinkering' }
	];

	let nameIndex = $state(0);
	const isHome = $derived(page.url.pathname === '/');

	/** On the home page the name is a toy: click to cycle. Elsewhere it's the way home. */
	function onBrandClick(e: MouseEvent) {
		if (!isHome) return;
		e.preventDefault();
		nameIndex = (nameIndex + 1) % site.names.length;
		document.title = site.names[nameIndex];
	}

	function isCurrent(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(href);
	}
</script>

<nav class="nav" aria-label="Primary">
	{#if isHome}
		<h1 class="brand">
			<a href="/" onclick={onBrandClick} title="Click to cycle my name">{site.names[nameIndex]}</a>
		</h1>
	{:else}
		<span class="brand"><a href="/">{site.names[0]}</a></span>
	{/if}
	{#each links as link (link.href)}
		<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>{link.label}</a>
	{/each}
	<ThemeToggle class="theme-wide" />
</nav>
