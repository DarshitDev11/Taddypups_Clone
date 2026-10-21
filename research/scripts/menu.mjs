import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:375,height:812}})).newPage();
await p.goto('https://puppy.instabizweb.com/',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
await p.getByRole('button',{name:/menu/i}).first().click(); await p.waitForTimeout(1000);
console.log(JSON.stringify(await p.evaluate(()=>{
 const d=document.querySelector('dialog.tp-menu'); const g=(e)=>{const cs=getComputedStyle(e);const r=e.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),x:Math.round(r.x),y:Math.round(r.y),fs:cs.fontSize,lh:cs.lineHeight,fw:cs.fontWeight,ls:cs.letterSpacing,color:cs.color,pad:cs.padding,bg:cs.backgroundColor,cls:(e.className||'').toString().slice(0,140)}};
 return {dialog:g(d),links:[...d.querySelectorAll('a')].map(a=>({t:a.innerText.trim(),...g(a)})),btns:[...d.querySelectorAll('button')].map(a=>({t:a.innerText.trim(),...g(a)})),other:[...d.querySelectorAll('span,p')].map(a=>({t:a.innerText.trim(),...g(a)}))};
}),null,1));
console.log(await p.evaluate(()=>getComputedStyle(document.querySelector('dialog.tp-menu'),'::backdrop').backgroundColor));
await p.keyboard.press('Escape'); await p.waitForTimeout(150); await p.screenshot({path:'../screenshots/mobile-menu-closing-375.png'});
// sticky bar + header measure
console.log(JSON.stringify(await p.evaluate(()=>{const bar=document.querySelector('[data-whatsapp-bar]');const r=bar.getBoundingClientRect();const cs=getComputedStyle(bar);return {bar:{h:r.height,y:r.y,pad:cs.padding,bd:cs.borderTop,bg:cs.backgroundColor,z:cs.zIndex},logo:document.querySelector('.tp-header__logo').getBoundingClientRect().width,menuBtn:getComputedStyle(document.querySelector('.tp-header button')).cssText.length}})));
await b.close();
