# Project Context

## Purpose
Personal portfolio website showcasing research work, projects, and essays. Built to demonstrate technical expertise while maintaining high accessibility standards (WCAG AA/AAA) and optimal performance. Features custom dark mode, smart project filtering, and integration with external APIs for dynamic content.

## Tech Stack

### Core Technologies
- **Jekyll 4.3.3**: Static site generator with Liquid templating
- **Ruby**: Custom plugins for build-time processing
- **Vanilla JavaScript**: Interactive features (no frameworks)
- **CSS**: Custom contrast-aware system with CSS custom properties
- **Kramdown/Rouge**: Markdown processing and syntax highlighting

### Build & Optimization
- **GitHub Actions**: CI/CD pipeline with optimization steps
- **csso-cli**: CSS minification
- **terser**: JavaScript minification (conservative settings: `--compress --no-mangle --keep-fnames`)
- **html-proofer**: Link checking and accessibility validation
- **fastimage**: Image dimension pre-computation

### Deployment
- **GitHub Pages**: Static hosting
- **Webrick**: Local development server

## Project Conventions

### Code Style

**Liquid Templates:**
- Use semantic HTML5 elements
- Component-based includes in `_includes/` subdirectories
- Data-driven content via `_data/` YAML/JSON files
- Use Jekyll front matter for page metadata

**Ruby Plugins:**
- One responsibility per plugin file
- Provide Liquid filters and tags, not direct HTML output
- Handle errors gracefully (builds must not fail)
- Document filter usage in CLAUDE.md

**JavaScript:**
- Vanilla JS only (no frameworks/libraries unless absolutely necessary)
- ES6+ syntax acceptable
- Progressive enhancement (site must work without JS)
- Use data attributes for component configuration
- Keep files small and focused (<200 lines)

**CSS:**
- Mobile-first responsive design
- Use CSS custom properties for theming/contrast
- Avoid `!important` except for utility classes
- Component-scoped styles where possible
- Never commit minified CSS (handled by CI)

**Naming Conventions:**
- Files: `kebab-case.ext`
- CSS classes: `kebab-case`
- JavaScript functions: `camelCase`
- Data files: `snake_case.yml` or `kebab-case.json`
- Liquid variables: `snake_case`

### Architecture Patterns

**Component System:**
- Reusable components in `_includes/` (e.g., `badge.html`, `header.html`)
- Layout templates in `_layouts/` (default, home, essay, project, now, missingpage)
- Data-driven configuration via `_data/` files
- Components accept parameters via Liquid `include` syntax

**Plugin Architecture:**
- `contrast_filter.rb`: Server-side contrast calculations (WCAG compliance)
- `asset_inliner.rb`: Production build-time CSS/JS inlining
- `image_dimensions_generator.rb`: Pre-compute dimensions to prevent layout shift
- `project_sort.rb`: Custom sorting for date-based and ongoing projects
- `git_modified_date.rb`: Auto-retrieve last commit dates for content freshness

**Tech Badge System:**
- Central metadata in `_data/tech_themes.yml` (color, icon slug)
- Renders via `_includes/badge.html` with contrast adjustments
- SVG icons from SimpleIcons CDN with `<picture>` for theme switching
- Two modes: interactive (buttons with data attributes) and static (spans)
- Automatic border addition for low-contrast colors

**Project Filtering:**
- Frontend-only (no page reload)
- Parses `data-labels` attributes (pipe-delimited: `"python|pytorch|jupyter"`)
- Builds filters from available labels across all projects
- Shows buttons only for labels with >1 project, unless whitelisted in `_data/project_filter_whitelist.yml`
- Currently whitelisted: TypeScript, Cloudflare Workers, Swift
- AND matching: multiple active filters show only projects with all selected labels

**Accessibility System:**
- Dual-track contrast: Standard mode (4.5:1 WCAG AA), High contrast mode (7.0:1 WCAG AAA)
- Server-side contrast calculations preserve brand colors
- CSS custom properties for runtime adjustments (`--badge-standard-color`, etc.)
- Responds to `prefers-color-scheme` (light/dark) and `prefers-contrast: more`

### Testing Strategy

