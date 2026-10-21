import { chromium } from 'playwright';
import fs from 'fs';
const BASE='https://puppy.instabizweb.com';
const routes={home:'/',puppies:'/puppies','puppy-copper-male':'/puppies/copper-male','gone-home':'/gone-home','happy-families':'/happy-families','how-it-works':'/how-it-works',faq:'/faq',contact:'/contact'};
const only=process.argv[2]; const widths=(process.argv[3]||'1440,375').split(',').map(Number);
const b=await chromium.launch();
for(const w of widths){
 const H=w<700?812:900;
 const ctx=await b.newContext({viewport:{width:w,height:H}});
 const p=await ctx.newPage();
 for(const [name,path] of Object.entries(routes)){
  if(only&&only!=='all'&&only!==name)continue;
  const dir=`../screenshots/steps/${name}-${w}`; fs.mkdirSync(dir,{recursive:true});
  await p.goto(BASE+path,{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
  const total=await p.evaluate(()=>document.documentElement.scrollHeight);
  const step=Math.round(H*0.85); let i=0;
  for(let y=0;y<total-H+step;y+=step){
    await p.evaluate(async(y)=>{ window.scrollTo(0,y);},y);
    await p.waitForTimeout(1400);
    await p.screenshot({path:`${dir}/${String(i).padStart(2,'0')}-y${y}.png`}); i++;
  }
  console.log(name,w,total,i);
 }
 await ctx.close();
}
await b.close();
