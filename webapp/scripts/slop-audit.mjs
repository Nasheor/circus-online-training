// The impeccable.style/slop checks a browser can measure (https://impeccable.style/slop/), ported from the site starter
// kit's tools/site_slop_audit.mjs to puppeteer-core and the installed Chrome, and run over several pages.
// Usage: site running (npm run preview or dev; SITE_ORIGIN as for shot.mjs), then: npm run audit [-- <path> ...]
// Writes audit/report.json and full-page screenshots audit/<page>_<width>_<theme>.png; prints one summary line per run.
// Not ported: the kit's injected CSP. Astro islands boot from small inline scripts, so a strict default-src 'self'
// would need Astro's CSP hashes; the summary counts inline scripts instead.
import { mkdirSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { BROWSER, ORIGIN } from './shot.mjs';

const DEFAULT_PAGES = [
  'en/',
  'en/journey/awareness/',
  'en/tools/cards/',
  'en/tools/energy-profile/',
  'en/tools/business-model/draw/',
  'en/tools/map/nl-altena/',
  'en/learn/',
  'en/about/',
];
const pages = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_PAGES;
const out = 'audit';
mkdirSync(out, { recursive: true });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true });
const all = [];
for (const path of pages) {
  for (const [w, h] of [[1440, 900], [1024, 800], [390, 844]]) {
    for (const theme of ['dark', 'light']) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h });
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
      await page.goto(`${ORIGIN}/${path.replace(/^\/+/, '')}?theme=${theme}`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('main');
      await pause(400);
      // content visible at load, before any scroll (content stuck waiting to appear)
      const hiddenAtLoad = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((e) => { const s = getComputedStyle(e); return e.children.length < 50 && e.textContent.trim() && parseFloat(s.opacity) === 0; }).length);
      // scroll through once so lazy pictures load and every entrance has run, then measure at rest
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        scrollTo(0, 0);
      });
      // lazy pictures load eagerly for the full-page capture (a full-page screenshot does not scroll)
      await page.evaluate(() => {
        document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
        const loads = [...document.images].filter((i) => i.offsetParent).map((i) => i.decode().catch(() => {}));
        return Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 3000))]);
      });
      await pause(1600);
      const r = await page.evaluate(() => {
          const out = {};
          const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v[3] === undefined ? 1 : v[3] }; };
          const lum = ({ r, g, b }) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
          const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
          const bgOf = (el) => { const stack = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; } }
            let acc = parse(getComputedStyle(document.documentElement).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 }; for (const c of stack.reverse()) acc = blend(c, acc); return acc; };
          const texts = [...document.querySelectorAll('body *')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && e.getClientRects().length && !e.closest('.visually-hidden, svg, .skip'));
          const name = (e) => (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : e.tagName.toLowerCase()) + ' "' + e.textContent.trim().slice(0, 28) + '"';
          const lowC = [], tiny = [], wideLS = [], caps = [], tightLH = [], longLines = [], crushed = [];
          for (const e of texts) {
            const s = getComputedStyle(e), fs = parseFloat(s.fontSize), fg = parse(s.color); if (!fg) continue;
            const bg = bgOf(e), c = blend(fg, bg), L1 = lum(c), L2 = lum(bg), ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
            const large = fs >= 24 || (fs >= 18.66 && parseInt(s.fontWeight) >= 700);
            if (ratio < (large ? 3 : 4.5)) lowC.push(`${name(e)} ${ratio.toFixed(2)}`);
            if (fs < 12) tiny.push(`${name(e)} ${fs}px`);
            const ls = parseFloat(s.letterSpacing) || 0;
            if (ls / fs > 0.04) wideLS.push(`${name(e)} ${(ls / fs).toFixed(3)}em`);
            if (ls / fs < -0.03) crushed.push(`${name(e)} ${(ls / fs).toFixed(3)}em`);
            if (s.textTransform === 'uppercase') caps.push(name(e));
            const lh = parseFloat(s.lineHeight); const lines = e.getBoundingClientRect().height / (lh || fs * 1.2);
            if (lh && lh / fs < 1.3 && lines > 1.6 && fs < 24) tightLH.push(`${name(e)} ${(lh / fs).toFixed(2)}`);
            if (e.tagName === 'P' && e.getBoundingClientRect().width / (fs * 0.5) > 85) longLines.push(`${name(e)} ~${Math.round(e.getBoundingClientRect().width / (fs * 0.5))}ch`);
          }
          out.lowContrast = lowC; out.tinyText = tiny; out.wideLetterSpacing = wideLS; out.crushedLetterSpacing = crushed; out.allCaps = caps; out.tightLineHeight = tightLH; out.longLines = longLines;
          out.bodyFont = getComputedStyle(document.body).fontSize;
          const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((e) => e.getClientRects().length || e.closest('.visually-hidden'));
          const skips = []; let prev = 0; for (const e of hs) { const l = +e.tagName[1]; if (prev && l > prev + 1) skips.push(`${e.tagName} "${e.textContent.trim().slice(0, 30)}" after H${prev}`); prev = l; }
          out.headingSkips = skips; out.h1Count = document.querySelectorAll('h1').length;
          const els = [...document.querySelectorAll('body *')];
          out.infiniteAnimations = [...new Set(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations === Infinity).map((a) => (a.animationName || 'anim') + ' on ' + name(a.effect.target)))];
          out.gradients = [...new Set(els.map((e) => { const bi = getComputedStyle(e).backgroundImage; return bi !== 'none' && /gradient/.test(bi) ? `${bi.match(/^(repeating-)?(linear|radial)/)?.[0]} on ${name(e)}` : null; }).filter(Boolean))].slice(0, 30);
          out.bodyGradient = getComputedStyle(document.body).backgroundImage.slice(0, 60);
          out.backdropBlur = els.filter((e) => getComputedStyle(e).backdropFilter !== 'none').map(name);
          out.bigRadius = [...new Set(els.filter((e) => { const s = getComputedStyle(e); const r = parseFloat(s.borderTopLeftRadius); return r > 16 && r < 999 && e.offsetWidth > 120 && e.offsetHeight > 80; }).map(name))].slice(0, 20);
          out.borderPlusShadow = [...new Set(els.filter((e) => { const s = getComputedStyle(e); return s.boxShadow !== 'none' && !s.boxShadow.includes('inset') && parseFloat(s.borderTopWidth) > 0; }).map(name))];
          out.brokenImages = [...document.images].filter((i) => i.complete && !i.naturalWidth).map((i) => i.src);
          out.overflowX = document.documentElement.scrollWidth - innerWidth;
          out.edgeTouching = texts.filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.left < 12 || innerWidth - r.right < 12) && !e.closest('.tbl, .top'); }).map(name).slice(0, 10);
          out.fonts = [...new Set(els.map((e) => getComputedStyle(e).fontFamily.split(',')[0]))];
          out.fontSizes = [...new Set(texts.map((e) => getComputedStyle(e).fontSize))].sort((a, b) => parseFloat(a) - parseFloat(b));
          out.radii = [...new Set(els.map((e) => getComputedStyle(e).borderTopLeftRadius).filter((x) => x !== '0px'))];
          const nested = els.filter((e) => /\b(card|panel)\b/.test(e.className) && [...e.querySelectorAll('*')].some((c) => { const s = getComputedStyle(c); return c.offsetWidth > 60 && parseFloat(s.borderTopWidth) > 0 && parseFloat(s.borderTopLeftRadius) >= 8 && s.borderTopStyle !== 'none' && !/(btn|chip|seg|pill|ic)\b/.test(c.className); }));
          out.nestedCards = nested.map(name);
          return out;
        });
      
      r.hiddenAtLoad = hiddenAtLoad;
      r.inlineScripts = await page.evaluate(() => [...document.scripts].filter((s) => !s.src && s.type !== 'application/json').length);
      r.errs = errs;
      const tag = path.replace(/^en\/?/, '').replace(/\/$/, '').replaceAll('/', '-') || 'home';
      await page.screenshot({ path: `${out}/${tag}_${w}_${theme}.png`, fullPage: true });
      all.push({ path, w, theme, ...r });
      const issues = Object.entries(r)
        .filter(([key, value]) => Array.isArray(value) ? value.length && !['fonts', 'fontSizes', 'radii'].includes(key) : ['overflowX', 'hiddenAtLoad'].includes(key) && value > 0)
        .map(([key, value]) => `${key}=${Array.isArray(value) ? value.length : value}`);
      console.log(`${path} ${w} ${theme}: ${issues.join(' ') || 'clean'}`);
      await page.close();
    }
  }
}
writeFileSync(`${out}/report.json`, JSON.stringify(all, null, 1));
await browser.close();
