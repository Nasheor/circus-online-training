// Usage: node scripts/home-shots.mjs <seed workspace.json>   (site running; SITE_ORIGIN as for shot.mjs)
// A seed comes from: KEEP_WORKSPACE=<file> npm run e2e
// Screenshots of the four tools for the home page's showcase, in both themes, from a seeded workspace.
import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { BROWSER as browserPath, ORIGIN as origin } from './shot.mjs';
const [, , seedFile] = process.argv;
const outDir = 'public/home';
const seed = readFileSync(seedFile, 'utf8');
const shots = [
  { id: 'cards', path: '/en/tools/cards/session/?deck=p1', start: 'main form button[type="submit"]', target: '.wcard', size: [1000, 560], above: 96 },
  { id: 'energy-profile', path: '/en/tools/energy-profile/', target: 'svg.chart', frame: '.panel' },
  { id: 'map', path: '/en/tools/map/nl-altena/', target: 'main h1' },
  { id: 'business-model', path: '/en/tools/business-model/draw/', target: '.canvas' },
];
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
for (const theme of ['dark', 'light']) {
  for (const shot of shots) {
    const page = await browser.newPage();
    await page.setViewport({ width: shot.size?.[0] ?? 1200, height: shot.size?.[1] ?? 800 });
    await page.evaluateOnNewDocument((data, t) => { localStorage.setItem('circus.workspace', data); localStorage.setItem('circus.theme', t); }, seed, theme);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(origin + shot.path, { waitUntil: 'networkidle0' });
    await page.addStyleTag({ content: '.site-header { position: static !important; } .site-footer { display: none !important; }' });
    if (shot.start) {
      await page.waitForSelector(shot.start);
      await page.click(shot.start);
    }
    await page.waitForSelector(shot.target, { timeout: 8000 }).catch(() => console.log('no target', shot.id));
    await page.evaluate((sel, frame, above) => {
      let el = document.querySelector(sel);
      if (el && frame) el = el.closest(frame) ?? el;
      if (el) scrollTo(0, Math.max(0, el.getBoundingClientRect().top + scrollY - above));
    }, shot.target, shot.frame, shot.above ?? 24);
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: `${outDir}/${shot.id}-${theme}.webp`, type: 'webp', quality: 82 });
    console.log(shot.id, theme);
    await page.close();
  }
}
await browser.close();
