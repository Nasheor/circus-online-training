# CIRCUS online training — instructions

@CONTEXT.md

## Rules

- `CONTEXT.md` is the single source of truth. **Update it in the same turn as any change** to the app, its content or a decision: the Status table, the affected section, and a dated Changelog line. A Stop hook (`.claude/hooks/context-guard.mjs`) blocks finishing while it is stale.
- Never modify the source folders `energy_profile_tool/`, `watt_works/`, `business_tool/`, `gis_tool/`. The app lives in `webapp/`.
- Do not invent method content, country data or financial models. Where the source material is silent, say so in the app and add an open item.
- Any change to the calculation must keep `npm test` green; a new intentional difference from the Excel workbook goes in `deviations.ts` and section 5.
- All user-facing text goes in `webapp/src/content/locales/<locale>/`, never hard-coded in components.
- All internal links go through `href()` / `asset()`; every partner-hosted link through `src/content/resources.ts`.
- Before calling work done, run in `webapp/`: `npm test`, `npm run check`, `npm run build`, and `npm run e2e` (dev server running).
