import {useLayoutEffect,useEffect,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {chapters} from '../data/scenes';
import {motion} from '../components/machineModel';
import {referenceAtProgress,progressAtReference,scrollScreens} from '../data/pacing';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);
export function useMasterTimeline(root,ready,controller){
 const [compact,setCompact]=useState(()=>innerWidth<700);
 useEffect(()=>{const q=matchMedia('(max-width:699px)');const update=()=>setCompact(q.matches);q.addEventListener('change',update);return()=>q.removeEventListener('change',update);},[]);
 useLayoutEffect(()=>{if(!ready)return;
 const resumeTime=controller.current?.time??null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const lenis=new Lenis({lerp:.12,wheelMultiplier:1,smoothWheel:!reduced,syncTouch:false});lenis.on('scroll',ScrollTrigger.update);const tick=t=>lenis.raf(t*1000);gsap.ticker.add(tick);
 let timeline,driver;const playhead={progress:0};
 root.current.style.height=reduced?'100svh':`${(scrollScreens+1)*100}svh`;
 const setUI=t=>{const light=t>3.25&&t<7.68;document.documentElement.classList.toggle('light-ui',light);document.documentElement.classList.toggle('detail-active',t>7.6&&t<8.88);document.documentElement.classList.toggle('editorial-ui',t>8.25&&t<8.8);document.querySelectorAll('.copy').forEach(e=>e.inert=Number(gsap.getProperty(e,'opacity'))<.1);document.querySelectorAll('.chapter-dot').forEach((e,i)=>{const active=i===Math.max(0,chapters.findLastIndex(c=>t>=c.time-.1));e.classList.toggle('active',active);if(active)e.setAttribute('aria-current','step');else e.removeAttribute('aria-current');});};
 const ctx=gsap.context(()=>{
 gsap.set(motion,{x:.5,y:compact?.73:.76,height:1.12,yaw:0,explode:0,cup:0,fill:0,light:0,opacity:0,dialText:0});
 gsap.set('.light-wipe',{scale:0});gsap.set('.opening-dial',{autoAlpha:1});
 timeline=gsap.timeline({paused:true,defaults:{ease:'none'}});
 const tl=timeline;chapters.forEach(c=>tl.addLabel(c.name,c.time));
 const show=(q,t,d=.25,v={})=>tl.to(q,{autoAlpha:1,duration:d,ease:'power1.inOut',...v},t);const hide=(q,t,d=.25,v={})=>tl.to(q,{autoAlpha:0,duration:d,ease:'power1.inOut',...v},t);
 // Continuous object and camera state. The product never changes identity.
 tl.to(motion,{opacity:1,duration:.32},.24);hide('.opening-dial',.22,.3);hide('.opening-shade',.35,.55);
 tl.to(motion,{height:compact?.76:.65,y:compact?.71:.63,duration:.85},.3);
 show('.intro',.55,.45);tl.fromTo('.intro h1 span, .intro p, .intro button',{y:24,autoAlpha:0},{y:0,autoAlpha:1,duration:.3,stagger:.05,ease:'power2.out'},.55);
 hide('.intro',1.32,.32,{y:-18,ease:'power1.inOut'});
 show('.dial-copy',1.65,.42,{ease:'power1.inOut'});tl.fromTo('.dial-copy h2',{y:24,autoAlpha:0},{y:0,autoAlpha:1,duration:.42,stagger:.08,ease:'power2.out'},1.65);
 tl.to(motion,{height:compact?1.12:1.34,y:.805,duration:.55},2.1);
 show('.dial-copy p',2.14,.35);
 tl.to(motion,{dialText:1,duration:.35},2.16);tl.to(motion,{dialText:0,duration:.3},4.25);
 tl.to('.light-wipe',{scale:1,duration:.53,ease:'power2.inOut'},2.82);hide('.dial-copy',2.96,.3);
 show('.light-bg',3.25,.10);tl.to(motion,{height:.51,y:compact?.64:.585,light:1,duration:.43},3.08);
 show('.precision',3.2,.28);show('.engineering-labels',3.42,.28);tl.fromTo('.leaders path',{strokeDashoffset:1},{strokeDashoffset:0,duration:.3},3.42);
 tl.to(motion,{explode:1,height:compact?.54:.58,y:compact?.62:.58,yaw:-.42,duration:1.35},3.83);
 hide('.precision',4.45,.35,{y:-110});hide('.engineering-labels',4.85,.25);
 tl.to(motion,{x:compact?.54:.57,y:.55,duration:.6},4.68);
 show('.bean-story',4.8,.3);show('.floating-bean',5.02,.2);tl.fromTo('.floating-bean',{y:-35,rotation:-20},{y:40,rotation:20,duration:.75},5.02);hide('.floating-bean',5.67,.2);
 hide('.bean-story',5.7,.3,{y:-65});tl.to(motion,{explode:0,yaw:0,height:.66,x:.5,y:compact?.61:.58,duration:.62},5.57);
 tl.to(motion,{cup:1,duration:.25},5.55);tl.to(motion,{fill:1,duration:.7},5.85);
 show('.ritual',6.04,.25);show('.word-strong',6.0,.25);tl.fromTo('.word-strong',{xPercent:20},{xPercent:-8,duration:.78},6.02);
 hide('.word-strong',6.72,.18);show('.word-smooth',6.73,.18);tl.fromTo('.word-smooth',{xPercent:8},{xPercent:-8,duration:.45},6.75);
 hide('.word-smooth',7.10,.12);show('.word-intense',7.16,.18);tl.fromTo('.word-intense',{xPercent:7},{xPercent:0,duration:.19,ease:'power2.out'},7.16);
 hide('.ritual',7.42,.3,{y:-240});hide('.word-intense',7.45,.3,{y:-400});tl.to('.light-bg',{yPercent:-100,duration:.45},7.45);hide('.light-wipe',7.45,.01);
 tl.to(motion,{y:-.35,height:.65,duration:.33},7.47);
 tl.set(motion,{y:1.6,height:1.32,yaw:-.93,x:compact?.68:.55,cup:0,light:0},7.8);
 tl.to(motion,{y:.82,duration:.26},7.8);
 show('.detail-panel',8.13,.28);show('.detail-copy',8.16,.3);tl.fromTo('.detail-copy > *',{y:18},{y:0,duration:.3,stagger:.045,ease:'power2.out'},8.16);tl.to(motion,{x:compact?.83:.72,yaw:-.85,height:1.14,duration:.33},8.13);
 hide('.detail-copy',8.65,.22,{y:-160});hide('.detail-panel',8.65,.23,{yPercent:-100});
 tl.to(motion,{height:.67,x:compact?.33:.5,y:compact?.66:.61,yaw:0,cup:1,duration:.4},8.68);
 show('.outro',8.94,.3);show('.tomorrow',9.28,.35);show('.sunrise',9.2,.8);tl.to(motion,{light:.5,duration:.8},9.2);
 tl.to({}, {duration:.01},9.99);
 const update=()=>{const t=referenceAtProgress(playhead.progress);timeline.time(t);root.current.style.setProperty('--progress',playhead.progress);if(controller.current)controller.current.time=t;setUI(t);const d=document.querySelector('.debug');if(d)d.textContent=`REFERENCE ${t.toFixed(2)}s · SCROLL ${Math.round(playhead.progress*100)}%`;};
 if(reduced){document.documentElement.classList.add('reduced-motion');timeline.time(10);root.current.style.setProperty('--progress',1);setUI(10);}
 else{driver=gsap.to(playhead,{progress:1,ease:'none',onUpdate:update,scrollTrigger:{trigger:root.current,start:'top top',end:'bottom bottom',scrub:true,invalidateOnRefresh:true}});update();}
 },root);
 controller.current={time:reduced?10:referenceAtProgress(playhead.progress),timeline,go(time){if(reduced){timeline.time(time);root.current.style.setProperty('--progress',progressAtReference(time));setUI(time);this.time=time;return;}lenis.scrollTo((root.current.offsetHeight-innerHeight)*progressAtReference(time),{duration:2});}};
 window.__orbisTimeline=timeline;window.__orbisReview={seek:time=>{driver?.scrollTrigger.disable();timeline.time(time);setUI(time);},scrollReference:time=>lenis.scrollTo((root.current.offsetHeight-innerHeight)*progressAtReference(time),{immediate:true}),progressAtReference,referenceAtProgress,scrollScreens};ScrollTrigger.refresh();
 if(resumeTime!==null){if(reduced)controller.current.go(resumeTime);else lenis.scrollTo((root.current.offsetHeight-innerHeight)*progressAtReference(resumeTime),{immediate:true});}
 return()=>{ctx.revert();lenis.destroy();gsap.ticker.remove(tick);delete window.__orbisTimeline;delete window.__orbisReview;document.documentElement.classList.remove('light-ui','detail-active','editorial-ui','reduced-motion');};
 },[ready,compact]);
}
