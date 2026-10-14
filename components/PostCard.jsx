'use client';
import Link from 'next/link';

export default function PostCard({ post, index }) {
    var isLeft = index % 2 === 0;

  return (
    <Link href={'/posts/' + post.slug} className="block group">
      <div className={'soft-glass-panel p-6 transition-all duration-300 group-hover:scale-[1.01] ' + (isLeft ? 'group-hover:shadow-[0_26px_80px_rgba(126,91,64,0.18)]' : '')}>
        <div className={'flex gap-6 items-center ' + (isLeft ? '' : 'flex-row-reverse')}>
          {post.cover && (
            <div className="shrink-0 w-40 h-28 rounded-2xl overflow-hidden">
              <img src={post.cover} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-stone-800 dark:text-stone-100 group-hover:text-amber-500 transition-colors line-clamp-2">{post.title}</h2>
            {post.description && (
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">{post.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="text-xs text-stone-400">{post.formattedDate || post.created_at}</span>
              {post.tags && post.tags.map(function(tag) {
                return <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">{tag}</span>;
              })}
              <span className="text-xs text-stone-400">{post.view_count || 0} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
