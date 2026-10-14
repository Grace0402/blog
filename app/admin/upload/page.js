'use client';
import { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function UploadPage() {
  var _ = useState(false), up = _[0], su = _[1];
  var _2 = useState([]), fs = _2[0], sf = _2[1];
  var _3 = useState(''), pv = _3[0], sp = _3[1];

  async function handleUpload(e) {
    var file = e.target.files[0]; if (!file) return; su(true);
    var fd = new FormData(); fd.append('file', file);
    try {
      var r = await fetch('/api/upload', { method: 'POST', body: fd });
      var d = await r.json();
      if (d.url) { sf([{ url: d.url, name: d.name }, ...fs].slice(0, 20)); sp(d.url); }
    } catch(ex) { alert('Upload failed'); }
    su(false);
  }

  function copy(url) {
    navigator.clipboard.writeText(url).then(function() {
      alert('已复制到剪贴板！可以粘贴到头像、背景图、封面等地方使用');
    });
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-2">文件上传</h1>
        <p className="text-sm text-stone-500 mb-2">上传图片或文件，获取访问链接。上传后可复制 URL 用于任意地方。</p>
        <div className="soft-glass-panel p-4 mb-6 text-xs text-stone-500 space-y-1">
          <p>✅ <b>写文章时插图片：</b>直接拖拽图片到编辑区即可，不需要来这里上传。</p>
          <p>✅ <b>这里的用途：</b>上传头像、背景图、文章封面等图片，复制 URL 后粘贴到对应输入框。</p>
        </div>

        <div className="soft-glass-panel p-8 text-center mb-8">
          <label className={'inline-flex flex-col items-center gap-3 cursor-pointer ' + (up ? 'opacity-50' : '')}>
            <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
            </div>
            <span className="text-sm text-stone-600 dark:text-stone-300">{up ? 'Uploading...' : '点击或拖拽上传'}</span>
            <span className="text-xs text-stone-400">支持图片、音频等文件</span>
            <input type="file" onChange={handleUpload} className="hidden" disabled={up} />
          </label>
        </div>

        {pv && (
          <div className="soft-glass-panel p-4 mb-6">
            <div className="text-xs text-stone-500 mb-2">上次上传：</div>
            <div className="flex items-center gap-3">
              <img src={pv} alt="" className="w-20 h-20 object-cover rounded-lg" />
              <input type="text" value={pv} readOnly className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none text-xs text-stone-600" />
              <button onClick={function() { copy(pv); }} className="px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors shrink-0">复制</button>
            </div>
          </div>
        )}

        {fs.length > 0 && (
          <div className="soft-glass-panel p-4">
            <h3 className="text-sm font-bold text-stone-700 dark:text-stone-200 mb-3">历史记录</h3>
            <div className="space-y-2">
              {fs.map(function(f) {
                return (
                  <div key={f.url} className="flex items-center gap-2 text-xs">
                    <span className="text-stone-400 truncate flex-1">{f.name}</span>
                    <button onClick={function() { copy(f.url); }} className="text-amber-500 hover:text-amber-600 font-medium">复制 URL</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
