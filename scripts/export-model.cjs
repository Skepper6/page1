const fs=require('node:fs');
const {chromium}=require('C:/Users/91962/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge',args:['--enable-unsafe-swiftshader']});
 try{const p=await b.newPage({viewport:{width:1000,height:1000}});await p.goto('http://127.0.0.1:5180/');await p.waitForSelector('.loader',{state:'detached'});await p.waitForFunction(()=>Boolean(window.__orbisModel&&window.__orbisReview));
 const poster=await p.evaluate(()=>{window.__orbisReview.seek(6.5);const m=window.__orbisModel;Object.assign(m.motion,{x:.5,y:.5,height:.73,explode:0,yaw:0,cup:1,fill:1,light:.5,opacity:1});m.render(true);return m.renderer.domElement.toDataURL('image/webp',.96).split(',')[1];});fs.writeFileSync('public/assets/v2/machine-fallback.webp',Buffer.from(poster,'base64'));
 const binary=await p.evaluate(async()=>{const {GLTFExporter}=await import('/node_modules/three/examples/jsm/exporters/GLTFExporter.js');const m=window.__orbisModel.machine;m.position.set(0,0,0);m.scale.setScalar(1);const out=await new GLTFExporter().parseAsync(m,{binary:true,onlyVisible:false});const bytes=new Uint8Array(out);let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);});fs.writeFileSync('public/assets/v2/orbis-machine.glb',Buffer.from(binary,'base64'));
 console.log('Exported transparent fallback and reusable 3D machine.');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
