# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

tomhcy.com is Tom Han's personal site: a one-screen landing page plus a Now page, essays ("Thoughts"), projects ("Tinkering"), and a resume. It is a SvelteKit 2 app prerendered to static HTML with `@sveltejs/adapter-static` and served from GitHub Pages. There is no server at runtime.

The layout follows Tom's hand sketch from September 2026. Design tokens live in `src/app.css`: concrete grey paper, ink, Pacific blue links, a teak accent, Newsreader for text, Spline Sans Mono for labels and dates. Keep new UI on those tokens.

## Commands

```bash
npm install          # once
npm run dev          # http://localhost:5173 with HMR
npm run build        # prerender everything into build/
npm run preview      # serve build/ locally
npm run check        # svelte-check (types + templates); keep it at 0 errors
```

## Layout of the Repo

- `src/routes/` — pages. `+layout.ts` sets `prerender = true` and `trailingSlash = 'never'`.
  - `/` home, `/now`, `/essays` + `/essays/[slug]`, `/projects` + `/projects/[slug]`, `/resume`, `/404`.
  - Index pages (`now`, `essays`, `projects`) set `trailingSlash = 'always'` in `+page.ts` so they build to `index.html` folders. Detail pages keep `'never'` so they build to `essays/<slug>.html`, which are the URLs the old Jekyll site published. Do not change these without also handling redirects.
- `src/content/` — markdown with YAML front matter, unchanged from the Jekyll era.
  - `essays/*.md`: `title`, `date`, optional `last_updated`, `labels`, `published`, optional `mermaid: true`.
  - `projects/*.md`: `title`, `date` (`YYYY`, `YYYY-MM`, `YYYY-MM-DD`, or `present`), optional `startDate`, `labels`, `summary`, optional `projecturl`, `image`, `published`. Body is optional.
  - `now.md`: the Now page body.
  - `published: false` or `draft: true` hides content and skips prerendering it.
- `src/lib/server/` — build-time only. `content.ts` loads markdown via `import.meta.glob` + gray-matter and exposes `listEssays`, `getEssay`, `listProjects`, `getProject`, `getNow`. `markdown.ts` is the shared markdown-it with Shiki dual-theme highlighting; ```mermaid fences pass through as `<pre class="mermaid">` for the client.
- `src/lib/data/bio.json` — JSON Resume. The home page renders `basics.label` and `basics.summary` from it; `/resume` renders the rest; the footer takes GitHub/LinkedIn URLs from `basics.profiles`. Edit the bio here, not in components.
- `src/lib/site.ts` — constants: name variants for the cycler, API URLs, Strava and tomtopia links.
- `src/lib/components/` — `Nav` (name cycler on the home page), `NowBox` (live box), `Footer`, `ThemeToggle`.
- `static/` — copied verbatim: `img/`, `CNAME`, `favicon.ico`, `robots.txt`, `.nojekyll`, `metrics.js`.
- `.github/workflows/main.yml` — `npm ci && npm run build`, upload `build/` to Pages on push to `main`.

## Behaviours Worth Knowing

- **Live box** (`NowBox.svelte`): fetches the Now Playing worker at `site.musicApi`. If `success` is false and `site.stravaApi` is set, it tries that for a last ride; otherwise it shows a quiet state. Fixed `min-height` so the page does not jump. The brat easter egg (Charli xcx, album matching /brat/i, currently playing) turns the box lime green.
- **Theme**: three-state (system / light / dark) stored in `localStorage` under `theme-preference`. `src/app.html` applies it before first paint. CSS tokens are defined on `:root`, redefined under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme='light'])`, and again under `:root[data-theme='dark']`. Style through tokens, never inside those blocks.
- **Last updated**: `+layout.server.ts` runs `git log -1 --format=%cI` at build time. Site-wide, not per page.
- **Metrics**: `static/metrics.js` beacons to the analytics worker on load and exposes `window.__metricsPageview`, which the root layout calls after client-side navigations.
- **Old Bootstrap classes** (`img-fluid`, `rounded`, `mx-auto`, `btn`, …) still appear in a few essays; `app.css` shims them under `.prose`. Prefer plain markdown for new content.
- **Fonts** are self-hosted via Fontsource packages imported in `+layout.svelte`. Do not add Google Fonts links.

## Swapping the Profile Photo

`static/img/me.jpeg` is a JPEG with an embedded HDR gain map made from the iPhone HEIC, so Safari and Chrome show it in HDR on capable displays and everything else shows the SDR base. To regenerate from a new HEIC (export it from Photos with File → Export → Export Unmodified Original):

```bash
xcrun swiftc -O -o /tmp/hdrjpeg scripts/hdrjpeg.swift
/tmp/hdrjpeg ~/Desktop/IMG_XXXX.heic static/img/me.jpeg 900 1200 0.82
```

Then update the `width`/`height` on the `<img>` in `src/routes/+page.svelte` if the aspect ratio changed. The photo frame's ratio is set in `.photo` in `app.css` (`aspect-ratio: 3 / 4`).

## Adding Content

- **Essay**: drop a markdown file in `src/content/essays/` with the front matter above and `published: true`. Images go in `static/img/<slug>/` and are referenced as `/img/<slug>/...`.
- **Project**: same in `src/content/projects/`. Leave the body empty if the project only needs a card; give it a body for a full page.
- **Now**: edit `src/content/now.md`.

## Conventions

- TypeScript, Svelte 5 runes (`$state`, `$derived`, `$props`). Tabs for indentation (Prettier defaults from the SvelteKit template).
- Keep JS optional: pages must read fine before hydration. Only the live box, name cycler, theme toggle, metrics, and mermaid need JS.
- Never commit `build/` or `.svelte-kit/`. `package-lock.json` is committed.
- Commit messages end with `With the help of Claude.` when Claude helped.
- Architecture changes go through an OpenSpec proposal first (see the managed block at the top).
