'use client';
import { useEffect, useRef } from 'react';
import { useEffectQuality } from '../contexts/EffectContext';

export default function SakuraPetals() {
  var _q = useEffectQuality();
  var quality = _q.quality;
  var containerRef = useRef(null);

  useEffect(function() {
    if (quality === 'static' || quality === 'paused') return;
    var container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    var count = quality === 'low' ? 8 : 18;

    for (var i = 0; i < count; i++) {
      var petal = document.createElement('div');
      var size = 7 + Math.random() * 9;
      var left = Math.random() * 100;
      var duration = 10 + Math.random() * 14;
      var delay = Math.random() * 18;
      var drift = (Math.random() - 0.5) * 200;
      var rotation = 180 + Math.random() * 540;
      var opacity = 0.5 + Math.random() * 0.4;
      var hue = 340 + Math.random() * 20;

      petal.style.cssText =
        'position:absolute;' +
        'top:-30px;' +
        'left:' + left + '%;' +
        'width:' + size + 'px;' +
        'height:' + (size * 1.4) + 'px;' +
        'background:linear-gradient(135deg, hsl(' + hue + ',100%,92%), hsl(' + (hue-10) + ',80%,75%));' +
        'border-radius:100% 0 100% 0 / 60% 0 60% 0;' +
        'opacity:' + opacity + ';' +
        'animation:sakura-fall ' + duration + 's ' + delay + 's linear infinite,sakura-sway ' + (3 + Math.random() * 4) + 's ease-in-out infinite;' +
        '--drift:' + drift + 'px;' +
        '--rotation:' + rotation + 'deg;' +
        'pointer-events:none;' +
        'z-index:0;';
      container.appendChild(petal);
    }
    return function() { if (container) container.innerHTML = ''; };
  }, [quality]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[1] overflow-hidden hidden md:block" aria-hidden="true" />;
}
