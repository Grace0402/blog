'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LikeButton from '../../../components/LikeButton';
import CommentSection from '../../../components/CommentSection';
import hljs from 'highlight.js';

export default function PostPage({ params }) {
  var _p = useState(null), post = _p[0], setPost = _p[1];
  var _c = useState([]), comments = _c[0], setComments = _c[1];
  var _l = useState(0), likes = _l[0], setLikes = _l[1];
  var _pr = useState(null), prev = _pr[0], setPrev = _pr[1];
  var _n = useState(null), next = _n[0], setNext = _n[1];
  var _ld = useState(true), loading = _ld[0], setLoading = _ld[1];
  var _toc = useState([]), toc = _toc[0], setToc = _toc[1];
  var _active = useState(''), activeId = _active[0], setActiveId = _active[1];

  useEffect(function() {
    var slug = params.slug;
    fetch('/api/posts/' + slug).then(function(r) { return r.json(); }).then(function(data) {
      if (data.post) {
        setPost(data.post);
        setComments(data.comments || []);
        setLikes(data.likes || 0);
        setPrev(data.prev);
        setNext(data.next);
      }
      setLoading(false);
    }).catch(function() { setLoading(false); });
  }, [params.slug]);

  // Extract headings from content (supports both HTML <h1> and markdown #)
  useEffect(function() {
    if (!post) return;
    var raw = post.content || '';
    var items = [];
    // Match HTML headings: <h1>text</h1>, <h2>text</h2>, <h3>text</h3>
    var htmlRe = /<h([1-3])[^>]*>(.+?)<\/h\1>/gi;
    var m;
    while ((m = htmlRe.exec(raw)) !== null) {
      items.push({ id: 'h-' + items.length, text: m[2].replace(/<[^>]*>/g, '').trim(), level: parseInt(m[1]) });
    }
    // Match markdown headings: # text, ## text, ### text
    var mdRe = /^(#{1,3})\s+(.+)$/gm;
    while ((m = mdRe.exec(raw)) !== null) {
      items.push({ id: 'h-' + items.length, text: m[2].replace(/<[^>]*>/g, '').trim(), level: m[1].length });
    }
    setToc(items);
  }, [post]);

  // Code highlighting
  var contentRef = useRef(null);
  useEffect(function() {
    if (!post) return;
    setTimeout(function() {
      // Handle both <pre><code> and bare <pre> blocks
      document.querySelectorAll('.markdown-content pre').forEach(function(pre) {
        // If no <code> child, wrap content in <code>
        var code = pre.querySelector('code');
        if (!code) {
          code = document.createElement('code');
          code.innerHTML = pre.innerHTML;
          pre.innerHTML = '';
          pre.appendChild(code);
        }
        // Add language class if missing (default to plaintext for basic highlighting)
        if (!code.className || code.className.indexOf('language-') === -1) {
          code.classList.add('language-plaintext');
        }
        hljs.highlightElement(code);
      });
    }, 100);
  }, [post]);

  // Scroll spy
  useEffect(function() {
    function onScroll() {
      var best = '';
      var all = document.querySelectorAll('[id^="h-"]');
      all.forEach(function(el) {
        if (el.getBoundingClientRect().top < 120) best = el.id;
      });
      setActiveId(best);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return function() { window.removeEventListener('scroll', onScroll); };
  }, [toc]);

  // Convert markdown headings to HTML with IDs
  function renderContent(raw) {
    var html = raw;
    // Convert markdown headings to HTML with IDs
    var counter = 0;
    html = html.replace(/^(#{1,3})\s+(.+)$/gm, function(m, hashes, text) {
      return '<h' + hashes.length + ' id="h-' + (counter++) + '">' + text + '</h' + hashes.length + '>';
    });
    // Add IDs to existing HTML headings that don't have one
    html = html.replace(/<h([1-3])([^>]*)>/g, function(m, level, attrs) {
      if (attrs.indexOf('id=') >= 0) return m;
      return '<h' + level + attrs + ' id="h-' + (counter++) + '">';
    });
    return html;
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <div className="soft-glass-panel p-12 text-stone-400">加载中...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <div className="soft-glass-panel p-12">
          <div className="text-5xl mb-4">404</div>
          <p className="text-stone-500">这里什么都没有哦~ 页面可能被猫叼走了</p>
          <Link href="/" className="inline-block mt-4 text-amber-500 hover:text-amber-600">回到首页</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8 justify-center">
        <aside className="hidden xl:block w-64 shrink-0 sticky top-28 self-start">
          <div className="soft-glass-panel p-4 text-xs">
            <div className="font-bold text-stone-500 mb-3 text-xs uppercase tracking-wider">目录</div>
            {toc.length === 0 ? (
              <div className="text-stone-400">无标题</div>
            ) : (
              <nav className="space-y-0.5 max-h-[60vh] overflow-y-auto">
                {toc.map(function(item) {
                  return (
                    <a
                      key={item.id}
                      href={'#' + item.id}
                      onClick={function(e) {
                        e.preventDefault();
                        var el = document.getElementById(item.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={'block py-1 transition-colors hover:text-amber-500 truncate ' +
                        (item.level === 1 ? 'font-medium text-stone-700 dark:text-stone-200' :
                         item.level === 2 ? 'pl-3 text-stone-600 dark:text-stone-300' :
                         'pl-6 text-stone-500 dark:text-stone-400') +
                        (activeId === item.id ? ' text-amber-500' : '')}
                    >
                      {item.text}
                    </a>
                  );
                })}
              </nav>
            )}
          </div>
        </aside>
        <div className="w-full xl:w-[85%] min-w-0">
          {post.cover && (
            <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-8">
              <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-stone-800 dark:text-stone-100 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-stone-400 mb-8 flex-wrap">
            <span>{post.formattedDate}</span>
            {post.tags && post.tags.map(function(tag) {
              return <span key={tag} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">{tag}</span>;
            })}
            <span>{post.view_count} 浏览</span>
            <span>{likes} 点赞</span>
          </div>
          <div className="markdown-content soft-glass-panel p-8 md:p-10 mb-8" dangerouslySetInnerHTML={{ __html: renderContent(post.content || '') }} />
          <div className="flex justify-between items-center mb-8">
            {prev ? <Link href={'/posts/' + prev.slug} className="text-sm text-stone-500 hover:text-amber-500 transition-colors">&larr; {prev.title}</Link> : <div />}
            {next ? <Link href={'/posts/' + next.slug} className="text-sm text-stone-500 hover:text-amber-500 transition-colors text-right">{next.title} &rarr;</Link> : <div />}
          </div>
          <LikeButton postId={post.id} initialLikes={likes} />
          <CommentSection postId={post.id} initialComments={comments} />
        </div>
      </div>
    </article>
  );
}