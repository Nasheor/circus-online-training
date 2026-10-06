# CIRCUS Online Training Programme — project context

**Purpose of this file:** the single source of truth for the CIRCUS online training web app in `F:\Circus\Tools`. Read it before working; **update it in the same turn as any change** to the app, its content or a decision (a Stop hook enforces this). Keep it under about 300 lines; git log holds the full history. Facts carry their source; inferences are marked *(inferred)*.

Companion file for Interreg reporting (separate purpose): `F:\Circus\CIRCUS_REPORTING_CONTEXT.md`.

## 1. The deliverable

| Item | Fact | Source |
|---|---|---|
| Project | CIRCUS, Interreg NWE 2021-2027, NWE0200304; 48 months, month 1 ≈ Jan 2024 *(inferred)* | AF p.2; reporting context |
| Deliverable | **D.3.3.1 "Online CIRCUS method training"**, Activity 3.3, due Period 8 (months 43–48) | AF p.109 |
| Owner | MTU leads; LG embeds it on the Interreg project website (D.3.4.3) | AF p.24, p.110 |
| What it must be | "A light online training developed to teach our target audience how to use the tools, tested in line with the 5 multi-day trainings" — basic introduction to Tools 1.1, 1.2, 1.3 and the participatory practice 1.4; **no certificate**; ends as "a standalone training module" | AF p.109 |
| Languages | Method **and online training** in "the four different languages of the NWE region" (D.3.5.1) — EN/FR/NL/DE *(inferred, never named)* | AF p.111 |
| Durability | Publicly available for 10 years on the Interreg site and LG/ISP sites | AF p.125 (C.8.1) |
| Budget | MTU external expertise and services: €0 → no paid hosting or services | AF p.127 |
| Audience | "Interested individuals", potential advisors/facilitators after the project; low-threshold | AF p.106, p.125 |
| Test runs | "Implemented five times", alongside the multi-day trainings (FR, BE: P5; NL, DE: P6; IE: P7) | AF p.108–109 |

## 2. Decisions made — do not re-ask

| Date | Decision |
|---|---|
| 2026-10-06 | Energy Profile calculator **fixes the Excel v1.03 bugs**; every deviation is registered and published; original xlsx stays downloadable. |
| 2026-10-06 | **English only for now, built translation-ready** for FR/NL/DE. |
| 2026-10-06 | Partner-hosted content (Nextcloud, Google Drive, QGIS Cloud) is **linked through one manifest now, bundled later**. |
| 2026-10-06 | Claude Code project setting: `permissions.defaultMode: "auto"`. |
| 2026-10-06 | Static site, no backend, no login, no cookies or analytics; all user data stays in the browser (plan approved). |

## 3. The method the app teaches

Three phases driven by the **WattWorks** conversation cards (69 cards), each wrapping one tool:

| Phase | Colour | Cards | Tool card | Tool |
|---|---|---|---|---|
| 1 Awareness | red `#C72126` | 16: Me 1–7, Neighbourhood 8–11, Tool 12, We 13–16 | p1-12 | Tool 1 Energy Profile |
| 2 Exploring Renewable Energy Opportunities | orange `#F47B20` | 11: Collectively 1–5, Tool 6, Collectively 7, Experts 8–9, Inspiration trips 10–11 | p2-6 | Tool 2 GIS |
| 3 Collaboration | green `#6BBA45` | 34: Tool 1, Key group 2–3, Goal 4–8, Group structure 9–12, Partners 13–18, Conclusion 19–22, Long-term 23–29, Resources 30–34 | p3-1 | Tool 3 Business model |
| Intro / outro | white / navy | 8: Introduction, Pack up, The End, Boost for the future 1–5 | — | — |

Five cards point to methodologies: p3-2 Persona, p3-8 SMART, p3-10 Peer to Peer, p3-13 Stakeholder Mapping, p3-25 Action Planner (content not supplied; linked to the partner Drive folder).

## 4. Architecture

