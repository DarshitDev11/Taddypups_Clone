import { chromium } from 'playwright';
import fs from 'fs';
const BASE='https://puppy.instabizweb.com';
const routes={home:'/',puppies:'/puppies','puppy-copper-male':'/puppies/copper-male','gone-home':'/gone-home','happy-families':'/happy-families','how-it-works':'/how-it-works',faq:'/faq',contact:'/contact'};
fs.mkdirSync('../raw',{recursive:true});
const fn=()=>{
  const r=(n)=>Math.round(n*100)/100;
  const cn=(e)=> (typeof e.className==='string'?e.className:(e.getAttribute('class')||'')).trim().slice(0,160);
  const sel=(e)=>e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(cn(e)?'.'+cn(e).split(/\s+/).slice(0,4).join('.'):'');
  const box=(e)=>{const b=e.getBoundingClientRect();return {x:r(b.x),y:r(b.y+scrollY),w:r(b.width),h:r(b.height)}};
  const secs=[];
  const sectionEls=[...document.querySelectorAll('header, footer, main, main section, main > div > *, section')];
  const seen=new Set();
  for(const e of sectionEls){ if(seen.has(e))continue; seen.add(e);
    const cs=getComputedStyle(e);
    secs.push({sel:sel(e),box:box(e),display:cs.display,position:cs.position,bg:cs.backgroundColor,bgImage:cs.backgroundImage.slice(0,300),padding:cs.padding,margin:cs.margin,maxWidth:cs.maxWidth,gridCols:cs.display.includes('grid')?cs.gridTemplateColumns:undefined,flexDir:cs.display.includes('flex')?cs.flexDirection:undefined,gap:cs.gap,vars:['--sky-top','--sky-bottom','--quilt','--ink','--ink-soft'].map(v=>[v,cs.getPropertyValue(v).trim()]).filter(x=>x[1]),
      overflow:cs.overflow,minHeight:cs.minHeight,zIndex:cs.zIndex});
  }
  const typo=(e)=>{const cs=getComputedStyle(e);return {sel:sel(e),text:(e.innerText||e.value||e.placeholder||'').trim().slice(0,60),box:box(e),fontFamily:cs.fontFamily.split(',')[0],fontSize:cs.fontSize,fontWeight:cs.fontWeight,lineHeight:cs.lineHeight,letterSpacing:cs.letterSpacing,color:cs.color,bg:cs.backgroundColor,padding:cs.padding,border:cs.border,borderRadius:cs.borderRadius,boxShadow:cs.boxShadow,transition:cs.transition.slice(0,200),textAlign:cs.textAlign,textTransform:cs.textTransform,textDecoration:cs.textDecorationLine,rotate:cs.rotate,transform:cs.transform,opacity:cs.opacity,cursor:cs.cursor}};
  const texts=[...document.querySelectorAll('h1,h2,h3,h4,p,figcaption,blockquote,label,input,select,textarea,button,a.btn,nav a,footer a,.chip,[class*="sticker"],[class*="badge"],summary,li,span[class*="font-"]')].filter(e=>e.getBoundingClientRect().width>0).map(typo);
  // dedupe by sel+fontsize+color
  const key=new Set(); const t2=[]; for(const t of texts){const k=[t.sel,t.fontSize,t.fontWeight,t.color,t.box.w].join('|'); if(key.has(k))continue; key.add(k); t2.push(t);}
  const kf=[]; const tr=new Set();
  for(const ss of document.styleSheets){ try{ for(const rule of ss.cssRules){ if(rule.type===7) kf.push(rule.cssText.slice(0,600)); } }catch(e){} }
  const libs={lenis:!!window.lenis, lenisKeys:window.lenis?Object.keys(window.lenis).slice(0,40):null, htmlClass:document.documentElement.className, htmlAttrs:[...document.documentElement.attributes].map(a=>a.name+'='+a.value).join(' '), gsap:!!window.gsap, scrollTrigger:!!window.ScrollTrigger, framer:!!window.__framer_importFromPackage, dataAttrs:[...new Set([...document.querySelectorAll('*')].flatMap(e=>[...e.attributes].map(a=>a.name).filter(n=>n.startsWith('data-'))))].sort(), fonts:[...document.fonts].map(f=>f.family+' '+f.weight+' '+f.status).slice(0,30)};
  const imgs=[...document.images].map(i=>({src:i.currentSrc||i.src,alt:i.alt,w:i.naturalWidth,h:i.naturalHeight,rw:Math.round(i.getBoundingClientRect().width),rh:Math.round(i.getBoundingClientRect().height),cls:cn(i).slice(0,80)}));
  return {url:location.href,docH:document.documentElement.scrollHeight,docW:document.documentElement.clientWidth,secs,typo:t2,kf,libs,imgs};
};
const b=await chromium.launch();
for(const w of [1440,375]){
  const ctx=await b.newContext({viewport:{width:w,height:w<700?812:900}});
  const p=await ctx.newPage();
  for(const [name,path] of Object.entries(routes)){
    await p.goto(BASE+path,{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
    // scroll through to arm reveals
    await p.evaluate(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,90));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,800));});
    const d=await p.evaluate(fn);
    fs.writeFileSync(`../raw/measure-${name}-${w}.json`,JSON.stringify(d,null,1));
    console.log(name,w,d.secs.length,d.typo.length,d.imgs.length);
  }
  await ctx.close();
}
await b.close();
