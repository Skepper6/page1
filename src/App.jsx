import React, { useEffect, useRef, useState } from 'react';
import { asset, chapters } from './data/scenes';
import { Copy, OpeningDial } from './components/Layers';
import MachineScene from './components/MachineScene';
import { useMasterTimeline } from './hooks/useMasterTimeline';

export default function App() {
  const root = useRef(null);
  const controller = useRef(null);
  const videoRef = useRef(null);

  const [assetsReady, setAssetsReady] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [failed, setFailed] = useState(false);

  // Main page is ready when assets & 3D model are loaded AND loading video finished
  const ready = assetsReady && modelReady && videoFinished;

  const go = (t) => controller.current?.go(t);

  useEffect(() => {
    let active = true;
    const urls = [
      asset('bean'),
      `${import.meta.env.BASE_URL}assets/v2/night.webp`,
      `${import.meta.env.BASE_URL}assets/v2/dawn.webp`,
      `${import.meta.env.BASE_URL}assets/v2/espresso-photo.png`,
      `${import.meta.env.BASE_URL}assets/v2/espresso-glass.png`
    ];

    Promise.all(
      urls.map(
        (url) =>
          new Promise((resolve) => {
            const im = new Image();
            im.onload = async () => {
              try {
                await im.decode();
              } catch {}
              resolve(true);
            };
            im.onerror = () => resolve(false);
            im.src = url;
          })
      )
    ).then((results) => {
      if (active) {
        if (results.every(Boolean)) setAssetsReady(true);
        else setFailed(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  // Programmatically trigger video play with muted autoplay policy compliance
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if autoplay is blocked
          setVideoFinished(true);
        });
      }
    }
  }, []);

  const handleVideoEnded = () => {
    setVideoFinished(true);
  };

  useMasterTimeline(root, ready, controller);

  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [ready]);

  const step = (dir) => {
    const t = controller.current?.time || 0;
    const candidates = chapters.filter((c) => (dir > 0 ? c.time > t + 0.25 : c.time < t - 0.25));
    go(dir > 0 ? candidates[0]?.time ?? 10 : candidates.at(-1)?.time ?? 0);
  };

  return (
    <>
      {!ready && (
        <div className={`loader-screen ${videoFinished ? 'fade-out' : ''}`} role="status">
          <video
            ref={videoRef}
            className="loader-video"
            src={`${import.meta.env.BASE_URL}assets/v2/orbis-loading.mp4`}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
          />
          {failed && (
            <div className="loader-error">
              <p>A visual could not load. Please reload.</p>
              <button className="reload-btn" onClick={() => location.reload()}>
                RELOAD
              </button>
            </div>
          )}
        </div>
      )}

      <main className="experience" ref={root} aria-label="ORBIS cinematic product experience">
        <div className="stage">
          <div className="dark-bg" />
          <img className="stars layer" src={asset('stars')} alt="" />
          <div className="sunrise" />
          <div className="opening-shade" />
          <div className="light-wipe" />
          <div className="light-bg" />

          <Copy go={go} />
          <MachineScene onReady={() => setModelReady(true)} />
          <OpeningDial />
          <div className="detail-panel" />

          <header>
            <button className="wordmark" onClick={() => go(0)} aria-label="ORBIS home">
              ORBIS
            </button>
            <nav aria-label="Main navigation">
              <button onClick={() => go(8.43)}>ABOUT US</button>
              <button onClick={() => go(3.7)}>PRODUCTS</button>
              <button onClick={() => go(10)}>CONTACT US</button>
              <button onClick={() => go(5.25)}>OUR STORY</button>
            </nav>
          </header>

          <button className="side previous" onClick={() => step(-1)} aria-label="Previous chapter">
            ‹
          </button>
          <button className="side next" onClick={() => step(1)} aria-label="Next chapter">
            ›
          </button>

          <svg className="sparkle" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 0C22 13 27 18 40 20C27 22 22 27 20 40C18 27 13 22 0 20C13 18 18 13 20 0Z" />
          </svg>

          <footer>
            <span className="scroll-hint">SCROLL TO EXPLORE</span>
            <nav className="chapters" aria-label="Experience chapters">
              {chapters.map((c) => (
                <button
                  className="chapter-dot"
                  key={c.name}
                  onClick={() => go(c.time)}
                  aria-label={c.name}
                  title={c.name}
                />
              ))}
            </nav>
            <button className="replay" aria-label="Replay experience" onClick={() => go(0)}>
              <svg viewBox="0 0 40 40">
                <circle className="track" cx="20" cy="20" r="17" />
                <circle className="progress" cx="20" cy="20" r="17" />
              </svg>
              <span>↺</span>
            </button>
          </footer>

          {new URLSearchParams(location.search).has('debug') && <output className="debug" />}
        </div>
      </main>

      <div className="sr-only">
        <h2>Discover ORBIS</h2>
        <p>
          A precision espresso machine. Explore the control dial, independent engineering components, your coffee ritual,
          and the finished cup. Use the chapter navigation to move through the experience.
        </p>
      </div>
    </>
  );
}