- **App:** `webapp/` — Astro 7.3.6 static multi-page site, React 19 islands, TypeScript 6.0.3, plain CSS tokens, nanostores, zod 4, Vitest 5; puppeteer-core (dev only) drives the locally installed Chrome for checks. Versions pinned exactly (`.npmrc save-exact`). `F:` is exFAT: single `package.json`, no symlinks, file sizes on disk look inflated.
- **Astro rules:** Astro 7 is newer than most references — check docs.astro.build before using an Astro API. The app deliberately uses few: pages, layouts, `getStaticPaths`, `client:only` / `client:visible`, `import.meta.env.BASE_URL`. `compressHTML: true` keeps HTML whitespace semantics. No content collections, no Astro i18n routing. **`getStaticPaths` runs in its own scope**: it cannot use constants declared in the same frontmatter (import them or declare them inside).
- **No Astro imports** in `src/engine`, `src/workspace`, `src/tools` (keeps the tools portable).
- **Routing:** `src/pages/[locale]/…`; every internal link goes through `href()` / `asset()` in `src/i18n/href.ts`. Sub-path build: PowerShell `$env:BASE_PATH='/x/y/'; npm run build`; in Git Bash prefix `MSYS_NO_PATHCONV=1` (otherwise the path is rewritten to a Windows path). Verified: no link ignores the prefix.
- **Text:** all user-facing text is in `src/content/locales/en/*.ts`, assembled in `locales/en/index.ts`; `getStrings(locale)` in `src/i18n/strings.ts` merges a translation over English (`withFallback`). To add a language: create `locales/<locale>/`, register it in `TRANSLATIONS` (strings.ts) and add it to `PUBLISHED_LOCALES` (`src/i18n/config.ts`). A banner appears while a locale is partly translated.
- **Structure (locale-neutral):** `src/content/structure.ts` (phases, decks, card ids), `business.ts`, `regions.ts`, `lessons.ts`, `resources.ts` (the manifest: `local` path wins over `external` URL).
- **Workspace:** `src/workspace/` — one zod-validated JSON document in `localStorage` key `circus.workspace`, **schema version 1**, inputs and notes only (results are recomputed). Debounced save (300 ms) with flush on page hide, tab sync, backup key on import/reset, unreadable data kept aside. Any shape change needs a new version and a step in `migrate.ts`.
- **Islands** mount with `client:only="react"` when they read the workspace.
- **Printing:** `src/styles/print.css`; `PrintableTextarea` prints text in full; the canvas page injects `@page { size: A4 landscape }` and prints as one sheet.
- **Originals:** `webapp/scripts/copy-originals.mjs` copies the source files into `webapp/public/downloads/` (git-ignored) under clean names before dev/build. **The source folders `energy_profile_tool/`, `watt_works/`, `business_tool/`, `gis_tool/` are never modified.**
- **Brand assets:** `webapp/public/brand/*.png` are crops from the WattWorks manual PDF (interim, until LG supplies official files).

### Directory map
```
F:\Circus\Tools\
  CONTEXT.md  CLAUDE.md  .gitignore  .claude\settings.json  .claude\hooks\context-guard.mjs
  energy_profile_tool\  watt_works\  business_tool\  gis_tool\      (source material, read-only)
  webapp\
    scripts\   copy-originals.mjs  e2e-smoke.mjs  shot.mjs  print-check.mjs  fixtures\generate_fixtures.py
    src\engine\energy-profile\   compute.ts  assumptions.ts  deviations.ts  csv.ts  types.ts
    src\workspace\               schema.ts  create.ts  migrate.ts  store.ts  useWorkspace.ts
    src\content\                 structure.ts  business.ts  regions.ts  lessons.ts  resources.ts  locales\en\
    src\i18n\                    config.ts  href.ts  format.ts  merge.ts  strings.ts
    src\tools\                   home\  cards\  energy-profile\  map\  business\  dossier\  learn\  shared\
    src\pages\[locale]\          index  journey\  tools\  learn\  my-community  library\  about\
    src\layouts\  src\components\  src\styles\
    tests\engine\  tests\workspace\  tests\content\  tests\fixtures\energy-profile\golden.json
```

