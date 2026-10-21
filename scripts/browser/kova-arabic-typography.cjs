/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const origin = process.env.KOVA_STOREFRONT_URL || 'http://localhost:3200';
let browser;
(async () => {
  browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  const errors = [];
  for (const width of [375, 768, 812, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 812 ? 375 : 900 }, reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      window.kovaLayoutShift = 0;
      window.kovaLayoutShiftSources = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) {
          window.kovaLayoutShift += entry.value;
          window.kovaLayoutShiftSources.push({value:entry.value, sources:entry.sources.map(s=>({node:s.node?.nodeName,previousY:s.previousRect.y,currentY:s.currentRect.y}))});
        }
      }).observe({type:'layout-shift',buffered:true});
    });
    page.on('pageerror', error => errors.push(error.message));
    const routes = width === 375 || width === 1440
      ? ['/ar', '/ar/shop', '/ar/products/kova-womens-scrub-set', '/ar/account', '/ar/checkout', '/ar/help/sizing'] : ['/ar'];
    for (const route of routes) {
      await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const styles = await page.evaluate(() => {
        const heading = document.querySelector('h1');
        const body = getComputedStyle(document.body);
        const h = heading && getComputedStyle(heading);
        return {
          direction: getComputedStyle(document.documentElement).direction,
          bodyFont: body.fontFamily,
          headingFont: h?.fontFamily,
          headingTracking: h?.letterSpacing,
          headingLineHeight: h?.lineHeight,
          overflow: document.documentElement.scrollWidth > innerWidth,
          layoutShift: window.kovaLayoutShift,
          layoutShiftSources: window.kovaLayoutShiftSources,
          loadedFonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family),
          fontRequests: performance.getEntriesByType('resource').filter(r => /\.woff2/.test(r.name)).map(r => ({url: r.name, bytes:r.encodedBodySize})),
        };
      });
      assert.equal(styles.direction, 'rtl');
      assert.equal(styles.overflow, false, `${width} ${route} overflow`);
      assert(styles.layoutShift < 0.1, `${width} ${route} loading shift ${styles.layoutShift}`);
      assert.match(styles.bodyFont, /arabicUi/);
      assert(styles.loadedFonts.some(f => /arabicUi/.test(f)), 'Arabic UI font not loaded');
      assert(styles.fontRequests.every(f => new URL(f.url).origin === new URL(origin).origin), 'External font request');
      if (styles.headingFont?.includes('arabicDisplay')) {
        assert.equal(styles.headingTracking, 'normal');
        assert(styles.loadedFonts.some(f => /arabicDisplay/.test(f)), 'Arabic heading font not loaded');
      }
      if (route === '/ar') {
        await page.screenshot({path:`docs/qa/arabic-typography-${width}.png`, fullPage:true});
      }
      if (route.includes('/products/')) await page.screenshot({path:`docs/qa/arabic-product-${width}.png`,fullPage:true});
      results.push({ width, route, ...styles });
    }
    await page.close();
  }
  // A fresh English visit must not pay the Arabic font download cost.
  const english = await browser.newPage();
  await english.goto(`${origin}/en`, {waitUntil:'networkidle'});
  assert.equal(await english.evaluate(() => performance.getEntriesByType('resource').filter(r=>/\.woff2/.test(r.name)).length), 0, 'English loaded Arabic fonts');
  assert(!await english.locator('html').getAttribute('class'));
  await english.close();
  assert.deepEqual(errors, []);
  fs.writeFileSync('docs/qa/arabic-typography-results.json', JSON.stringify({origin, results, errors},null,2));
  console.log(JSON.stringify({pages:results.length,errors,fonts:'Arabic self-hosted; English zero font downloads'}));
})().catch(error => {console.error(error);process.exitCode=1;}).finally(async()=>browser?.close());
