import manifest from "../../../../../docs/product-photography-manifest.json";
import type { Product } from "./types";

// Owner-approved on 2026-10-21: one women's set / three colours, one men's set;
// EGP 850 each, EGP 200 COD deposit. No sizes, variants or stock were supplied.
const definitions = [
  { id: "20", slug: "kova-womens-scrub-set", category: "women", title: {en:"KOVA Women's Scrub Set",ar:"طقم سكراب كوفا حريمي"}, groups: ["grey-womens-set","blue-womens-set","burgundy-womens-set"] },
  { id: "21", slug: "kova-mens-scrub-set", category: "men", title: {en:"KOVA Men's Scrub Set",ar:"طقم سكراب كوفا رجالي"}, groups: ["black-mens-set"] },
];
const colours:Record<string,{code:string;swatch:string;name:{en:string;ar:string}}> = {
  "grey-womens-set":{code:"grey",swatch:"#96959c",name:{en:"Grey",ar:"رمادي"}},
  "blue-womens-set":{code:"blue",swatch:"#205da1",name:{en:"Blue",ar:"أزرق"}},
  "burgundy-womens-set":{code:"burgundy",swatch:"#792530",name:{en:"Burgundy",ar:"نبيتي"}},
  "black-mens-set":{code:"black",swatch:"#191d1b",name:{en:"Black",ar:"أسود"}},
};
export const kovaCatalog:Product[] = definitions.map(definition=>{
  const images=definition.groups.flatMap((group,index)=>manifest.assets.filter(asset=>asset.group===group).sort((a,b)=>a.groupOrder-b.groupOrder).map(asset=>({src:asset.publicPath,alt:asset.alt,colourCode:colours[group].code,position:index*100+asset.groupOrder})));
  const primary=colours[definition.groups[0]];
  return {...definition,description:{en:"V-neck scrub set. Select a colour to explore the studio gallery. Size and availability details are awaiting confirmation.",ar:"طقم سكراب برقبة V. اختر اللون لاستعراض صور الاستوديو. تفاصيل المقاسات والتوفر في انتظار التأكيد."},price:85000,codDeposit:20000,color:primary.swatch,colorCode:primary.code,colorName:primary.name,colors:definition.groups.map(group=>({...colours[group],id:`${definition.id}-${colours[group].code}`,sizes:[],variants:{},allVariants:{},stockBySize:{},inStock:false})),sizes:[],inStock:false,availabilityPending:true,art:"ink",image:images[0],images};
});
