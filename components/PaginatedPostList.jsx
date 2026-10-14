'use client';
import { useState, useCallback, useRef } from 'react';
import PostCard from './PostCard';

var PAGE_SIZE = 5;

export default function PaginatedPostList({ posts }) {
  var allPosts = posts || [];
  var totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  var [currentPage, setCurrentPage] = useState(1);
  var [direction, setDirection] = useState('next');
  var [isAnimating, setIsAnimating] = useState(false);
  var containerRef = useRef(null);
  var startIndex = (currentPage - 1) * PAGE_SIZE;
  var pagePosts = allPosts.slice(startIndex, startIndex + PAGE_SIZE);

  var goToPage = useCallback(function(page) {
    if (page === currentPage || page < 1 || page > totalPages || isAnimating) return;
    setDirection(page > currentPage ? 'next' : 'prev');
    setIsAnimating(true);
    setTimeout(function() {
      setCurrentPage(page);
      setIsAnimating(false);
    }, 260);
  }, [currentPage, totalPages, isAnimating]);

  var handlePrev = useCallback(function() { goToPage(currentPage - 1); }, [currentPage, goToPage]);
  var handleNext = useCallback(function() { goToPage(currentPage + 1); }, [currentPage, goToPage]);

  var getPageNumbers = function() {
    var pages = [];
    var maxShow = 5;
    var start = Math.max(1, currentPage - Math.floor(maxShow / 2));
    var end = Math.min(totalPages, start + maxShow - 1);
    if (end - start + 1 < maxShow) start = Math.max(1, end - maxShow + 1);
    for (var i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (allPosts.length === 0) {
    return (
      <div className="soft-glass-panel p-12 text-center text-stone-400">
        <div className="text-4xl mb-3">{'\u{1F4DD}'}</div>
        <p>No articles yet, the first one is on its way.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <div
        className="paginated-list"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.26s ease, transform 0.26s ease',
        }}
      >
        {pagePosts.map(function(post, i) {
          return <div key={post.id} style={{ marginBottom: i < pagePosts.length - 1 ? '16px' : '0' }}>
            <PostCard post={post} index={i} />
          </div>;
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 pt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1 || isAnimating}
            className="px-3 py-2 rounded-xl text-sm font-medium transition-all soft-glass-panel text-stone-600 dark:text-stone-400 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {'\u2190'}
          </button>
          {getPageNumbers().map(function(p) {
            return (
              <button
                key={p}
                onClick={function() { goToPage(p); }}
                disabled={isAnimating}
                className={'min-w-[36px] px-2 py-2 rounded-xl text-sm font-medium transition-all ' +
                  (p === currentPage
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'soft-glass-panel text-stone-600 dark:text-stone-400 hover:text-amber-500')}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || isAnimating}
            className="px-3 py-2 rounded-xl text-sm font-medium transition-all soft-glass-panel text-stone-600 dark:text-stone-400 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {'\u2192'}
          </button>
        </div>
      )}
    </div>
  );
}
