'use client';
import { useState, useEffect } from 'react';

export default function AuthorCard() {
  var _t = useState(''), toast = _t[0], setToast = _t[1];
  var _ = useState({ avatar: '', name: 'MirrorMoon', bio: 'Where Words Embrace the Way', github: '', email: '', wechat: '', qq: '' }), f = _[0], sf = _[1];

  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(function() {
      setToast(label + ' 已复制');
      setTimeout(function() { setToast(''); }, 2000);
    }).catch(function() {
      setToast('复制失败');
      setTimeout(function() { setToast(''); }, 2000);
    });
  }

  useEffect(function() {
    fetch('/api/site-settings')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.settings) {
          sf({
            avatar: d.settings.avatar || '',
            name: d.settings.name || 'MirrorMoon',
            bio: d.settings.bio || 'Where Words Embrace the Way',
            github: d.settings.github || '',
            email: d.settings.email || '',
            wechat: d.settings.wechat || '',
            qq: d.settings.qq || ''
          });
        }
      })
      .catch(function() {});
  }, []);

  return (
    <div className="soft-glass-panel p-5 text-center">
      {f.avatar ? (
        <img src={f.avatar} alt={f.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-amber-500/30" />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-black">
          {f.name.charAt(0)}
        </div>
      )}
      <h3 className="font-bold text-stone-800 dark:text-stone-100">{f.name}</h3>
      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{f.bio}</p>
      <div className="flex justify-center gap-3 mt-3">
        {f.github && (
          <a href={f.github} target="_blank" className="text-stone-400 hover:text-amber-500 transition-colors">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        )}
        {f.email && (
          <a href={'mailto:' + f.email} className="text-stone-400 hover:text-amber-500 transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </a>
        )}
        {f.wechat && (
          <button onClick={function() { copyToClipboard(f.wechat, '微信'); }} className="text-stone-400 hover:text-amber-500 transition-colors" title='微信'>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.327.327 0 00.166-.045l1.76-.986a.565.565 0 01.514-.024c.934.44 2.002.682 3.184.682 4.8 0 8.691-3.288 8.691-7.342 0-4.054-3.891-7.342-8.691-7.342zM5.996 11.27c-.538 0-.98-.44-.98-.98 0-.538.442-.98.98-.98.537 0 .98.442.98.98 0 .54-.443.98-.98.98zm5.39 0c-.538 0-.98-.44-.98-.98 0-.538.442-.98.98-.98.537 0 .98.442.98.98 0 .54-.443.98-.98.98z"/><path d="M17.898 19.478c4.176-.358 7.5-3.423 7.5-7.252 0-3.769-3.198-6.856-7.06-7.23-.027.213-.032.428-.016.644.062.777.285 1.55.639 2.26 2.65.568 4.637 2.78 4.637 5.44 0 2.754-2.09 5.08-4.842 5.753a5.33 5.33 0 01-.358.385z"/></svg>
          </button>
        )}
        {f.qq && (
          <button onClick={function() { copyToClipboard(f.qq, 'QQ'); }} className="text-stone-400 hover:text-amber-500 transition-colors" title='QQ'>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M21.395 15.035a39.548 39.548 0 00-.803-2.264l-1.079-2.695c.001-.032.01-.062.01-.094a7.522 7.522 0 00-7.523-7.524 7.522 7.522 0 00-7.523 7.523c0 .03.008.059.009.089l-1.08 2.698a39.374 39.374 0 00-.802 2.265c-.405 1.364-.396 2.163-.16 2.613.216.41.579.66 1.068.832.427.15.961.224 1.556.224.042 0 .084-.002.126-.002l.028-.001c.85.087 1.868.275 2.944.553.546.807 1.837 1.712 3.358 1.712 1.523 0 2.814-.908 3.36-1.715a21.33 21.33 0 002.97-.55c.484.024.96.057 1.408.057.634 0 1.203-.088 1.655-.265.503-.196.874-.479 1.065-.93.232-.449.155-1.183-.168-2.586z"/></svg>
          </button>
        )}
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-xl bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-800 text-sm shadow-lg">{toast}</div>
      )}
    </div>
  );
}
