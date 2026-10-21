import { chromium } from 'playwright';
import fs from 'fs';
const BASE='https://puppy.instabizweb.com';
const routes={home:'/',puppies:'/puppies','puppy-copper-male':'/puppies/copper-male','gone-home':'/gone-home','happy-families':'/happy-families','how-it-works':'/how-it-works',faq:'/faq',contact:'/contact'};
const b=await chromium.launch(); const out={};
for(const w of [1440,375]){
  const H=w<700?812:900;
  const ctx=await b.newContext({viewport:{width:w,height:H}}); const p=await ctx.newPage();
  for(const [name,path] of Object.entries(routes)){
    await p.goto(BASE+path,{waitUntil:'networkidle'}); await p.waitForTimeout(2200);
    const stops=await p.evaluate(()=>[...document.querySelectorAll('[data-pup-stop]')].map(e=>{const r=e.getBoundingClientRect();return {pose:e.dataset.pose,facing:e.dataset.facing,act:e.dataset.act||null,lane:e.dataset.lane||null,behind:e.dataset.behind||null,visible:e.getClientRects().length>0,x:Math.round(r.x),y:Math.round(r.y+scrollY),w:Math.round(r.width),scene:(e.closest('[data-pup-scene]')?.className||'').split(' ').slice(1,2)[0]||null,cls:e.className.slice(0,60)}}));
    const total=await p.evaluate(()=>document.documentElement.scrollHeight);
    const track=[]; const bubbles=new Set();
    for(let y=0;y<total-H;y+=Math.round(H*0.3)){
      await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(450);
      const s=await p.evaluate(()=>{const a=document.querySelector('.pup-actor');const bb=document.querySelector('.pup-bubble');const r=a?.getBoundingClientRect();const lay=document.querySelector('.pup-layer');return {tr:a?.style.transform,x:r&&Math.round(r.x),y:r&&Math.round(r.y),w:r&&Math.round(r.width),bub:bb?.textContent,show:bb?.dataset.show,layerHidden:lay?.hidden,front:lay?.dataset.front,htmlPup:document.documentElement.dataset.pup||null,pose:a?.querySelector('svg')?.outerHTML.length}});
      track.push({scrollY:y,...s}); if(s.bub&&s.show==='true') bubbles.add(s.bub);
    }
    out[`${name}-${w}`]={stops,track,bubbles:[...bubbles]};
    console.log(name,w,stops.length,[...bubbles]);
  }
  await ctx.close();
}
fs.writeFileSync('../raw/pup-actor.json',JSON.stringify(out,null,1));
await b.close();
