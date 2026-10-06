// Render pages to PDF through the print stylesheet, to check printed output.
// Usage: SEED=<workspace.json> node scripts/print-check.mjs <output folder> <path>...
import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { BROWSER, ORIGIN } from './shot.mjs';

const [folder, ...paths] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true });
try {
  for (const rawPath of paths) {
    const path = '/' + rawPath.replace(/^\/+/, '');
    const page = await browser.newPage();
    if (process.env.SEED) {
      const seed = readFileSync(process.env.SEED, 'utf8');
      await page.evaluateOnNewDocument((data) => localStorage.setItem('circus.workspace', data), seed);
    }
    await page.goto(ORIGIN + path, { waitUntil: 'networkidle0' });
    const name = path.replace(/^\/|\/$/g, '').replaceAll('/', '_') || 'home';
    await page.pdf({ path: `${folder}/${name}.pdf`, preferCSSPageSize: true, printBackground: true, format: 'A4' });
    console.log(`${path} -> ${name}.pdf`);
    await page.close();
  }
} finally {
  await browser.close();
}
