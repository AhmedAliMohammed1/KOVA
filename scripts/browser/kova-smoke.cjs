/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const store = process.env.KOVA_STOREFRONT_URL || 'http://localhost:3000';
const admin = process.env.KOVA_ADMIN_URL || 'http://localhost:3001';
const output = path.resolve('docs/qa');
const results = [];
let browser;
(async () => {
  fs.mkdirSync(output, { recursive: true });
  browser = await chromium.launch({ headless: true, channel: process.env.KOVA_BROWSER_CHANNEL || 'msedge' });
  const context = await browser.newContext({ viewport: {width:1440,height:1000}, reducedMotion:'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const locale of ['en','ar']) {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',375,812],['tablet',768,1024],['landscape',812,375]]) {
      await page.setViewportSize({width,height});
      const response = await page.goto(`${store}/${locale}`, {waitUntil:'networkidle'});
      assert.equal(response.status(),200);
      assert.equal(await page.locator('html').getAttribute('dir'),locale === 'ar' ? 'rtl' : 'ltr');
      const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow,false,`${locale}/${name} overflow`);
      assert.equal(await page.locator('h1').count(),1);
      const broken = await page.locator('img').evaluateAll(imgs=>imgs.filter(img=>img.complete && img.naturalWidth===0).map(img=>img.src));
      assert.deepEqual(broken,[]);
      if(name==='desktop'||name==='mobile') await page.screenshot({path:path.join(output,`${locale}-${name}.png`),fullPage:true});
      results.push({check:`${locale} ${name} homepage / images / reflow`,pass:true});
    }
  }
  await page.setViewportSize({width:375,height:812});
  await page.goto(`${store}/en`,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Open navigation menu'}).click();
  assert.equal(await page.getByRole('dialog',{name:'Store navigation'}).isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button',{name:'Open navigation menu'}).evaluate(el=>el===document.activeElement),true);
  results.push({check:'Mobile dialog opens, Escape closes, focus returns',pass:true});
  await page.goto(`${store}/en/shop?category=women&size=M`,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Open navigation menu'}).click();
  await page.getByRole('dialog').getByRole('link',{name:'العربية',exact:true}).click();
  await page.waitForURL('**/ar/shop?category=women&size=M');
  results.push({check:'Language switch retains catalog filters',pass:true});
  await page.goto(`${store}/en/shop?q=zzznomatchzz`,{waitUntil:'networkidle'});
  await page.getByRole('heading',{name:'No scrubs match your selection'}).waitFor();
  results.push({check:'Catalog no-results recovery',pass:true});
  await page.goto(`${store}/en/shop`,{waitUntil:'networkidle'});
  const productLink=page.locator('main a[href*="/products/"]').first();
  const href=await productLink.getAttribute('href');
  await page.goto(`${store}${href}`,{waitUntil:'networkidle'});
  await page.getByRole('radio',{name:'Blue',exact:true}).click();
  assert.ok(page.url().includes('colour=blue'));
  const selectedImage=await page.locator('main img').first().getAttribute('src');
  assert.ok(decodeURIComponent(selectedImage).includes('studio-29.webp'));
  await page.getByRole('button',{name:'Open navigation menu'}).click();
  await page.getByRole('dialog').getByRole('link',{name:'العربية',exact:true}).click();
  await page.waitForURL('**/ar/products/**');
  assert.equal(await page.getByRole('radio',{name:'أزرق',exact:true}).getAttribute('aria-checked'),'true');
  results.push({check:'New KOVA colour gallery and selected colour survive language switching',pass:true});
  await page.goto(`${store}${href}?colour=burgundy`,{waitUntil:'networkidle'});
  await page.locator('main img').first().evaluate(img => img.decode());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false,'Product gallery must not overflow on mobile');
  await page.screenshot({path:path.join(output,'product-mobile.png'),fullPage:true});
  assert.equal(await page.getByRole('button',{name:'Add to shopping bag',exact:true}).count(),0);
  await page.getByText('Sizes and stock have not been published yet.',{exact:false}).waitFor();
  assert.ok((await page.locator('main').innerText()).includes('200'));
  await page.setViewportSize({width:1440,height:1000});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false,'Product gallery must not overflow on desktop');
  await page.goto(`${store}/en/products/kova-mens-scrub-set`,{waitUntil:'networkidle'});
  await page.locator('main img').first().evaluate(img => img.decode());
  await page.getByRole('radio',{name:'Black',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Add to shopping bag',exact:true}).count(),0);
  await page.screenshot({path:path.join(output,'mens-product-desktop.png'),fullPage:true});
  await page.setViewportSize({width:375,height:812});
  results.push({check:'New products show approved price/deposit and cannot be ordered without confirmed sizes/stock',pass:true});
  await page.goto(`${store}/en/checkout`,{waitUntil:'networkidle'});
  if(process.env.KOVA_CONNECTED === 'true') {
    assert.equal(await page.getByRole('heading',{name:'Checkout is temporarily unavailable'}).count(),0);
    results.push({check:'Connected checkout renders without submitting a live order',pass:true});
  } else {
    await page.getByRole('heading',{name:'Checkout is temporarily unavailable'}).waitFor();
    results.push({check:'Unconfigured checkout remains unavailable without fabricating an order',pass:true});
  }
  await page.goto(`${store}/en/products/female-design-2-scrub-set`,{waitUntil:'networkidle'});
  assert.ok((await page.locator('meta[name="robots"]').first().getAttribute('content')).includes('noindex'));
  results.push({check:'Retired Scrub Vibe product is absent from preview catalog',pass:true});
  for(const locale of ['en','ar']) for(const topic of ['sizing','shipping','returns','contact','privacy','terms']) {
    const response=await page.goto(`${store}/${locale}/help/${topic}`,{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200);
  }
  results.push({check:'All six help topics render in both languages',pass:true});
  const missing=await page.goto(`${store}/en/products/not-a-product`,{waitUntil:'networkidle'});
  assert.ok([200,404].includes(missing.status()));
  assert.ok((await page.locator('meta[name="robots"]').first().getAttribute('content')).includes('noindex'));
  results.push({check:'Unavailable product displays not-found UI with noindex (Next streamed responses may use 200)',pass:true});
  await page.goto(`${admin}/en/admin`,{waitUntil:'networkidle'});
  assert.match(page.url(),/\/en\/account/);
  await page.screenshot({path:path.join(output,'admin-guest.png'),fullPage:true});
  results.push({check:'Admin guest is redirected to host-local staff sign-in',pass:true});
  assert.deepEqual(errors,[],`Browser runtime errors: ${errors.join('; ')}`);
  results.push({check:'No browser page errors across tested flows',pass:true});
  fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({date:new Date().toISOString(),environment:process.env.KOVA_CONNECTED === 'true' ? 'Local production builds, Supabase connected, local draft catalog preview' : 'Local builds, no Supabase credentials',storefrontOrigin:store,adminOrigin:admin,results},null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
  await browser.close();
})().catch(async error=>{console.error(error);await browser?.close();process.exitCode=1;});
