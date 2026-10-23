# Theme audit — October 2026

## Coverage
Reviewed CSS color declarations throughout `src` and inline styles in the reported pages. Migrated literal neutral/purple surfaces, text and borders in 69 stylesheets to shared semantic roles. Covered PDF/exam controls and summary modal; practice setup, questions, progress and results; profile and calendar controls/details; flashcards; concept pickers/popovers/suggestions; note/folder menus; study planning; media lists; authentication; settings; admin forms; and lesson feedback.

The existing app shell, note document renderer, source callout styling, curriculum navigation and code highlighting already have dedicated dark styles and were retained. Subject identity rules, calendar event palettes, progress fills and primary accent fills are intentionally preserved. Embedded PDF document pixels/native browser PDF controls are outside the app CSS; the surrounding app controls and summary modal are themed.

## Approach
`--theme-*` aliases are defined **only** in dark mode and reuse the existing `--app-*` palette. Each migrated declaration retains its exact previous light value as fallback. Shared semantic feedback colors cover success/error/warning surfaces and text. Layout, selectors and responsive rules are unchanged. A few dark-only rules provide elevation and selected/hover contrast for nested practice controls.

## Verification
- `node tests/theme-light-regression.mjs`: checks all 69 migrated stylesheets against their pre-change hashes after resolving the new fallbacks. This protects every original light-mode value and layout declaration, not just sampled screenshots.
- `/tests/theme-consistency.html`: isolated, data-free visual fixture with actual ReadOnlyNote and PdfSummaryModal components, plus actual page class structures/styles for practice, profile and calendar. Theme switch does not persist user preferences. Click **Kjør kontrasttester** for computed surface/text contrast (4.5:1), muted text contrast, light restoration and unchanged calendar subject color. Hidden controls are measured without calling application services.
- Visual checks in both themes: normal note, PDF summary modal, practice, calendar and profile. These are representative fixture checks, not an authenticated end-to-end run of every route.
- No data, database, event handlers or application TS/TSX files changed.
