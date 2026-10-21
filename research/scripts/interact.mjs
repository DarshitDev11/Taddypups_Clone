import { chromium } from 'playwright';
import fs from 'fs';
const BASE='https://puppy.instabizweb.com'; const O='../screenshots/';
const b=await chromium.launch();
const res={};
// pinned attr per width
for(const [w,h] of [[375,812],[640,900],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]]){
  const ctx=await b.newContext({viewport:{width:w,height:h}}); const p=await ctx.newPage();
  await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
  res['w'+w]=await p.evaluate(()=>({pinned:document.querySelector('.tp-meet')?.hasAttribute('data-pinned'),pup:document.documentElement.dataset.pup,meetH:document.querySelector('.tp-meet')?.offsetHeight,track:getComputedStyle(document.querySelector('.tp-meet__track')).display+' '+getComputedStyle(document.querySelector('.tp-meet__track')).gridTemplateColumns,docH:document.documentElement.scrollHeight,navVisible:getComputedStyle(document.querySelector('.tp-header__nav')).display,waBtn:getComputedStyle(document.querySelector('.tp-header__wa')).display,bar:!!document.querySelector('[data-whatsapp-bar]')&&getComputedStyle(document.querySelector('[data-whatsapp-bar]')).display,heroTitle:getComputedStyle(document.querySelector('.tp-hero__title')).fontSize}));
  await p.screenshot({path:`${O}home-viewport-${w}.png`});
  await ctx.close();
}
fs.writeFileSync('../raw/breakpoints-home.json',JSON.stringify(res,null,1)); console.log(res);
{
 const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage();
 // puppies filters
 await p.goto(BASE+'/puppies',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
 await p.getByRole('button',{name:'Imported'}).click(); await p.waitForTimeout(900);
 await p.screenshot({path:`${O}puppies-filter-imported-1440.png`});
 const c1=await p.evaluate(()=>document.body.innerText.match(/\d+ puppies? looking for a home|[^\n]*looking for a home[^\n]*/g));
 await p.getByRole('button',{name:'Boys'}).click(); await p.waitForTimeout(900);
 const c2=await p.evaluate(()=>document.body.innerText.match(/[^\n]*looking for a home[^\n]*/g));
 await p.screenshot({path:`${O}puppies-filter-imported-boys-1440.png`});
 const url=p.url(); console.log('filters',c1,c2,url);
 // chips state attrs
 console.log(await p.evaluate(()=>[...document.querySelectorAll('.tp-sticker-chip')].map(b=>b.textContent+':'+b.getAttribute('aria-pressed'))));
 // detail lightbox
 await p.goto(BASE+'/puppies/copper-male',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
 const img=p.locator('main img').first(); await img.click({force:true}); await p.waitForTimeout(1000);
 await p.screenshot({path:`${O}puppy-lightbox-1440.png`});
 await p.keyboard.press('ArrowRight'); await p.waitForTimeout(700); await p.screenshot({path:`${O}puppy-lightbox-next-1440.png`});
 await p.keyboard.press('Escape'); await p.waitForTimeout(500);
 // gallery thumbs click
 await p.locator('button[aria-label*="photo 3" i], button:has(img)').nth(2).click({force:true}).catch(()=>{}); await p.waitForTimeout(700);
 await p.screenshot({path:`${O}puppy-gallery-thumb3-1440.png`,clip:{x:0,y:80,width:900,height:820}});
 // happy families viewer
 await p.goto(BASE+'/happy-families',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
 await p.evaluate(()=>window.scrollTo(0,800)); await p.waitForTimeout(1200);
 await p.locator('.tp-wall__print').first().click(); await p.waitForTimeout(1000);
 await p.screenshot({path:`${O}happy-viewer-1440.png`});
 await ctx.close();
}
{ // mobile interactions: sticky bar, hero tap
 const ctx=await b.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true}); const p=await ctx.newPage();
 await p.goto(BASE+'/puppies',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
 await p.screenshot({path:`${O}mobile-real-puppies-viewport-375.png`});
 await p.goto(BASE+'/faq',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
 await p.screenshot({path:`${O}mobile-real-faq-viewport-375.png`});
 await ctx.close();
}
await b.close();
