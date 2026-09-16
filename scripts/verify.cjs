const fs=require('node:fs');
const {chromium}=require('C:/Users/91962/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const URL='http://127.0.0.1:5180/';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-unsafe-swiftshader']});
 const errors=[],checks=[];
 async function open(viewport,options={}){const p=await browser.newPage({viewport,...options});p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});await p.goto(URL);await p.waitForSelector('.loader',{state:'detached'});await p.waitForFunction(()=>Boolean(window.__orbisReview));return p;}
 try{
  for(const size of [{width:1280,height:720},{width:1920,height:1080},{width:1440,height:900},{width:1366,height:768},{width:390,height:844},{width:320,height:740}]){
   const p=await open(size);const times=size.width===1280?[0,1.15,2.7,3.7,4.6,5.25,6.5,6.97,7.35,8.43,10]:[1.15,5.25,8.43,10];
   for(const t of times){await p.evaluate(t=>window.__orbisReview.seek(t),t);await p.waitForTimeout(220);if([1280,390,320].includes(size.width))await p.screenshot({path:`review/verified-${size.width}-${t}.jpg`,quality:87});checks.push({viewport:size,time:t,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});}
   console.log('Visual checks',size.width);await p.close();
  }
  const p=await open({width:1280,height:720});
  async function scrollToTime(t){await p.evaluate(t=>window.__orbisReview.scrollReference(t),t);await p.waitForTimeout(700);}
  await scrollToTime(1.15);const before=await p.evaluate(()=>scrollY);await p.mouse.wheel(0,240);await p.waitForTimeout(80);const intermediate=await p.evaluate(()=>scrollY);await p.waitForTimeout(800);const after=await p.evaluate(()=>scrollY);
  checks.push({smoothWheel:before<intermediate&&intermediate<after,before,intermediate,after,readingHold:await p.evaluate(()=>window.__orbisTimeline.time())});
  await scrollToTime(2.7);const a=await p.evaluate(()=>Object.fromEntries(Object.entries(window.__orbisModel.motion).filter(([,v])=>typeof v==='number')));
  await scrollToTime(7.35);await scrollToTime(2.7);const b=await p.evaluate(()=>Object.fromEntries(Object.entries(window.__orbisModel.motion).filter(([,v])=>typeof v==='number')));
  checks.push({reverseRestoresState:Object.keys(a).every(k=>Math.abs(a[k]-b[k])<.00001)});
  await p.getByRole('button',{name:'Next chapter',exact:true}).click();await p.waitForTimeout(2400);checks.push({nextChapter:await p.evaluate(()=>window.__orbisTimeline.time())});
  await p.getByRole('button',{name:'ORBIS home',exact:true}).click();await p.waitForTimeout(2400);checks.push({home:await p.evaluate(()=>window.__orbisTimeline.time()),drawCalls:await p.evaluate(()=>window.__orbisModel.renderer.info.render.calls)});await p.close();
  const reduced=await open({width:1280,height:720},{reducedMotion:'reduce'});checks.push({reduced:await reduced.evaluate(()=>({pageHeight:document.documentElement.scrollHeight,viewport:innerHeight,time:window.__orbisTimeline.time(),outroInteractive:!document.querySelector('.outro').inert}))});await reduced.locator('.outro .pill').click();checks.push({reducedReplay:await reduced.evaluate(()=>window.__orbisTimeline.time())});await reduced.close();
  fs.writeFileSync('review/verification.json',JSON.stringify({errors,checks},null,2));console.log(JSON.stringify({errors,checks},null,2));
  if(errors.length||checks.some(c=>c.overflow)||checks.some(c=>c.reverseRestoresState===false)||checks.some(c=>c.smoothWheel===false))process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
