# site-shell Specification

## Purpose
The one-screen home page from the September 2026 sketch and the static-output contract that keeps the old Jekyll URLs resolving.

## Requirements
### Requirement: One-Screen Home Page
The home page SHALL follow Tom's September 2026 sketch: a four-item nav, a photo beside a two-line bio, a live box under the bio, a rule, a footer row, and a closing note.

#### Scenario: Desktop layout
- **WHEN** the home page renders at 640px or wider
- **THEN** the nav reads `Tom Han · Now · Thoughts · Tinkering`
- **AND** the photo occupies the left column spanning both the bio row and the live-box row
- **AND** the bio's role and about lines come from `bio.basics.label` and `bio.basics.summary` in `bio.json`

#### Scenario: Phone layout
- **WHEN** the home page renders narrower than 640px
- **THEN** the photo, bio, and live box stack in one column
- **AND** the page never scrolls horizontally

#### Scenario: Name cycler
- **WHEN** a visitor clicks the name in the nav while on the home page
- **THEN** the name cycles through `Tom Han`, `Tom Han Chongye`, `Chongye Han`, `韩重烨` and the document title follows
- **AND** on any other page the same link simply navigates home

### Requirement: Live Box
The home page SHALL show a single swappable box that reflects what Tom is doing right now, without shifting the layout while it loads.

#### Scenario: Music playing or recently played
- **WHEN** the Now Playing worker returns `success: true`
- **THEN** the box shows the album art, "Now playing" or "Recently played", the track linked to `songUrl`, the artist, album, and source
- **AND** the art pulses only while `isPlaying` is true and the visitor has not requested reduced motion

#### Scenario: Nothing playing, ride available
- **WHEN** the worker returns `success: false` and a Strava endpoint is configured and returns a ride
- **THEN** the box shows "Nothing playing · last ride" with the ride name, distance, moving time, and elevation

#### Scenario: Nothing at all
- **WHEN** neither music nor a ride is available
- **THEN** the box shows a quiet state ("Nothing playing right now.") rather than an error

#### Scenario: brat
- **WHEN** the current track is playing, the album matches /brat/i and the artist matches /charli\s*xcx/i
- **THEN** the box turns #8ACE00 with black lowercase Arial text

### Requirement: Static Output With Stable URLs
The site SHALL build to static files whose paths match the URLs the Jekyll site published.

#### Scenario: Detail pages
- **WHEN** the site is built
- **THEN** each published essay exists at `essays/<slug>.html` and each published project at `projects/<slug>.html`
- **AND** unpublished (`published: false` or `draft: true`) content is not emitted

#### Scenario: Index pages and now page
- **WHEN** the site is built
- **THEN** `essays/index.html`, `projects/index.html`, `now/index.html`, `resume.html`, `index.html`, and `404.html` exist

#### Scenario: No external font requests
- **WHEN** any page loads
- **THEN** Newsreader and Spline Sans Mono are served from the site's own `_app/immutable/assets`

