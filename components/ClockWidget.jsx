'use client';
import { useState, useEffect } from 'react';

export default function ClockWidget() {
  const [time, setTime] = useState('');

  useEffect(function() {
    function tick() {
      var now = new Date();
      var h = String(now.getHours()).padStart(2, '0');
      var m = String(now.getMinutes()).padStart(2, '0');
      var s = String(now.getSeconds()).padStart(2, '0');
      setTime(h + ':' + m + ':' + s);
    }
    tick();
    var timer = setInterval(tick, 1000);
    return function() { clearInterval(timer); };
  }, []);

  if (!time) {
    return (
      <div className="soft-glass-panel p-4">
        <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">Clock</h3>
        <div className="text-center py-2 text-xs text-stone-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="soft-glass-panel p-4">
      <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">Clock</h3>
      <div className="text-center">
        <div className="text-4xl font-black text-stone-800 dark:text-stone-100 tabular-nums tracking-widest">
          {time}
        </div>
        <div className="text-xs text-stone-400 mt-2">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</div>
      </div>
    </div>
  );
}
