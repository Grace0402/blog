'use client';
import { useState } from 'react';


export default function CommentSection(_ref) {
  var postId = _ref.postId, initialComments = _ref.initialComments;
  
  var _useState = useState(initialComments), comments = _useState[0], setComments = _useState[1];
  var _useState2 = useState(''), author = _useState2[0], setAuthor = _useState2[1];
  var _useState3 = useState(''), email = _useState3[0], setEmail = _useState3[1];
  var _useState4 = useState(''), content = _useState4[0], setContent = _useState4[1];
  var _useState5 = useState(false), submitting = _useState5[0], setSubmitting = _useState5[1];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      var res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: postId, author: author, email: email, content: content }) });
      var data = await res.json();
      if (data.id) { setComments([{ id: data.id, author: author, content: content, created_at: new Date().toISOString() }, ...comments]); setAuthor(''); setEmail(''); setContent(''); }
    } catch (e) {}
    setSubmitting(false);
  }

  return (
    <div className="soft-glass-panel p-6">
      <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">评论 ({comments.length})</h3>
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="flex gap-3">
          <input type="text" value={author} onChange={function(e) { setAuthor(e.target.value); }} placeholder="昵称" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" required />
          <input type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="邮箱" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
        </div>
        <textarea value={content} onChange={function(e) { setContent(e.target.value); }} placeholder="写下你的评论..." rows="3" className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm resize-none" required />
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">
          {submitting ? '提交中...' : '提交评论'}
        </button>
      </form>
      <div className="space-y-4">
        {comments.map(function(c) {
          return (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-xs font-bold shrink-0">{c.author.charAt(0).toUpperCase()}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="text-sm font-bold text-stone-700 dark:text-stone-200">{c.author}</span><span className="text-xs text-stone-400">{c.created_at ? c.created_at.split('T')[0] : ''}</span></div>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">{c.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
