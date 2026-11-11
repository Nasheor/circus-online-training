# CIRCUS Online Training Programme — project context

**Purpose of this file:** the single source of truth for the CIRCUS online training web app in `D:\Circus\Tools` (on `F:` on the first machine, where the 2026-10-18 redesign was done). Read it before working; **update it in the same turn as any change** to the app, its content or a decision (a Stop hook enforces this). Keep it under about 300 lines; git log holds the full history. Facts carry their source; inferences are marked *(inferred)*.

Companion file for Interreg reporting (separate purpose): `D:\Circus\CIRCUS_REPORTING_CONTEXT.md`.

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
| 2026-10-18 | **Redesign** on the user's site starter kit, ported into Astro (no rebuild). CIRCUS navy + phase colours kept, Inter replaces Montserrat, **dark default** with light toggle; whole site, home page first; tool layouts kept. Brief: `.claude/skills/site-design/SKILL.md`. |
| 2026-10-19 | Dark theme changed to **"CIRCUS night"** (grounds from the brand navy, `#0a1428` …): the kit's neutral dark matched the user's previous website. Light theme unchanged. |
| 2026-10-19 | Home hero has **no figures strip** (69 / 3 / 3 / 0) and the header has **no Interreg logo**; the funding logo stays on About (footer: see 2026-11-10). |
| 2026-11-10 | **Footer = five links only** (About, Privacy, Accessibility, Feedback, CIRCUS project website): wordmark, Interreg logo, funding statement, disclaimer, data note, version and partner logos removed. **Journey pages: the "Notes for whoever leads the session" block removed** (overview and each phase). Interreg logo, funding statement and disclaimer remain on About and on the canvas printout. |
| 2026-11-10 | Home hero = **photo of a cheering community energy group** (Hepburn Wind launch 2011, Flickr CC BY 2.0, credited on the photo) **+ animated energy village** (SVG) in place of the card fan. Generic stock photos were rejected by the user. |
| 2026-11-11 | **Redesign approved, committed and merged into `master`** (`5b368c2`). |
| 2026-11-11 | **Library and Glossary approved**; About pages redesigned with one shared side menu; the stale "version at the bottom of every page" sentence removed from Feedback. |
| 2026-11-11 | **My community approved**; Library (tool-coloured file columns) and Glossary (A–Z, letter groups) redesigned. |
| 2026-11-11 | **Learn approved**; My community laid out as a dossier (report rows on phase-colour rules; completed phases filled). |
| 2026-11-11 | **Business Model Tool approved**; Learn pages redesigned (coloured lesson tiles, numbered lesson sections). |
| 2026-11-11 | **GIS Tool approved**; Business Model Tool redesigned (green header with a step progress track on every step). |
| 2026-11-11 | **Energy Profile approved**; GIS Tool pages redesigned (region tiles with country codes, orange prompts band). |
| 2026-11-11 | **Tools overview and card pages approved.** Energy Profile: only the headline card stays in view beside the inputs; the chart moves to a full-width band below them. |
| 2026-11-11 | **Top bar larger** (menu labels up to 20px, bold, full contrast; header 76px). |
| 2026-11-10 | **Journey pages approved**; tools overview, cards page and card session redesigned (see the site-design brief). |
| 2026-11-10 | **Home page approved.** Text sizes made fluid site-wide (body 18px on laptops; user found 16px too small); footer links centred. Journey pages redesigned (route of three phase fields; phase page with At a glance + card track). |
| 2026-10-06 | Static site, no backend, no login, no cookies or analytics; all user data stays in the browser (plan approved). |
| 2026-11-11 | **Test deployment on GitHub Pages** from a **public** repo `Nasheor/circus-online-training` (whole repo, partner source folders and history included — user's choice, knowing rights are not yet signed off), partner downloads included, preview builds `noindex`. Not the final 10-year host (section 7). |

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

- **App:** `webapp/` — Astro 7.3.6 static multi-page site, React 19 islands, TypeScript 6.0.3, plain CSS tokens, nanostores, zod 4, Vitest 5; puppeteer-core (dev only) drives the locally installed Chrome for checks. Versions pinned exactly (`.npmrc save-exact`). The project drive is exFAT: single `package.json`, no symlinks, file sizes on disk look inflated.
- **Astro rules:** Astro 7 is newer than most references — check docs.astro.build before using an Astro API. The app deliberately uses few: pages, layouts, `getStaticPaths`, `client:only` / `client:visible`, `import.meta.env.BASE_URL`. `compressHTML: true` keeps HTML whitespace semantics. No content collections, no Astro i18n routing. **`getStaticPaths` runs in its own scope**: it cannot use constants declared in the same frontmatter (import them or declare them inside).
- **No Astro imports** in `src/engine`, `src/workspace`, `src/tools` (keeps the tools portable).
- **Routing:** `src/pages/[locale]/…`; every internal link goes through `href()` / `asset()` in `src/i18n/href.ts`. Sub-path build: PowerShell `$env:BASE_PATH='/x/y/'; npm run build`; in Git Bash prefix `MSYS_NO_PATHCONV=1` (otherwise the path is rewritten to a Windows path). Verified: no link ignores the prefix.
- **Text:** all user-facing text is in `src/content/locales/en/*.ts`, assembled in `locales/en/index.ts`; `getStrings(locale)` in `src/i18n/strings.ts` merges a translation over English (`withFallback`). To add a language: create `locales/<locale>/`, register it in `TRANSLATIONS` (strings.ts) and add it to `PUBLISHED_LOCALES` (`src/i18n/config.ts`). A banner appears while a locale is partly translated.
- **Structure (locale-neutral):** `src/content/structure.ts` (phases, decks, card ids), `business.ts`, `regions.ts`, `lessons.ts`, `resources.ts` (the manifest: `local` path wins over `external` URL), `credits.ts` (third-party photos and their licence credits).
- **Workspace:** `src/workspace/` — one zod-validated JSON document in `localStorage` key `circus.workspace`, **schema version 1**, inputs and notes only (results are recomputed). Debounced save (300 ms) with flush on page hide, tab sync, backup key on import/reset, unreadable data kept aside. Any shape change needs a new version and a step in `migrate.ts`.
- **Islands** mount with `client:only="react"` when they read the workspace.
- **Design (2026-10-18 redesign):** tokens after the user's site starter kit (`webapp/site-starter-kit/`, untracked) in `src/styles/tokens.css`; **dark default**, light via `public/theme.js` (sync in `<head>`; `?theme=` wins, else `localStorage['circus.theme']`); legacy token names alias the semantic ones; `.theme-light` scopes light to one element; Inter Variable. Motion in `src/scripts/motion.ts` (rise-in, count-up; nothing hidden before it runs; off under reduced motion). Brief and decisions: `.claude/skills/site-design/SKILL.md`.
- **Printing:** `src/styles/print.css` (always the light token set); `PrintableTextarea` prints text in full; the canvas page injects `@page { size: A4 landscape }` and prints as one sheet.
- **Originals:** `webapp/scripts/copy-originals.mjs` copies the source files into `webapp/public/downloads/` (git-ignored) under clean names before dev/build. **The source folders `energy_profile_tool/`, `watt_works/`, `business_tool/`, `gis_tool/` are never modified.**
- **Brand assets:** `webapp/public/brand/*.png` are crops from the WattWorks manual PDF (interim, until LG supplies official files).

- **Test deployment:** `.github/workflows/pages.yml` — on push to `master` (or manual run): `npm ci`, `npm test`, build with `BASE_PATH=/<repo name>/` and `NOINDEX=1`, deploy `webapp/dist` with `actions/deploy-pages`. Site: https://nasheor.github.io/circus-online-training/ . Downloads come from the tracked source folders via `copy-originals.mjs`. On a project sub-path a `robots.txt` has no effect, hence the meta tag.

### Directory map
```
D:\Circus\Tools\
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
| `npm run audit [-- <paths>]` | The kit's impeccable.style/slop audit (puppeteer-core): 8 pages × 1440/1024/390 × dark/light, report + screenshots in `audit/` (git-ignored) |
| `node scripts/home-shots.mjs <seed.json>` | Regenerate the home page's tool screenshots (`public/home/`); seed from `KEEP_WORKSPACE=<file> npm run e2e` |
| `NOINDEX=1 BASE_PATH=/x/ npm run build` | Preview build: adds `<meta name="robots" content="noindex, nofollow">` to every page (`Base.astro`, `pages/index.astro`) |
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
| M10 Test deployment (GitHub Pages) | see the changelog line of 2026-11-11 for its outcome |
| M9 Redesign on the site starter kit (`webapp/site-starter-kit/`, brief in `.claude/skills/site-design/SKILL.md`) | **done** — every page redesigned and approved (2026-11-11); committed as `5b368c2` and merged into `master` (fast-forward; branch `redesign/site-starter-kit` kept; no remote) |

**Verified (2026-10-06):** 24 unit tests; `astro check` clean; build of 36 pages; `npm run e2e` — 23 checks: full journey (self-check → phase 1 session → tool card → profile → return → summary → site → business steps → dossier → erase → open file → foreign file refused), no script errors on any page, no sideways scroll at 360 px, one h1 per page; print output of canvas (one landscape sheet), dossier and profile.

**Verified (2026-10-18, redesign, against `astro preview` on port 4400):** 24 tests; check clean; 36 pages; e2e 23/23 (304 from the preview server now accepted); `npm run audit` on 8 pages: 0 overflow, 0 console errors, 0 low contrast, 0 hidden at load; remaining findings are the accepted ones in the brief plus, on tool pages, nested cards, long lines and one heading skip (Energy Profile h1 → h3), left for the page-by-page pass. Not run: taste-skill `inspect.mjs`; no strict-CSP test (Astro islands use inline bootstrap scripts).

**Not verified / known limits:**
- No screen-reader test and no automated accessibility audit (axe) yet; accessibility is by construction only.
- The embedded QGIS map was not exercised in a real browser session; the Chrome extension was not connected, so checks ran headless.
- Whether `defaultMode: "auto"` is honoured from the shared project settings file, and whether the Stop hook fires in the harness (it passes its pipe tests) — both show at the next session.
- Astro telemetry is on by default for the dev tool (`npx astro telemetry disable` turns it off; the built site sends nothing).
- Printing the Energy Profile page includes the input steps (4 pages since 2026-11-11).
- Redesign: the home headline takes 3 lines at 390 px; the tool pages carry the new tokens but not yet their own redesign; print re-checked after the port for the canvas only (one light landscape sheet, white paper), not yet the dossier or profile.

## 7. Open items for partners (none block the build)

- **Hosting** and who holds it for 10 years. Recommendation: no custom domain; static host under an institutional account, linked (not iframed — storage is partitioned inside an iframe) from circus.nweurope.eu; Zenodo deposit per release.
- **LG:** official logo files and funding-statement rule.
- **EU visibility check:** with the funding block gone from the footer, only About carries the Interreg logo, funding statement and disclaimer. Confirm with LG / the NWE programme that this meets the visibility rules for project outputs, or bring a compact funding line back.
- **Home hero photo:** a CIRCUS event photo (with consent of the people shown) would be better than the Australian Hepburn Wind photo; it is a one-file swap (`credits.ts` + `public/home/`).
- **Rights:** proposed MIT (code) + CC BY 4.0 (consortium content); the Nextcloud folders contain third-party material — consortium sign-off needed before bundling. Shares are publicly listable (~82 files, 177 MB). The site currently says the licence is being agreed.
- **LochemEnergie:** sign-off on the four calculation fixes (the differences page says they await confirmation); country-specific reference values.
- **KIT:** meaning of the unexplained layers (e.g. `AGRI-PV_EC1/EC2`, `APV_greater2_5`, the Emmendingen variants), long-term availability of the maps, possible data export.
- **Content needed:** five methodologies, Tools 1B/1C files, D.3.1.1 training handbook, FR/NL/DE translations and reviewers.
- **Feedback route** for the five test runs (the Feedback page currently points to the project site's contact page).

## 8. Later work (not built)

FR/NL/DE content; bundling partner files; offline service worker and portable build; public hosting and Zenodo deposit; automated accessibility tests; in-app methodology pages; facilitator track from the D.3.1.1 handbook; compact print layout for the profile.

## 10. Resuming the next session

**State at the end of the 2026-11-10 session (redesign, M9, F: machine):**
- **Done this session (user requests):** (1) home hero rebuilt: Hepburn Wind photo (cheering members under their turbine, Flickr CC BY 2.0, credited on the photo; `src/content/credits.ts`, `public/home/hero-hepburn.webp`) with a navy fade, and the animated energy village `src/components/EnergyVillage.astro` instead of the card fan; `.theme-dark` scope in `tokens.css` keeps the hero dark in the light theme. (2) Footer reduced to five links. (3) Facilitator-notes block removed from the journey pages. Details: section 2 and the changelog.
- **Update 2026-11-11 (D: machine), final:** About pages approved; the whole redesign (M9) is approved and **committed on the new branch `redesign/site-starter-kit`** at the user's request (master untouched at `250e432`; no remote, nothing pushed or merged). Left out of the commit on purpose: `webapp/site-starter-kit/` (the user's kit), `.idea/`, `webapp/audit/` (git-ignored) and `gis_tool/gis_tool_link.txt` (the user's own change to a read-only source folder). **Merged into `master` (fast-forward to `5b368c2`) at the user's request on 2026-11-11.** Lesson: switching branches failed on the first try because the running `astro dev` held `public/home` and `src/scripts` open (Windows "Permission denied"); stop dev/preview servers before `git switch`/merge on this machine. Open: the hero photo original; EU visibility check; section 7.
- **Update 2026-11-11, earlier:** Library and Glossary approved; About pages done (screenshots `webapp/audit/about/`).
- **Update 2026-11-11, earlier:** My community approved; Library and Glossary done (screenshots `webapp/audit/library/`).
- **Update 2026-11-11, earlier:** Learn approved; My community (dossier) done (screenshots and print PDF in `webapp/audit/community/`; `audit/seed-done.json` = seed with phase 1 ticked; `audit/seed-clip.mjs` clips a region with a seed loaded); next: Library and glossary, then the About pages (About, Privacy, Accessibility, Feedback) — the last batch of the page pass.
- **Update 2026-11-11, earlier:** Business Model Tool approved; Learn pages done (screenshots `webapp/audit/learn/`, `audit/lesson-capture.mjs`).
- **Update 2026-11-11 (D: machine), earlier:** GIS Tool approved; Business Model Tool overview and five steps done (screenshots `webapp/audit/business/`).
- **Update 2026-11-11 (D: machine), later:** Energy Profile approved; GIS Tool overview and region guides done and awaiting the user's verdict (screenshots `webapp/audit/map/`); next: business model steps, then learn, My community, library, about. Claude started a dev server on 4321 for the user (the user's own had stopped); it ends with the session.
- **Update 2026-11-11 (D: machine):** home, journey, tools overview, cards and card session approved; Energy Profile done and awaiting the user's verdict (screenshots `webapp/audit/profile/`, seed workspace `webapp/audit/seed.json` from `KEEP_WORKSPACE`, `audit/profile-capture.mjs` takes viewport shots at scroll positions); next in the page pass: map guides, business model, learn, My community, library, about. The bullets below are the earlier state.
- **Checking pages on this machine:** the user's `astro dev` on 4321 stopped picking up file changes mid-session (it served old pages) and reloads mid-run (detaches e2e). Check against `npm run build` + `npx astro preview --port 4400`. **Stop the preview before rebuilding** and make sure its `node … astro preview` process is gone (TaskStop can leave it orphaned): a rebuild under a running preview left `dist/` without the `public/` files (broken images everywhere). Helper scripts for screenshots: `webapp/audit/clip.mjs` (scrolls, then clips a region) and `audit/session-capture.mjs` (setup + first card of a session).
- **Was waiting on the user:** their verdict on the new hero (and so on the home page as a whole). Screenshots: `webapp/audit/hero/v4_{1024,1440,1920}.png`, `v2_390_photo.png`, `v3_1024_light.png`, `footer.png`. **Do not start the remaining pages until they approve**; nothing is committed or deployed without their say-so.
- **Pending file from the user:** the full-size original of the hero photo (Flickr blocked Claude's automated download; do not work around it). Link: https://www.flickr.com/photos/43929929@N07/6317368252/sizes/o/. When the user supplies the path: convert with sharp to `webapp/public/home/hero-hepburn.webp` (~1600 px wide, quality ~84) and update `width`/`height` in `credits.ts`. On a 1920 px screen the current 683 px file looks soft.
- **How the user works (learned 2026-11-10):** they check by running their own `astro dev` on **4321** and judge by eye; "nothing changed" meant "not different enough". They want visible, concrete changes, real photos of happy people *with* energy in shot (generic stock and silhouettes were rejected), and they answer clarifying questions quickly — ask before choosing imagery. Good free sources of real community energy photos: Flickr CC via the Openverse API (`api.openverse.org/v1/images/?q=...&source=flickr&license=by,by-sa,cc0`): 1010 Climate Action (REPOWERBalcombe, Moss Community Energy), Hepburn Wind. Unsplash's API needs a key; Pexels search pages can be read with WebFetch.
- **Uncommitted work (nothing committed since `250e432`):** everything from the redesign plus this session — see `git status`. New this session: `src/components/EnergyVillage.astro`, `src/content/credits.ts`, `public/home/hero-hepburn.webp`; changed `pages/[locale]/index.astro`, `journey/index.astro`, `journey/[phase].astro`, `Footer.astro`, `tokens.css`, locales `en/common.ts`, `en/pages.ts`. **Do not commit** `webapp/site-starter-kit/` (the user's kit), `.idea/` or `webapp/audit/` (git-ignored); `gis_tool/gis_tool_link.txt` is the user's change (see below).
- **Next, once the home page is approved — page-by-page pass** in this order: journey pages → tools index + card pages/session → Energy Profile → map guides → business model steps → learn → My community → library/glossary → about pages. Per page: apply the kit look (80% column, one idea per screen where it fits, flat hairline panels), and fix the audit findings left open: **nested cards** (panels inside panels on tool pages), **long lines** (>85ch paragraphs; cap at ~60–70ch), **Energy Profile heading skip** (h1 → h3). Tool layouts keep working as they are. After each batch: screenshots to the user. Expect the user to want bolder, more visual changes than a token restyle.
- **Also still open:** home headline wraps to 3 lines at 390 px; print re-check of dossier and Energy Profile after the token change; taste-skill `inspect.mjs` + critique rounds not run; strict CSP not possible without Astro CSP hashes; the village animation runs while off-screen (could pause it with an IntersectionObserver); `public/brand/partners.png` is no longer used anywhere (partner logos were in the footer) — ask whether they belong on About; EU visibility check with LG (section 7).
- **Gates for "done"** (all green at end of session): `npm test` (24), `npm run check` (0 errors), `npm run build` (36 pages), `npm run e2e` (23/23, run with `SITE_ORIGIN=http://localhost:4321` against the user's dev server), `npm run audit -- en/` (0 overflow / console errors). Accepted audit findings are listed in SKILL.md (now including the village's infinite animations).
- **Servers at end of session:** only the user's own `astro dev` on **4321** (PID 11112300, not started by Claude — leave it; `astro dev` refuses a second instance, so use it for checks or `npx astro preview --port 4400`). Claude left no server running.
- **This machine (F:):** Node **v22.20.0** on PATH; Chrome under Program Files (puppeteer-core uses it). The session scratchpad is temporary: keep working files under `webapp/audit/` (git-ignored).
- Design rules and every design decision: `.claude/skills/site-design/SKILL.md` (invoke the `site-design` skill before any layout/colour/copy change; record new decisions there and here).

**Earlier notes:**
- The dev server is started with `npm run dev` in `webapp/`; `npm run e2e` needs a recent `npm run build`.
- **D: machine, 2026-11-10:** Node **v26.13.0** is now installed on PATH (`C:\Program Files\nodejs`); the v24 zip below is gone. 24 tests pass on it. Git still needs `-c safe.directory=D:/Circus/Tools` (global config not changed).
- **New machine (2026-10-08), `D:\Circus\Tools`:** Node.js was the standalone zip **v24.21.0** extracted to `%USERPROFILE%\Downloads\node-v24.21.0-win-x64` and is **not on PATH** — prefix shell commands with it (`$env:Path = "$env:USERPROFILE\Downloads\node-v24.21.0-win-x64;$env:Path"`); the Stop hook only works once the user adds that folder to their user PATH. `npm ci` done (npm 11 skipped esbuild's postinstall under `allowScripts`; build works regardless). `python` is only the Microsoft Store stub (`npm run fixtures` unavailable). Git refuses the repo ("dubious ownership", exFAT records no owner) until `git config --global --add safe.directory D:/Circus/Tools`. Chrome is installed under Program Files. Uncommitted change found, not made by Claude: `gis_tool/gis_tool_link.txt` now holds `https://circus.nweurope.eu/gistool` (was empty). **Committed on master at the user's request on 2026-11-11** (their own change; the app does not use this file — the GIS links come from `src/content/resources.ts`).
- 2026-10-18: an `astro dev` server not started by Claude was already running on port 4321 (PID 3011464); Claude left it alone and checked against `npx astro preview --port 4400` with `SITE_ORIGIN=http://localhost:4400`.
- First checks of the new session: does `permissions.defaultMode: "auto"` apply; does the Stop hook fire; if auto mode did not apply, mirror it in `.claude/settings.local.json`.
- Questions for the user that the build left open (all answered with placeholders so far): where the site will be hosted and under which path (`BASE_PATH`); the feedback route for the five test runs; whether the MTU-written texts in section 5 may stay until partners review them; whether the Chrome extension can be connected for a real-browser walkthrough; whether the Energy Profile printout should show inputs or results only.
- Not a question, a reminder: the Chrome extension was unavailable, so browser checks run headless through `scripts/e2e-smoke.mjs`, `shot.mjs` and `print-check.mjs` (`SEED=<workspace.json>` preloads a workspace).

## 9. Changelog

- 2026-11-11 — Test deployment set up at the user's request: `.github/workflows/pages.yml`, `NOINDEX=1` switch in `Base.astro` and `pages/index.astro`, public repo `Nasheor/circus-online-training` with remote `origin`. Locally: 24 tests, check clean, 36 pages (sub-path + noindex build verified: no unprefixed links, 10 downloads; normal build has no noindex), e2e 23/23 against preview on 4400.

- 2026-10-06 — Project started; plan approved. Settings (auto mode + context-guard Stop hook), git repo, Astro scaffold.
- 2026-10-06 — Energy Profile engine verified against 52 Excel-computed scenarios; four deviations registered.
- 2026-10-06 — First complete version: home, journey, 69 cards with session mode, Energy Profile calculator, Map explorer, Business Model workspace, lessons, My community, Library, glossary, About pages. E2E walkthrough added (`npm run e2e`); print layouts checked. Local commit `d32302a` (no remote).
- 2026-10-06 — Session closed at the user's request; section 10 records how to resume. The user will bring suggestions and clarifications next session.
- 2026-10-08 — Resumed on a new machine (`D:`); Node 24.21.0 (standalone zip, not on PATH) set up, `npm ci`; on Node 24 all green: 24 tests, check clean, 36 pages built, e2e 23/23. No app changes.
- 2026-10-18 — Redesign requested on the user's site starter kit (tickmarklabs.io design system, Vite template). Kit read; design brief copied to `.claude/skills/site-design/SKILL.md`. User chose: port to Astro, CIRCUS colours with Inter, dark default, whole site with the home page first. No app changes yet.
- 2026-10-18 — Redesign, first pass: kit tokens with dark default + light toggle, Inter, kit top bar and name-first footer, all components restyled; new home page (taste-skill direction "colour chapters": the three deck colours as full-screen chapters, card fan, count-up strip, tools index with real screenshots). Added `npm run audit`, `scripts/home-shots.mjs`. All gates green; screenshots to the user for approval.
- 2026-10-19 — Session closed; section 10 rewritten with the exact resume state (awaiting home-page approval, uncommitted file list, page-by-page plan, open findings, servers, F: machine setup). No app changes.
- 2026-10-19 — Dark theme recoloured to "CIRCUS night" in `tokens.css` at the user's request (the kit's grey dark was their previous site's); home tool screenshots retaken. 24 tests, check clean, 36 pages, e2e passed, audit: 0 low contrast / overflow / errors. Awaiting the user's approval with the home page.
- 2026-10-19 — At the user's request: removed the home hero's figures strip (markup, styles, `home.figures*` strings) and the Interreg logo from the header (`Header.astro`). Check clean, 36 pages, 24 tests, e2e passed, audit unchanged.
- 2026-11-10 — Session closed; section 10 rewritten with the resume state (hero awaiting approval, original photo pending from the user, what the user expects, servers). No app changes.
- 2026-11-10 — At the user's request: footer reduced to its five links (`Footer.astro`; strings `site.version`, `footer.partners`, `footer.dataNote`, `logoAlt.partners` deleted) and the facilitator notes removed from the journey overview and phase pages (strings `journey.facilitator*` deleted). 24 tests, check clean, 36 pages, e2e passed.
- 2026-11-10 — Home hero rebuilt at the user's request: cheering community photo (Hepburn Wind, CC BY 2.0, credited; `src/content/credits.ts`, `public/home/hero-hepburn.webp`) with a navy fade, and the animated energy village (`components/EnergyVillage.astro`) instead of the card fan; `.theme-dark` scope added in `tokens.css` so the hero stays dark in the light theme. 24 tests, check clean, 36 pages, e2e 23/23, audit on `en/`: no overflow/errors; new accepted finding: infinite animations (village).
- 2026-11-10 — Resumed on the D: machine (Node 26.13.0 on PATH); working tree matches section 10; 24 tests green. No app changes.
- 2026-11-10 — User approved the home page. Fluid type scale in `tokens.css` (`--t-12…--t-28`), footer links centred, journey overview and phase pages redesigned (`journey/index.astro`, `journey/[phase].astro`; `PhaseCards.astro` deleted; strings `journey.routeTitle/openPhase/glance/toolCard/previous/next` added, `audience`/`previousPhase` removed). 24 tests, check clean, 36 pages, e2e 23/23 and audit on all 8 pages (0 overflow / low contrast / errors) against `astro preview` on 4400 — the user's dev server on 4321 reloads mid-run and detaches the e2e frame. Screenshots: `webapp/audit/journey/`.
- 2026-11-11 — At the user's request, committed their change to `gis_tool/gis_tool_link.txt` (the link `https://circus.nweurope.eu/gistool`, file was empty). Not used by the app.
- 2026-11-11 — `redesign/site-starter-kit` merged into `master` (fast-forward, `5b368c2`) at the user's request; on master: 24 tests, check clean, 36 pages. This CONTEXT.md update committed separately on master at the user's request.
- 2026-11-11 — User approved the About pages; redesign complete. Committed at the user's request on new branch `redesign/site-starter-kit` (kit, `.idea/`, audit output and the user's `gis_tool` change left out; a stray screenshot `webapp/1366` made by a misnamed helper script deleted).
- 2026-11-11 — User approved the Library and Glossary. About pages redesigned: new `components/AboutNav.astro`; `about/index.astro`, `about/[page].astro`, `tools/energy-profile/differences.astro` rebuilt (no change to the calculation or the deviations list). Removed the string `feedback.versionNote` ("Please mention the version shown at the bottom of every page"): the version left the footer on 2026-11-10, so the sentence pointed at nothing. 24 tests, check clean, 36 pages, e2e 23/23. **Full-site audit after the whole page pass: all 35 built pages × 1440/1024/390 × dark/light (210 runs): 0 overflow, 0 low contrast, 0 console errors, 0 broken images, 0 nested cards, 0 heading skips; one accepted long line (home hero photo credit).**
- 2026-11-11 — User approved My community. Library (`library/index.astro`: tool-coloured file columns with format labels, partner materials as report rows) and Glossary (`library/glossary.astro`: A–Z bar, letter groups, two columns; string `glossary.lettersLabel`) redesigned. 24 tests, check clean, 36 pages, e2e 23/23, audit on both pages (12 runs): no findings.
- 2026-11-11 — User approved the Learn pages. My community redesigned: container classes only in `DossierApp.tsx` (`dossier-top`, `dossier-journey`/`dossier-phase is-done`, `dossier__part`; inline styles on the journey list and facts removed), styles and print rules appended to `tools.css`. Dossier print 3 → 2 pages. 24 tests, check clean, 36 pages, e2e 23/23, audit on the page (6 runs): no findings.
- 2026-11-11 — User approved the Business Model Tool pages. Learn pages redesigned (`learn/index.astro`: coloured lesson tiles; `learn/[lesson].astro`: numbered sections, sticky contents, quick-check block, large next/back links). No string or content changes (the existing `learn.start` string is now used). 24 tests, check clean, 36 pages, e2e 23/23, audit on the five pages (30 runs): no findings.
- 2026-11-11 — User approved the GIS Tool pages. Business Model Tool redesigned: overview route (`business-model/index.astro`), step pages with the green `PageHero` + progress track (`BusinessSteps.astro`, `[step].astro`, header `no-print`), large previous/next links; container class changes only in `ActivityExplorer.tsx`, `Checklists.tsx`, `BusinessStepApp.tsx`, `BusinessContext.tsx` (no logic or workspace change); styles in `tools.css`. Canvas still prints on one sheet. 24 tests, check clean, 36 pages, e2e 23/23, audit on the six pages (36 runs): no findings in overflow, contrast, errors, long lines, nested cards or heading skips.
- 2026-11-11 — User approved the Energy Profile. GIS Tool pages redesigned: new `components/RegionTiles.astro` (country-code tiles, layer count, feedback tag; compact variant), `tools/map/index.astro` and `tools/map/[region].astro` rebuilt (step columns, orange prompts band, layer rows); strings `map.layerCount/layerCountOne/feedbackTag` added. `--measure` 68ch → 64ch in `tokens.css`. 24 tests, check clean, 36 pages, e2e 23/23, audit on the 9 redesigned pages (54 runs): 0 overflow / low contrast / errors / broken images.
- 2026-11-11 — User approved the tools overview and card pages. Energy Profile page redesigned: step links in the hero (`profile.stepsNav` string), flat input steps with h2 titles (heading skip fixed), `Results` split into `part="summary"` (sticky headline card with coverage bar, now offset below the top bar) and `part="detail"` (full-width chart band with month matching and keep), scenarios + assumptions side by side, open "About / other parts" columns. Calculation untouched. Print: site footer hidden on paper (`print.css`), profile 5 → 4 pages, no blank page. 24 tests, check clean, 36 pages, e2e 23/23, audit 48 runs: 0 overflow / low contrast / errors / broken images; on the profile 0 heading skips, 0 nested cards (was 5).
- 2026-11-11 — Top bar enlarged at the user's request (`Header.astro`: menu labels up to 20px, bolder, full-contrast; logo, name and theme toggle larger; `--bar` 76px in `tokens.css`). Fixed a breakpoint overlap that put the menu on a second row at exactly 1024px. 24 tests, check clean, 36 pages, e2e 23/23, audit 48 runs: 0 overflow / low contrast / errors / broken images. Screenshots `webapp/audit/header/`.
- 2026-11-10 — User approved the journey pages. Redesigned the tools overview (`tools/index.astro`: alternating rows with real screenshots), the WattWorks cards page (`tools/cards/index.astro`: deck tiles, six-step columns, print tiles, sticky deck bar, deck-colour headings; `.card-grid` renamed `.deck-grid`) and the card session (`SessionApp.tsx` class names only: `session-setup`, `deck-choices`, `deck-choice`, `session__card` wrapper with `.theme-light`; styles in `tools.css`, incl. the session bar stacking on phones, which was broken at 390 px). 24 tests, check clean, 36 pages, e2e 23/23, audit 8 pages × 3 widths × 2 themes: 0 overflow / low contrast / console errors / broken images; nested cards on the cards page 21 → 0.
- 2026-10-19 — Stakeholder demo script written (90-min role-played community session, exact UI labels) and published as a private claude.ai artifact: https://claude.ai/artifact/FJ2EkBWT5thk5KiazMthP4. Not part of the app; the demo village figures in it are invented for the demo.
