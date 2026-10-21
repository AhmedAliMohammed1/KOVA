/* eslint-disable @typescript-eslint/no-require-imports */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const store=process.env.KOVA_STOREFRONT_URL||'http://localhost:3200';
const admin=process.env.KOVA_ADMIN_URL||'http://localhost:3201';
const configuredUrl=fs.readFileSync('apps/storefront/.env.local','utf8').match(/^NEXT_PUBLIC_SUPABASE_URL="?([^"\r\n]+)/m)?.[1];
const supabaseProject=configuredUrl?new URL(configuredUrl).hostname.split('.')[0]:'unconfigured';
let browser;
(async()=>{
 browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];const checks=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const locale of ['en','ar']){
  await page.goto(`${store}/${locale}/account`,{waitUntil:'networkidle'});
  await page.locator('#auth-email').waitFor();
  assert.equal(await page.locator('main button[type=submit]').isEnabled(),true);
  await page.goto(`${store}/${locale}/account/sign-up`,{waitUntil:'networkidle'});
  await page.locator('#auth-fullName').waitFor();
  assert.equal(await page.locator('main button[type=submit]').isEnabled(),true);
  await page.goto(`${store}/${locale}/account/forgot-password`,{waitUntil:'networkidle'});
  assert.equal(await page.locator('main button[type=submit]').isEnabled(),true);
  checks.push(`${locale}: sign-in, registration and recovery forms enabled`);
 }
 await page.goto(`${store}/en/account`,{waitUntil:'networkidle'});
 await page.locator('#auth-email').fill('kova-qa-nonexistent@example.invalid');
 await page.locator('#auth-password').fill('invalid-qa-password');
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.getByRole('alert').getByText('The email or password is incorrect.',{exact:true}).waitFor();
 checks.push('Sign-in server action reaches Auth and rejects invalid credentials');
 await page.goto(`${store}/en/admin`,{waitUntil:'networkidle'});
 assert.equal(new URL(page.url()).origin,admin);
 assert.equal(new URL(page.url()).pathname,'/en/account');
 assert.equal(await page.getByRole('button',{name:'Sign in',exact:true}).isEnabled(),true);
 checks.push('Legacy admin URL redirects to configured admin sign-in');
 await page.goto(`${store}/en/products/kova-womens-scrub-set`,{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Save to wishlist',exact:true}).click();
 await page.getByRole('button',{name:'Saved in your wishlist',exact:true}).waitFor();
 await page.goto(`${store}/en/wishlist`,{waitUntil:'networkidle'});
 await page.getByRole('link',{name:/KOVA Women's Scrub Set/}).first().waitFor();
 await page.reload({waitUntil:'networkidle'});
 await page.getByRole('link',{name:/KOVA Women's Scrub Set/}).first().waitFor();
 checks.push('Wishlist save, navigation and reload persistence');
 for(const locale of ['en','ar']){
  await page.setViewportSize({width:375,height:812});
  await page.goto(`${store}/${locale}/products/kova-womens-scrub-set`,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:locale==='en'?'Interactive size guide':'دليل وحاسبة المقاسات',exact:true}).click();
  const dialog=page.getByRole('dialog');await dialog.waitFor();
  assert.equal(await dialog.locator('header').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(6, 21, 45)');
  assert.equal(await dialog.evaluate(el=>el.scrollWidth>el.clientWidth),false);
  await dialog.getByRole('button',{name:locale==='en'?'inches':'بوصة (in)',exact:true}).click();
  await dialog.getByRole('tab').nth(1).click();
  await dialog.locator('input[type=number]').first().fill('38');
  await dialog.screenshot({path:`docs/qa/${locale}-size-guide.png`});
  await page.keyboard.press('Escape');
  assert.equal(await dialog.count(),0);
  checks.push(`${locale}: size guide opens, KOVA colours, mobile reflow, units, calculator, Escape`);
 }
 await page.goto(`${store}/en/checkout`,{waitUntil:'networkidle'});
 assert.equal(await page.getByText('Checkout is temporarily unavailable',{exact:true}).count(),0);
 checks.push('Checkout route uses connected application, without submitting live orders');
 assert.deepEqual(errors,[]);
 const result={date:new Date().toISOString(),environment:'Local production builds connected to configured Supabase; draft catalog preview; no new users/orders or email sent',supabaseProject,checks,runtimeErrors:errors,limits:['No staff credentials supplied; successful staff/customer authentication and protected operations unverified','Server secret is unavailable locally; privileged checkout/payment operations remain unverified','No fabricated stock; buying remains disabled for draft products']};
 fs.writeFileSync('docs/qa/connected-browser-results.json',JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result,null,2));await browser.close();
})().catch(async error=>{console.error(error);await browser?.close();process.exitCode=1;});
