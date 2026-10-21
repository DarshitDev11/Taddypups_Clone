import { chromium } from 'playwright';
const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage();
await p.goto('https://puppy.instabizweb.com/faq',{waitUntil:'commit'});
for(const t of [150,350,600,800]){ await p.waitForTimeout(t===150?150:200); await p.screenshot({path:`../screenshots/curtain-intro-${t}ms-1440.png`}); }
await p.waitForTimeout(1500);
// click-through transition
await p.getByRole('link',{name:'Puppies',exact:true}).first().click();
for(const t of [120,260,420,700]){ await p.waitForTimeout(t===120?120:140); await p.screenshot({path:`../screenshots/curtain-nav-${t}ms-1440.png`}); console.log(t,await p.evaluate(()=>document.querySelector('.tp-curtain').dataset.state)); }
// header scrolled/hidden states
await p.waitForTimeout(2000);
await p.evaluate(()=>window.scrollTo(0,700)); await p.waitForTimeout(900);
console.log(await p.evaluate(()=>({h:document.getElementById('site-header').dataset.hidden,s:document.getElementById('site-header').dataset.scrolled})));
await p.screenshot({path:'../screenshots/header-hidden-on-scroll-down-1440.png',clip:{x:0,y:0,width:1440,height:200}});
await p.evaluate(()=>window.scrollTo(0,500)); await p.waitForTimeout(900);
console.log(await p.evaluate(()=>({h:document.getElementById('site-header').dataset.hidden,s:document.getElementById('site-header').dataset.scrolled})));
await p.screenshot({path:'../screenshots/header-shown-on-scroll-up-1440.png',clip:{x:0,y:0,width:1440,height:200}});
console.log(await p.evaluate(()=>{const h=document.querySelector('.tp-header');const cs=getComputedStyle(h,'::before');return {before:cs.backgroundColor+' '+cs.opacity,hemOp:getComputedStyle(document.querySelector('.tp-header__hem')).opacity,hemFilter:getComputedStyle(document.querySelector('.tp-header__hem')).filter}}));
// menu closing screenshot at mobile
await b.close();
