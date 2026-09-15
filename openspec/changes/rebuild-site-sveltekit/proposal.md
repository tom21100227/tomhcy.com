# Change: Rebuild tomhcy.com on SvelteKit, drop the TechFolios/Jekyll template

## Why

The Jekyll + TechFolios + Bootstrap stack had grown a lot of machinery (badge contrast filters, card filtering, asset inlining, CSS/JS minification in CI) to serve a card-heavy layout Tom no longer wants. The new design is a one-screen landing page from Tom's September 14, 2026 hand sketch: nav, photo, two-line bio, a live "what's on" box, a rule, footer links, and a note. Content lives one click away. A small SvelteKit app prerendered to static HTML is a better fit: no Ruby toolchain, one language, first-class components for the few interactive bits, and a fast build.

## What Changes

- **BREAKING** Replace Jekyll with SvelteKit 2 + `adapter-static`. Every route is prerendered; GitHub Pages keeps serving plain files.
- **BREAKING** Remove Bootstrap, the TechFolios theme, tech badges, project card filtering, the asset inliner, the contrast filter plugins, and the CSS/JS minify steps in CI.
- New home page per the sketch. Nav labels are `Tom Han · Now · Thoughts · Tinkering`; URLs stay `/`, `/now/`, `/essays/`, `/projects/`.
- Detail pages build with `trailingSlash: 'never'` so they land at `essays/<slug>.html` and `projects/<slug>.html`, matching the old Jekyll URLs. Index pages use `'always'` for folder indexes.
- Markdown content (`src/content/**`) is rendered at build time with markdown-it + Shiki dual themes; ```mermaid fences are rendered client-side only on essays that opt in.
- The Now Playing indicator becomes a swappable box: music first, then (when a Strava endpoint exists) the last ride, else a quiet state. Brat easter egg preserved.
- Fonts are self-hosted via Fontsource (Newsreader, Spline Sans Mono); no external font requests.
- Resume renders from `bio.json` as before. Name cycler, theme toggle, site-wide "Last updated" (from git), visitor metrics beacon, and the hidden LLM opt-out notice are all carried over. Tagline cycler and animated profile icons are dropped.
- Deploy workflow becomes `npm ci && npm run build` → upload `build/` to Pages.

## Impact

- Affected specs: `footer` (modified), `tech-badges` (removed), new `site-shell`.
- Affected code: everything. Jekyll files (`_layouts`, `_includes`, `_plugins`, `_config*.yml`, `css/`, `js/`, `Gemfile`) are deleted. Content moves to `src/content/`, `bio.json` to `src/lib/data/`, images to `static/img/`.
- Unpublished essays and projects (`published: false` / `draft: true`) are not prerendered, same as before.
- Open follow-ups: Strava endpoint on the worker, the real Strava profile URL in `src/lib/site.ts`, and pruning `static/img` of assets only the old theme used (bootstrap-icons.svg, profile-icons/).
