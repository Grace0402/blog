'use client';
import { useEffect } from 'react';
import { useEffectQuality } from '../contexts/EffectContext';
var COUNT = 8;

export default function ClickParticles() {
  var quality = useEffectQuality().quality;

  useEffect(function() {
    if (quality === 'static' || quality === 'paused') return;

    function handler(e) {
      var x = e.clientX;
      var y = e.clientY;
      var count = quality === 'low' ? 4 : COUNT;

      for (var i = 0; i < count; i++) {
        var petal = document.createElement('span');
        petal.className = 'sakura-click-petal';
        var size = 10 + Math.random() * 10;
        var angle = Math.random() * Math.PI * 2;
        var distance = 40 + Math.random() * 60;
        var dx = Math.cos(angle) * distance;
        var dy = Math.sin(angle) * distance - 40;
        var rot = Math.random() * 720 - 360;
        var dur = 800 + Math.random() * 600;
        var hue = 340 + Math.random() * 20;

        petal.style.left = x + 'px';
        petal.style.top = y + 'px';
        petal.style.width = size + 'px';
        petal.style.height = (size * 1.4) + 'px';
        petal.style.background = 'linear-gradient(135deg, hsl(' + hue + ',100%,92%), hsl(' + (hue-10) + ',80%,75%))';
        petal.style.setProperty('--dx', dx + 'px');
        petal.style.setProperty('--dy', dy + 'px');
        petal.style.setProperty('--rot', rot + 'deg');
        petal.style.animationDuration = dur + 'ms';

        document.body.appendChild(petal);
        setTimeout(function() { petal.remove(); }, dur);
      }
    }

    document.addEventListener('click', handler);
    return function() { document.removeEventListener('click', handler); };
  }, [quality]);

  return null;
}
