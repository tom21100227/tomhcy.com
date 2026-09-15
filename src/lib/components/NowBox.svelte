<script lang="ts">
	import { onMount } from 'svelte';
	import { site } from '$lib/site';

	/** Shape returned by the Now Playing worker. */
	interface Music {
		success: boolean;
		isPlaying: boolean;
		title: string;
		artist: string;
		album?: string;
		source: string;
		songUrl?: string;
		albumImageUrl?: string;
		error?: string;
	}
	/** Shape the future Strava endpoint should return. */
	interface Ride {
		name: string;
		distance: string;
		movingTime: string;
		elevation?: string;
		when?: string;
		url?: string;
	}
	type Slot =
		| { kind: 'loading' }
		| { kind: 'music'; data: Music }
		| { kind: 'ride'; data: Ride }
		| { kind: 'quiet' };

	let slot = $state<Slot>({ kind: 'loading' });
	let refreshing = $state(false);

	async function fetchJson<T>(url: string): Promise<T | null> {
		try {
			const res = await fetch(url, { cache: 'no-store' });
			if (!res.ok) return null;
			return (await res.json()) as T;
		} catch {
			return null;
		}
	}

	/** Music first. If nothing's playing, a ride. If no ride either, say so quietly. */
	async function load(force = false) {
		const musicUrl = force
			? site.musicApi + (site.musicApi.includes('?') ? '&' : '?') + 'noCache=true'
			: site.musicApi;
		const music = await fetchJson<Music>(musicUrl);
		if (music?.success && music.title) {
			slot = { kind: 'music', data: music };
			return;
		}
		if (site.stravaApi) {
			const ride = await fetchJson<Ride>(site.stravaApi);
			if (ride?.name) {
				slot = { kind: 'ride', data: ride };
				return;
			}
		}
		slot = { kind: 'quiet' };
	}

	async function refresh() {
		if (refreshing) return;
		refreshing = true;
		try {
			await load(true);
		} finally {
			refreshing = false;
		}
	}

	onMount(() => {
		load();
	});

	const brat = $derived(
		slot.kind === 'music' &&
			slot.data.isPlaying &&
			/brat/i.test(slot.data.album ?? '') &&
			/charli\s*xcx/i.test(slot.data.artist ?? '')
	);
</script>

<div class="slot" class:brat aria-live="polite">
	{#if slot.kind === 'loading'}
		<div class="art skeleton" aria-hidden="true"></div>
		<div class="text">
			<span class="eyebrow">Now playing</span>
			<p class="track muted">Checking what's on…</p>
		</div>
	{:else if slot.kind === 'music'}
		{@const d = slot.data}
		<img
			class="art"
			class:pulsing={d.isPlaying}
			src={d.albumImageUrl || '/img/album_cover_placeholder.svg'}
			alt=""
			width="76"
			height="76"
			decoding="async"
		/>
		<div class="text">
			<span class="eyebrow">{d.isPlaying ? 'Now playing' : 'Recently played'}</span>
			<p class="track">
				{#if d.songUrl}
					<a href={d.songUrl} target="_blank" rel="noopener">{d.title}</a>
				{:else}
					{d.title}
				{/if}
				— {d.artist}
			</p>
			<p class="sub">{#if d.album}{d.album} {/if}<span class="mono">· {d.source}</span></p>
		</div>
	{:else if slot.kind === 'ride'}
		{@const r = slot.data}
		<div class="art" aria-hidden="true">
			<svg viewBox="0 0 76 76" width="76" height="76">
				<polyline
					points="8,58 18,44 26,48 34,30 44,34 52,20 62,26 68,14"
					fill="none"
					stroke="var(--teak)"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<circle cx="8" cy="58" r="3" fill="var(--teak)" />
				<circle cx="68" cy="14" r="3" fill="var(--paper)" stroke="var(--teak)" stroke-width="2" />
			</svg>
		</div>
		<div class="text">
			<span class="eyebrow">Nothing playing · last ride</span>
			<p class="track">
				{#if r.url}<a href={r.url} target="_blank" rel="noopener">{r.name}</a>{:else}{r.name}{/if}
			</p>
			<p class="sub">
				<span class="mono">{r.distance} · {r.movingTime}{#if r.elevation} · ↑ {r.elevation}{/if}</span>
				{#if r.when}· {r.when}{/if}
			</p>
		</div>
	{:else}
		<div class="art" aria-hidden="true"></div>
		<div class="text">
			<span class="eyebrow">Quiet</span>
			<p class="track">Nothing playing right now.</p>
			<p class="sub">Probably a movie night.</p>
		</div>
	{/if}

	<button
		type="button"
		class="refresh"
		class:is-loading={refreshing}
		disabled={refreshing || slot.kind === 'loading'}
		aria-busy={refreshing}
		aria-label="Refresh now playing"
		title="Refresh"
		onclick={refresh}
	>
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
			<path d="M13.5 2.5v3h-3" />
		</svg>
	</button>
</div>
