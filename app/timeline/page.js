'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

var PAGE_SIZE = 9;

export default function TimelinePage() {
  var _p = useState([]), allPosts = _p[0], setAllPosts = _p[1];
  var _pg = useState(1), page = _pg[0], setPage = _pg[1];
  var _ld = useState(true), loading = _ld[0], setLoading = _ld[1];

  useEffect(function() {
    fetch('/api/posts?limit=999').then(function(r) { return r.json(); }).then(function(d) {
      var posts = (d.posts || []).sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });
      setAllPosts(posts);
      setLoading(false);
    }).catch(function() { setLoading(false); });
  }, []);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-8"><div className="soft-glass-panel p-12 text-center text-stone-400">加载中...</div></div>;
  }

  var totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  var start = (page - 1) * PAGE_SIZE;
  var pagePosts = allPosts.slice(start, start + PAGE_SIZE);

  // Group current page posts by year
  var grouped = {};
  pagePosts.forEach(function(p) {
    var d = p.created_at ? new Date(p.created_at) : new Date();
    var year = d.getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(p);
  });
  var years = Object.keys(grouped).sort(function(a, b) { return b - a; });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-2">归档</h1>
      <p className="text-sm text-stone-500 mb-8">共 {allPosts.length} 篇文章</p>

      {allPosts.length === 0 ? (
        <div className="soft-glass-panel p-12 text-center text-stone-400"><p>暂无文章。</p></div>
      ) : (
        <div>
          <div className="space-y-8 mb-8">
            {years.map(function(year) {
              return (
                <div key={year}>
                  <h2 className="text-2xl font-black text-amber-500 mb-4">{year}</h2>
                  <div className="space-y-2">
                    {grouped[year].map(function(p) {
                      var d = p.created_at ? p.created_at.split('T')[0] : '';
                      return (
                        <Link key={p.id} href={'/posts/' + p.slug} className="soft-glass-panel p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform">
                          <div className="text-xs text-stone-400 shrink-0 w-24">{d}</div>
                          <div className="flex-1 font-medium text-stone-800 dark:text-stone-100">{p.title}</div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={function() { setPage(function(p) { return Math.max(1, p - 1); }); }}
                disabled={page <= 1}
                className={'px-4 py-2 rounded-xl text-sm transition-colors ' + (page <= 1 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-600 hover:bg-amber-500/10 hover:text-amber-500')}
              >
                ← 上一页
              </button>
              <span className="text-sm text-stone-400">{page} / {totalPages}</span>
              <button
                onClick={function() { setPage(function(p) { return Math.min(totalPages, p + 1); }); }}
                disabled={page >= totalPages}
                className={'px-4 py-2 rounded-xl text-sm transition-colors ' + (page >= totalPages ? 'text-stone-300 cursor-not-allowed' : 'text-stone-600 hover:bg-amber-500/10 hover:text-amber-500')}
              >
                下一页 →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}