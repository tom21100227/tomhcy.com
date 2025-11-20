# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Jekyll, based on the TechFolios template. The site features custom enhancements including dark mode, accessibility-aware contrast system, smart project filtering, performance optimizations, and integration with external APIs (Now Playing indicator).

## Build & Development Commands

**Initial setup:**
```bash
bundle install
npm install
```

**Development server:**
```bash
./dev-server.sh
# or
npm run dev
```
Serves site at `http://localhost:4000` with live reload and incremental builds. Uses both `_config.yml` and `_config_dev.yml`.

**Production build:**
```bash
npm run build
# or
JEKYLL_ENV=production bundle exec jekyll build
```
Output goes to `_site/` directory.

**Test optimization pipeline:**
```bash
./test-optimization.sh
```
Performs clean production build and verifies CSS/JS inlining works correctly.

**Link checking:**
```bash
bundle exec htmlproofer ./_site
```
Run after production build to catch broken links and accessibility issues.

## Architecture & Key Systems

### Jekyll Structure
- `_config.yml` / `_config_dev.yml`: Site configuration (dev config overlays base config)
- `_data/`: Structured data (bio.json, tech_themes.yml, profile_icons.yml, project_filter_whitelist.yml)
- `_layouts/`: Page templates (default, home, essay, project, now, missingpage)
- `_includes/`: Reusable components (header, footer, badge, plus subdirectories for about/, essays/, projects/)
- `_plugins/`: Custom Jekyll plugins (see below)
- Content: `essays/` and `projects/` contain markdown files; `now.md` and `resume.html` live at repo root

### Custom Jekyll Plugins (`_plugins/`)

**contrast_filter.rb:**
Liquid filters that ensure badge colors meet WCAG contrast requirements. Provides separate filters for:
- Standard contrast (4.5:1) and high contrast (7.0:1) modes
- Light background and dark background variants
- Used by `_includes/badge.html` to dynamically adjust tech badge colors

**asset_inliner.rb:**
Inlines critical CSS/JS into HTML during production builds to eliminate render-blocking resources. Works in tandem with GitHub Actions optimization step.

**image_dimensions_generator.rb:**
Pre-computes image dimensions and generates data files to avoid layout shift.

**project_sort.rb:**
Custom sorting logic for projects that handles both date-based and ongoing projects.

**git_modified_date.rb:**
Automatically retrieves the last git commit date for files and adds it to page/document data. Used by the now page to display when the content was last updated without manual date maintenance. The plugin:
- Runs git log commands to get file modification dates
- Exposes `git_modified_date` in page.data for use in layouts
- Provides Liquid filters: `git_modified_date` and `git_modified_date_format` for manual use
- Formats dates as "Month Day, Year" (e.g., "September 23, 2025")

### Tech Badge System (`_includes/badge.html`)

Sophisticated badge component that:
- Looks up technology metadata from `_data/tech_themes.yml` (color, icon slug)
- Renders SVG icons via SimpleIcons CDN with `<picture>` elements for theme-responsive icons
- Applies dynamic contrast adjustments using CSS custom properties
- Supports two modes:
  - `interactive=false` (default): renders `<span>` badges
  - `interactive=true`: renders `<button>` badges with data attributes for filtering
- Automatically adds borders to low-contrast colors for accessibility

### Project Filtering System

**Frontend (`js/project-cards.js`):**
- Parses `data-labels` attributes (pipe-delimited string or JSON array fallback) from project cards
- Builds filter buttons from available tech labels across all projects
- Only shows filter buttons for labels with >1 project, unless whitelisted in `_data/project_filter_whitelist.yml`
- Currently whitelisted: TypeScript, Cloudflare Workers, Swift
- Implements AND matching: activating multiple filters shows only projects with all selected labels
- Runs on every page (script tag must stay global; don't move inside home-page-only guard)

**Styling:**
- Filter buttons use the same contrast-aware badge system
- `css/contrast-utils.css` is loaded globally and provides CSS custom properties (`--badge-standard-color`, etc.)
- New badge styles must preserve these variables

### Dark Mode & Accessibility

The site implements dual-track contrast compliance:
- **Standard mode**: 4.5:1 contrast ratio (WCAG AA) with brand color preservation
- **High contrast mode**: 7.0:1 contrast ratio (WCAG AAA) via `prefers-contrast: more` media query
- Both modes work in light and dark themes via `prefers-color-scheme`
- Contrast adjustments calculated server-side by `contrast_filter.rb` and applied via CSS custom properties

### Performance Optimization Pipeline

**GitHub Actions (`.github/workflows/main.yml`):**
1. Minifies all CSS files with `csso-cli`
2. Minifies all JS files with `terser` (conservative settings: `--compress --no-mangle --keep-fnames`)
3. Runs Jekyll build with `JEKYLL_ENV=production`
4. Jekyll plugins inline critical assets into HTML
5. Deploys to GitHub Pages

**Important:** Never commit pre-minified files. The workflow handles optimization. If you modify asset paths or add new CSS/JS directories, update the workflow's `find` commands accordingly.

## Content Structure

**Projects (`projects/*.md`):**
- Front matter includes: title, date, labels (tech stack), summary, projecturl, optional published_url
- `date` field supports both completed dates and "Present" for ongoing work
- `labels` array drives the tech badge display and filtering system

**Essays (`essays/*.md`):**
- Front matter includes: title, date, optional last_updated, type ("essay")
- Essays with updates show "Last Updated" badge

**Bio (`_data/bio.json`):**
- JSON Resume format with custom extensions
- Includes basics, interests, skills, work, education, volunteer, awards, references

## Common Development Patterns

**Adding a new technology badge:**
1. Add entry to `_data/tech_themes.yml` with color (hex) and icon (SimpleIcons slug)
2. Badge will automatically render with appropriate contrast adjustments
3. If it should appear in filters for single-project use, add to `_data/project_filter_whitelist.yml`

**Editing project cards:**
When modifying `_includes/projects/projects.html`, ensure:
- Project cards expose `data-labels` attribute (pipe-delimited format: `"python|pytorch|jupyter"`)
- Interactive badges pass `interactive=true` parameter
- Both attributes must stay synchronized

**Testing changes:**
1. Run `./dev-server.sh` for quick iteration with live reload
2. Before committing major changes, run production build and verify optimization: `./test-optimization.sh`
3. For link/accessibility checks: `npm run build && bundle exec htmlproofer ./_site`

## Important Files

- `css/contrast-utils.css`: Global CSS custom properties for contrast system
- `css/profile-icons.css` + `js/profile-icons.js`: Animated profile picture icons
- `js/music-status.js`: Now Playing API integration
- `js/name-cycler.js`: Name cycling interaction
- `_data/profile_icons.yml`: Configuration for profile icons rotation
