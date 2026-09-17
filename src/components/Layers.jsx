import React, { useEffect } from 'react';
import { asset } from '../data/scenes';
export function OpeningDial() { return <div className="opening-dial" aria-hidden="true"><svg viewBox="0 0 240 240"><circle className="ring" cx="120" cy="120" r="89" /><path className="arc" d="M176 50 A89 89 0 0 1 181 184" /><path className="ticks" d="M120 39v6 M112 197h16" /><text x="120" y="126" textAnchor="middle">ORBIS</text></svg></div> }
export function Copy({ go }) {
  useEffect(() => {
    const box = document.querySelector('.engineering-labels'); let active = true;
    const align = () => {
      if (!active||box.style.visibility==='hidden') return; const bounds = box.getBoundingClientRect(); if (!bounds.width || !bounds.height) return; const paths = box.querySelectorAll('.leaders path'); const dots = box.querySelectorAll('.leaders circle'); const targets = window.__orbisAnchorPoints||[[640,352],[640,401],[650,401],[650,568]];
      const rects=[...box.querySelectorAll('.label')].map(label=>label.getBoundingClientRect());
      rects.forEach((r, i) => { const left = (r.left - bounds.left) / bounds.width * 1280; const right = (r.right - bounds.left) / bounds.width * 1280; const y = (r.bottom - bounds.top + 10) / bounds.height * 720; const [x, endY] = targets[i]; const start = i < 2 ? left : right; const elbow = i < 2 ? Math.min(right + 30, x - 70) : left; paths[i].setAttribute('d', `M${start} ${y}H${elbow}L${x} ${endY}`); dots[i].setAttribute('cx', x); dots[i].setAttribute('cy', endY); });
    }; const observer = new ResizeObserver(align); observer.observe(box); box.querySelectorAll('.label').forEach(e => observer.observe(e)); document.fonts.ready.then(align);window.addEventListener('orbis-anchors',align); align(); return () => { active = false; observer.disconnect();window.removeEventListener('orbis-anchors',align); };
  }, []);
  return <>
    <section className="copy intro"><h1><span>COFFEE,</span><span>IN MOTION</span></h1><p>Not just made to brew. Designed to turn an<br className="desktop" /> everyday ritual into something worth<br className="desktop" /> watching.</p><p className="micro">SMALL MACHINE. BIGGER MORNING.</p><button className="text-link" onClick={() => go(2.5)}>START THE JOURNEY <span>↗</span></button></section>
    <div className="dial-copy dial-left"><h2>ONE TURN</h2><p>TURN FOR<br />PRECISION.<br />AROMA.</p></div>
    <div className="dial-copy dial-right"><h2>CHANGES EVERYTHING</h2><p>TURN FOR THE<br />CUP YOU<br />ACTUALLY<br />WANTED.</p></div>
    <section className="precision copy"><h2><span className="text-line">WATCH PRECISION</span><span className="text-line">COME APART</span></h2></section>
    <div className="engineering-labels" aria-hidden="true"><svg className="leaders" viewBox="0 0 1280 720" preserveAspectRatio="none"><path pathLength="1" d="M182 278H365L477 352" /><path pathLength="1" d="M182 464H365L477 401" /><path pathLength="1" d="M968 231H895L782 314" /><path pathLength="1" d="M1010 565H895L781 517" /><circle cx="477" cy="352" r="2" /><circle cx="477" cy="401" r="2" /><circle cx="782" cy="314" r="2" /><circle cx="781" cy="517" r="2" /></svg><div className="label label-a">PRECISION GRINDER</div><div className="label label-b">INTELLIGENT HEATING</div><div className="label label-c">CONTROLLED EXTRACTION</div><div className="label label-d">ENGINEERED FLOW</div></div>
    <section className="copy bean-story"><span className="number">3</span><h2><span className="text-line">WHOLE BEAN.</span><span className="text-line">PERFECT GRIND.</span></h2><p>Precision grinding engineered for every origin.<br />Every bean, unlocked.</p><button className="pill dark" onClick={() => go(6.65)}>FOLLOW THE BEAN <span>↗</span></button></section>
    <img className="floating-bean" src={asset('bean')} alt="" />
    <div className="giant-words" aria-hidden="true"><div className="word word-strong">STRONG</div><div className="word word-smooth">SMOOTH <span>SHORT</span></div><div className="word word-intense">INTENSE <span>SLOW</span></div></div>
    <section className="copy ritual"><span className="number">4</span><h2>FROM BEAN TO<br />SOMETHING BETTER</h2><p>ORBIS adapts the ritual around you—not<br />the other way around.</p><p className="micro">ONE MACHINE. YOUR WAY. EVERY MORNING.</p><button className="pill dark" onClick={() => go(9.85)}>MAKE IT YOURS <span>↗</span></button></section>
    <section className="copy detail-copy"><span className="number">6.</span><h2>Designed to<br />stay out.</h2><p>Sculpted black surfaces. A single illuminated ring. Transparent water architecture. Nothing unnecessary.</p><p>Performance that happens to look beautiful.</p></section>
    <section className="copy tomorrow"><h2>TOMORROW<br />STARTS<br />WITH A<br />BETTER CUP.</h2><p>Not every morning needs to<br />be extraordinary. But it can<br />begin extraordinarily well.</p></section>
    <section className="copy outro"><h2>ORBIS —<small>Coffee moves<br />the day forward.</small></h2><button className="text-link" onClick={() => go(6.7)}>GET YOURS <span>↗</span></button><button className="pill warm" onClick={() => go(0)}>EXPERIENCE ORBIS <span>↗</span></button></section>
  </>
}
