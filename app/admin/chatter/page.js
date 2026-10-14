'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function ChatterAdmin() {
  var _ = useState([]), msgs = _[0], sm = _[1];
  var _2 = useState(true), ld = _2[0], sl = _2[1];

  useEffect(function() { load(); }, []);

  async function load() {
    try { var r = await fetch('/api/chatter'); var d = await r.json(); sm(d.messages || []); } catch(e) {}
    sl(false);
  }

  async function del(id) {
    if (!confirm('确定删除这条留言？')) return;
    try {
      await fetch('/api/chatter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      });
      sm(msgs.filter(function(m) { return m.id !== id; }));
    } catch(e) { alert('删除失败'); }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-2">留言墙管理</h1>
        <p className="text-sm text-stone-500 mb-8">管理所有留言，可删除不当言论</p>

        {ld ? (
          <div className="soft-glass-panel p-12 text-center text-stone-400">加载中...</div>
        ) : msgs.length === 0 ? (
          <div className="soft-glass-panel p-12 text-center text-stone-400">暂无留言</div>
        ) : (
          <div className="space-y-3">
            {msgs.map(function(m) {
              return (
                <div key={m.id} className="soft-glass-panel p-4 flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-stone-700 dark:text-stone-200">{m.author}</span>
                      <span className="text-xs text-stone-400">{m.created_at ? m.created_at.split('T')[0] : ''}</span>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-300">{m.content}</p>
                    {m.image && <img src={m.image} alt="" className="mt-2 w-24 h-20 object-cover rounded-lg" />}
                  </div>
                  <button onClick={function() { del(m.id); }}
                    className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors shrink-0">
                    删除
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
