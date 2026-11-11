---
name: site-design
description: The design rules for CIRCUS online method training (webapp/). Use before ANY change to the site's layout, colours, sections or copy, for a redesign, or when the user shares a new design reference.
---

# CIRCUS online method training — design rules (the user's decisions, newest first)

Read `webapp/site-starter-kit/design/DESIGN.md` (the base design system, adapted) for the tokens and components; this file is the brief that must survive every redesign.

## Standing decisions
- **2026-11-11 — Library and Glossary approved; About pages redesigned (last batch of the page pass).**
  - `components/AboutNav.astro`: one side menu for the five pages about the site (About, Privacy, Accessibility,
    Feedback, the Energy Profile differences page), accent rule, current page marked, sticky beside the text.
  - About: project-website button in the hero; sections as hairline-divided parts, the first paragraph large; the
    links list was dropped (the side menu holds them); funding (Interreg logo on white, statement, disclaimer) and the
    eleven partners (two columns) in a band below. Funding block kept as decided 2026-11-10.
  - Privacy / Accessibility / Feedback: side menu + parts; the accessibility status as an accent pull line; feedback's
    "how to send" as an accent block with the contact button, the five questions numbered.
  - Differences: in the About menu; each change a numbered row (large red number, title), "In the Excel tool" dashed
    beside "In this calculator" on red-soft, cells below; "52" large above "How this was checked".
- **2026-11-11 — My community approved; Library and Glossary redesigned.**
  - Library: hero buttons (original files, glossary). Original files in four columns, each under a 4px rule in its
    tool's colour (WattWorks navy, Tool 1 red, Tool 2 orange, Tool 3 green), one row per file with a format label
    (PDF/XLSX, `resources.ts` format) in that colour; the link's "(PDF)" stays for screen readers only. Partner-hosted
    materials as report rows on a surface band: group heading on its colour rule at the left, links in two columns.
  - Glossary: an A–Z jump bar (letters that have terms) in the header; terms grouped under large accent letters,
    two columns of term + definition. New string `glossary.lettersLabel`.
- **2026-11-11 — Learn pages approved; My community (dossier) redesigned.**
  - Top: "About your community" and "Keep your work safe" side by side as open sections under an accent rule (no
    boxes: a framed panel around framed inputs was a nested card).
  - Journey: three phase fields with a border in the phase colour, filled in the phase colour once the group has
    ticked the phase as completed.
  - Energy profile, card sessions, candidate sites, business model: report rows, the heading at the left on a 4px
    phase-colour rule (sessions in accent), the content to the right; profile figures larger. Phones: heading above.
  - Print: A4 is narrower than the phone breakpoint, so the print rules set each part to heading-above-content and the
    journey to three fields; the dossier prints on 2 pages (was 3).
- **2026-11-11 — Business Model Tool approved; Learn pages redesigned.**
  - Overview: hero button to lesson 1; the "who it is for" paragraph large beside the no-certificate note as an
    accent-ruled pull line; the four lessons as 2 × 2 tiles in the colour of what they teach (cards navy, then red,
    orange, green): number, "Lesson n · minutes", title, intro, "Start the lesson".
  - Lesson: hero buttons (open the tool, quick check); sections numbered 01–05 in the phase colour, divided by
    hairlines; "In this lesson" contents with the same numbers, sticky below the top bar, tool button and manual under
    it (on phones the contents come first); the quick check as a phase-soft block with a 6px phase top edge, large
    questions; "All lessons" and the next lesson as large links, the next in its own colour.
