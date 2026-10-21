import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://puppy.instabizweb.com/',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{
 const out=[];
 const walk=(el,d)=>{ if(d>3)return; for(const c of el.children){const cs=getComputedStyle(c);const rc=c.getBoundingClientRect();out.push('  '.repeat(d)+c.tagName.toLowerCase()+(c.id?'#'+c.id:'')+'.'+(c.className&&c.className.toString().slice(0,90))+` h=${Math.round(rc.height)} pos=${cs.position} top=${Math.round(rc.top+scrollY)}`);walk(c,d+1);}};
 walk(document.body,0);
 return {out,h:document.documentElement.scrollHeight,lenis:!!window.lenis,cls:document.documentElement.className,bodycls:document.body.className}});
console.log(r.h,r.lenis,r.cls,'|',r.bodycls);console.log(r.out.join('\n'));
await b.close();