### Commands (run in `webapp/`)
| Command | Purpose |
|---|---|
| `npm run dev` | Local site at http://localhost:4321/ |
| `npm test` | 24 unit tests: engine vs Excel, workspace, content |
| `npm run check` | Type-check, including `.astro` files |
| `npm run build` | Static site in `dist/` (36 pages) |
| `npm run e2e` | Browser walkthrough of the whole journey + per-page checks; needs the dev server running and a build |
| `npm run fixtures` | Regenerate the Excel fixtures (needs Excel + pywin32) |
| `node scripts/shot.mjs en/ out.png` | Screenshot (pass paths without a leading slash in Git Bash) |

## 5. Tools: approach and state

### Tool 1 — Energy Profile (`tools/energy-profile/`)
Interactive calculator replacing the Excel 1A workbook (author LochemEnergie). Four input steps, live results, monthly chart with table, lowest/highest-month matching, scenarios with comparison, editable assumptions (including seasonality), CSV export, print, large-text mode. Reference values are **Dutch**; no country data has been invented.

Model (`compute.ts`, cell references in comments): household electricity = homes × kWh per house type; heat-pump electricity = gas m³ × 9.77 × 0.9 × share (hybrid 0.7, all-electric 1) ÷ COP 5; mobility = ROUND(cars × EV share) × 12,675.77 km × 0.175 kWh/km; solar = panels × 400 Wp × 0.88; wind = kW × 1750 h; monthly split by seasonality columns.

**Registered deviations from the workbook** (`deviations.ts`, published at `tools/energy-profile/differences/`):
| Id | Workbook behaviour | Web app |
|---|---|---|
| `residential-total-heating` | "Total usage residential" (B32) omits heat-pump electricity | Included |
| `ev-target-unset` | Empty adoption target counts as 0 % electric cars | No goal = today's share (`evShareTarget: null`) |
| `winter-month-mismatch` | On a January/December tie (always, with default seasonality) takes January's shortfall but December's solar yield | Shortfall and yield from the same month (the tied month with the lowest yield) |
| `winter-chart-double-count` | Winter chart adds existing solar twice | Counted once |

Additions not in the workbook: use today beside use with goals, coverage %, scenarios. Wind rows can be added (workbook has two).

**Verification:** `golden.json` holds 52 scenarios computed by real Excel 16.0 on a temporary copy of the workbook. Tests prove (1) with all deviations replicated the engine equals every mapped workbook cell, (2) with fixes on, only registered outputs differ and each deviation really changes something, (3) each fix against hand-worked numbers.

