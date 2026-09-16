const {chromium}=require('C:/Users/91962/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge',args:['--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:1280,height:720}});const errors=[];
 p.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message);});
 p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text());});
 await p.goto('http://127.0.0.1:5180/');await p.waitForSelector('.loader',{state:'detached'});
 await p.waitForTimeout(3000);console.log(await p.evaluate(()=>({model:!!window.__orbisModel,timeline:!!window.__orbisTimeline,canvas:document.querySelector('.product-canvas')?.outerHTML})));
 await p.waitForFunction(()=>Boolean(window.__orbisModel&&window.__orbisTimeline));
 for(const t of [1.2,3.55,5.2,6.6,8.4,9.85]){
  await p.evaluate(t=>{window.__orbisReview.seek(t);},t);
  await p.waitForTimeout(800);await p.screenshot({path:`review/model-${t}.jpg`,quality:85});
 }
 console.log(JSON.stringify({errors}));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
