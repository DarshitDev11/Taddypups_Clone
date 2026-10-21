import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://puppy.instabizweb.com/puppies',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
for(const n of ['Korean Teacup','Maltipoo','Girls','Poodle','Everywhere']){
  await p.getByRole('button',{name:n,exact:true}).click(); await p.waitForTimeout(700);
  const cnt=await p.evaluate(()=>[...document.querySelectorAll('p')].map(x=>x.textContent).find(t=>/looking for a home|match|No puppies/i.test(t)));
  console.log(n,p.url(),cnt, await p.evaluate(()=>document.querySelectorAll('.tp-sketches > li').length));
}
await p.getByRole('button',{name:'Boys',exact:true}).click(); await p.getByRole('button',{name:'Shih Tzu'}).click(); await p.getByRole('button',{name:'Korean Teacup',exact:true}).click(); await p.waitForTimeout(800);
console.log(p.url(), await p.evaluate(()=>document.body.innerText.split('\n').filter(l=>/match|No puppies|clear|no /i.test(l))));
await p.screenshot({path:'../screenshots/puppies-filter-empty-1440.png'});
await b.close();