Tools 1B (Google Forms + Sheets) and 1C (Energy Saving Tool = MTU's BER Automation; needs API keys and a server) are described and linked only.

### WattWorks cards (`tools/cards/`)
All 69 cards as accessible HTML, text verbatim from the card PDFs. Session mode (`tools/cards/session/`): choose a deck (phase 1, 2, 3, or the end + Boost), one card at a time, note per card, skip, overview, presenting view, arrow keys. Tool cards link to the tool; `ReturnBar` on the tool pages brings the group back; items saved in the tool during the session are listed on the tool card and in the summary. Summary is printable. `?deck=p1` preselects a deck, `?session=<id>` opens one.

### Tool 2 — GIS (`tools/map/`)
Six region guides for KIT's QGIS Cloud maps. "Open the map in a new tab" is primary; the embed is **click-to-load** because qgiscloud.com sets a cookie, runs Google Analytics and Matomo, and needs third-party cookies. Layer names per region were read from each map's public `themes.json` (2026-10-06); only layers whose meaning is clear from the manual are explained. Five maps have feedback layers that write to KIT (not Bad Bergzabern). Candidate sites notebook saved in the workspace.

### Tool 3 — Business model (`tools/business-model/`)
Five steps as in the PDF: explore (12 activities in 4 groups, interest + notes, project-feedback links), draw (business model canvas, several canvases, one-sheet print), collect (13 data items in 4 categories with figure/source/note), build up (guidance only — **no financial model, by the tool's own advice**), go further (benefits, legal entity, risk). Step 1 shows the saved energy profile and candidate sites as context; it recommends nothing.

### Other sections
Home with a four-question self-check; journey pages per phase; four lessons with quick checks (`learn/`); My community (dossier, save as file, open file, restore, erase, print); Library and glossary; About, Privacy, Accessibility statement, Feedback.

### Written by MTU, not taken from partner material — needs partner review
Names of the four activity groups (the PDF's tree has icons only); plain-English house-type labels; region descriptions; the self-check questions; glossary definitions; lesson wording; the "common order" hint on the canvas.

## 6. Status

| Milestone | State |
|---|---|
| M0 Settings, context file, hook, repo, scaffold | done |
| M1 Content: phases, cards, journey, library | done |
| M2 Workspace | done |
| M3 Energy Profile engine + fixtures + tests | done |
| M4 Energy Profile interface | done |
| M5 WattWorks session mode | done |
| M6 Map explorer | done |
| M7 Business model | done |
| M8 Join-up, About pages, accessibility and print pass | done, with the limits below |

**Verified (2026-10-06):** 24 unit tests; `astro check` clean; build of 36 pages; `npm run e2e` — 23 checks: full journey (self-check → phase 1 session → tool card → profile → return → summary → site → business steps → dossier → erase → open file → foreign file refused), no script errors on any page, no sideways scroll at 360 px, one h1 per page; print output of canvas (one landscape sheet), dossier and profile.

**Not verified / known limits:**
- No screen-reader test and no automated accessibility audit (axe) yet; accessibility is by construction only.
- The embedded QGIS map was not exercised in a real browser session; the Chrome extension was not connected, so checks ran headless.
- Whether `defaultMode: "auto"` is honoured from the shared project settings file, and whether the Stop hook fires in the harness (it passes its pipe tests) — both show at the next session.
- Astro telemetry is on by default for the dev tool (`npx astro telemetry disable` turns it off; the built site sends nothing).
- Printing the Energy Profile page includes the input steps (5 pages).

## 7. Open items for partners (none block the build)

- **Hosting** and who holds it for 10 years. Recommendation: no custom domain; static host under an institutional account, linked (not iframed — storage is partitioned inside an iframe) from circus.nweurope.eu; Zenodo deposit per release.
- **LG:** official logo files and funding-statement rule.
- **Rights:** proposed MIT (code) + CC BY 4.0 (consortium content); the Nextcloud folders contain third-party material — consortium sign-off needed before bundling. Shares are publicly listable (~82 files, 177 MB). The site currently says the licence is being agreed.
- **LochemEnergie:** sign-off on the four calculation fixes (the differences page says they await confirmation); country-specific reference values.
- **KIT:** meaning of the unexplained layers (e.g. `AGRI-PV_EC1/EC2`, `APV_greater2_5`, the Emmendingen variants), long-term availability of the maps, possible data export.
- **Content needed:** five methodologies, Tools 1B/1C files, D.3.1.1 training handbook, FR/NL/DE translations and reviewers.
- **Feedback route** for the five test runs (the Feedback page currently points to the project site's contact page).

## 8. Later work (not built)

FR/NL/DE content; bundling partner files; offline service worker and portable build; public hosting and Zenodo deposit; automated accessibility tests; in-app methodology pages; facilitator track from the D.3.1.1 handbook; compact print layout for the profile.

## 9. Changelog

- 2026-10-06 — Project started; plan approved. Settings (auto mode + context-guard Stop hook), git repo, Astro scaffold.
- 2026-10-06 — Energy Profile engine verified against 52 Excel-computed scenarios; four deviations registered.
- 2026-10-06 — First complete version: home, journey, 69 cards with session mode, Energy Profile calculator, Map explorer, Business Model workspace, lessons, My community, Library, glossary, About pages. E2E walkthrough added (`npm run e2e`); print layouts checked.
