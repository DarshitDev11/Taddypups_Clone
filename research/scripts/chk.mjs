import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://puppy.instabizweb.com/faq',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
const q=p.locator('.tp-note__q button');
await q.nth(0).click(); await p.waitForTimeout(700); await q.nth(2).click(); await p.waitForTimeout(700);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.tp-note')].map(n=>n.hasAttribute('data-unfolded')?1:0).join('')));
await p.goto('https://puppy.instabizweb.com/puppies/copper-male',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
for(const y of [0,600,1200,2000]){ await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(600); console.log(y,await p.evaluate(()=>{const e=document.querySelector('.tp-ribbon__band');return e.getAttribute('style')+' '+getComputedStyle(e).transform+' h='+e.getBoundingClientRect().height})); }
await b.close();
