## REMOVED Requirements

### Requirement: Badge Contrast Compliance
**Reason**: The redesign removes tech badges entirely. Labels are rendered as plain monospace text in the page's ink/muted colours, which already meet WCAG AA against the paper background in both themes.
**Migration**: None for visitors. `_data/tech_themes.yml`, `_includes/badge.html`, `contrast_filter.rb`, and `css/contrast-utils.css` are deleted.

### Requirement: Contrast System Consistency
**Reason**: No badges, no fallback badges; the CSS custom property contrast system has nothing left to style.
**Migration**: None.

### Requirement: Dual-Mode Contrast Support
**Reason**: Superseded by the site-wide token palette (`--paper`, `--ink`, `--muted`, `--link`, `--teak`) which is defined for light, system-dark, and forced-dark in `src/app.css`.
**Migration**: None.
