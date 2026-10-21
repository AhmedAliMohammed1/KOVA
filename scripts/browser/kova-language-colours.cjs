/* eslint-disable @typescript-eslint/no-require-imports */
const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');
const origin=process.env.KOVA_STOREFRONT_URL||'http://localhost:3200';let browser;
(async()=>{
 browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:375,height:812},locale:'en-US'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const checks=[];
 await page.goto(origin,{waitUntil:'networkidle'});
 assert.equal(new URL(page.url()).pathname,'/ar');
 assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
 checks.push('Fresh root visit opens Arabic despite English browser preference');
 for(const [locale,width,label] of [['ar',375,'أزرق'],['en',1440,'Blue']]){
  await page.setViewportSize({width,height:900});
  await page.goto(`${origin}/${locale}`,{waitUntil:'networkidle'});
  assert.equal(new URL(page.url()).pathname,`/${locale}`);
  const card=page.locator('article').filter({has:page.locator('a[href*="/products/kova-womens-scrub-set"]')}).first();
  const original=await card.locator('img').getAttribute('src');
  await card.getByRole('button',{name:label,exact:true}).click();
  assert.equal(await card.getByRole('button',{name:label,exact:true}).getAttribute('aria-pressed'),'true');
  await card.locator('img').evaluate(img=>img.decode());
  const selected=await card.locator('img').getAttribute('src');assert.notEqual(selected,original);
  const imagePath=new URL(selected,origin).searchParams.get('url');
  for(const href of await card.locator('a').evaluateAll(links=>links.map(a=>a.href))) assert.equal(new URL(href).searchParams.get('colour'),'blue');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`docs/qa/${locale}-home-colour-selected.png`,fullPage:true});
  await card.locator('a').first().click();
  await page.waitForURL(`**/${locale}/products/kova-womens-scrub-set?colour=blue`);
  await page.getByRole('radio',{name:label,exact:true}).waitFor();
  assert.equal(await page.getByRole('radio',{name:label,exact:true}).getAttribute('aria-checked'),'true');
  const gallery=await page.locator('main img').first().getAttribute('src');
  assert.equal(new URL(gallery,origin).searchParams.get('url'),imagePath);
  checks.push(`${locale}: swatch changes photo, all links carry colour, product opens with matching gallery, no horizontal overflow`);
 }
 assert.deepEqual(errors,[]);
 const result={date:new Date().toISOString(),origin,checks,runtimeErrors:errors};
 fs.writeFileSync('docs/qa/language-colour-results.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));await browser.close();
})().catch(async error=>{console.error(error);await browser?.close();process.exitCode=1;});
