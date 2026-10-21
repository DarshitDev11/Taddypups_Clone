import { chromium } from 'playwright';
import fs from 'fs';
const BASE='https://puppy.instabizweb.com';
const routes={home:'/',puppies:'/puppies','puppy-copper-male':'/puppies/copper-male','gone-home':'/gone-home','happy-families':'/happy-families','how-it-works':'/how-it-works',faq:'/faq',contact:'/contact'};
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
let md='# Page copy (extracted from the live site DOM, desktop 1440)\n\nSource: https://puppy.instabizweb.com/ . Order = DOM order. `[btn]`/`[link]` = interactive text, `[ph]` = placeholder, `[aria]` = accessible label only.\n\n';
const seo={};
for(const [name,path] of Object.entries(routes)){
  await p.goto(BASE+path,{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
  const d=await p.evaluate(()=>{
    const out=[]; const seen=new Set();
    const root=document.querySelector('main');
    const sel='h1,h2,h3,h4,p,li,blockquote,figcaption,label,summary,button,a[href],input,textarea,select,dt,dd,[aria-label]:not(a):not(button):not(svg),span.font-scrawl,span.font-plush,time';
    const els=[...root.querySelectorAll(sel)];
    for(const e of els){
      if(e.closest('.tp-curtain')||e.closest('dialog')&&!e.closest('main'))continue;
      let t=(e.innerText||e.textContent||'').replace(/\s+/g,' ').trim();
      const tag=e.tagName.toLowerCase();
      let kind=tag;
      if(['input','textarea'].includes(tag)){ t=e.placeholder||e.name||''; kind='ph:'+(e.name||tag); if(!t)continue;}
      else if(tag==='select'){t=[...e.options].map(o=>o.textContent).join(' | '); kind='select:'+(e.name||'')}
      else if(tag==='a'||tag==='button'){ if(!t){t=e.getAttribute('aria-label')||''; if(!t)continue;} kind=(tag==='a'?'link':'btn')+(tag==='a'?` → ${e.getAttribute('href')}`:'');}
      else if(['li','span'].includes(tag)&&(e.querySelector('h1,h2,h3,h4,p,li,a,button')))continue;
      else if(!['h1','h2','h3','h4','p','blockquote','figcaption','label','summary','dt','dd','li','span'].includes(tag)){ t=e.getAttribute('aria-label')||''; kind='aria'; }
      if(!t)continue;
      // skip containers whose text equals concatenation of children already captured (p/blockquote only)
      const key=kind.split(' ')[0]+'|'+t; if(seen.has(key))continue; seen.add(key);
      out.push([kind,t]);
    }
    const meta=(n)=>document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content;
    return {title:document.title,desc:meta('description'),ogimg:meta('og:image'),canon:document.querySelector('link[rel=canonical]')?.href,out};
  });
  seo[name]={title:d.title,desc:d.desc,og:d.ogimg,canon:d.canon};
  md+=`\n# PAGE: ${name}  (${path})\n\n- title: ${d.title}\n- meta description: ${d.desc}\n\n`;
  for(const [k,t] of d.out){ const tag=k.split(' ')[0];
    if(/^h[1-4]$/.test(k)) md+=`\n${'#'.repeat(1+parseInt(k[1]))} ${t}\n`;
    else if(k==='p'||k==='blockquote'||k==='figcaption'||k==='dd') md+=`${k==='blockquote'?'> ':''}${t}\n\n`;
    else md+=`- [${k}] ${t}\n`;
  }
}
// header/footer/menu once
await p.goto(BASE+'/',{waitUntil:'networkidle'});
const hf=await p.evaluate(()=>{const g=(s)=>[...document.querySelectorAll(s)].map(e=>[(e.innerText||'').replace(/\s+/g,' ').trim(),e.getAttribute('href')]).filter(x=>x[0]);return {header:g('header a'),footer:g('footer a'),footerText:[...document.querySelectorAll('footer p, footer h2')].map(e=>e.innerText.trim()),bar:g('[data-whatsapp-bar] a'),menu:[...document.querySelectorAll('dialog.tp-menu a')].map(e=>[e.innerText.trim(),e.getAttribute('href')])}});
md+='\n## SHARED: header / mobile menu / footer / sticky bar\n\n'+JSON.stringify(hf,null,1).replace(/^/gm,'    ')+'\n';
md+='\n## SEO per page\n\n'+JSON.stringify(seo,null,1).replace(/^/gm,'    ')+'\n';
fs.writeFileSync('../content.md',md);
console.log(md.length);
await b.close();
