import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const r=await p.goto('https://puppy.instabizweb.com/this-page-does-not-exist',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
console.log(r.status()); await p.screenshot({path:'../screenshots/404-1440.png'});
console.log(await p.evaluate(()=>document.querySelector('main').innerText));
await b.close();