- **2026-11-11 — GIS Tool pages approved; Business Model Tool pages redesigned.**
  - Overview: hero buttons (open step 1, learn); intro with the first paragraph large beside the partner documents
    under a green rule; the five steps as a route (large green numbered circles 01–05 on a line, step, summary, arrow).
  - Every step page now has the green page header (eyebrow "Step n · name", title, lead) with
    `components/BusinessSteps.astro` as a progress track: five numbered circles joined by a line, steps up to the
    current one filled (position only, never "done" ticks), the current one ringed. The header is not printed (the
    canvas stays one landscape sheet).
  - Step contents: activity groups, data categories and the three "go further" topics are open sections under a 4px
    green rule (no boxes in boxes); activities in two columns; "Build your own" as a green-ruled pull statement with
    the two partner links as rows; the "what you already know" aside sticks below the top bar. The canvas is
    unchanged. Previous/next steps as large links, next in green.
- **2026-11-11 — Energy Profile approved; GIS Tool (map) pages redesigned.**
  - `components/RegionTiles.astro`: one tile per pilot region with the country code (first part of the region id) large
    in orange, the region, its area, "n map layers · Feedback layers", "Open the guide and map"; compact variant for
    "Other regions" with the current region filled orange.
  - Overview: hero buttons (choose a region, learn); "What the maps show" with the scope as an orange-ruled pull line;
    tiles on a surface band (3 × 2); "My area is not on the list" as heading + text columns; candidate sites below.
  - Region guide: four "how to use the map" steps as numbered columns; "Questions to discuss" as a full orange band
    with the WattWorks prompts large; layers as rows (code name in orange, meaning below) beside the feedback note;
    the embed on a surface band; candidate sites; other regions as compact tiles.
  - `--measure` 68ch → 64ch site-wide (the fluid type had made lines wider). Accepted audit finding: the one-line
    photo credit on the home hero.
- **2026-11-11 — tools overview and card pages approved; Energy Profile page redesigned.**
  - Hero: four step links (numbered pills) jump to the input steps.
  - Inputs: open sections divided by hairlines (no boxes), large red step numbers, step titles are h2 (no h1→h3 skip).
  - Beside the inputs only the headline card stays in view (sticky below the top bar): large figures, a coverage bar
    (solar colour), the minor figures, the breakdown. It fits a laptop screen; before, the sticky column was taller
    than the screen and hid the chart in its own scroll box.
  - Below the inputs a full-width band: the chart (large) beside month matching and "keep or share".
  - Then scenarios and assumptions side by side; then "About this tool" and "The other parts of Tool 1" as two open
    columns. Print: the footer is hidden on paper (it is links only); the profile prints on 4 pages (was 5).
- **2026-11-11 — larger top bar** (user: the menu labels were hard to read). Menu: 16→20px fluid
  (`clamp(16px, 9.5px + 0.75vw, 20px)`), weight 600, full ink instead of muted grey, 48px targets, current item marked
  with an accent underline; tighter item padding under 1200px so it stays on one row from 1024px. Logo 44px, name
  `--t-22`, theme toggle 48px, `--bar` 64 → 76px. Fixed: the header's phone rule (`max-width: 64rem`) also applied at
  exactly 1024px, putting the menu on a second row under the sticky header; now `63.99rem`.
