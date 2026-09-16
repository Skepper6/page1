import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const motion = { x: .5, y: .61, height: .95, yaw: 0, explode: 0, cup: 0, fill: 0, light: 0, opacity: 1, bodyOpacity:1, dialText: 0, dialRotation:0, beanFall:0, beanVisible:0 };
export function buildMachine() {
  const machine = new THREE.Group(); const moving = []; const disposables = [];
  const mat = (color, metalness = .6, roughness = .28, extra = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
  const black = mat('#0a0c0e', .82, .24), side = mat('#060709', .7, .25), inside = mat('#020304', .7, .4, { envMapIntensity: .18 }), bronze = mat('#6c4631', .82, .32), steel = mat('#252a30', .90, .3), rubber = new THREE.MeshBasicMaterial({ color: '#050608' });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#a7bbca', metalness: 0, roughness: .07, transparent: true, opacity: .18, depthWrite: false, side: THREE.DoubleSide });
  const water = new THREE.MeshPhysicalMaterial({ color: '#758995', metalness: 0, roughness: .06, transparent: true, opacity: .12, depthWrite: false });
  function mesh(geo, material, parent, pos = [0, 0, 0]) { const m = new THREE.Mesh(geo, material); m.position.set(...pos); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; }
  function group(name, origin, offset) { const g = new THREE.Group(); g.name = name; g.position.set(...origin); machine.add(g); moving.push({ group: g, base: g.position.clone(), offset: new THREE.Vector3(...offset) }); return g; }
  const box = (w, h, d, r = .04) => new RoundedBoxGeometry(w, h, d, 3, r);
  const cyl = (r, h, segments = 96) => new THREE.CylinderGeometry(r, r, h, segments);
  function decal(text, size, color = '#d5d3cc') { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const ctx = c.getContext('2d'); ctx.clearRect(0, 0, 512, 128); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `${size}px Arial`; ctx.fillText(text, 256, 64, 480); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; disposables.push(tex); return new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }); }
  const base = group('base', [0, -2.02, 0], [0, -.04, 0]);
  mesh(cyl(1.22, .30), black, base, [0, 0, 0]); mesh(cyl(1.17, .04), rubber, base, [0, -.17, 0]);
  const tray = group('drip-tray', [0, -1.825, .28], [0, 0, 0]);
  const trayDisc = mesh(cyl(1.065, .055), side, tray); trayDisc.scale.z = .70;
  const slotMat = mat('#010203', .1, .4); for (let i = -8; i <= 8; i++) { const x = i * .103; const length = 1.2 * Math.sqrt(1 - (x / .98) ** 2); mesh(box(.038, .012, length, .015), slotMat, tray, [x, .035, 0]); }
  mesh(new THREE.PlaneGeometry(.55, .14), decal('ORBIS', 98), base, [0, -.035, 1.231]);
  for (let i of [-1, 1]) {
    const panel = group(i < 0 ? 'left-shell' : 'right-shell', [i * 1.16, -.60, -.05], [i * 1.08, .04, .03]);
    mesh(box(.14, 2.65, .80, .06), black, panel); mesh(cyl(.045, 2.65, 32), side, panel, [i * .07, 0, .10]);
    const upper = group(i < 0 ? 'left-upper-shell' : 'right-upper-shell', [i * 1.16, 1.30, -.05], [i * 1.10, .52, .03]);
    mesh(box(.14, 1.15, .80, .05), black, upper); mesh(cyl(.045, 1.15, 32), side, upper, [i * .07, 0, .10]);
  }
  const rear = group('rear-spine', [0, -.25, -.52], [0, 0, 0]);
  mesh(box(2.10, 2.35, .40, .12), inside, rear,[0,-.56,0]);
  mesh(box(1.89, 2.26, .055, .08), rubber, rear, [0, -.39, .25]);
  for (let i of [-1, 1]) { mesh(box(.12, 2.18, .60, .035), inside, rear, [i * .93, -.39, .4]); }
  // Side water architecture is narrow from the frontal camera, prominent in three-quarter view.
  const reservoir = group('reservoir', [.80, -.18, -1.12], [1.25, .36, -.05]);
  mesh(cyl(.48,3.62), glass, reservoir); mesh(cyl(.43,2.36), water, reservoir,[0,-.53,0]);
  mesh(cyl(.49,.105),side,reservoir,[0,1.79,0]);mesh(cyl(.49,.16),black,reservoir,[0,-1.77,0]);
  for (let x of [-.25, .25]) for (let z of [-.46, .46]) mesh(cyl(.006, 3.5, 10), glass, reservoir, [x, 0, z]);
  const shell = group('upper-shell', [0, 1.14, 0], [0, 1.05, .05]);
  mesh(new THREE.CylinderGeometry(1.16, 1.16, 1.54, 64, 1, true, -.72, 1.44), black, shell);
  for (let sign of [-1, 1]) { const wing = group(sign < 0 ? 'curved-left-cover' : 'curved-right-cover', [0, 1.14, 0], [sign * 1.15, .6, -.03]); mesh(new THREE.CylinderGeometry(1.16, 1.16, 1.54, 48, 1, true, sign < 0 ? -2.42 : .72, 1.70), black, wing); }
  const backCover = group('rear-upper-cover', [0, 1.14, 0], [0, .4, -.42]); mesh(new THREE.CylinderGeometry(1.16, 1.16, 1.54, 48, 1, true, 2.42, 1.4432), black, backCover);
  const top = group('bronze-lid', [0, 1.985, 0], [0, 1.75, 0]);
  const lid = mesh(new THREE.RingGeometry(.82, 1.18, 96), bronze, top); lid.rotation.x = -Math.PI / 2; lid.material.side = THREE.DoubleSide;
  mesh(new THREE.CylinderGeometry(1.18, 1.18, .06, 96, 1, true), bronze, top);
  const hopperCap = group('hopper-cap', [0, 2.034, 0], [0, 1.28, 0]); mesh(cyl(.815, .038), black, hopperCap);
  const collar = group('upper-collar', [0, 1.90, 0], [0, 1.08, 0]); const collarRing = mesh(new THREE.RingGeometry(.46, 1.145, 96), side, collar); collarRing.rotation.x = -Math.PI / 2; collarRing.material.side = THREE.DoubleSide;
  const grinder = group('precision-grinder', [0, 1.45, -.03], [0, 1.48, -.15]);
  mesh(cyl(.39, .42, 48), steel, grinder); mesh(cyl(.26, .48, 40), inside, grinder, [0, .09, 0]);
  for (let a = 0; a < 12; a++) { const angle = a * Math.PI / 6; const tooth = mesh(box(.06, .18, .08, .01), black, grinder, [Math.cos(angle) * .29, .31, Math.sin(angle) * .29]); tooth.rotation.y = -angle; }
  const heater = group('heating-unit', [.31, .9, -.20], [1.16, .73, -.2]);
  mesh(box(.38, .57, .20, .035), bronze, heater); for (let y = 0; y < 4; y++)mesh(box(.36, .023, .23, .006), steel, heater, [0, -.20 + y * .12, 0]);
  const dial = group('control-dial', [0, 1.21, 1.50], [0, 1.08, .25]);dial.scale.x=1/.88;
  const mount = mesh(cyl(.668, .62), side, dial, [0, 0, -.25]); mount.rotation.x = Math.PI / 2;
  const rim = mesh(new THREE.TorusGeometry(.624, .016, 12, 128), bronze, dial, [0, 0, .06]);
  const faceCanvas = document.createElement('canvas'); faceCanvas.width = 512; faceCanvas.height = 512; const faceCtx = faceCanvas.getContext('2d'); const faceGradient = faceCtx.createLinearGradient(0, 0, 400, 512); faceGradient.addColorStop(0, '#111820'); faceGradient.addColorStop(.55, '#05080d'); faceGradient.addColorStop(1, '#030507'); faceCtx.fillStyle = faceGradient; faceCtx.fillRect(0, 0, 512, 512); const faceTexture = new THREE.CanvasTexture(faceCanvas); faceTexture.colorSpace = THREE.SRGBColorSpace; disposables.push(faceTexture);
  const face = mesh(new THREE.CircleGeometry(.612, 128), new THREE.MeshBasicMaterial({ map: faceTexture }), dial, [0, 0, .09]);
  const sheen=faceCtx.createLinearGradient(30,0,370,450);sheen.addColorStop(0,'rgba(155,171,188,.12)');sheen.addColorStop(.5,'rgba(112,132,153,.035)');sheen.addColorStop(1,'rgba(0,0,0,0)');faceCtx.fillStyle=sheen;faceCtx.beginPath();faceCtx.moveTo(0,0);faceCtx.lineTo(512,0);faceCtx.lineTo(95,512);faceCtx.lineTo(0,512);faceCtx.fill();faceTexture.needsUpdate=true;
  const illuminated = new THREE.MeshBasicMaterial({ color: '#d5863c', toneMapped: false });
  illuminated.color.set('#efa15b');
  mesh(new THREE.TorusGeometry(.584, .013, 12, 160), illuminated, dial, [0, 0, .103]);
  const glowCanvas=document.createElement('canvas');glowCanvas.width=512;glowCanvas.height=512;const glowCtx=glowCanvas.getContext('2d');const halo=glowCtx.createRadialGradient(256,256,145,256,256,256);halo.addColorStop(0,'rgba(230,104,30,0)');halo.addColorStop(.28,'rgba(230,104,30,.10)');halo.addColorStop(.38,'rgba(244,123,38,.28)');halo.addColorStop(.48,'rgba(230,104,30,.14)');halo.addColorStop(.75,'rgba(190,66,20,.035)');halo.addColorStop(1,'rgba(190,66,20,0)');glowCtx.fillStyle=halo;glowCtx.fillRect(0,0,512,512);const glowTexture=new THREE.CanvasTexture(glowCanvas);disposables.push(glowTexture);mesh(new THREE.PlaneGeometry(1.6,1.6),new THREE.MeshBasicMaterial({map:glowTexture,transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending}),dial,[0,0,.125]);
  const arc = mesh(new THREE.TorusGeometry(.478, .023, 12, 100, Math.PI * .53), illuminated, dial, [0, 0, .109]); arc.rotation.z = -Math.PI * .265;
  mesh(new THREE.PlaneGeometry(.72, .18), decal('ORBIS', 86, '#e3e9ed'), dial, [0, 0, .114]);
  const wordsCanvas = document.createElement('canvas'); wordsCanvas.width = 512; wordsCanvas.height = 512; const wordsCtx = wordsCanvas.getContext('2d'); wordsCtx.fillStyle = '#dfdfd8'; wordsCtx.textAlign = 'center'; wordsCtx.textBaseline = 'middle'; wordsCtx.font = '24px Arial';
  for (const [word, start] of [['GRIND', -.98], ['CREATE', .32], ['REPEAT', 1.58], ['GRIND', -2.68]]) { [...word].forEach((letter, i) => { const angle = start + i * .10; wordsCtx.save(); wordsCtx.translate(256 + 185 * Math.sin(angle), 256 - 185 * Math.cos(angle)); wordsCtx.rotate(angle); wordsCtx.fillText(letter, 0, 0); wordsCtx.restore(); }); }
  const wordsTexture = new THREE.CanvasTexture(wordsCanvas); wordsTexture.colorSpace = THREE.SRGBColorSpace; disposables.push(wordsTexture); const wordsMaterial = new THREE.MeshBasicMaterial({ map: wordsTexture, transparent: true, depthWrite: false, opacity: 0 }); const lettering=mesh(new THREE.PlaneGeometry(1.16, 1.16), wordsMaterial, dial, [0, 0, .119]);
  const ticks = mesh(box(.105, .015, .005, .001), illuminated, dial, [0, -.355, .12]);
  mesh(box(.012, .048, .005, .001), illuminated, dial, [0, .455, .12]);
  const nozzle = group('dispensing-nozzle', [0, .39, 1.04], [0, 1.05, .38]);
  mesh(cyl(.145, .28, 48), black, nozzle); mesh(cyl(.073, .08, 32), steel, nozzle, [0, -.175, 0]);
  const label = mesh(new THREE.PlaneGeometry(.5, .10), decal('REPEAT', 65, '#55575a'), rear, [0, .23, .282]);
  const pcb = group('control-board', [-.45, .65, -.2], [-1.18, .40, -.05]);
  mesh(box(.4, .64, .07, .006), mat('#1c2622', .4, .5), pcb);
  for (let i = 0; i < 10; i++)mesh(box(.055, .07, .025, .003), i % 2 ? steel : black, pcb, [((i % 3) - 1) * .12, Math.floor(i / 3) * .14 - .20, .05]);
  // Espresso glass, liquid and crema are geometry; no crossfade between different machines.
  const cup = new THREE.Group(); cup.position.set(0, -1.34, .82); machine.add(cup);
  const pts = [[.27, -.40], [.29, -.39], [.34, .38], [.33, .41], [.30, .41], [.26, -.34], [.27, -.40]].map(([x, y]) => new THREE.Vector2(x, y));
  const glassMat = new THREE.MeshPhysicalMaterial({ color: '#aeb9be', metalness: 0, roughness: .06, transmission: .85, thickness: .025, ior: 1.45, transparent: true, opacity: .32, depthWrite: false });
  const liquidCanvas = document.createElement('canvas'); liquidCanvas.width = 32; liquidCanvas.height = 128; const liquidCtx = liquidCanvas.getContext('2d'); const liquidGradient = liquidCtx.createLinearGradient(0, 0, 0, 128); liquidGradient.addColorStop(0, '#542908'); liquidGradient.addColorStop(.2, '#2b1205'); liquidGradient.addColorStop(1, '#100705'); liquidCtx.fillStyle = liquidGradient; liquidCtx.fillRect(0, 0, 32, 128); const liquidTexture = new THREE.CanvasTexture(liquidCanvas); liquidTexture.colorSpace = THREE.SRGBColorSpace; disposables.push(liquidTexture);
  mesh(new THREE.LatheGeometry(pts, 64), glassMat, cup); const coffee = mesh(new THREE.CylinderGeometry(.296, .248, .55, 64), new THREE.MeshBasicMaterial({ map: liquidTexture }), cup, [0, -.075, 0]);
  const crema = mesh(cyl(.296, .038, 64), new THREE.MeshBasicMaterial({ color: '#b98642' }), cup, [0, .215, 0]);
  const cupRim = mesh(new THREE.TorusGeometry(.325, .009, 8, 64), steel, cup, [0, .403, 0]); cupRim.rotation.x = Math.PI / 2;
  const stream = mesh(cyl(.012, 1.31, 12), mat('#6b3515', .2, .28), machine, [0, -.54, 1.04]);
  // Photographic glass and natural liquid cutout replace the modeled cup and cylinder.
  const photoTexture = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}assets/v2/espresso-photo.png`); photoTexture.colorSpace = THREE.SRGBColorSpace;
  const glassPhoto = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}assets/v2/espresso-glass.png`); glassPhoto.colorSpace = THREE.SRGBColorSpace; glassPhoto.repeat.set(1, .64); glassPhoto.offset.set(0, 0);
  const pourPhoto = photoTexture.clone(); pourPhoto.repeat.set(1, .36); pourPhoto.offset.set(0, .64);
  disposables.push(photoTexture, glassPhoto, pourPhoto);
  const photoGlass = mesh(new THREE.PlaneGeometry(1.05, 1.008), new THREE.MeshBasicMaterial({ map: glassPhoto, transparent: true, depthWrite: false, toneMapped: false }), machine, [0, -1.34, 1.18]);
  const photoPour = mesh(new THREE.PlaneGeometry(1.05, 1.38), new THREE.MeshBasicMaterial({ map: pourPhoto, transparent: true, depthWrite: false, toneMapped: false }), machine, [0, -.515, 1.19]);
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = 128; shadowCanvas.height = 128; const shadowCtx = shadowCanvas.getContext('2d'); const gradient = shadowCtx.createRadialGradient(64, 64, 8, 64, 64, 63); gradient.addColorStop(0, 'rgba(0,0,0,.32)'); gradient.addColorStop(1, 'rgba(0,0,0,0)'); shadowCtx.fillStyle = gradient; shadowCtx.fillRect(0, 0, 128, 128); const shadowTexture = new THREE.CanvasTexture(shadowCanvas); disposables.push(shadowTexture); const ground = mesh(new THREE.PlaneGeometry(4.2, 3.3), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }), machine, [0, -2.21, 0]); ground.rotation.x = -Math.PI / 2;
  function update() { for (const p of moving) { p.group.position.copy(p.base).addScaledVector(p.offset, motion.explode); } wordsMaterial.opacity = motion.dialText; cup.visible = motion.cup > .02; cup.scale.setScalar(Math.max(.001, motion.cup)); coffee.scale.y = Math.max(.01, motion.fill); coffee.position.y = -.35 + .275 * motion.fill; crema.position.y = -.35 + .55 * motion.fill; crema.visible = motion.fill > .03; stream.visible = motion.cup > .98 && motion.fill > .01 && motion.fill < .99; grinder.visible = motion.explode > .025; heater.visible = motion.explode > .025; pcb.visible = motion.explode > .025; label.visible = motion.explode < .05; machine.rotation.y = motion.yaw; }
  function dispose() { machine.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => m.dispose()); } }); disposables.forEach(t => t.dispose()); }
  const fasteners=[];for(let i=0;i<6;i++){const sign=i%2?-1:1;const bolt=group(`fastener-${i}`,[sign*.85,1.85-Math.floor(i/2)*.85,.2],[sign*(.65+Math.floor(i/2)*.18),.8-Math.floor(i/2)*.3,.12]);mesh(cyl(.023,.18,12),steel,bolt);mesh(cyl(.043,.025,16),black,bolt,[0,.095,0]);fasteners.push(bolt);}
  const beanTexture=new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}assets/processed/bean.webp`);beanTexture.colorSpace=THREE.SRGBColorSpace;disposables.push(beanTexture);
  const bean=new THREE.Sprite(new THREE.SpriteMaterial({map:beanTexture,transparent:true,depthWrite:false}));bean.scale.set(.25,.34,1);machine.add(bean);
  const delayFor=name=>name==='bronze-lid'?0:name.includes('cap')||name.includes('collar')?.05:name.includes('upper')||name.includes('cover')?.13:name.includes('shell')?.25:.18;
  const bodyMaterials=[];machine.traverse(o=>{if(!o.isMesh)return;let parent=o;while(parent&&parent!==dial)parent=parent.parent;if(parent===dial)return;const originals=Array.isArray(o.material)?o.material:[o.material];const copies=originals.map(m=>{const copy=m.clone();copy.transparent=true;bodyMaterials.push({material:copy,opacity:m.opacity});return copy;});o.material=Array.isArray(o.material)?copies:copies[0];});
  function updatePhotographicCoffee() { update();
    bodyMaterials.forEach(({material,opacity})=>{material.opacity=opacity*motion.bodyOpacity;});
    for(const p of moving){const delay=delayFor(p.group.name);const t=THREE.MathUtils.clamp((motion.explode-delay)/(1-delay),0,1);const eased=t*t*(3-2*t);p.group.position.copy(p.base).addScaledVector(p.offset,eased);}
    fasteners.forEach(o=>o.visible=motion.explode>.12);lettering.rotation.z=motion.dialRotation;arc.rotation.z=-Math.PI*.265+motion.dialRotation*.65;
    bean.visible=motion.beanVisible>.001;bean.material.opacity=motion.beanVisible;const fall=motion.beanFall*motion.beanFall;bean.position.set(.10*Math.sin(fall*Math.PI),.64+(1-fall)*.62-1.84*fall,1.43);bean.material.rotation=-.3+motion.beanFall*2.2;
    cup.visible = false; stream.visible = false; photoGlass.visible = motion.cup > .01; photoGlass.material.opacity = motion.cup; photoPour.visible = motion.cup > .95 && motion.fill > .01 && motion.fill < .99; photoPour.material.opacity = Math.min(1, motion.fill * 12, (1 - motion.fill) * 12);photoPour.position.y=-.515+motion.explode*.5;photoPour.scale.y=1+motion.explode*.72;
  }
  return { machine, update: updatePhotographicCoffee, dispose, anchors:[grinder,heater,nozzle,tray] };
}
