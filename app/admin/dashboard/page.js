'use client';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';


function WritingHeatmap(_ref) {
  var posts = _ref.posts;
  var dateMap = {};
  posts.forEach(function(p) {
    var raw = p.created_at || '';
    var d = raw ? raw.split('T')[0] : '';
    // created_at is UTC ISO, convert to local date
    if (d) {
      var dt = new Date(raw);
      if (!isNaN(dt.getTime())) {
        d = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
      }
    }
    if (d) dateMap[d] = (dateMap[d] || 0) + 1;
  });

  function toLocalDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  var today = new Date();
  today.setHours(0,0,0,0);
  var todayStr = toLocalDate(today);

  // Start date: 52 weeks ago, aligned to Sunday
  var startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() - 1);
  }

  // Build weeks array
  var weeks = [];
  var week = [];
  var monthLabels = [];
  var current = new Date(startDate);
  var lastMonth = -1;

  for (var i = 0; i < 371; i++) {
    var ds = toLocalDate(current);
    var month = current.getMonth();
    var dow = current.getDay();

    if (dow === 0 && i > 0) {
      weeks.push(week);
      week = [];
    }

    var isFuture = ds > todayStr;
    week.push({
      date: ds,
      count: isFuture ? 0 : (dateMap[ds] || 0),
      month: month,
      future: isFuture
    });

    if (month !== lastMonth) {
      monthLabels.push({ weekIndex: weeks.length, label: (month + 1) + '月' });
      lastMonth = month;
    }

    current.setDate(current.getDate() + 1);
  }
  if (week.length > 0) weeks.push(week);

  function getColor(count) {
    if (count === 0) return 'bg-stone-100 dark:bg-stone-800';
    if (count === 1) return 'bg-green-300 dark:bg-green-800';
    if (count === 2) return 'bg-green-500 dark:bg-green-600';
    return 'bg-green-700 dark:bg-green-400';
  }

  var cellSize = 13;
  var cellGap = 3;

  return React.createElement('div', { className: 'w-full overflow-x-auto pb-2' },
    React.createElement('div', { style: { display: 'flex', minWidth: '720px' } },
      // Weekday labels
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: cellGap + 'px', marginRight: '6px', paddingTop: '18px' } },
        ['一', '', '三', '', '五', '', ''].map(function(l, i) {
          return React.createElement('div', {
            key: i,
            style: { height: cellSize + 'px', lineHeight: cellSize + 'px', fontSize: '10px', color: '#a8a29e', textAlign: 'right', width: '22px' }
          }, l);
        })
      ),
      // Grid area
      React.createElement('div', null,
        // Month labels
        React.createElement('div', { style: { display: 'flex', height: '16px', marginBottom: '3px', position: 'relative' } },
          monthLabels.map(function(ml, i) {
            var leftPx = ml.weekIndex * (cellSize + cellGap);
            return React.createElement('div', {
              key: i,
              style: { position: 'absolute', left: leftPx + 'px', fontSize: '10px', color: '#a8a29e' }
            }, ml.label);
          })
        ),
        // Weeks
        React.createElement('div', { style: { display: 'flex', gap: cellGap + 'px' } },
          weeks.map(function(w, wi) {
            return React.createElement('div', { key: wi, style: { display: 'flex', flexDirection: 'column', gap: cellGap + 'px' } },
              w.map(function(d, di) {
                return React.createElement('div', {
                  key: di,
                  style: {
                    width: cellSize + 'px',
                    height: cellSize + 'px',
                    borderRadius: '2px',
                    backgroundColor: d.future ? 'transparent' : null
                  },
                  className: d.future ? '' : getColor(d.count),
                  title: d.future ? '' : (d.date + ': ' + d.count + ' 篇')
                });
              })
            );
          })
        ),
        // Legend
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px' } },
          React.createElement('span', { style: { fontSize: '10px', color: '#a8a29e', marginRight: '2px' } }, '少'),
          ['bg-stone-100 dark:bg-stone-800', 'bg-green-300 dark:bg-green-800', 'bg-green-500 dark:bg-green-600', 'bg-green-700 dark:bg-green-400'].map(function(cls, i) {
            return React.createElement('div', { key: i, className: cls, style: { width: cellSize + 'px', height: cellSize + 'px', borderRadius: '2px' } });
          }),
          React.createElement('span', { style: { fontSize: '10px', color: '#a8a29e', marginLeft: '2px' } }, '多')
        )
      )
    )
  );
}

