'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  var _ = useState(''), query = _[0], setQuery = _[1];
  var _2 = useState([]), results = _2[0], setResults = _2[1];
  var _3 = useState(false), open = _3[0], setOpen = _3[1];
  var _4 = useState(-1), activeIdx = _4[0], setActiveIdx = _4[1];
  var router = useRouter();
  var inputRef = useRef(null);
  var containerRef = useRef(null);
  var timeoutRef = useRef(null);
  var dropdownRef = useRef(null);
  var _5 = useState({ top: 0, left: 0, width: 0 }), dropdownPos = _5[0], setDropdownPos = _5[1];

  function updatePosition() {
    if (containerRef.current) {
      var rect = containerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
  }

  useEffect(function() {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target) && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return function() {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  function doSearch(val) {
    if (!val.trim()) { setResults([]); setOpen(false); return; }
    fetch('/api/posts?search=' + encodeURIComponent(val.trim()) + '&limit=5')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        setResults(d.posts || []);
        if ((d.posts || []).length > 0) {
          updatePosition();
          setOpen(true);
        }
        setActiveIdx(-1);
      })
      .catch(function() {});
  }

  function handleChange(e) {
    var val = e.target.value;
    setQuery(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(function() { doSearch(val); }, 200);
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(function(prev) { return prev < results.length - 1 ? prev + 1 : 0; });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(function(prev) { return prev > 0 ? prev - 1 : results.length - 1; });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) {
        goTo(results[activeIdx]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function goTo(post) {
    setOpen(false);
    setQuery('');
    router.push('/posts/' + (post.slug || post.id));
  }

  function handleFocus() {
    if (query.trim() && results.length > 0) { updatePosition(); setOpen(true); }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="soft-glass-panel-strong p-1 flex items-center rounded-2xl transition-all focus-within:ring-2 focus-within:ring-amber-500/30">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="搜索文章..."
          className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-stone-700 dark:text-stone-200 placeholder-stone-400"
        />
        <button onClick={function() { doSearch(query); }} className="px-4 py-2 text-amber-500 hover:text-amber-600 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
      </div>
      {open && results.length > 0 && createPortal(
        <div ref={dropdownRef} className="fixed soft-glass-panel-strong rounded-2xl overflow-hidden z-[9999] shadow-lg" style={{ top: dropdownPos.top + 'px', left: dropdownPos.left + 'px', width: dropdownPos.width + 'px' }}>
          {results.map(function(post, i) {
            var isActive = i === activeIdx;
            return (
              <button
                key={post.id || post.slug}
                onClick={function() { goTo(post); }}
                className={'w-full text-left px-4 py-3 text-sm transition-colors ' + (isActive ? 'bg-amber-500/10 text-amber-600' : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800')}
              >
                <div className="font-medium truncate">{post.title}</div>
                {post.description && <div className="text-xs text-stone-400 truncate mt-0.5">{post.description}</div>}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
