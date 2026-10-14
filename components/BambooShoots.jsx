'use client';
import { useEffect, useRef } from 'react';
import { useEffectQuality } from '../contexts/EffectContext';

export default function BambooShoots() {
  const { quality } = useEffectQuality();
  const containerRef = useRef(null);

  useEffect(() => {
    if (quality === 'static' || quality === 'paused') return;
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    const count = quality === 'low' ? 10 : 20;
    for (let i = 0; i < count; i++) {
      const shoot = document.createElement('div');
      const left = Math.random() * 100;
      const height = 40 + Math.random() * 80;
      const rotation = -5 + Math.random() * 10;
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 3;
      const hue = 80 + Math.random() * 40;
      shoot.style.cssText = `position:absolute;bottom:0;left:${left}%;width:6px;height:${height}px;background:linear-gradient(to top,hsl(${hue},60%,25%),hsl(${hue},70%,45%));border-radius:50% 50% 0 0;transform-origin:bottom center;transform:rotate(${rotation}deg);animation:bamboo-sway ${duration}s ${delay}s ease-in-out infinite;pointer-events:none;z-index:0;mask-image:linear-gradient(to top,rgba(0,0,0,0.3),rgba(0,0,0,0));`;
      container.appendChild(shoot);
    }
    return () => { if (container) container.innerHTML = ''; };
  }, [quality]);

  return <div ref={containerRef} className="fixed bottom-0 left-0 right-0 pointer-events-none z-[1] h-40 hidden md:block" aria-hidden="true" />;
}
