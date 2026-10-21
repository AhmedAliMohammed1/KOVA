/* eslint-disable @typescript-eslint/no-require-imports */
const {chromium}=require('playwright');
const fs=require('node:fs');
const origin=process.env.KOVA_STOREFRONT_URL || 'http://localhost:3100';
let browser;
(async()=>{
 browser=await chromium.launch({headless:true,channel:process.env.KOVA_BROWSER_CHANNEL || 'msedge'});
 const samples=[];
 for(const route of ['/en','/ar','/en/shop','/en/products/kova-womens-scrub-set']) {
  // Warm server compilation/image caches; each measured iteration uses a fresh browser cache.
  const warm=await browser.newPage();await warm.goto(origin+route,{waitUntil:'networkidle'});await warm.close();
  for(let run=1;run<=3;run++) {
   const context=await browser.newContext({viewport:{width:375,height:812},deviceScaleFactor:1,isMobile:true,reducedMotion:'reduce'});
   const page=await context.newPage();
   const cdp=await context.newCDPSession(page);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   await cdp.send('Network.enable');
   await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
   await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
   await page.addInitScript(()=>{
    window.__kovaVitals={lcp:0,cls:0};
    new PerformanceObserver(list=>{for(const entry of list.getEntries()) window.__kovaVitals.lcp=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(list=>{for(const entry of list.getEntries()) if(!entry.hadRecentInput)window.__kovaVitals.cls+=entry.value;}).observe({type:'layout-shift',buffered:true});
   });
   await page.goto(origin+route,{waitUntil:'networkidle'});
   await page.waitForTimeout(750);
   const metrics=await page.evaluate(()=>({lcpMs:Math.round(window.__kovaVitals.lcp),cls:Math.round(window.__kovaVitals.cls*10000)/10000,ttfbMs:Math.round(performance.getEntriesByType('navigation')[0].responseStart),transferBytes:performance.getEntriesByType('resource').reduce((sum,e)=>sum+e.transferSize,0)}));
   samples.push({route,run,...metrics});await context.close();
  }
 }
 const routes=[...new Set(samples.map(s=>s.route))].map(route=>{
  const values=samples.filter(s=>s.route===route);const median=key=>values.map(s=>s[key]).sort((a,b)=>a-b)[1];
  return {route,medianLcpMs:median('lcpMs'),medianCls:median('cls'),medianTtfbMs:median('ttfbMs'),medianTransferBytes:median('transferBytes')};
 });
 const result={date:new Date().toISOString(),environment:'Local production Next.js; Edge headless; 375×812; fresh browser cache; warm server/image cache; CPU 4x; 150ms latency; 1.6 Mbps download; 750 Kbps upload; three runs per route; connected KOVA Supabase',limits:'Navigation LCP/CLS samples, not Lighthouse, not field p75, and no INP measurement. Representative image assets are local; public database reads use the configured Supabase project and a warm server data cache.',targets:{lcpMs:2500,cls:0.1,inpMs:200},routes,samples};
 fs.writeFileSync('docs/qa/performance.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(routes,null,2));
 await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
