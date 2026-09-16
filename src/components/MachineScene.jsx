import React,{useEffect,useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import gsap from 'gsap';
import {buildMachine,motion} from './machineModel';
export default function MachineScene({onReady}){const host=useRef(null);useEffect(()=>{
 let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch{const el=host.current;el.classList.add('webgl-unavailable');const fallbackTick=()=>{el.style.opacity=motion.opacity;el.style.transform=`translate3d(${(motion.x-.5)*100}vw,${(motion.y-.5)*100}vh,0) scale(${motion.height/.73*(innerWidth<700?.74:1)})`;};gsap.ticker.add(fallbackTick);onReady();return()=>gsap.ticker.remove(fallbackTick);}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.current.appendChild(renderer.domElement);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(32,innerWidth/innerHeight,.1,60);camera.position.set(0,.12,12);camera.lookAt(0,0,0);
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.06);scene.environment=env.texture;scene.environmentIntensity=.68;
 const ambient=new THREE.HemisphereLight('#b9c8dd','#1b1713',1.4);scene.add(ambient);
 const key=new THREE.DirectionalLight('#f2dfca',4.3);key.position.set(-3,5,6);scene.add(key);
 const fill=new THREE.DirectionalLight('#91a9c9',2.2);fill.position.set(4,2,4);scene.add(fill);
 const rim=new THREE.DirectionalLight('#e1a869',2.2);rim.position.set(0,4,-3);scene.add(rim);
 const model=buildMachine();scene.add(model.machine);
 const measure=()=>{const w=host.current.clientWidth,h=host.current.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};measure();const observer=new ResizeObserver(measure);observer.observe(host.current);
 let last='';const render=(force=false)=>{const next=[...Object.values(motion),innerWidth,innerHeight].join(',');if(!force&&last===next)return;last=next;const height=2*12*Math.tan(THREE.MathUtils.degToRad(16));const compact=innerWidth<700;const factor=compact?.74:1;model.machine.scale.setScalar(motion.height*height/4.4*factor);model.machine.position.set((motion.x-.5)*height*camera.aspect,(.5-motion.y)*height,0);model.update();scene.environmentIntensity=.48+motion.light*.30;ambient.intensity=.50+motion.light*.35;renderer.domElement.style.opacity=motion.opacity;renderer.render(scene,camera);};const renderTick=()=>render();gsap.ticker.add(renderTick);render();host.current.dataset.ready='true';window.__orbisModel={motion,render,renderer,machine:model.machine};onReady();
 return()=>{gsap.ticker.remove(renderTick);observer.disconnect();model.dispose();env.dispose();room.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();delete window.__orbisModel;};
 },[]);return <div className="product-canvas" ref={host} role="img" aria-label="ORBIS espresso machine, an interactive three-dimensional engineering study"/>;}
