# Change: Fix Fallback Badge Contrast

## Why
Badges without tech_themes entries (fallback badges) currently bypass the contrast adjustment system, resulting in poor text contrast that violates WCAG accessibility standards. This affects multiple labels used in projects and essays that aren't defined in tech_themes.yml, including "Bioinformatics", "Data Science", "Deep Learning", "Visualization", and many others.

The contrast system works perfectly for badges with tech_themes entries, but fallback badges use inline styles with `color: inherit` or Bootstrap defaults, never receiving the contrast-adjusted colors from `contrast-utils.css`.

## What Changes
- Add global CSS rules to `css/contrast-utils.css` for all `.badge` elements
- Rules provide proper text colors for light/dark modes and standard/high contrast
- No changes needed to `_includes/badge.html` or `_plugins/contrast_filter.rb`
- Simpler solution: leverage CSS cascade instead of build-time calculations for fallback badges

## Impact
- **Affected specs**: `tech-badges` (new capability spec)
- **Affected code**:
  - `_includes/badge.html` (lines 77-90: fallback badge rendering)
  - `css/contrast-utils.css` (may need default fallback colors)
  - `_plugins/contrast_filter.rb` (may need default color constant)
- **User impact**: Improved accessibility for all badge labels, especially those without icons
- **Breaking changes**: None (visual-only fix)
