import { chromium } from 'playwright';
import fs from 'fs';
const BASE='https://puppy.instabizweb.com';
const routes={home:'/',puppies:'/puppies','puppy-copper-male':'/puppies/copper-male','gone-home':'/gone-home','happy-families':'/happy-families','how-it-works':'/how-it-works',faq:'/faq',contact:'/contact'};
const b=await chromium.launch();
for(const w of [1440,375]){
 const ctx=await b.newContext({viewport:{width:w,height:w<700?812:900}}); const p=await ctx.newPage();
 for(const [name,path] of Object.entries(routes)){
  await p.goto(BASE+path,{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
  await p.evaluate(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,70));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,600));});
  const lines=await p.evaluate(()=>{
    const out=[]; const MAX=9;
    const walk=(e,d)=>{
      if(d>MAX)return;
      const tag=e.tagName.toLowerCase(); if(['script','style','path','defs','g','circle','ellipse','rect','line','polygon','use','pattern','linearGradient','radialGradient','stop','filter','clipPath','mask','tspan','text','title','desc'].includes(tag)) return;
      if(tag==='svg'){const r=e.getBoundingClientRect(); out.push('  '.repeat(d)+`svg.${(e.getAttribute('class')||'').slice(0,60)} ${Math.round(r.width)}x${Math.round(r.height)}`);return;}
      const r=e.getBoundingClientRect(); const cs=getComputedStyle(e);
      if(cs.display==='none'&&d>1){return;}
      const cls=(typeof e.className==='string'?e.className:'').replace(/\s+/g,' ').trim().slice(0,170);
      const attrs=[...e.attributes].filter(a=>a.name.startsWith('data-')||['role','aria-label','href','id','type'].includes(a.name)).map(a=>`${a.name}=${a.value.slice(0,40)}`).join(' ');
      const txt=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').slice(0,50);
      out.push('  '.repeat(d)+`<${tag}${cls?'.'+cls:''}${attrs?' ['+attrs+']':''}> ${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.x)},${Math.round(r.y+scrollY)}${cs.position!=='static'?' '+cs.position:''}${cs.display.includes('grid')?' grid '+cs.gridTemplateColumns.slice(0,60):cs.display.includes('flex')?' flex '+cs.flexDirection:''}${txt?' "'+txt+'"':''}`);
      for(const c of e.children) walk(c,d+1);
    };
    for(const c of document.body.children) walk(c,0);
    return out;
  });
  fs.writeFileSync(`../raw/outline-${name}-${w}.txt`,lines.join('\n'));
  console.log(name,w,lines.length);
 }
 await ctx.close();
}
await b.close();
