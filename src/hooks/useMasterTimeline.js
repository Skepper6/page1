import { useLayoutEffect, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { chapters } from '../data/scenes';
import { motion } from '../components/machineModel';
import { referenceAtProgress, progressAtReference, scrollScreens } from '../data/pacing';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);
export function useMasterTimeline(root, ready, controller) {
  const [compact, setCompact] = useState(() => innerWidth < 700);
  useEffect(() => { const q = matchMedia('(max-width:699px)'); const update = () => setCompact(q.matches); q.addEventListener('change', update); return () => q.removeEventListener('change', update); }, []);
  useLayoutEffect(() => {
    if (!ready) return;
    const resumeTime = controller.current?.time ?? null;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({ lerp: .09, wheelMultiplier: 1, smoothWheel: !reduced, syncTouch: false }); lenis.on('scroll', ScrollTrigger.update); const tick = t => lenis.raf(t * 1000); gsap.ticker.lagSmoothing(0);gsap.ticker.add(tick,false,true);
    let timeline, driver; const playhead = { progress: 0 };
    root.current.style.height = reduced ? '100svh' : `${(scrollScreens + 1) * 100}svh`;
    const setUI = t => { const light = t > 3.25 && t < 7.68; document.documentElement.classList.toggle('light-ui', light); document.documentElement.classList.toggle('detail-active', t > 7.6 && t < 8.88); document.documentElement.classList.toggle('editorial-ui', t > 8.25 && t < 8.8); document.querySelectorAll('.copy').forEach(e => e.inert = Number(gsap.getProperty(e, 'opacity')) < .1); document.querySelectorAll('.chapter-dot').forEach((e, i) => { const active = i === Math.max(0, chapters.findLastIndex(c => t >= c.time - .1)); e.classList.toggle('active', active); if (active) e.setAttribute('aria-current', 'step'); else e.removeAttribute('aria-current'); }); };
    const ctx = gsap.context(() => {
      gsap.set(motion, { x: .5, y: compact ? .765 : .835, height: 1.22, yaw: 0, explode: 0, cup: 0, fill: 0, light: 0, opacity: 1,bodyOpacity:0, dialText: 0, dialRotation:0,beanFall:0,beanVisible:0 });
      gsap.set('.light-wipe', { scale: 0 }); gsap.set('.opening-dial', { autoAlpha: 0 });
      timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      const tl = timeline; chapters.forEach(c => tl.addLabel(c.name, c.time));
      const show = (q, t, d = .25, v = {}) => tl.to(q, { autoAlpha: 1, duration: d, ease: 'power1.inOut', ...v }, t); const hide = (q, t, d = .25, v = {}) => tl.to(q, { autoAlpha: 0, duration: d, ease: 'power1.inOut', ...v }, t);
      // Continuous object and camera state. The product never changes identity.
      tl.to(motion, { bodyOpacity: 1, duration: .5,ease:'power1.inOut' }, .14);hide('.opening-shade', .14, .6);
      tl.to(motion, { height: compact ? .76 : .65, y: compact ? .71 : .65, yaw:0, duration: .95,ease:'power1.inOut' }, .2);
      tl.fromTo('.dark-bg',{scale:1.26,yPercent:6},{scale:1,yPercent:0,duration:.95,ease:'power1.inOut'},.2);tl.fromTo('.stars',{scale:1.22,yPercent:3},{scale:1,yPercent:0,duration:.95,ease:'power1.inOut'},.2);
      show('.intro', .43, .35); tl.fromTo('.intro h1 span, .intro p, .intro button', { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .3, stagger: .075, ease: 'power2.out' }, .43);
      tl.to(motion,{height:compact?.78:.68,duration:.85,ease:'none'},1.15);
      hide('.intro', 1.32, .32, { y: -18, ease: 'power1.inOut' });
      show('.dial-copy', 1.65, .42, { ease: 'power1.inOut' }); tl.fromTo('.dial-copy h2', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .42, stagger: .08, ease: 'power2.out' }, 1.65);
      tl.to(motion, { height: compact ? 1.12 : 1.34, y: .805, yaw:.06, duration: .65,ease:'power1.inOut' }, 2.0);
      show('.dial-copy p', 2.14, .35);
      tl.to(motion, { dialText: 1, duration: .4 }, 1.85);tl.to(motion,{dialRotation:1.35,duration:1.05,ease:'power1.inOut'},1.75);tl.to(motion,{dialRotation:1.65,duration:.6},3.08); tl.to(motion, { dialText: 0, duration: .3 }, 4.25);
      tl.to('.light-wipe', { scale: 1, duration: .53, ease: 'power2.inOut' }, 2.82); hide('.dial-copy', 2.96, .3);
      show('.light-bg', 3.25, .10); tl.to(motion, { height: .51, y: compact ? .64 : .585,yaw:0, light: 1, duration: .43 }, 3.08);
      show('.precision', 3.2, .28);tl.fromTo('.precision .text-line',{y:28,autoAlpha:0},{y:0,autoAlpha:1,duration:.25,stagger:.08,ease:'power2.out'},3.2); show('.engineering-labels', 3.2, .15); tl.fromTo('.leaders path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .30,stagger:.04 }, 3.28);tl.fromTo('.leaders circle',{autoAlpha:0},{autoAlpha:1,duration:.03,stagger:.04},3.57);
      tl.to(motion, { explode: 1, height: compact ? .48 : .52, y: compact ? .68 : .63, yaw: -.38, duration: 1.35,ease:'power1.inOut' }, 3.83);
      hide('.precision', 4.45, .35, { y: -110 });tl.to('.label-a,.label-c',{y:compact?-12:-55,duration:.75,ease:'power1.inOut'},3.9);tl.to('.label-b,.label-d',{y:compact?-8:-28,duration:.75,ease:'power1.inOut'},3.9);hide('.engineering-labels', 4.85, .25);
      tl.to(motion, { x: compact ? .54 : .60, y:compact?.71:.63, duration: .6,ease:'power1.inOut' }, 4.68);
      show('.bean-story',4.72,.35);tl.fromTo('.bean-story .number,.bean-story .text-line,.bean-story p,.bean-story button',{y:45,autoAlpha:0},{y:0,autoAlpha:1,duration:.26,stagger:.06,ease:'power2.out'},4.72);
      tl.to(motion,{cup:1,duration:.25},4.92);tl.to(motion,{beanVisible:1,duration:.12},4.9);tl.to(motion,{beanFall:1,duration:.68,ease:'none'},5.04);tl.to(motion,{beanVisible:0,duration:.07},5.65);
      hide('.bean-story', 5.83, .28, { y: -85 }); tl.to(motion, { explode: 0, yaw: 0, height: .66, x: .5, y: compact ? .61 : .58, duration: .48,ease:'power2.inOut' }, 5.75);
      tl.to(motion, { fill: 1, duration: .48 }, 5.70);
      show('.ritual', 6.04, .25);tl.fromTo('.ritual > *',{y:35,autoAlpha:0},{y:0,autoAlpha:1,duration:.22,stagger:.045,ease:'power2.out'},6.04); show('.word-strong', 6.0, .25); tl.fromTo('.word-strong', { xPercent: 20 }, { xPercent: -8, duration: .78 }, 6.02);
      hide('.word-strong', 6.72, .18); show('.word-smooth', 6.73, .18); tl.fromTo('.word-smooth', { xPercent: 8 }, { xPercent: -8, duration: .45 }, 6.75);
      hide('.word-smooth', 7.10, .12); show('.word-intense', 7.16, .18); tl.fromTo('.word-intense', { xPercent: 7 }, { xPercent: 0, duration: .19, ease: 'power2.out' }, 7.16);
      hide('.ritual', 7.42, .3, { y: -240 }); hide('.word-intense', 7.45, .3, { y: -400 }); tl.to('.light-bg', { yPercent: -100, duration: .45 }, 7.45); hide('.light-wipe', 7.45, .01);
      tl.to(motion, { y: -.35, height: .65, duration: .33 }, 7.47);
      tl.set(motion, { y: 1.6, height: 1.32, yaw: -.93, x: compact ? .68 : .55, cup: 0, light: 0 }, 7.8);
      tl.to(motion, { y: .82, duration: .26 }, 7.8);
      show('.detail-panel', 8.13, .28); show('.detail-copy', 8.16, .3); tl.fromTo('.detail-copy > *', { y: 18 }, { y: 0, duration: .3, stagger: .045, ease: 'power2.out' }, 8.16); tl.to(motion, { x: compact ? .83 : .72, yaw: -.85, height: 1.14, duration: .33 }, 8.13);
      hide('.detail-copy', 8.65, .22, { y: -160 }); hide('.detail-panel', 8.65, .23, { yPercent: -100 });
      tl.to(motion, { height: .67, x: compact ? .33 : .5, y: compact ? .66 : .61, yaw: 0, cup: 1, duration: .4 }, 8.68);
      show('.outro', 8.94, .3); show('.tomorrow', 9.28, .35); show('.sunrise', 9.2, .8); tl.to(motion, { light: .5, duration: .8 }, 9.2);
      tl.to({}, { duration: .01 }, 9.99);
      const update = () => { const t = referenceAtProgress(playhead.progress); timeline.time(t); root.current.style.setProperty('--progress', playhead.progress); if (controller.current) controller.current.time = t; setUI(t); const d = document.querySelector('.debug'); if (d) d.textContent = `REFERENCE ${t.toFixed(2)}s · SCROLL ${Math.round(playhead.progress * 100)}%`; };
      if (reduced) { document.documentElement.classList.add('reduced-motion'); timeline.time(10); root.current.style.setProperty('--progress', 1); setUI(10); }
      else { driver = gsap.to(playhead, { progress: 1, ease: 'none', onUpdate: update, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } }); update(); }
    }, root);
    controller.current = { time: reduced ? 10 : referenceAtProgress(playhead.progress), timeline, go(time) { if (reduced) { timeline.time(time); root.current.style.setProperty('--progress', progressAtReference(time)); setUI(time); this.time = time; return; } lenis.scrollTo((root.current.offsetHeight - innerHeight) * progressAtReference(time), { duration: 2 }); } };
    window.__orbisTimeline = timeline; window.__orbisReview = { seek: time => { driver?.scrollTrigger.disable(); timeline.time(time); setUI(time); }, scrollReference: time => lenis.scrollTo((root.current.offsetHeight - innerHeight) * progressAtReference(time), { immediate: true }), progressAtReference, referenceAtProgress, scrollScreens }; ScrollTrigger.refresh();
    if (resumeTime !== null) { if (reduced) controller.current.go(resumeTime); else lenis.scrollTo((root.current.offsetHeight - innerHeight) * progressAtReference(resumeTime), { immediate: true }); }
    return () => { ctx.revert(); lenis.destroy(); gsap.ticker.remove(tick); delete window.__orbisTimeline; delete window.__orbisReview; document.documentElement.classList.remove('light-ui', 'detail-active', 'editorial-ui', 'reduced-motion'); };
  }, [ready, compact]);
}
