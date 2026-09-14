## Context

Tom's sketch (September 14, 2026) is the authoritative layout. Palette and type carry over from the August prototype: concrete grey paper, ink, Pacific blue links, teak accent; Newsreader for text, Spline Sans Mono for labels and dates.

## Decisions

- **SvelteKit + adapter-static over Astro or plain HTML.** Tom asked for Svelte. Prerendering gives static files for Pages; components cover the name cycler, theme toggle, and live box without a framework in the content pages.
- **Markdown at build time, not mdsvex.** `import.meta.glob(..., { query: '?raw' })` + gray-matter + markdown-it + `@shikijs/markdown-it`, all in `$lib/server`. Content stays plain markdown with the same front matter as before; no Svelte inside essays. Mermaid is a lazy CDN import on the one essay that sets `mermaid: true`.
- **URL compatibility via trailing-slash rules.** Root layout sets `trailingSlash = 'never'` so `essays/[slug]` writes `essays/<slug>.html` (old Jekyll paths). `/now`, `/essays`, `/projects` set `'always'` to get `index.html` folders. `/resume` writes `resume.html`. A `404` route writes `404.html`, which Pages serves for misses.
- **Single source of bio.** Home page role and about lines render `bio.basics.label` and `bio.basics.summary` from `bio.json`; the resume renders the rest. Editing the bio means editing one file.
- **Live box states.** Music from the existing worker; if `success` is false, try `site.stravaApi` when set; else quiet. The box has a fixed min-height so the page doesn't jump.
- **"Last updated" from git.** `+layout.server.ts` runs `git log -1 --format=%cI` at build time. Falls back to build time if git is unavailable.
- **Self-hosted fonts.** Fontsource packages are bundled by Vite. Tom had already been moving off Google Fonts.
- **Old Bootstrap classes in content.** A handful of utility classes (`img-fluid`, `rounded`, `mx-auto`, `btn`, …) still appear inside older markdown; `app.css` shims them under `.prose` instead of rewriting the essays.

## Risks / Trade-offs

- Client-side routing means `metrics.js` only fires on hard loads; the layout calls `window.__metricsPageview` on `afterNavigate` to keep per-page beacons.
- `handleHttpError: 'warn'` during prerender: a broken internal link would not fail the build. Revisit to `'fail'` once content links are audited.
- Shiki bundles all grammars at build time; build is ~3 s so this is acceptable.
