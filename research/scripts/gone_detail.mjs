import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://puppy.instabizweb.com/puppies/pomeranian-ace-boy',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
await p.screenshot({path:'../screenshots/puppy-gone-detail-top-1440.png'});
await p.evaluate(()=>window.scrollTo(0,800)); await p.waitForTimeout(1200);
await p.screenshot({path:'../screenshots/puppy-gone-detail-mid-1440.png'});
await p.goto('https://puppy.instabizweb.com/puppies/maltipoo-female-2',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
// click thumbs until video
const thumbs=p.locator('ul[aria-label^="All photos"] button'); const n=await thumbs.count(); console.log('thumbs',n);
await thumbs.nth(n-1).click(); await p.waitForTimeout(1500);
await p.screenshot({path:'../screenshots/puppy-video-gallery-1440.png',clip:{x:0,y:80,width:900,height:900}});
console.log(await p.evaluate(()=>[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc.slice(-60),controls:v.controls,autoplay:v.autoplay,muted:v.muted,loop:v.loop,playsInline:v.playsInline,poster:v.poster.slice(-50),cls:v.className}))));
// whatsapp enquire variants for gone puppy
await b.close();
