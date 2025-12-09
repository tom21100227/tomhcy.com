# tech-badges Specification

## Purpose
TBD - created by archiving change fix-fallback-badge-contrast. Update Purpose after archive.
## Requirements
### Requirement: Badge Contrast Compliance
All badge components (pills/tags) rendered on Projects and Essays pages SHALL meet WCAG contrast requirements in all viewing modes.

#### Scenario: Badge with tech_themes entry in standard mode
- **GIVEN** a badge with a color defined in `_data/tech_themes.yml`
- **WHEN** rendered in standard mode (no `prefers-contrast: more`)
- **THEN** text contrast SHALL meet WCAG AA (minimum 4.5:1 ratio)

#### Scenario: Badge with tech_themes entry in high contrast mode
- **GIVEN** a badge with a color defined in `_data/tech_themes.yml`
- **WHEN** rendered with `prefers-contrast: more`
- **THEN** text contrast SHALL meet WCAG AAA (minimum 7.0:1 ratio)

#### Scenario: Fallback badge without tech_themes entry in standard mode
- **GIVEN** a badge for a label NOT defined in `_data/tech_themes.yml`
- **WHEN** rendered in standard mode (no `prefers-contrast: more`)
- **THEN** text contrast SHALL meet WCAG AA (minimum 4.5:1 ratio)

#### Scenario: Fallback badge without tech_themes entry in high contrast mode
- **GIVEN** a badge for a label NOT defined in `_data/tech_themes.yml`
- **WHEN** rendered with `prefers-contrast: more`
- **THEN** text contrast SHALL meet WCAG AAA (minimum 7.0:1 ratio)

### Requirement: Contrast System Consistency
Fallback badges SHALL use the same contrast adjustment system as badges with tech_themes entries.

#### Scenario: Fallback badge uses CSS custom properties
- **GIVEN** a badge without tech_themes entry
- **WHEN** rendered in the DOM
- **THEN** it SHALL use CSS custom properties (e.g., `--badge-fallback-standard-color`) for text color
- **AND** SHALL NOT use inline `color: inherit` or rely on Bootstrap defaults

#### Scenario: Fallback badge responds to theme changes
- **GIVEN** a fallback badge rendered on a page
- **WHEN** user switches between light mode and dark mode
- **THEN** badge text color SHALL automatically adjust via CSS custom properties
- **AND** SHALL maintain proper contrast in both modes

### Requirement: Dual-Mode Contrast Support
All badges SHALL provide separate colors for light backgrounds and dark backgrounds, calculated at build time.

#### Scenario: Badge in light theme
- **GIVEN** any badge (with or without tech_themes)
- **WHEN** rendered with `prefers-color-scheme: light`
- **THEN** SHALL use dark text on light background with proper contrast

#### Scenario: Badge in dark theme
- **GIVEN** any badge (with or without tech_themes)
- **WHEN** rendered with `prefers-color-scheme: dark`
- **THEN** SHALL use light text on dark background with proper contrast

