'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const EffectContext = createContext();

export function EffectProvider({ children }) {
  const [quality, setQuality] = useState('high');

  useEffect(() => {
    const saved = localStorage.getItem('blog-effect-quality');
    if (saved) {
      setQuality(saved);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: true)').matches;
    if (reducedMotion) {
      setQuality('static');
      return;
    }

    const cores = navigator.hardwareConcurrency || 4;
    const width = window.innerWidth;
    if (width < 768 || cores <= 2) {
      setQuality('low');
    } else {
      setQuality('high');
    }
  }, []);

  const setEffectQuality = (q) => {
    setQuality(q);
    localStorage.setItem('blog-effect-quality', q);
  };

  return (
    <EffectContext.Provider value={{ quality, setEffectQuality }}>
      {children}
    </EffectContext.Provider>
  );
}

export const useEffectQuality = () => useContext(EffectContext);
