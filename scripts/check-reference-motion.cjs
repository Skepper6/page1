const {chromium}=require('C:/Users/91962/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-unsafe-swiftshader']});
 const errors=[];const states=[];
 for(const viewport of [{width:1280,height:720},{width:390,height:844}]){
  const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5180/');await page.waitForSelector('.loader',{state:'detached'});await page.evaluate(()=>document.fonts.ready);
  for(const time of [1.15,2.6,3.4,3.7,4.4,5.2,5.68,6.5,3.7]){
   await page.evaluate(t=>window.__orbisReview.seek(t),time);await page.waitForTimeout(250);
   const state=await page.evaluate(()=>({motion:Object.fromEntries(Object.entries(window.__orbisModel.motion).filter(([,v])=>typeof v==='number')),anchors:window.__orbisAnchorPoints,lines:[...document.querySelectorAll('.leaders path')].map(p=>({d:p.getAttribute('d'),draw:getComputedStyle(p).strokeDashoffset})),overflow:document.documentElement.scrollWidth>innerWidth}));
   states.push({width:viewport.width,time,...state});await page.screenshot({path:`review/refined-${viewport.width}-${time}.jpg`,quality:80});
  }await page.close();
 }
 require('fs').writeFileSync('review/reference-motion-check.json',JSON.stringify({errors,states},null,2));console.log(JSON.stringify({errors,overflow:states.some(s=>s.overflow),states:states.length,reverseMatches:JSON.stringify(states[3].motion)===JSON.stringify(states[8].motion)}));
 await browser.close();if(errors.length||states.some(s=>s.overflow))process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
