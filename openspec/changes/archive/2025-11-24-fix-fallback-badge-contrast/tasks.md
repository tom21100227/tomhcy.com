# Implementation Tasks

## 1. Implementation
- [x] 1.1 Add global `.badge` CSS rules to `contrast-utils.css`
- [x] 1.2 Define light mode text color (dark gray #212529)
- [x] 1.3 Define dark mode text color (light gray #f8f9fa)
- [x] 1.4 Define high contrast mode colors (pure black/white)
- [x] 1.5 Ensure rules don't override existing `.badge-standard-contrast` badges

## 2. Testing
- [x] 2.1 Test fallback badges in light mode (verify WCAG AA 4.5:1 contrast)
- [x] 2.2 Test fallback badges in dark mode (verify WCAG AA 4.5:1 contrast)
- [x] 2.3 Test fallback badges in high contrast mode (verify WCAG AAA 7.0:1 contrast)
- [x] 2.4 Visually verify Projects page with labels lacking tech_themes entries
- [x] 2.5 Visually verify Essays page with labels lacking tech_themes entries
- [x] 2.6 Run production build and verify contrast-utils.css generates correctly

## 3. Validation
- [x] 3.1 Run `./test-optimization.sh` to verify build succeeds
- [x] 3.2 Run browser DevTools accessibility audit
- [x] 3.3 Verify no visual regression on badges WITH tech_themes entries
