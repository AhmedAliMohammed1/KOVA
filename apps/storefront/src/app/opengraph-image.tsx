import { ImageResponse } from "next/og";
export const alt = "KOVA Scrubs — For those who care. Every shift.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',background:'#06152d',padding:70,color:'white'}}><div style={{display:'flex',fontSize:32,letterSpacing:8}}>KOVA SCRUBS</div><div style={{display:'flex',flexDirection:'column',fontSize:86,lineHeight:1.1}}><div>For those who care.</div><div style={{color:'#55d5cd'}}>Every shift.</div></div><div style={{display:'flex',fontSize:24,color:'#c1d2e1'}}>Medical apparel · Egypt</div></div>,size);
}