- **2026-11-10 — journey pages approved; tools overview and WattWorks card pages redesigned.**
  - Tools overview: one row per tool, alternating sides: number, large name, summary, a dot + "used in phase n",
    "Open the tool" filled in the phase colour; beside it the real tool screenshot (`public/home/<tool>-{dark,light}.webp`)
    on a slightly tilted block of the phase colour (cards: navy).
  - Cards page: "Run a session" = WattWorks logo + text beside four deck tiles in the deck colours (count, deck, "Start
    with these cards"); "How to use" = six numbered columns + the note as a pull line; print files as tiles with a
    deck-colour edge; all cards under a sticky deck bar (wraps on wide screens, scrolls on phones) with a full-width
    deck-colour heading per deck; long info cards in two columns on wide screens; methodologies as five hairline-topped
    columns.
  - Card session: deck choices are tiles in their deck colour, filled when chosen (no box around the form); the card
    in a running session has the printed-card look (`.theme-light`, white, deck border, shadow); the session bar
    stacks on phones.
- **2026-11-10 — home page approved; larger text; footer links centred; journey pages redesigned.**
  - Type: the user found the text too small on their laptop. `--t-12…--t-28` are now fluid (clamp, growing from about
    760px): body 16 → 18px at ≥ 1366px, phones unchanged. Do not go back to fixed kit sizes.
  - Footer: the five links are centred.
  - Journey overview: the three phases as one **route** of three deck-colour fields joined by arrows (number, name,
    audience, cards · tool, "See phase n"); the rhythm as three large numbered columns with hairlines.
  - Phase page: goal (first paragraph large) + **At a glance** (cards count, tool, lesson, the completed tick); the
    "Who it is for" panel was dropped (it repeated the hero lead). **What you do** is a card track: one chip per card
    group (range + category) on a phase-colour line, the first card's question beside it; the tool card is a full
    phase-colour band with the tool's buttons. Take-aways as ticked tiles; previous/next as large links, next in the
    next phase's colour.
  - Accepted audit finding: `.eyebrow` "long line" on hero eyebrows (block width, not text length).
- **2026-11-10 — home hero: a photograph of happy people at a community energy project + the animated energy village.**
  The user: the redesign did not read as new; the background must show "happy people representing a thriving energy
  community", and the card fan must become "something more with a zing and relevant to energy communities".
  - Photo: user chose a free-licence photo and rejected every generic Pexels/Unsplash candidate (no happy people *with*
    energy in shot; silhouettes "need a bit of happiness"). Chosen: Hepburn Wind launch 2011, members cheering under
    their turbine (Flickr, CC BY 2.0, credit shown on the photo, facts in `src/content/credits.ts`). Real community
    energy event photos are on Flickr CC (1010 Climate Action: REPOWERBalcombe, Moss Community Energy; Hepburn Wind):
    look there first, not stock sites.
  - Layout: photo anchored right/bottom with a navy fade into the text side (it is portrait, so not edge to edge); the
    hero stays dark in the light theme (`.theme-dark` scope in tokens.css). The village (`components/EnergyVillage.astro`,
    inline SVG, CSS motion) is a band along the hero's bottom over the photo's grass, scaled with the page width;
    turbines turn, pulses in the three phase colours run along the local grid, solar roofs feed it, homes draw from it.
- **2026-10-19 — no figures strip on the home hero, no Interreg logo in the header** (the user asked for both to go).
  The Interreg funding logo stays on the About page. Do not bring either back.
- **2026-11-10 — footer is the five links only** (About, Privacy, Accessibility, Feedback, CIRCUS project website).
  No wordmark, funding block, data note, version or partner logos (user request). No facilitator-notes block on the
  journey pages.
- **2026-10-19 — dark theme is "CIRCUS night", not the kit's grey.** The user: the kit's neutral dark (`#0d0e11` …) is the
  same as their previous website. Dark grounds, cards and lines are now drawn from the brand navy. Never go back to the
  kit's neutral dark values.
- **2026-10-18 — scope: whole site, landing first.** New home page in the kit's one-section-per-screen style; the kit's look (tokens, cards, type, motion) on every page; tool pages (Energy Profile, business canvas, map guide, card session) keep their working layouts. Home screenshots go to the user before the rest.
- **2026-10-18 — dark default + light toggle** (the user chose this over a light default). Toggle remembered, `?theme=light|dark` wins. Print is always light *(Claude's default, not asked)*.
- **2026-10-18 — CIRCUS colours stay, Inter replaces Montserrat.** Navy is the accent, tuned for AA in both themes; phase red / orange / green are the only other colours (they tie the site to the printed WattWorks cards).
- **2026-10-18 — port, don't rebuild.** The kit's design goes into the existing Astro app (routes, i18n, tests, print kept); the slop audit is adapted to run across the site's pages.

## How the home page is built (2026-10-18, first pass, awaiting the user's approval)
- Art direction from taste-skill: direction `colour-chapters` (seed 1720256898, `--keep palette,type`). Idea: **the three
  WattWorks deck colours become the page's chapters** — Awareness red, Exploring orange, Collaboration green, each one
  full-bleed screen with the phase's own tool card shown as the printed (light) card.
- Order: hero (two-line headline, second line sweeps in once; lead; two actions; photo + energy village since 2026-11-10, was a fan of three cards) → how it works (the talk / apply the tool / decide rhythm) → three chapters → "Where are
  you now?" self-check (the live thing) → tools index (name list + real screenshot on a disc, dark/light shots) → made to
  be used → who it is for + the CIRCUS definition → footer (links only since 2026-11-10).
- Tool screenshots are real, regenerated with `node scripts/home-shots.mjs <seed.json>` into `public/home/`.
- Kept from the kit over taste-skill where they disagree: 1px hairlines between groups, flat hairline cards, the
  sweep/count-up/rise motion. Found photographs: one, the hero (2026-11-10), credited on the photo.

## Tokens (`webapp/src/styles/tokens.css`)
- Kit scale: `--t-12…--t-hero`, `--s-4…--s-72`, `--r-6/10/14/pill`, `--bar` 64px. Inter Variable only, tabular figures.
- Dark (default, "CIRCUS night") / light: ground `#0a1428` / `#eef0f3`, card `#0f1d38` / `#fff`, card2 `#142545`, inset
  `#1a2d52`, lines `rgb(168 196 255 / .12 | .2)`; ink `#edf2fb` / `#0e1116`, muted `#a9b6cf` / `#4f5663`; accent text
  `#9dbcff` / `#17428f`, accent fill `#2f63d0` / `#17428f` (CIRCUS navy).
- Phase fields `#c72126` (white ink), `#f47b20` and `#6bba45` (dark ink); `-strong` text shades per theme.
- Legacy names (`--navy`, `--navy-deep`, `--lilac-soft`, `--phase*`) alias the semantic tokens, so every page themes.
- `.theme-light` scopes the light set to one element (printed-card look). Print always uses the light set (`print.css`).
- Theme: `public/theme.js` (sync in `<head>`): `?theme=` wins, else `localStorage['circus.theme']`, else dark.

## Brand
- Name / wordmark: CIRCUS (Interreg NWE, NWE0200304); official logo files and funding statement pending from LG
- Accent (dark / light): CIRCUS navy `#17428f`, shades for each theme tuned for AA; phases p1 `#C72126`, p2 `#F47B20`, p3 `#6BBA45`
- The mark: interim crops in `webapp/public/brand/` until LG supplies official files
- Words the site never uses: nothing from tickmarklabs.io; no invented method content (CLAUDE.md)

## Hard constraints
- Project rules in `CLAUDE.md` win: text only in locales, links via `href()` / `asset()`, `npm test` / `check` / `build` / `e2e` green.
- CSP `default-src 'self'`: no CDN, no inline `<style>`/`<script>`, fonts self-hosted (React `style` props are fine).
- Every animation off under `prefers-reduced-motion`; keyframe names unique.
- Workflow: reference image → plan with questions → build → `npm run build` → Playwright at 1440/1024/390, dark AND
  light (0 CSP violations, 0 console errors, 0 overflow) → `npm run audit` (impeccable.style/slop) → screenshots to the
  user → deploy only on approval → update DESIGN.md and this file.
- In this project: `npm run audit` (scripts/slop-audit.mjs, the kit's audit ported to puppeteer-core, eight pages ×
  1440/1024/390 × dark/light, screenshots in `webapp/audit/`). Accepted findings: uppercase card categories (as printed), infinite animations in the home hero's village (requested motion, off under reduced motion),
  button "tight line height" (min-height false positive), nav row touching the edge at 390 (it scrolls sideways).
- Design skills that help: taste-skill, web-design-guidelines, image-to-code, redesign-skill, playwright-cli.
