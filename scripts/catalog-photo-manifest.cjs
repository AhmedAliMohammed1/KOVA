/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require(require.resolve('sharp', {paths:[require.resolve('next')]}));
const sourceDirectory = process.argv[2] || 'ELESAWY STUDIOS-20261021T195231Z-1-001/ELESAWY STUDIOS';
const knownSources = JSON.parse(fs.readFileSync('docs/product-photo-sources.json','utf8'));
const review = JSON.parse(fs.readFileSync('docs/product-photo-review.json','utf8'));
const numberOf = file => /^ELESAWY STUDIOS\.jpg$/i.test(file) ? 1 : Number(file.match(/^ELESAWY STUDIOS-(\d+)\.jpg$/i)?.[1]);
const viewLabels = {
  'full-front':['full-length front view','صورة أمامية كاملة'],
  'front-three-quarter':['front or three-quarter pose','صورة أمامية أو بزاوية'],
  side:['side view','صورة جانبية'],
  'pocket-detail':['pocket and garment detail','تفاصيل الجيوب والملابس'],
  'trouser-detail':['trouser detail','تفاصيل البنطلون'],
  'side-detail':['side garment detail','تفاصيل جانبية للملابس'],
  'still-life':['still-life with a water bottle nearby','صورة ثابتة وبجوار الملابس زجاجة ماء'],
  'water-demonstration':['water-pour demonstration frame','لقطة لسكب الماء على الملابس']
};
(async()=>{
  const files=fs.readdirSync(sourceDirectory).filter(file=>/\.jpg$/i.test(file) && Number.isInteger(numberOf(file))).sort((a,b)=>numberOf(a)-numberOf(b));
  const assigned=Object.values(review.groups).flatMap(group=>group.order).sort((a,b)=>a-b);
  const observed=files.map(numberOf);
  if(JSON.stringify(assigned)!==JSON.stringify(observed)) throw new Error('Visual group assignments must cover each source exactly once');
  const views=Object.values(review.views).flat().sort((a,b)=>a-b);
  if(JSON.stringify(views)!==JSON.stringify(observed)) throw new Error('View assignments must cover each source exactly once');
  const assets=[];
  for(const file of files) {
    const number=numberOf(file);
    const known=knownSources.find(source=>source.number===number);
    const [groupId,group]=Object.entries(review.groups).find(([,group])=>group.order.includes(number));
    const [view]=Object.entries(review.views).find(([,numbers])=>numbers.includes(number));
    const localSourcePath=path.join(sourceDirectory,file).replaceAll('\\','/');
    const localPath=`apps/storefront/public/images/kova/studio-${number}.webp`;
    const [original,optimized]=await Promise.all([sharp(localSourcePath).metadata(),sharp(localPath).metadata()]);
    assets.push({number,sourceId:known?.id??null,sourceName:file,sourceUrl:known?.url??null,localSourcePath,sha256:crypto.createHash('sha256').update(fs.readFileSync(localSourcePath)).digest('hex'),sourceBytes:fs.statSync(localSourcePath).size,sourceDimensions:{width:original.width,height:original.height,orientation:original.orientation??1},group:groupId,observedColour:group.colour,view,localPath,publicPath:`/images/kova/studio-${number}.webp`,dimensions:{width:optimized.width,height:optimized.height},bytes:fs.statSync(localPath).size,groupOrder:group.order.indexOf(number)+1,alt:{en:`${group.subjectEn}, ${viewLabels[view][0]}`,ar:`${group.subjectAr}، ${viewLabels[view][1]}`},productAssociation:group.approvedProductSlug?{productId:group.approvedProductId,productSlug:group.approvedProductSlug,colourCode:group.colour}:null,mappingStatus:group.approvedProductSlug?'Owner-confirmed product/color mapping; database draft awaiting sizes, stock and deployment':'Not assigned: demonstration image excluded from product galleries',usage:number===14?'Homepage hero and grey product gallery':number===10?'Homepage women editorial and grey product gallery':number===55?'Homepage men editorial and black product gallery':groupId==='burgundy-demonstration'?'Not published: imagery is not evidence of fabric performance':'Color-specific product gallery; database product remains a draft'});
  }
  const hashes=new Map();
  for(const asset of assets) hashes.set(asset.sha256,[...(hashes.get(asset.sha256)??[]),asset.number]);
  const manifest={folderId:'1kIySxOJEz2FL5by7g4LbGJb73wX_QPlu',localSourceDirectory:sourceDirectory,reviewedOn:review.reviewedOn,sourceCount:assets.length,sourceBytes:assets.reduce((sum,a)=>sum+a.sourceBytes,0),optimizedBytes:assets.reduce((sum,a)=>sum+a.bytes,0),exactDuplicateGroups:[...hashes.values()].filter(numbers=>numbers.length>1),mappingNotes:review.mappingNotes,assets};
  fs.writeFileSync('docs/product-photography-manifest.json',JSON.stringify(manifest,null,2)+'\n');
  for(let page=1;page<=Math.ceil(assets.length/20);page++) fs.copyFileSync(`.kova-assets/contact-sheet-${page}.jpg`,`docs/qa/studio-contact-sheet-${page}.jpg`);
  console.log(JSON.stringify({images:assets.length,sourceBytes:manifest.sourceBytes,optimizedBytes:manifest.optimizedBytes,exactDuplicateGroups:manifest.exactDuplicateGroups},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
