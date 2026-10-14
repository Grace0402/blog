import Link from 'next/link';
var db = require('../../lib/db');
export var dynamic = 'force-dynamic';

export default function ProjectsPage() {
  var projects = db.all('projects');
  projects.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-8">开源项目</h1>
      {projects.length === 0 ? (
        <div className="soft-glass-panel p-12 text-center text-stone-400"><p>暂无项目。</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(function(p) {
            var tags = typeof p.tags === 'string' ? p.tags.split(',').map(function(t){return t.trim()}).filter(Boolean) : (Array.isArray(p.tags) ? p.tags : []);
            return (
              <div key={p.id} className="soft-glass-panel p-5 hover:scale-[1.02] transition-transform">
                {p.image && <div className="w-full h-36 rounded-2xl overflow-hidden mb-3"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div>}
                <h3 className="font-bold text-stone-800 dark:text-stone-100">{p.name}</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">{p.description}</p>
                {tags.length > 0 && <div className="flex gap-1 mt-2 flex-wrap">{tags.map(function(t) { return <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-600">{t}</span>; })}</div>}
                <div className="flex gap-3 mt-3">
                  {p.github && <a href={p.github} target="_blank" className="text-xs text-stone-400 hover:text-amber-500 transition-colors">GitHub</a>}
                  {p.url && <a href={p.url} target="_blank" className="text-xs text-stone-400 hover:text-amber-500 transition-colors">查看详情</a>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
