'use client';
import React, { useState, useEffect, useRef } from 'react';

var COLORS = [
  { bg: '#f3e8ff', pin: '#c4b5fd' },
  { bg: '#fce7f3', pin: '#f9a8d4' },
  { bg: '#dbeafe', pin: '#93c5fd' },
  { bg: '#fef9c3', pin: '#fde047' },
  { bg: '#d1fae5', pin: '#6ee7b7' }
];

var DECORATIONS = ['⭐', '🌸', '☁️', '🌱', '❤️'];

export default function ChatterWall() {
  var _m = useState([]), messages = _m[0], setMessages = _m[1];
  var _a = useState(''), author = _a[0], setAuthor = _a[1];
  var _c = useState(''), content = _c[0], setContent = _c[1];
  var _s = useState(false), submitting = _s[0], setSubmitting = _s[1];
  var _t = useState(''), toast = _t[0], setToast = _t[1];
  var _col = useState(false), showPicker = _col[0], setShowPicker = _col[1];
  var _sel = useState(0), selectedColor = _sel[0], setSelectedColor = _sel[1];
  var _anon = useState(false), isAnonymous = _anon[0], setIsAnonymous = _anon[1];
  var wallRef = useRef(null);

  useEffect(function() { fetchMessages(); }, []);

  async function fetchMessages() {
    try {
      var res = await fetch('/api/chatter');
      var data = await res.json();
      var real = (data.messages || []).map(function(m) {
        return { id: m.id, author: m.author, content: m.content, color: m.color || 0, created_at: m.created_at, isReal: true };
      });
      setMessages(real);
    } catch (e) { setMessages([]); }
  }

  function showToast(msg) { setToast(msg); setTimeout(function() { setToast(''); }, 2500); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    if (content.length > 200) { showToast('字数超过200，请简短一些'); return; }
    setShowPicker(true);
  }

  async function confirmSubmit() {
    setShowPicker(false);
    setSubmitting(true);
    var name = isAnonymous ? '匿名' : (author.trim() || '匿名');
    var colorIdx = selectedColor;
    try {
      var res = await fetch('/api/chatter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author: name, content: content, color: colorIdx }) });
      var data = await res.json();
      if (data.id) {
        var newMsg = { id: data.id, author: name, content: content, color: colorIdx, created_at: new Date().toISOString(), isReal: true, isNew: true };
        setMessages(function(prev) { return [newMsg, ...prev]; });
        setAuthor(''); setContent(''); setSelectedColor(0); setIsAnonymous(false);
        showToast('便签已钉上！');
        setTimeout(function() { setMessages(function(prev) { return prev.map(function(m) { return m.id === newMsg.id ? { ...m, isNew: false } : m; }); }); }, 600);
      }
    } catch (e) { showToast('提交失败，请重试'); }
    setSubmitting(false);
  }

  function formatDate(d) {
    var date = new Date(d);
    var y = date.getFullYear(); var mo = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0'); var h = String(date.getHours()).padStart(2, '0');
    var mi = String(date.getMinutes()).padStart(2, '0');
    return { date: y + '.' + mo + '.' + day, time: h + ':' + mi };
  }

  function getColor(idx) { var i = typeof idx === 'number' ? idx : 0; return COLORS[i % COLORS.length] || COLORS[0]; }

  return (
    <div>
      <div className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-stone-200/50 dark:shadow-black/20 border border-white/50 dark:border-stone-700/30 mb-8">
        <div ref={wallRef} className="relative min-h-[400px] max-h-[500px] overflow-y-auto pt-4">
          <div className="flex flex-wrap justify-center gap-5 md:gap-6">
            {messages.map(function(m) {
              var noteColor = getColor(m.color != null ? m.color : 0);
              var idStr = m.id || '0';
              var hash = 0; for (var j = 0; j < idStr.length; j++) { hash = ((hash << 5) - hash) + idStr.charCodeAt(j); hash |= 0; } var rot = (Math.abs(hash) % 17) - 8;
              var fd = formatDate(m.created_at);
              var deco = DECORATIONS[(m.id || '').length % DECORATIONS.length];
              return React.createElement('div', {
                key: m.id,
                className: 'group relative p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default' + (m.isNew ? ' animate-bounce-in' : ''),
                style: { background: noteColor.bg, transform: 'rotate(' + rot + 'deg)', maxWidth: '260px', minWidth: '180px', minHeight: '140px' }
              },
                React.createElement('div', { className: 'absolute -top-1.5 left-1/2 -translate-x-1/2 z-10' },
                  React.createElement('div', { className: 'w-3 h-3 rounded-full shadow-sm', style: { background: noteColor.pin } }),
                  React.createElement('div', { className: 'w-0.5 h-1.5 mx-auto', style: { background: noteColor.pin } })
                ),
                React.createElement('p', { className: "text-base text-stone-700 leading-relaxed whitespace-pre-wrap mt-1", style: { fontFamily: "'Ma Shan Zheng', 'ZCOOL KuaiLe', cursive" } }, m.content),
                React.createElement('div', { className: 'mt-3 pt-2 border-t border-black/5' },
                  React.createElement('div', { className: 'flex items-center justify-between text-[10px] text-stone-400' },
                    React.createElement('span', null, '👤 ', m.author),
                    React.createElement('span', null, '📅 ', fd.date, ' 🕒 ', fd.time)
                  ),
                  React.createElement('div', { className: 'text-right text-xs mt-0.5 opacity-50' }, deco)
                )
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-stone-500"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            <span className="text-base font-bold text-stone-700">写一张便签</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-1/3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <input type="text" value={author} onChange={function(e) { setAuthor(e.target.value); }} placeholder="你的名字（可选）" className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/60 border border-stone-200 outline-none focus:border-purple-400 text-sm text-stone-700" />
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea value={content} onChange={function(e) { setContent(e.target.value); }} placeholder="写下你想说的话..." rows="3" className="w-full px-3 py-2.5 rounded-xl bg-white/60 border border-stone-200 outline-none focus:border-purple-400 text-sm text-stone-700 resize-none" />
            <span className="absolute right-3 bottom-2 text-xs text-stone-400">😊</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className={content.length > 200 ? 'text-xs text-red-400' : 'text-xs text-stone-400'}>{content.length}/200</span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-300 hidden sm:inline">留言提交后需审核，通过后显示</span>
            <button type="submit" className="px-5 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L15.09 8.26L24 9.27L17 15.14L18.18 24L12 19.77L5.82 24L7 15.14L0 9.27L8.91 8.26L12 0Z" transform="translate(0,1) scale(0.6)"/></svg>
              钉上便签
            </button>
          </div>
        </div>
      </form>

      {showPicker && React.createElement('div', { className: 'fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-sm', onClick: function() { setShowPicker(false); } },
        React.createElement('div', { className: 'bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4', onClick: function(e) { e.stopPropagation(); } },
          React.createElement('h3', { className: 'text-lg font-bold text-stone-700 mb-4' }, '选择便签颜色'),
          React.createElement('div', { className: 'flex gap-3 mb-4 justify-center' },
            COLORS.map(function(c, i) {
              return React.createElement('button', {
                key: i, type: 'button',
                onClick: function() { setSelectedColor(i); },
                className: 'w-10 h-10 rounded-full border-2 transition-all ' + (selectedColor === i ? 'border-stone-600 scale-110' : 'border-transparent hover:scale-105'),
                style: { background: c.bg }
              });
            })
          ),
          React.createElement('div', { className: 'flex items-center gap-2 mb-4 justify-center' },
            React.createElement('label', { className: 'flex items-center gap-2 text-sm text-stone-600 cursor-pointer' },
              React.createElement('input', { type: 'checkbox', checked: isAnonymous, onChange: function(e) { setIsAnonymous(e.target.checked); }, className: 'rounded' }),
              '匿名发布'
            )
          ),
          React.createElement('div', { className: 'flex gap-2' },
            React.createElement('button', { onClick: function() { setShowPicker(false); }, className: 'flex-1 py-2 rounded-xl border border-stone-200 text-sm text-stone-500 hover:bg-stone-50 transition-colors' }, '取消'),
            React.createElement('button', { onClick: confirmSubmit, disabled: submitting, className: 'flex-1 py-2 rounded-xl text-sm text-white font-medium transition-colors disabled:opacity-50', style: { background: COLORS[selectedColor].pin } },
              submitting ? '提交中...' : '确认钉上'
            )
          )
        )
      )}

      {toast && React.createElement('div', { className: 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-5 py-2.5 rounded-full bg-stone-800 text-white text-sm shadow-lg' }, toast)}
    </div>
  );
}