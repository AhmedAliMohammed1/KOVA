/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }));
(async () => {
  const output = 'apps/storefront/public/images/kova';
  fs.mkdirSync(output, { recursive: true });
  const source = process.argv[2] || '.kova-assets';
  const numberOf = file => /^ELESAWY STUDIOS\.jpg$/i.test(file) ? 1 : Number(file.match(/^(?:ELESAWY STUDIOS-)?(\d+)\.jpg$/i)?.[1]);
  const files = fs.readdirSync(source).filter(f => /\.jpg$/i.test(f) && Number.isInteger(numberOf(f))).sort((a,b) => numberOf(a)-numberOf(b));
  if (!files.length) throw new Error('No numbered studio JPEGs found');
  fs.mkdirSync('.kova-assets', {recursive:true});
  let tiles = [];
  for (let i=0; i<files.length; i++) {
    const file = files[i];
    const number = numberOf(file);
    const data = await sharp(path.join(source, file)).rotate().resize(1600, 2000, {fit:'inside', withoutEnlargement:true}).webp({quality:88}).toBuffer();
    fs.writeFileSync(path.join(output, `studio-${number}.webp`), data);
    const adminOutput = 'apps/admin/public/images/kova';
    fs.mkdirSync(adminOutput, {recursive:true});
    fs.writeFileSync(path.join(adminOutput, `studio-${number}.webp`), data);
    const tile = await sharp(data).resize(250, 320, {fit:'contain', background:'#eef1f5'}).toBuffer();
    const index = i % 20;
    tiles.push({input:tile, left:(index%5)*250, top:Math.floor(index/5)*350});
    tiles.push({input:Buffer.from(`<svg width="250" height="30"><rect width="250" height="30" fill="white"/><text x="12" y="22" font-size="18">ELESAWY STUDIOS-${number}</text></svg>`), left:(index%5)*250, top:Math.floor(index/5)*350+320});
    if (index === 19 || i === files.length-1) {
      const page=Math.floor(i/20)+1;
      await sharp({create:{width:1250,height:Math.ceil((index+1)/5)*350,channels:3,background:'#ffffff'}}).composite(tiles).jpeg().toFile(`.kova-assets/contact-sheet-${page}.jpg`);
      tiles=[];
    }
  }
  // Crop the supplied official artwork without redrawing or stretching the logo.
  await sharp('5cb5ebdc-ec30-4ead-9d74-edc2083c17be.jpg').extract({left:425,top:128,width:410,height:560}).resize({height:280}).webp({quality:92}).toFile(path.join(output,'official-logo.webp'));
  await sharp('5cb5ebdc-ec30-4ead-9d74-edc2083c17be.jpg').extract({left:472,top:132,width:318,height:386}).resize(128,156).png().toFile('apps/storefront/src/app/icon.png');
  fs.copyFileSync('apps/storefront/src/app/icon.png','apps/admin/src/app/icon.png');
  console.log(`Optimized ${files.length} photographs; contact sheet ready.`);
})();
