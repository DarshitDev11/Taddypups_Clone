import { chromium } from 'playwright';
import fs from 'fs'; import crypto from 'crypto';
const BASE='https://puppy.instabizweb.com';
const routes={home:'/',puppies:'/puppies','puppy-copper-male':'/puppies/copper-male','gone-home':'/gone-home','happy-families':'/happy-families','how-it-works':'/how-it-works',faq:'/faq',contact:'/contact'};
fs.mkdirSync('../assets/svg',{recursive:true});
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const svgs=new Map(); const imgs=new Map(); const bgs=new Set();
for(const [name,path] of Object.entries(routes)){
  await p.goto(BASE+path,{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
  await p.evaluate(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,600));});
  const d=await p.evaluate(()=>{
    const ctx=(e)=>{const a=[];let n=e.parentElement;for(let i=0;i<4&&n;i++,n=n.parentElement){const c=(typeof n.className==='string'?n.className:'').split(/\s+/).filter(x=>/^(tp-|pup-|font)/.test(x))[0];if(c)a.push(c);}return a.join('<');};
    const svgs=[...document.querySelectorAll('svg')].map(s=>{const c=s.cloneNode(true);const r=s.getBoundingClientRect();return {ctx:ctx(s),cls:(s.getAttribute('class')||'').slice(0,60),w:Math.round(r.width),h:Math.round(r.height),html:s.outerHTML}});
    const imgs=[...document.images].map(i=>({src:i.currentSrc||i.src,alt:i.alt}));
    const vids=[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc||v.src,poster:v.poster}));
    const bgs=[...document.querySelectorAll('*')].map(e=>getComputedStyle(e).backgroundImage).filter(x=>x.includes('url(')&&!x.includes('data:')).slice(0,20);
    return {svgs,imgs,vids,bgs};
  });
  for(const s of d.svgs){ const h=crypto.createHash('md5').update(s.html).digest('hex').slice(0,8); if(!svgs.has(h)) svgs.set(h,{...s,pages:[name]}); else svgs.get(h).pages.push(name);}
  for(const i of d.imgs) imgs.set(i.src,i.alt);
  for(const v of d.vids) imgs.set('VIDEO '+v.src,v.poster);
  d.bgs.forEach(x=>bgs.add(x));
  console.log(name,d.svgs.length,d.imgs.length,d.vids.length);
}
const idx=[];
for(const [h,s] of svgs){
  let html=s.html; if(!html.includes('xmlns=')) html=html.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');
  const fn=`${(s.ctx||s.cls||'svg').replace(/[^a-z0-9_<-]/gi,'_').slice(0,50)||'svg'}-${h}.svg`;
  fs.writeFileSync('../assets/svg/'+fn,html);
  idx.push({file:fn,ctx:s.ctx,cls:s.cls,w:s.w,h:s.h,bytes:html.length,pages:[...new Set(s.pages)]});
}
fs.writeFileSync('../raw/svg-index.json',JSON.stringify(idx,null,1));
fs.writeFileSync('../raw/img-urls.json',JSON.stringify([...imgs].map(([src,alt])=>({src,alt})),null,1));
fs.writeFileSync('../raw/bg-urls.json',JSON.stringify([...bgs],null,1));
console.log('unique svgs',svgs.size,'imgs',imgs.size);
await b.close();
