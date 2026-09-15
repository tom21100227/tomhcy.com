# Project Context

## Purpose
Tom Han's personal website: a one-screen landing page (nav, photo, bio, live "what's on" box, footer) with a Now page, essays, projects, and a resume behind it. The site should be fast, quiet, and typographically careful, and keep working without JavaScript apart from the live box and small toys.

## Tech Stack

- **SvelteKit 2** with **Svelte 5** (runes) and **TypeScript**
- **@sveltejs/adapter-static**: every route prerendered to `build/`
- **Vite 8**
- **markdown-it + gray-matter + Shiki** (`@shikijs/markdown-it`): markdown rendered at build time in `src/lib/server`
- **Fontsource**: self-hosted Newsreader (variable) and Spline Sans Mono
- **GitHub Actions → GitHub Pages**: `npm ci && npm run build`, upload `build/`

## Project Conventions

### Code Style
- TypeScript everywhere; Svelte 5 runes (`$state`, `$derived`, `$props`), no legacy stores unless needed.
- Tabs for indentation; single quotes; Prettier defaults from the SvelteKit template.
- CSS lives in `src/app.css` and is written against design tokens (`--paper`, `--ink`, `--muted`, `--rule`, `--link`, `--teak`, `--serif`, `--mono`). Components use global classes from `app.css`; add component-scoped styles only for one-off details.
- Files: `kebab-case` for content and static assets; SvelteKit's `+page.svelte` conventions for routes; `PascalCase.svelte` for components.

### Architecture Patterns
- **Build-time content**: `src/lib/server/content.ts` reads `src/content/**/*.md` via `import.meta.glob` (`?raw`), parses front matter, renders HTML. Routes call it from `+page.server.ts` and pass HTML to `{@html}`. `$lib/server` never ships to the client.
- **URL stability**: root `trailingSlash = 'never'` (detail pages build to `<slug>.html`); index pages set `'always'`. This mirrors the Jekyll site's URLs.
- **Single source of bio**: `src/lib/data/bio.json` (JSON Resume). Home page, footer, and resume all read from it.
- **Theming**: token redefinition under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme='light'])`, and under `:root[data-theme='dark']`. `src/app.html` applies the saved theme before first paint.
- **Live box**: `NowBox.svelte` cascades music → ride → quiet, fixed min-height, brat easter egg.

### Testing Strategy
- `npm run check` must report 0 errors.
- `npm run build` must succeed with no prerender warnings; inspect `build/` paths when routes change.
- Manual: light/dark/system themes, phone width (~400px), the live box in all states, old `.html` URLs after deploy.

### Git Workflow
- `main` deploys. Feature work on branches (e.g. `redesign-svelte`).
- Commit messages: why over what. When Claude helped, end with `With the help of Claude.`
- Never commit `build/` or `.svelte-kit/`. `package-lock.json` is committed.
- Never force-push `main`.

## Domain Context
- **Content model**: essays (`title`, `date`, `last_updated`, `labels`, `published`, `mermaid`), projects (`title`, `date`/`startDate` incl. `present`, `labels`, `summary`, `projecturl`, `image`, `published`), `now.md`, `bio.json`.
- **Little things** Tom wants kept: name cycler, theme toggle, Now Playing box, "Last updated" from git, hidden LLM opt-out notice, brat easter egg. Dropped in the 2026 redesign: tagline cycler, animated profile icons, tech badges, project filtering.

## Important Constraints
- Static hosting only (GitHub Pages). No runtime server; dynamic data comes from Cloudflare Workers Tom runs separately (Now Playing, analytics, future Strava).
- No external font requests; keep third-party requests to the workers and, on demand, the mermaid CDN.
- Keep old URLs resolving: `/essays/<slug>.html`, `/projects/<slug>.html`, `/now/`, `/resume.html`.
- Both themes must stay legible; contrast of text on paper ≥ WCAG AA.

## External Dependencies
- **Now Playing worker**: `https://music-api.tomhcy.workers.dev/` → `{ success, isPlaying, title, artist, album, source, songUrl, albumImageUrl }`
- **Analytics worker**: `https://analytics.tomhcy.workers.dev/collect` (beacon from `static/metrics.js`)
- **Mermaid** (CDN, lazy): only on essays with `mermaid: true`
- **Strava** (planned): endpoint URL goes in `src/lib/site.ts` as `stravaApi`
