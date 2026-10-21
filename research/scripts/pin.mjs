import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://puppy.instabizweb.com/',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
const info=await p.evaluate(()=>{const s=document.querySelector('.tp-meet');const t=document.querySelector('.tp-meet__track');return {secTop:s.getBoundingClientRect().top+scrollY,secH:s.offsetHeight,trackW:t.scrollWidth,vw:innerWidth,trackStyle:t.getAttribute('style'),tr:getComputedStyle(t).transform,floorX:document.querySelector('.tp-meet__floor').getAttribute('style'),stageStyle:document.querySelector('.tp-meet__stage').getAttribute('style'),secStyle:s.getAttribute('style')}});
console.log(info);
const rows=[];
for(let y=info.secTop-200;y<=info.secTop+info.secH-700;y+=300){
  await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{const t=document.querySelector('.tp-meet__track');const doors=[...document.querySelectorAll('.tp-door')];const a=document.querySelector('.pup-actor').getBoundingClientRect();return {trackX:Math.round(t.getBoundingClientRect().x),tr:getComputedStyle(t).transform,open:doors.map(d=>d.dataset.open==='true'?1:0).join(''),floor:document.querySelector('.tp-meet__floor').style.cssText,actorX:Math.round(a.x),here:document.querySelector('.tp-meet').dataset.here,teddyPose:document.querySelector('.tp-meet__teddy .pup-buddy')?.dataset.facing}});
  rows.push({y,...r}); console.log(y,r.trackX,r.tr,r.open,r.floor,r.actorX,r.here);
}
await b.close();
