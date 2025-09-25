# Repository Guidelines

## Project Structure & Module Organization
This site is a tailored TechFolios instance built with Jekyll. Global config is in `_config.yml`; `_config_dev.yml` enables dev defaults. Liquid layouts sit in `_layouts/`, composable fragments in `_includes/`, and structured data (bio, navigation, projects) in `_data/`. Markdown content lives in `essays/` and `projects/`; single pages like `now.md` and `resume.html` stay at repo root. Static assets stay in `css/`, `js/`, and `img/`. Utility scripts (`dev-server.sh`, `test-optimization.sh`) sit at repo root.

## Build, Test, and Development Commands
- `bundle install` + `npm install` (first run) pulls Ruby gems and JS optimizers.
- `./dev-server.sh` or `npm run dev` serves `http://localhost:4000` with live reload.
- `npm run build` wraps `JEKYLL_ENV=production bundle exec jekyll build` to publish `_site/`.
- `./test-optimization.sh` rebuilds clean and checks CSS/JS inlining plus file sizes.

## Coding Style & Naming Conventions
Use 2-space indentation across Liquid, HTML, YAML, and JSON. Prefer whitespace-controlled tags (`{%- ... -%}`) to avoid stray gaps. Name content files with kebab-case slugs (`essays/for-this-site.md`) and keep front matter keys snake_case. Keep CSS modular per feature (e.g. `css/contrast-utils.css`) and store JS helpers in `js/`. Run `bundle exec jekyll build` before committing to catch Liquid or data issues.

## Testing Guidelines
After a clean production build, run `bundle exec htmlproofer ./_site` to catch broken links and accessibility regressions. Run `./test-optimization.sh` when touching optimization logic to confirm inlining still passes. Preview new includes or layouts locally with real data.

## Commit & Pull Request Guidelines
Recent history favors short, imperative subjects (`Remove unused action`, `Update now page`). Keep commits single-purpose; add body text only when context is needed. Before a PR, ensure `npm run build`, `htmlproofer`, and optimization checks pass. Link affected content, include before/after screenshots for UI work, and highlight workflow or asset-pipeline changes.

## Deployment & Optimization
Deployments run from `.github/workflows/main.yml`, installing Ruby 3.4 and Node 18 before minifying with `csso` and `terser` for GitHub Pages. Avoid committing pre-minified files; let the workflow handle optimization. If asset paths change, update the workflow scan paths and flag the tweak in your PR.

## Agent Notes
- Project filters now build from `_includes/projects/projects.html`: project cards expose `data-labels` (pipe-delimited + JSON fallback) and badges pass `interactive=true` when filters are enabled. Keep both attributes in sync when editing cards.
- Filtering UI pulls tech colors through the existing contrast helpers; `css/contrast-utils.css` is loaded globally, so any new badge styles should keep the `badge-standard-contrast` variables intact.
- Buttons only render for labels with more than one project unless whitelisted via `_data/project_filter_whitelist.yml` (currently TypeScript, Cloudflare Workers, Swift). Update the list to surface single-project filters.
- `js/project-cards.js` relies on being loaded on every page; avoid moving that script tag back inside the home-page guard. Filter logic defaults to AND matching across active labels.