**Automated Testing:**
- `bundle exec htmlproofer ./_site`: Run after production builds to catch:
  - Broken internal/external links
  - Missing alt attributes on images
  - Invalid HTML structure
  - Accessibility violations

**Manual Testing:**
- Test dark mode and high contrast mode in multiple browsers
- Verify project filtering with various label combinations
- Check responsive design at mobile/tablet/desktop breakpoints
- Validate external API integrations (Now Playing, etc.)

**Pre-Deployment Checklist:**
1. Run `./test-optimization.sh` (clean build + verify inlining)
2. Run `bundle exec htmlproofer ./_site`
3. Visually test on mobile device
4. Check Lighthouse scores for performance/accessibility

### Git Workflow

**Branching:**
- `main`: Production branch, auto-deploys to GitHub Pages
- Feature branches: `feature/description` or `fix/description` (optional, can commit directly to main for small changes)

**Commit Conventions:**
- Descriptive messages focusing on "why" rather than "what"
- Follow existing style (see recent commits)
- Co-authored by Claude: Include this footer when commits are AI-assisted:
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

**Pull Requests:**
- Create PR with summary (1-3 bullet points) + test plan checklist
- Include link to GitHub Actions build/deploy run
- Auto-merge after checks pass (no formal review process for personal site)

**Important Git Rules:**
- NEVER commit pre-minified files
- NEVER commit `_site/` directory (ignored)
- NEVER force push to main
- NEVER skip hooks without explicit request

## Domain Context

**Accessibility-First Design:**
This project prioritizes WCAG compliance at the architecture level, not as an afterthought. The contrast system (`contrast_filter.rb` + `contrast-utils.css`) calculates optimal colors server-side to ensure all badges/buttons meet standards while preserving brand identity.

**Performance Optimization:**
The site uses a multi-stage optimization pipeline:
1. Development: Unminified CSS/JS for debugging
2. CI/CD: Minification with `csso-cli` and `terser`
3. Jekyll build: Inlining critical assets via `asset_inliner.rb` plugin
4. Deployment: Static files served from GitHub Pages CDN

**Static Site Philosophy:**
All dynamic features must work client-side (JavaScript) or build-time (Ruby plugins). No server-side runtime beyond GitHub Pages static hosting.

**Content Model:**
- **Projects**: Portfolio pieces with tech labels, dates, and optional URLs
- **Essays**: Blog posts with optional last_updated dates
- **Bio**: JSON Resume format with custom extensions
- **Now**: Current activities/interests (auto-updates timestamp via git)

## Important Constraints

**Technical:**
- Must run on GitHub Pages (Jekyll 4.x, specific plugin whitelist)
- No build step allowed in repo (optimization must happen in CI/CD)
- Static site only (no backend, no databases)
- All plugins must be in `_plugins/` directory (not gems)

**Accessibility:**
- MUST meet WCAG AA (4.5:1 contrast) in standard mode
- MUST meet WCAG AAA (7.0:1 contrast) in high contrast mode
- MUST support both light and dark themes
- MUST work without JavaScript (progressive enhancement)

**Performance:**
- Critical CSS/JS must be inlined (< 14KB combined)
- Images must have width/height attributes (prevent layout shift)
- External dependencies must be minimized

**Content:**
- All content in version control (no CMS)
- Markdown-first authoring (except bio.json and resume.html)

## External Dependencies

**CDNs:**
- **SimpleIcons CDN**: SVG icons for tech badges (e.g., `https://cdn.simpleicons.org/...`)
  - Provides theme-responsive icons via URL parameters
  - Used by `_includes/badge.html`

**External APIs:**
- **Music Status API**: Powers "Now Playing" indicator on homepage
  - Handled by `js/music-status.js`
  - Gracefully degrades if API unavailable

**Build Tools (CI/CD only):**
- **csso-cli**: CSS minification
- **terser**: JavaScript minification

**Gem Dependencies:**
- `jekyll` (~> 4.3.3): Core static site generator
- `jekyll-gist`: Embed GitHub gists
- `jekyll-redirect-from`: Handle URL redirects
- `rouge`: Syntax highlighting
- `html-proofer`: Link checking
- `webrick`: Development server
- `fastimage`: Image dimension extraction

All dependencies locked in `Gemfile.lock` and `package-lock.json`. Update conservatively to avoid breaking changes.
