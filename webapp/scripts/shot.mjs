// Screenshot a page of the running dev server with the locally installed Chrome or Edge.
// Usage: node scripts/shot.mjs <path> <output.png> [width=1280] [height=800] [full]
import { existsSync, readFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

export const BROWSER =
  process.env.CHROME_PATH ??
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ].find((path) => existsSync(path));
export const ORIGIN = process.env.SITE_ORIGIN ?? 'http://localhost:4321';

if (process.argv[1]?.endsWith('shot.mjs')) {
  // Pass the path without a leading slash (Git Bash rewrites "/en/" into a Windows path).
  const [rawPath = 'en/', output = 'shot.png', width = '1280', height = '800', full] = process.argv.slice(2);
  const path = '/' + rawPath.replace(/^\/+/, '');
  const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: Number(width), height: Number(height) });
    const errors = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    // SEED=<file.json> loads a saved workspace into the browser before the page opens.
    if (process.env.SEED) {
      const seed = readFileSync(process.env.SEED, 'utf8');
      await page.evaluateOnNewDocument((data) => localStorage.setItem('circus.workspace', data), seed);
    }
    await page.goto(ORIGIN + path, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: output, fullPage: full === 'full' });
    console.log(`${path} -> ${output}${errors.length ? '\nERRORS:\n' + errors.join('\n') : ''}`);
  } finally {
    await browser.close();
  }
}
