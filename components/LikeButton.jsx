'use client';
import { useState } from 'react';


export default function LikeButton(_ref) {
  var postId = _ref.postId, initialLikes = _ref.initialLikes;
  
  var _useState = useState(initialLikes), likes = _useState[0], setLikes = _useState[1];
  var _useState2 = useState(false), liked = _useState2[0], setLiked = _useState2[1];

  async function handleLike() {
    try {
      var res = await fetch('/api/comments/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: postId }) });
      var data = await res.json();
      setLiked(data.liked); setLikes(data.likes);
    } catch (e) {}
  }

  return (
    <div className="text-center mb-8">
      <button onClick={handleLike} className={'inline-flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ' + (liked ? 'bg-amber-500 text-white' : 'soft-glass-panel text-stone-500 hover:text-amber-500 hover:scale-105')}>
        <svg width="20" height="20" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        {likes} {liked ? '已赞' : '点赞'}
      </button>
    </div>
  );
}
