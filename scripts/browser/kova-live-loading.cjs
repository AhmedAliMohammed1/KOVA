/* eslint-disable @typescript-eslint/no-require-imports */
const {chromium}=require('playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const origin=process.env.KOVA_STOREFRONT_URL||'https://kova-green-delta.vercel.app';
let browser;
(async()=>{
 browser=await chromium.launch({headless:true,channel:'msedge'});
 const samples=[];const runtimeErrors=[];
 for(const route of ['/en','/en/products/kova-mens-scrub-set']) {
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  page.on('pageerror',e=>runtimeErrors.push(e.message));
  await page.addInitScript(()=>{
   window.__kovaLiveVitals={lcp:0,cls:0};
   new PerformanceObserver(list=>{for(const e of list.getEntries()) window.__kovaLiveVitals.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(list=>{for(const e of list.getEntries()) if(!e.hadRecentInput)window.__kovaLiveVitals.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  });
  const start=Date.now();const response=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:45000});
  assert.equal(response.status(),200);
  if(route==='/en'){
   await page.locator('main a[href*="/products/kova-womens-scrub-set"]').first().waitFor({timeout:15000});
   await page.locator('main a[href*="/products/kova-mens-scrub-set"]').first().waitFor({timeout:15000});
  } else {
   await page.getByRole('heading',{name:"KOVA Men's Scrub Set",exact:true}).waitFor({timeout:15000});
  }
  const contentReadyMs=Date.now()-start;
  await page.locator('main img').first().evaluate(img=>img.decode());
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const metrics=await page.evaluate(()=>({lcpMs:Math.round(window.__kovaLiveVitals.lcp),cls:window.__kovaLiveVitals.cls,ttfbMs:Math.round(performance.getEntriesByType('navigation')[0].responseStart),domMs:Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd)}));
  if(route==='/en') {
   for(const img of await page.locator('main img').all()) {
    await img.scrollIntoViewIfNeeded();await img.evaluate(img=>img.decode());
   }
   await page.evaluate(()=>window.scrollTo(0,0));
  }
  await page.screenshot({path:`docs/qa/live-${route==='/en'?'home':'mens-product'}.png`,fullPage:true});
  samples.push({route,status:response.status(),contentReadyMs,...metrics});await page.close();
 }
 assert.deepEqual(runtimeErrors,[]);
 const result={date:new Date().toISOString(),origin,environment:'Live production site; desktop Edge headless with mobile viewport; unthrottled workstation connection',limits:'One navigation per route; no field p75, INP or universal speed guarantee. Network and cold-cache effects remain.',samples,runtimeErrors};
 fs.writeFileSync('docs/qa/live-loading.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
