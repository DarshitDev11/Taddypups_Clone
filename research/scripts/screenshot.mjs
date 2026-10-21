import { chromium } from 'playwright';
import fs from 'fs';
const BASE='https://puppy.instabizweb.com';
const OUT='../screenshots';
fs.mkdirSync(OUT,{recursive:true});
const routes={home:'/',puppies:'/puppies','puppy-copper-male':'/puppies/copper-male','gone-home':'/gone-home','happy-families':'/happy-families','how-it-works':'/how-it-works',faq:'/faq',contact:'/contact'};
const widths=[375,768,1024,1440];
async function scrollAll(page){
  await page.evaluate(async()=>{
    const h=()=>document.documentElement.scrollHeight;
    for(let y=0;y<h();y+=250){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}
    window.scrollTo(0,h());await new Promise(r=>setTimeout(r,600));
  });
  await page.waitForTimeout(1200);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(800);
}
const browser=await chromium.launch();
for(const w of widths){
  const ctx=await browser.newContext({viewport:{width:w,height:w<700?812:900}});
  const page=await ctx.newPage();
  for(const [name,path] of Object.entries(routes)){
    await page.goto(BASE+path,{waitUntil:'networkidle'});
    await scrollAll(page);
    await page.screenshot({path:`${OUT}/${name}-${w}.png`,fullPage:true});
    console.log(name,w);
  }
  await ctx.close();
}
// extras
{
  const ctx=await browser.newContext({viewport:{width:375,height:812}});
  const page=await ctx.newPage();
  await page.goto(BASE+'/',{waitUntil:'networkidle'});
  await page.waitForTimeout(1500);
  await page.screenshot({path:`${OUT}/mobile-home-viewport-375.png`});
  await page.getByRole('button',{name:/menu/i}).first().click();
  await page.waitForTimeout(150);
  await page.screenshot({path:`${OUT}/mobile-menu-opening-375.png`});
  await page.waitForTimeout(900);
  await page.screenshot({path:`${OUT}/mobile-menu-open-375.png`});
  await ctx.close();
}
{
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await ctx.newPage();
  await page.goto(BASE+'/',{waitUntil:'networkidle'});
  await page.waitForTimeout(2000);
  await page.screenshot({path:`${OUT}/desktop-home-viewport-1440.png`});
  const hdr=page.locator('header').first();
  await hdr.screenshot({path:`${OUT}/desktop-header-1440.png`});
  await page.evaluate(()=>window.scrollTo(0,900));await page.waitForTimeout(800);
  await page.screenshot({path:`${OUT}/desktop-header-scrolled-1440.png`,clip:{x:0,y:0,width:1440,height:160}});
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(500);
  const btn=page.locator('main a, main button').filter({hasText:/meet the pups|whatsapp/i}).first();
  await btn.hover();await page.waitForTimeout(500);
  const bb=await btn.boundingBox();
  await page.screenshot({path:`${OUT}/button-hover-1440.png`,clip:{x:Math.max(0,bb.x-30),y:Math.max(0,bb.y-30),width:bb.width+60,height:bb.height+60}});
  await page.mouse.move(0,0);await page.waitForTimeout(500);
  await page.screenshot({path:`${OUT}/button-rest-1440.png`,clip:{x:Math.max(0,bb.x-30),y:Math.max(0,bb.y-30),width:bb.width+60,height:bb.height+60}});
  // faq
  await page.goto(BASE+'/faq',{waitUntil:'networkidle'});await page.waitForTimeout(1000);
  const q=page.locator('summary, button[aria-expanded]').filter({hasText:/\?/}).first();
  await q.click();await page.waitForTimeout(700);
  await page.screenshot({path:`${OUT}/faq-expanded-1440.png`});
  // gallery
  await page.goto(BASE+'/puppies/copper-male',{waitUntil:'networkidle'});await page.waitForTimeout(1000);
  await page.screenshot({path:`${OUT}/puppy-gallery-1-1440.png`});
  const next=page.getByRole('button',{name:/next/i}).first();
  if(await next.count()){await next.click();await page.waitForTimeout(800);await page.screenshot({path:`${OUT}/puppy-gallery-2-1440.png`});}
  // card hover on /puppies
  await page.goto(BASE+'/puppies',{waitUntil:'networkidle'});await page.waitForTimeout(800);
  await page.evaluate(()=>window.scrollTo(0,500));await page.waitForTimeout(1000);
  const card=page.locator('a[href^="/puppies/"]').first();
  await card.hover();await page.waitForTimeout(700);
  await page.screenshot({path:`${OUT}/card-hover-1440.png`});
  await ctx.close();
}
await browser.close();
