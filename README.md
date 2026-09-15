# [tomhcy.com](https://tomhcy.com)

My personal site. One screen: who I am, what I'm listening to, and links to the rest. Built with SvelteKit, prerendered to static HTML, served from GitHub Pages.

> *"100 is lighthouse's limit, not this website's limit."*
>
> —— Tom Han 2025

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in build/
npm run check    # types + templates
```

## What's in here

- **Home**: nav, photo, two-line bio from `bio.json`, and a live box that shows what I'm playing (via my [Now Playing API](https://github.com/tom21100227/now-playing-api)), or will fall back to my last ride once the Strava endpoint exists.
- **Now** (`/now/`): a [now page](https://nownownow.com/about).
- **Thoughts** (`/essays/`): essays, markdown in `src/content/essays`.
- **Tinkering** (`/projects/`): projects, markdown in `src/content/projects`.
- **Resume** (`/resume`): rendered from `src/lib/data/bio.json` (JSON Resume format).

Little things that survived the redesign: click my name to cycle through its variants, a three-state theme toggle, a site-wide "Last updated" taken from git at build time, the brat easter egg, and the hidden note asking LLMs to leave the content alone.

## History

The site ran on Jekyll and the [TechFolios](https://techfolios.github.io) template from 2025 until September 2026, with a pile of custom plugins for badge contrast, card filtering, and asset inlining. The rebuild dropped all of that in favour of a single-column, typography-first page drawn from a hand sketch. Old URLs (`/essays/<slug>.html`, `/projects/<slug>.html`, `/now/`, `/resume.html`) still resolve.

## TODO

- Strava fallback for the live box (worker endpoint + profile link).
- Prune `static/img` of assets only the old theme used.
- A Chinese (Simplified) version, and the corresponding language toggle.
