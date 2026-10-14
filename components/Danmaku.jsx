'use client';
import { useEffect, useRef } from 'react';
import { useEffectQuality } from '../contexts/EffectContext';

const MSGS = ['writes too well!', 'Nice!', 'Learned a lot', 'Great work!', 'Bookmarked', 'Thanks for sharing', 'Waiting for more', 'So deep', 'Amazing'];

export default function Danmaku() {
  const { quality } = useEffectQuality();
  const containerRef = useRef(null);

  useEffect(() => {
    if (quality === 'static' || quality === 'paused') return;
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    const lines = quality === 'low' ? 3 : 6;
    for (let l = 0; l < lines; l++) {
      const track = document.createElement('div');
      track.style.cssText = `position:absolute;top:${15+l*12}%;white-space:nowrap;pointer-events:none;z-index:0;`;
      const msg = MSGS[Math.floor(Math.random() * MSGS.length)];
      const span = document.createElement('span');
      const duration = 15 + Math.random() * 20;
      const delay = -Math.random() * duration;
      span.textContent = '  ' + msg + '    ';
      span.style.cssText = `display:inline-block;animation:danmaku-scroll ${duration}s ${delay}s linear infinite;font-size:0.85rem;font-weight:900;color:var(--text-primary);opacity:0.04;`;
      track.appendChild(span);
      container.appendChild(track);
    }
    return () => { if (container) container.innerHTML = ''; };
  }, [quality]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[1] overflow-hidden hidden md:block" aria-hidden="true" />;
}
