/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {createClient}=require('@supabase/supabase-js');
const values={};
for(const line of fs.readFileSync('apps/storefront/.env.local','utf8').split(/\r?\n/)) {
 const match=line.match(/^(NEXT_PUBLIC_SUPABASE_(?:URL|PUBLISHABLE_KEY))=(.*)$/);
 if(match) values[match[1]]=match[2].startsWith('"')?JSON.parse(match[2]):match[2];
}
(async()=>{
 const url=values.NEXT_PUBLIC_SUPABASE_URL;
 assert.equal(url,'https://khccehpehasicomumani.supabase.co');
 const client=createClient(url,values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const products=await client.from('products').select('id,slug');
 assert.equal(products.error,null);assert.deepEqual(products.data.map(p=>p.slug).sort(),['kova-mens-scrub-set','kova-womens-scrub-set']);
 const categories=await client.from('categories').select('slug');
 assert.equal(categories.error,null);assert.equal(categories.data.length,2);
 const shipping=await client.from('shipping_governorates').select('code').eq('is_active',true);
 assert.equal(shipping.error,null);assert.ok(shipping.data.length>0);
 const archive=await client.rpc('admin_delete_product',{p_product_id:2});
 assert.ok(archive.error);assert.equal(archive.error.code,'42501');
 const orders=await client.from('orders').select('id').limit(1);
 assert.ok(orders.error || orders.data.length===0);
 const result={date:new Date().toISOString(),project:'khccehpehasicomumani',checks:{publicApiConnected:true,approvedProductsVisible:true,categories:categories.data.length,shippingGovernorates:shipping.data.length,anonymousProductMutationDenied:true,anonymousOrdersNotExposed:true},writesPerformed:false};
 fs.writeFileSync('docs/qa/new-database-public-api.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
