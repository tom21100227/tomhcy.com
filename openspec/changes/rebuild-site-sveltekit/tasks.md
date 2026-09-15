## 1. Scaffold
- [x] 1.1 Branch `redesign-svelte`; stash the uncommitted Jekyll theme edits on main
- [x] 1.2 SvelteKit 2 + adapter-static + TypeScript; Vite 8; fonts via Fontsource
- [x] 1.3 Remove Jekyll: `_layouts`, `_includes`, `_plugins`, `_config*.yml`, `Gemfile`, `css/`, `js/`, root pages, dev scripts

## 2. Content migration
- [x] 2.1 Move essays, projects, now.md to `src/content/`; `bio.json` to `src/lib/data/`; images and static files to `static/`
- [x] 2.2 Normalise image paths to `/img/...`; strip `{% raw %}` wrappers
- [x] 2.3 Build-time markdown pipeline (gray-matter, markdown-it, Shiki dual theme, mermaid fence passthrough)

## 3. Pages
- [x] 3.1 Home: nav, photo, bio from `bio.json`, live box, rule, footer links, last-updated, note
- [x] 3.2 Now, Thoughts (essays), Tinkering (projects) index pages and detail pages
- [x] 3.3 Resume from `bio.json`
- [x] 3.4 404 page
- [x] 3.5 Trailing-slash rules so old `.html` URLs and `/now/` keep working

## 4. Little things
- [x] 4.1 Name cycler on the home page brand link
- [x] 4.2 Theme toggle (system / light / dark) with pre-paint script
- [x] 4.3 Live box: music → ride → quiet, brat easter egg, pulsing art when playing
- [x] 4.4 Site-wide "Last updated" from git at build time
- [x] 4.5 Visitor metrics beacon incl. client-side navigations
- [x] 4.6 Hidden LLM opt-out notice in the footer

## 5. Ship
- [x] 5.1 GitHub Actions: `npm ci && npm run build` → Pages
- [x] 5.2 Update CLAUDE.md, README.md, openspec/project.md
- [x] 5.3 Tom reviews on the dev server; iterate
- [ ] 5.4 Merge to main; confirm deploy; spot-check old URLs
- [ ] 5.5 Follow-ups: Strava endpoint + profile URL; prune unused `static/img` assets
