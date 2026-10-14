'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TagsPage() {
  var _t = useState([]), tags = _t[0], setTags = _t[1];
  var _s = useState(''), selectedTag = _s[0], setSelectedTag = _s[1];
  var _p = useState([]), posts = _p[0], setPosts = _p[1];
  var _l = useState(true), loading = _l[0], setLoading = _l[1];
  var _pl = useState(false), postsLoading = _pl[0], setPostsLoading = _pl[1];

  useEffect(function() {
    fetch('/api/tags').then(function(r) { return r.json(); }).then(function(d) {
      setTags(d.tags || []);
      setLoading(false);
    });
  }, []);

  function selectTag(slug, name) {
    setSelectedTag(name);
    setPostsLoading(true);
    fetch('/api/posts?tag=' + slug + '&limit=50').then(function(r) { return r.json(); }).then(function(d) {
      setPosts(d.posts || []);
      setPostsLoading(false);
    });
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8"><div className="soft-glass-panel p-12 text-center text-stone-400">加载中...</div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-8">标签</h1>

      {tags.length === 0 ? (
        <div className="soft-glass-panel p-12 text-center text-stone-400"><p>暂无标签。</p></div>
      ) : (
        <div className="flex flex-wrap gap-3 mb-8">
          {tags.map(function(tag) {
            return (
              <button key={tag.id} onClick={function() { selectTag(tag.slug, tag.name); }}
                className={'soft-glass-panel px-4 py-2 rounded-full transition-colors text-sm ' + (selectedTag === tag.name ? 'bg-amber-500/20 text-amber-600 font-medium' : 'text-stone-600 dark:text-stone-400 hover:bg-amber-500/10')}>
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      {selectedTag && (
        <div>
          <h2 className="text-xl font-bold text-stone-700 dark:text-stone-200 mb-4">「{selectedTag}」下的文章</h2>
          {postsLoading ? (
            <div className="soft-glass-panel p-8 text-center text-stone-400">加载中...</div>
          ) : posts.length === 0 ? (
            <div className="soft-glass-panel p-8 text-center text-stone-400">该标签下暂无文章</div>
          ) : (
            <div className="space-y-3">
              {posts.map(function(post) {
                return (
                  <Link key={post.id} href={'/posts/' + post.slug} className="soft-glass-panel block p-4 hover:bg-amber-500/5 transition-colors rounded-xl">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100">{post.title}</h3>
                    {post.description && <p className="text-sm text-stone-500 mt-1">{post.description}</p>}
                    <span className="text-xs text-stone-400 mt-2 inline-block">{post.formattedDate}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}