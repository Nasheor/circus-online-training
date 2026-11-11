// End-to-end smoke test: walks one community through the whole journey in a real
// browser (locally installed Chrome or Edge), then checks every page for script
// errors and sideways overflow at phone width.
// Usage: start the site (npm run dev, or npm run preview), then: node scripts/e2e-smoke.mjs
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { BROWSER, ORIGIN } from './shot.mjs';

const BASE = (process.env.SITE_BASE ?? '/').replace(/\/?$/, '/');
const url = (path) => ORIGIN + BASE + path;
const STORAGE_KEY = 'circus.workspace';

const failures = [];
const errors = [];
let step = 0;
const ok = (message) => console.log(`  ok ${String(++step).padStart(2)}  ${message}`);
function check(condition, message) {
  if (condition) ok(message);
  else {
    failures.push(message);
    console.log(`  FAIL   ${message}`);
  }
}

const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });
page.on('pageerror', (error) => errors.push(`${page.url()} :: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`${page.url()} :: ${message.text()}`);
});

const go = (path) => page.goto(url(path), { waitUntil: 'networkidle0' });
const text = () => page.evaluate(() => document.body.innerText);
const click = (selector) => page.locator(selector).click();
const workspace = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? 'null'), STORAGE_KEY);
const settle = () => new Promise((resolve) => setTimeout(resolve, 500)); // longer than the 300 ms save delay
// Number fields select their content on focus, so typing replaces it.
async function fill(selector, value) {
  const field = await page.waitForSelector(selector);
  await field.focus();
  await field.type(String(value));
}
// Click the option of a radio group identified by its (visually hidden) legend.
const choose = (legend, option) =>
  page.evaluate(
    (legendText, optionText) => {
      const group = [...document.querySelectorAll('fieldset')].find((fieldset) =>
        fieldset.querySelector('legend')?.textContent.includes(legendText),
      );
      [...group.querySelectorAll('label')].find((label) => label.textContent.trim() === optionText).querySelector('input').click();
    },
    legend,
    option,
  );

try {
  console.log('Journey');
  await go('en/');
  check((await text()).includes('Where are you now?'), 'home page shows the self-check');
  // Answer every question with its first option ("not yet"): a newcomer belongs in phase 1.
  await page.waitForSelector('#where fieldset input');
  await page.evaluate(() =>
    document.querySelectorAll('#where fieldset').forEach((question) => question.querySelector('input').click()),
  );
  await page.waitForSelector('::-p-text(Go to phase 1)');
  ok('self-check recommends phase 1');

  console.log('Phase 1: cards and Energy Profile Tool');
  await go('en/tools/cards/session/?deck=p1');
  await click('button::-p-text(Begin)');
  await page.waitForSelector('::-p-text(Card 1 of 16)');
  await page.type('textarea', 'Lower bills and a warmer hall.');
  for (let card = 1; card < 12; card += 1) await click('button::-p-text(Next)');
  await page.waitForSelector('::-p-text(Card 12 of 16)');
  check((await text()).includes('Apply the Energy Profile Tool'), 'card 12 is the tool card');
  await settle();
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), click('a::-p-text(Open the Energy Profile Tool)')]);
  await page.waitForSelector('.return-bar');
  ok('tool card opens the tool, which shows the return bar');

  await fill('input[aria-label="Terraced house (between two others): Gas boiler"]', 10);
  await fill('input[aria-label="Terraced house (between two others): Hybrid heat pump"]', 5);
  await fill('input[aria-label="Terraced house (between two others): All-electric heat pump"]', 5);
  await fill('input[id$="-cars"]', '1,2'); // decimal comma must be accepted
  await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(slider, '20');
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await settle();
  const saved = await workspace();
  check(saved.profile.current.inputs.carsPerHousehold === 1.2, 'decimal comma is read as 1.2');
  check(saved.profile.current.inputs.evShare === 0.2, 'slider sets the share of electric cars');
  // Worked example of the tests: 53.4 + 14.649 + 11.091 = 79.14 MWh, which the page shows to one decimal.
  check((await text()).includes('79.1'), 'yearly use matches the hand-worked example (79.1 MWh)');
  check((await text()).includes('1,278') || (await text()).includes('1278'), 'highest-month match needs 1,278 panels');

  await page.type('input[id$="-name"]', 'Today');
  await click('button::-p-text(Save as scenario)');
  await page.waitForSelector('::-p-text(Saved “Today”.)');
  await settle();
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), click('.return-bar a')]);
  await page.waitForSelector('::-p-text(Card 12 of 16)');
  check((await text()).includes('Made during this session') && (await text()).includes('Today'), 'back on card 12, with the saved scenario listed');
  await click('button::-p-text(Next)');
  await page.waitForSelector('::-p-text(Card 13 of 16)');
  await click('button::-p-text(Finish session)');
  await page.waitForSelector('::-p-text(Session summary)');
  check((await text()).includes('Lower bills and a warmer hall.'), 'summary shows the note written on card 1');

  console.log('Phase 2: GIS Tool');
  await go('en/tools/map/ie/');
  check((await text()).includes('AGRI-PV_EC1'), 'region page lists the map layers');
  check((await page.$$('iframe')).length === 0, 'the partner map is not loaded until asked for');
  await click('button::-p-text(Add a site)');
  await page.type('input[id$="-name"]', 'Old quarry');
  await page.type('textarea[id$="-why"]', 'South facing, near the substation.');
  await click('button[type="submit"]::-p-text(Save)');
  await page.waitForSelector('h3::-p-text(Old quarry)');
  ok('candidate site is saved');

  console.log('Phase 3: Business Model Tool');
  await settle();
  await go('en/tools/business-model/explore/');
  check((await text()).includes('Old quarry') && (await text()).includes('20 homes'), 'context shows the profile and the candidate site');
  await choose('Interest of our group in Wind energy', 'Yes');
  await page.waitForSelector('::-p-text(Marked “Yes”: Wind energy)');
  ok('activity interest is recorded');
  await settle();
  await go('en/tools/business-model/draw/');
  await click('button::-p-text(Start a canvas)');
  await page.type('.canvas__block--value textarea', 'Local, affordable, shared power.');
  await settle();
  await go('en/tools/business-model/collect/');
  await click('label::-p-text(Grid connection)');
  await page.waitForSelector('::-p-text(1 of 13 collected)');
  ok('canvas and data checklist are saved');

  console.log('My community: dossier, save and open a file');
  await settle();
  await go('en/my-community/');
  const dossier = await text();
  check(
    ['Old quarry', 'Wind energy', 'Local, affordable, shared power.', 'Grid connection', 'Today'].every((item) => dossier.includes(item)),
    'dossier gathers the profile, session, site, canvas and checklist',
  );
  const before = await workspace();
  const folder = mkdtempSync(join(tmpdir(), 'circus-e2e-'));
  const file = join(folder, 'community.json');
  writeFileSync(file, JSON.stringify(before));
  // KEEP_WORKSPACE=<file> keeps the walkthrough's workspace, e.g. as a seed for scripts/shot.mjs.
  if (process.env.KEEP_WORKSPACE) writeFileSync(process.env.KEEP_WORKSPACE, JSON.stringify(before));

  await click('button::-p-text(Erase everything in this browser)');
  await click('button::-p-text(Yes, erase)');
  await settle();
  check((await workspace()).sites.length === 0, 'erase empties the workspace');
  await (await page.$('input[type="file"]')).uploadFile(file);
  await page.waitForSelector('::-p-text(Opened “community.json”.)');
  await settle();
  const after = await workspace();
  check(
    after.sites[0]?.name === 'Old quarry' && after.profile.scenarios[0]?.name === 'Today' && after.cards.sessions.length === 1,
    'opening the saved file brings everything back',
  );
  writeFileSync(file, '{"hello":"world"}');
  await (await page.$('input[type="file"]')).uploadFile(file);
  await page.waitForSelector('::-p-text(This is not a file saved from the CIRCUS method training.)');
  check((await workspace()).sites.length === 1, 'a foreign file is refused and nothing changes');
  rmSync(folder, { recursive: true, force: true });

  console.log('Every page: script errors, sideways overflow at phone width, one h1');
  // The page list comes from the last build (npm run build).
  const dist = fileURLToPath(new URL('../dist/', import.meta.url));
  const paths = readdirSync(dist, { recursive: true })
    .map((entry) => String(entry).replaceAll('\\', '/'))
    .filter((entry) => entry.endsWith('/index.html'))
    .map((entry) => entry.slice(0, -'index.html'.length))
    .sort();
  if (paths.length === 0) failures.push('no built pages found: run npm run build first');
  await page.setViewport({ width: 360, height: 740 });
  const overflowing = [];
  const badHeadings = [];
  for (const path of paths) {
    const response = await go(path);
    // npm run preview answers a page visited earlier in the walkthrough with 304 Not Modified
    if (!response?.ok() && response?.status() !== 304) {
      failures.push(`${path} returned ${response?.status()}`);
      console.log(`  FAIL   ${failures[failures.length - 1]}`);
    }
    const { overflow, h1 } = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll('h1').length,
    }));
    if (overflow > 1) overflowing.push(`${path} (+${overflow}px)`);
    if (h1 !== 1) badHeadings.push(`${path} (${h1})`);
  }
  check(overflowing.length === 0, `no sideways scrolling at 360 px on ${paths.length} pages${overflowing.length ? ': ' + overflowing.join(', ') : ''}`);
  check(badHeadings.length === 0, `exactly one h1 on every page${badHeadings.length ? ': ' + badHeadings.join(', ') : ''}`);
  check(errors.length === 0, `no script or console errors${errors.length ? ':\n    ' + errors.join('\n    ') : ''}`);
} catch (error) {
  failures.push(`stopped: ${error.message} (at ${page.url()})`);
  console.log(`  FAIL   ${failures[failures.length - 1]}`);
} finally {
  await browser.close();
}

console.log(failures.length ? `\n${failures.length} failure(s)` : '\nAll checks passed');
process.exit(failures.length ? 1 : 0);