export default function Dashboard() {
  var router = useRouter();
  var _ = useState([]), posts = _[0], setPosts = _[1];
  var _2 = useState(true), loading = _2[0], setLoading = _2[1];
  var _3 = useState({ postCount: 0, tagCount: 0, commentCount: 0, daysRunning: 0 }), stats = _3[0], setStats = _3[1];
  var _4 = useState(false), exporting = _4[0], setExporting = _4[1];
  var _5 = useState(false), showImport = _5[0], setShowImport = _5[1];
  var _6 = useState(false), importing = _6[0], setImporting = _6[1];
  var _7 = useState(''), importMsg = _7[0], setImportMsg = _7[1];
  var _8 = useState(true), importPublish = _8[0], setImportPublish = _8[1];
  var fileRef = useRef(null);
  var _9 = useState(false), selectMode = _9[0], setSelectMode = _9[1];
  var _10 = useState({}), selected = _10[0], setSelected = _10[1];

  useEffect(function() {
    if (!localStorage.getItem('admin-token')) { router.push('/admin/login'); return; }
    fetchPosts(); fetchStats();
  }, []);

  async function fetchPosts() {
    try { var r = await fetch('/api/posts?limit=999&all=1'); var d = await r.json(); setPosts(d.posts || []); } catch(e) {}
    setLoading(false);
  }
  async function fetchStats() {
    try { var r = await fetch('/api/site-stats'); var d = await r.json(); setStats(d); } catch(e) {}
  }
  async function deletePost(id) {
    if (!confirm('确定删除？')) return;
    try { await fetch('/api/posts/' + id, { method: 'DELETE' }); setPosts(posts.filter(function(p) { return p.id !== id; })); } catch(e) {}
  }
  function exportPost(id) { window.open('/api/export?id=' + id, '_blank'); }

  function enterSelectMode() { setSelectMode(true); setSelected({}); }
  function cancelSelect() { setSelectMode(false); setSelected({}); setExporting(false); }
  function toggleSelect(id) { setSelected(function(prev) { var next = Object.assign({}, prev); if (next[id]) { delete next[id]; } else { next[id] = true; } return next; }); }
  function selectAll() { var all = {}; posts.forEach(function(p) { all[p.id] = true; }); setSelected(all); }
  function clearSelect() { setSelected({}); }
  function exportSelected() { var ids = Object.keys(selected); if (ids.length === 0) { alert('请先选择文章'); return; } setExporting(true); ids.forEach(function(id, i) { setTimeout(function() { window.open('/api/export?id=' + id, '_blank'); }, i * 500); }); setTimeout(function() { setExporting(false); }, ids.length * 500 + 500); }

  async function handleImport(e) {
    var file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.md')) { setImportMsg('只支持 .md 文件'); return; }
    setImporting(true); setImportMsg('');
    var fd = new FormData();
    fd.append('file', file);
    if (importPublish) fd.append('publish', '1');
    try {
      var r = await fetch('/api/import', { method: 'POST', body: fd });
      var d = await r.json();
      if (d.id) { setImportMsg('导入成功: ' + d.title); fetchPosts(); fetchStats(); }
      else { setImportMsg('导入失败: ' + (d.error || '未知错误')); }
    } catch(ex) { setImportMsg('网络错误'); }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  var colorMap = { amber: 'text-amber-500', indigo: 'text-indigo-500', green: 'text-green-500', pink: 'text-pink-500' };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
          <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100">仪表盘</h1>
          <div className="flex gap-2">
            <button onClick={function() { setShowImport(!showImport); }} className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">导入文章</button>
            {selectMode ? React.createElement(React.Fragment, null,
              React.createElement('button', { onClick: exportSelected, disabled: exporting || Object.keys(selected).length === 0, className: 'px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors' }, exporting ? '导出中...' : ('导出选中 (' + Object.keys(selected).length + ')')),
              React.createElement('button', { onClick: cancelSelect, className: 'px-4 py-2 bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-medium hover:bg-stone-400 ml-2 transition-colors' }, '取消')
            ) : React.createElement('button', { onClick: enterSelectMode, className: 'px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors' }, '批量导出')}
            <Link href="/admin/editor" className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors">新建文章</Link>
          </div>
        </div>

        {showImport && (
          <div className="soft-glass-panel p-6 mb-8">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4">导入 Markdown 文章</h3>
            <p className="text-xs text-stone-500 mb-4">支持导入 .md 文件，自动解析标题、标签和正文。也支持导入从 CSDN / 其他博客导出的 Markdown 文件。</p>
            <div className="flex items-center gap-3 flex-wrap">
              <label className={'px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ' + (importing ? 'bg-stone-300 text-stone-500' : 'bg-green-500 text-white hover:bg-green-600')}>
                {importing ? '导入中...' : '选择 .md 文件'}
                <input type="file" accept=".md,.markdown,text/markdown" onChange={handleImport} ref={fileRef} className="hidden" disabled={importing} />
              </label>
              <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                <input type="checkbox" checked={importPublish} onChange={function(e) { setImportPublish(e.target.checked); }} /> 导入后直接发布
              </label>
            </div>
            {importMsg && (
              <div className={'mt-3 text-sm px-3 py-2 rounded-xl ' + (importMsg.indexOf('成功') !== -1 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500')}>
                {importMsg}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            ['文章', stats.postCount, 'amber'],
            ['标签', stats.tagCount, 'indigo'],
            ['评论', stats.commentCount, 'green'],
            ['运行天数', stats.daysRunning, 'pink']
          ].map(function(s) {
            return (
              <div key={s[0]} className="soft-glass-panel p-4 text-center">
                <div className={'text-2xl font-black ' + (colorMap[s[2]] || 'text-amber-500')}>{s[1]}</div>
                <div className="text-xs text-stone-400 mt-1">{s[0]}</div>
              </div>
            );
          })}
        </div>

        <div className="soft-glass-panel p-6 mb-8">
          <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4">{'写作日历'}</h3>
          {posts.length > 0 ? React.createElement(WritingHeatmap, { posts: posts }) : (
            <div className="text-center py-8 text-stone-400">{'暂无写作记录'}</div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-stone-400">加载中...</div>
        ) : (
          <div className="soft-glass-panel overflow-hidden">
            {posts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">&#x1F4DD;</div>
                <p className="text-stone-400 mb-4">还没有文章，创建你的第一篇吧！</p>
                <Link href="/admin/editor" className="inline-block px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors">新建文章</Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10 text-stone-500">{selectMode && React.createElement('th', { className: 'px-4 py-3', style: { width: '40px' } }, React.createElement('span', { onClick: function() { Object.keys(selected).length === posts.length ? clearSelect() : selectAll(); }, className: 'cursor-pointer text-xs text-amber-500 hover:underline' }, Object.keys(selected).length === posts.length && posts.length > 0 ? '取消全选' : '全选'))}<th className="px-4 py-3 text-left font-medium">标题</th><th className="px-4 py-3 text-left font-medium hidden md:table-cell">状态</th><th className="px-4 py-3 text-left font-medium hidden md:table-cell">日期</th><th className="px-4 py-3 text-right font-medium">操作</th></tr></thead>
                <tbody>{posts.map(function(p) {
                  return (<tr key={p.id} className="border-b border-white/5 hover:bg-white/10 transition-colors">{selectMode && React.createElement('td', { className: 'px-4 py-3' }, React.createElement('input', { type: 'checkbox', checked: !!selected[p.id], onChange: function() { toggleSelect(p.id); }, className: 'w-4 h-4 accent-amber-500' }))}<td className="px-4 py-3 text-stone-800 dark:text-stone-200">{p.title}</td><td className="px-4 py-3 hidden md:table-cell"><span className={'px-2 py-0.5 rounded-full text-xs ' + (p.status==='published'?'bg-green-500/10 text-green-600':'bg-yellow-500/10 text-yellow-600')}>{p.status==='published'?'已发布':'草稿'}</span></td><td className="px-4 py-3 text-stone-400 hidden md:table-cell">{p.formattedDate||(p.created_at?p.created_at.split('T')[0]:'')}</td><td className="px-4 py-3 text-right space-x-2 whitespace-nowrap"><Link href={'/admin/editor/'+p.id} className="text-amber-500 hover:text-amber-600 text-xs">编辑</Link><button onClick={function(){exportPost(p.id)}} className="text-indigo-500 hover:text-indigo-600 text-xs">导出</button><button onClick={function(){deletePost(p.id)}} className="text-red-500 hover:text-red-600 text-xs">删除</button></td></tr>);
                })}</tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
