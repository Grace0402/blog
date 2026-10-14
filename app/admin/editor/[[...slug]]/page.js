'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

var HEADINGS = [
  { label: '正文', cmd: 'formatBlock', val: 'p', tip: '普通文字' },
  { label: 'H1', cmd: 'formatBlock', val: 'h1', tip: '一级标题' },
  { label: 'H2', cmd: 'formatBlock', val: 'h2', tip: '二级标题' },
  { label: 'H3', cmd: 'formatBlock', val: 'h3', tip: '三级标题' },
];

var INLINE = [
  { label: 'B', cmd: 'bold', tip: '粗体' },
  { label: 'I', cmd: 'italic', tip: '斜体' },
  { label: 'S', cmd: 'strikeThrough', tip: '删除线' },
  { label: '引用', cmd: 'formatBlock', val: 'blockquote', tip: '引用' },
  { label: '代码', cmd: 'formatBlock', val: 'pre', tip: '代码块' },
];

var BLOCKS = [
  { label: '无序列表', cmd: 'insertUnorderedList', tip: '项目符号' },
  { label: '有序列表', cmd: 'insertOrderedList', tip: '编号列表' },
];

export default function Editor() {
  var router = useRouter();
  var params = useParams();
  var slugParam = params && params.slug ? params.slug[0] : null;
  var isEdit = !!slugParam;

  var _ = useState(''), title = _[0], setTitle = _[1];
  var _2 = useState(''), htmlContent = _2[0], setHtmlContent = _2[1];
  var _3 = useState(''), postSlug = _3[0], setPostSlug = _3[1];
  var _4 = useState(''), description = _4[0], setDescription = _4[1];
  var _5 = useState(''), cover = _5[0], setCover = _5[1];
  var _6 = useState('draft'), status = _6[0], setStatus = _6[1];
  var _7 = useState(''), tagInput = _7[0], setTagInput = _7[1];
  var _8 = useState([]), tags = _8[0], setTags = _8[1];
  var _9 = useState(false), saving = _9[0], setSaving = _9[1];
  var _10 = useState(false), tableGridOpen = _10[0], setTableGridOpen = _10[1];
  var _11 = useState(0), tableHoverRow = _11[0], setTableHoverRow = _11[1];
  var _12 = useState(0), tableHoverCol = _12[0], setTableHoverCol = _12[1];

  var editorRef = useRef(null);
  var savedSelection = useRef(null);
  var fileInputRef = useRef(null);
  var isUpdatingRef = useRef(false);

  useEffect(function() {
    isMountedRef.current = true;
    return function() { isMountedRef.current = false; };
  }, []);
  var resizeState = useRef(null);
  var isMountedRef = useRef(true);

  useEffect(function() {
    if (!isEdit) return;
    fetchPost();
    async function fetchPost() {
      try {
        var r = await fetch('/api/posts/' + slugParam);
        var d = await r.json();
        if (d.post) {
          setTitle(d.post.title || '');
          setHtmlContent(d.post.content || '');
          setPostSlug(d.post.slug || '');
          setDescription(d.post.description || '');
          setCover(d.post.cover || '');
          setStatus(d.post.status || 'draft');
          if (d.post.tags) setTags(d.post.tags);
        }
      } catch(e) {}
    }
  }, [isEdit, slugParam]);

  useEffect(function() {
    if (!isUpdatingRef.current && editorRef.current && htmlContent !== null) {
      editorRef.current.innerHTML = htmlContent;
    }
    return function() {};
  }, [htmlContent]);

  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags(tags.concat([tagInput.trim()])); setTagInput(''); }
  }
  function removeTag(tag) { setTags(tags.filter(function(t) { return t !== tag; })); }

    function execCmd(cmd, val) {
    editorRef.current.focus();
    if (cmd === "insertUnorderedList" || cmd === "insertOrderedList") {
      var sel = window.getSelection();
      if (sel.rangeCount) {
        var node = sel.anchorNode;
        if (node && node.nodeType === 3) node = node.parentElement;
        var li = node;
        while (li && li.tagName !== "LI") li = li ? li.parentElement : null;
        if (li) {
          document.execCommand("indent", false, null);
          handleInput();
          return;
        }
      }
    }
    document.execCommand(cmd, false, val || null);
    handleInput();
  }

  function handleInput() {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      setHtmlContent(editorRef.current.innerHTML);
      setTimeout(function() { isUpdatingRef.current = false; }, 0);
    }
  }

  async function handlePaste(e) {
    var items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        await uploadToEditor(items[i].getAsFile());
        return;
      }
    }
  }

  function handleDrop(e) {
    var files = e.dataTransfer && e.dataTransfer.files;
    if (!files || files.length === 0) return;
    e.preventDefault();
    for (var i = 0; i < files.length; i++) {
      if (files[i].type.indexOf('image') !== -1) uploadToEditor(files[i]);
    }
  }

  function handleKeyDown(e) {
    // Tab in list items = indent/outdent
    if (e.key === 'Tab') {
      var sel = window.getSelection();
      if (!sel.rangeCount) return;
      var node = sel.anchorNode;
      var li = node && node.nodeType === 3 ? node.parentElement : node;
      while (li && li.tagName !== 'LI') li = li ? li.parentElement : null;
      if (li) {
        e.preventDefault();
        if (e.shiftKey) document.execCommand('outdent', false, null);
        else document.execCommand('indent', false, null);
        handleInput();
        return;
      }
      e.preventDefault();
      document.execCommand('insertText', false, '\u3000\u3000');
      return;
    }
    // Enter at end of <pre> exits code block
    if (e.key === 'Enter') {
      var sel2 = window.getSelection();
      if (!sel2.rangeCount) return;
      var node2 = sel2.anchorNode;
      var pre = node2 && node2.nodeType === 3 ? node2.parentElement : node2;
      while (pre && pre.tagName !== 'PRE') pre = pre ? pre.parentElement : null;
      if (pre) {
        var range = sel2.getRangeAt(0);
        var textLen = (pre.textContent || '').length;
        var isAtEnd = range.startOffset === textLen || (range.startContainer === pre && range.startOffset >= pre.childNodes.length);
        if (isAtEnd) {
          e.preventDefault();
          var p = document.createElement('p');
          p.innerHTML = '<br>';
          pre.parentNode.insertBefore(p, pre.nextSibling);
          var nr = document.createRange();
          nr.setStart(p, 0);
          nr.collapse(true);
          sel2.removeAllRanges();
          sel2.addRange(nr);
          p.focus();
        }
      }
    }
  }
  function handleMouseDown(e) {
    var editor = editorRef.current;
    if (!editor) return;
    // If clicking directly on the editor (not on child elements), place cursor at end
    if (e.target === editor) {
      e.preventDefault();
      var range = document.createRange();
      var sel = window.getSelection();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }


  async function uploadToEditor(file) {
    var fd = new FormData();
    fd.append('file', file);
    try {
      var r = await fetch('/api/upload', { method: 'POST', body: fd });
      var d = await r.json();
      if (d.url) { editorRef.current.focus(); document.execCommand('insertImage', false, d.url); handleInput(); }
    } catch(ex) {}
  }

  function insertLink() {
    var url = prompt('输入链接地址:');
    if (url) execCmd('createLink', url);
  }

  function insertImage() {
    var url = prompt('输入图片地址:');
    if (url) execCmd('insertImage', url);
  }

  async function handleImageUpload(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var fd = new FormData();
    fd.append('file', file);
    try {
      var r = await fetch('/api/upload', { method: 'POST', body: fd });
      var d = await r.json();
      if (d.url) setCover(d.url);
    } catch(ex) {}
  }

  async function savePost(asStatus) {
    if (!title.trim()) { alert('标题不能为空'); return; }
    setSaving(true);
    var slugVal = postSlug || title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u4e00-\u9fff-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!slugVal) slugVal = 'post-' + Date.now();
    var contentToSave = editorRef.current ? editorRef.current.innerHTML : htmlContent;
    var body = { title: title, content: contentToSave, description: description, cover: cover, status: asStatus, tags: tags };
    try {
      var url, method;
      if (isEdit) {
        url = '/api/posts/' + slugParam;
        method = 'PUT';
      } else {
        url = '/api/posts';
        method = 'POST';
        body.slug = slugVal;
      }
      var r = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      var d = await r.json();
      if (d.error) { alert(d.error); if (isMountedRef.current) setSaving(false); return; }
      router.push('/admin/dashboard');
    } catch(e) { alert('保存失败'); }
    setSaving(false);
  }

  function handleMouseDown(e) {
    if (e.target === editorRef.current) {
      var cr;
      if (document.caretRangeFromPoint) cr = document.caretRangeFromPoint(e.clientX, e.clientY);
      else if (document.caretPositionFromPoint) {
        var pos = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (pos) { cr = document.createRange(); cr.setStart(pos.offsetNode, pos.offset); cr.collapse(true); }
      }
      if (cr) setTimeout(function() { var s = window.getSelection(); s.removeAllRanges(); s.addRange(cr); }, 0);
      return;
    }
    if (e.target.tagName !== 'IMG') return;
    var img = e.target;
    var rect = img.getBoundingClientRect();
    var isNearEdge = (e.clientX > rect.right - 15 && e.clientY > rect.bottom - 15) || (e.clientX < rect.left + 15 && e.clientY < rect.top + 15) || (e.clientX < rect.left + 15 && e.clientY > rect.bottom - 15) || (e.clientX > rect.right - 15 && e.clientY < rect.top + 15);
    if (isNearEdge) {
      resizeState.current = { img: img, startX: e.clientX, startY: e.clientY, startW: img.offsetWidth, aspect: img.offsetWidth / img.offsetHeight };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  }

  function onMouseMove(e) {
    var s = resizeState.current;
    if (!s) return;
    var newW = Math.max(80, s.startW + (e.clientX - s.startX) * 2);
    s.img.style.width = newW + 'px';
    s.img.style.height = 'auto';
  }

  function onMouseUp() {
    resizeState.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    handleInput();
  }

  function insertTable(rows, cols) {
    setTableGridOpen(false);
    var table = '<table style=\"border-collapse:collapse;width:100%;margin:1em 0\"><tbody>';
    for (var r = 0; r < rows; r++) { table += '<tr>'; for (var c = 0; c < cols; c++) { table += '<td style=\"border:1px solid #d4d4d8;padding:8px 12px;min-width:60px\">&nbsp;</td>'; } table += '</tr>'; }
    table += '</tbody></table><p><br></p>';
    editorRef.current.focus();
    if (savedSelection.current && savedSelection.current.range) {
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(savedSelection.current.range); savedSelection.current = null;
    }
    document.execCommand('insertHTML', false, table);
    handleInput();
  }

  function addTableRow(e, table) {
    e.stopPropagation();
    var rows = table.querySelectorAll('tr');
    var newRow = document.createElement('tr');
    var cellCount = rows[0] ? rows[0].querySelectorAll('td,th').length : 1;
    for (var i = 0; i < cellCount; i++) { var td = document.createElement('td'); td.style.cssText = 'border:1px solid #d4d4d8;padding:8px 12px;min-width:60px'; td.innerHTML = '&nbsp;'; newRow.appendChild(td); }
    table.querySelector('tbody').appendChild(newRow);
    handleInput();
  }

  function addTableCol(e, table) {
    e.stopPropagation();
    table.querySelectorAll('tr').forEach(function(row) { var td = document.createElement('td'); td.style.cssText = 'border:1px solid #d4d4d8;padding:8px 12px;min-width:60px'; td.innerHTML = '&nbsp;'; row.appendChild(td); });
    handleInput();
  }

  useEffect(function() {
    if (!editorRef.current) return;
    function onClick(e) {
      var table = e.target.closest('table');
      document.querySelectorAll('.table-add-btn').forEach(function(b) { b.remove(); });
      if (!table) return;
      var rect = table.getBoundingClientRect();
      var editorRect = editorRef.current.getBoundingClientRect();
      var rowBtn = document.createElement('button');
      rowBtn.className = 'table-add-btn';
      rowBtn.innerHTML = '+';
      rowBtn.style.cssText = 'position:absolute;width:28px;height:28px;border-radius:50%;background:#f59e0b;color:#fff;border:none;cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;z-index:100;';
      rowBtn.style.left = (rect.left - editorRect.left + rect.width/2 - 14) + 'px';
      rowBtn.style.top = (rect.bottom - editorRect.top + 4) + 'px';
      rowBtn.onmousedown = function(ev) { ev.preventDefault(); addTableRow(ev, table); };
      editorRef.current.parentElement.appendChild(rowBtn);
      var colBtn = document.createElement('button');
      colBtn.className = 'table-add-btn';
      colBtn.innerHTML = '+';
      colBtn.style.cssText = 'position:absolute;width:28px;height:28px;border-radius:50%;background:#f59e0b;color:#fff;border:none;cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;z-index:100;';
      colBtn.style.left = (rect.right - editorRect.left + 4) + 'px';
      colBtn.style.top = (rect.top - editorRect.top + rect.height/2 - 14) + 'px';
      colBtn.onmousedown = function(ev) { ev.preventDefault(); addTableCol(ev, table); };
      editorRef.current.parentElement.appendChild(colBtn);
    }
    editorRef.current.addEventListener('click', onClick);
    return function() { if (editorRef.current) editorRef.current.removeEventListener('click', onClick); };
  }, []);

  var _t = isEdit ? '编辑文章' : '写新文章';

  return (<div className="max-w-4xl mx-auto px-4 py-8"><div className="flex items-center gap-3 mb-6 flex-wrap"><button onClick={function() { router.push('/admin/dashboard'); }} className="p-2 rounded-xl text-stone-500 hover:text-amber-500 hover:bg-stone-200/50 dark:hover:bg-stone-700/50 transition-colors" title="返回仪表盘"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></button><h1 className="text-2xl font-black text-stone-800 dark:text-stone-100">{_t}</h1></div><div className="soft-glass-panel p-5 space-y-3 mb-4"><div><input type="text" value={title} onChange={function(e) { setTitle(e.target.value); }} placeholder="给你的文章取个好标题吧~" className="w-full px-4 py-3 text-xl font-bold rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 placeholder-stone-300"/></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-xs font-medium text-stone-500 mb-1 block">封面图片</label><div className="flex gap-2"><input type="text" value={cover} onChange={function(e) { setCover(e.target.value); }} placeholder="URL 或上传" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm"/><label className="px-3 py-2 bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer hover:bg-indigo-600 shrink-0 flex items-center">上传<input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden"/></label></div>{cover && <img src={cover} alt="" className="mt-2 w-full h-24 object-cover rounded-xl"/>}</div><div><label className="text-xs font-medium text-stone-500 mb-1 block">简短描述</label><input type="text" value={description} onChange={function(e) { setDescription(e.target.value); }} placeholder="一句话介绍..." className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm"/></div><div><label className="text-xs font-medium text-stone-500 mb-1 block">标签</label><div className="flex gap-1 flex-wrap mb-1">{tags.map(function(t) { return <span key={t} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs flex items-center gap-1">{t}<button onClick={function() { removeTag(t); }} className="hover:text-red-500">&times;</button></span>; })}</div><div className="flex gap-1"><input type="text" value={tagInput} onChange={function(e) { setTagInput(e.target.value); }} onKeyDown={function(e) { if (e.key==='Enter') { e.preventDefault(); addTag(); } }} placeholder="输入标签后回车" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-xs"/><button onClick={addTag} className="px-3 py-2 bg-stone-200 dark:bg-stone-700 rounded-xl text-xs hover:bg-stone-300">+</button></div></div></div></div><div className="soft-glass-panel p-2 mb-3 flex flex-wrap gap-1 items-center sticky top-16 z-30">{HEADINGS.map(function(btn) { return <button key={btn.label} title={btn.tip} onClick={function() { execCmd(btn.cmd, btn.val); }} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/20 hover:text-amber-600 transition-colors">{btn.label}</button>; })}<div className="w-px h-5 bg-stone-300 dark:bg-stone-600 mx-1"/>{INLINE.map(function(btn) { return <button key={btn.label} title={btn.tip} onClick={function() { execCmd(btn.cmd, btn.val); }} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/20 hover:text-amber-600 transition-colors">{btn.label}</button>; })}<div className="w-px h-5 bg-stone-300 dark:bg-stone-600 mx-1"/>{BLOCKS.map(function(btn) { return <button key={btn.label} title={btn.tip} onClick={function() { execCmd(btn.cmd); }} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/20 hover:text-amber-600 transition-colors">{btn.label}</button>; })}<button onClick={insertLink} title="插入链接" className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/20 hover:text-amber-600 transition-colors">链接</button><button onClick={insertImage} title="插入图片" className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/20 hover:text-amber-600 transition-colors">图片</button><div className="w-px h-5 bg-stone-300 dark:bg-stone-600 mx-1"/><div style={{position:'relative'}}><button onClick={function() { savedSelection.current = { range: window.getSelection().getRangeAt(0).cloneRange() }; setTableGridOpen(!tableGridOpen); }} title="插入表格" className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/20 hover:text-amber-600 transition-colors">表格</button>{tableGridOpen && (<div className="absolute top-full left-0 mt-1 bg-white dark:bg-stone-800 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 p-3 z-50" onMouseLeave={function() { setTableHoverRow(0); setTableHoverCol(0); }}><div className="text-xs text-stone-400 mb-2">{tableHoverRow > 0 && tableHoverCol > 0 ? tableHoverRow + ' x ' + tableHoverCol : '选择表格大小'}</div><div onMouseLeave={function() { setTableGridOpen(false); }}>{Array.from({length:8}, function(_,r) { return <div key={r} style={{display:'flex'}}>{Array.from({length:8}, function(_,c) { var active = r < tableHoverRow && c < tableHoverCol; return <div key={c} onClick={function() { insertTable(r+1, c+1); }} onMouseEnter={function() { setTableHoverRow(r+1); setTableHoverCol(c+1); }} style={{ width:'22px', height:'22px', margin:'1px', border:'1px solid ' + (active ? '#f59e0b' : '#d4d4d8'), background: active ? 'rgba(245,158,11,0.2)' : 'transparent', cursor:'pointer', borderRadius:'3px' }}/>; })}</div>; })}</div></div>)}</div><div className="w-px h-5 bg-stone-300 dark:bg-stone-600 mx-1"/><button onClick={function() { document.execCommand("undo"); }} title="撤销 Ctrl+Z" className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/20 hover:text-amber-600 transition-colors">↩ 撤销</button><button onClick={function() { document.execCommand("redo"); }} title="重做 Ctrl+Y" className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/20 hover:text-amber-600 transition-colors">↪ 重做</button></div><div className="soft-glass-panel overflow-hidden mb-4"><div className="px-4 py-2 border-b border-white/10 text-xs text-stone-400 font-medium">编辑区 —— 你看到的就是发布后的样子</div><div ref={editorRef} contentEditable suppressContentEditableWarning onInput={handleInput} onMouseDown={handleMouseDown} onPaste={handlePaste} onDrop={handleDrop} onKeyDown={handleKeyDown} onDragOver={function(e) { e.preventDefault(); }} className="wysiwyg-editor px-6 py-5 outline-none text-stone-700 dark:text-stone-200 min-h-[500px] text-[1.05rem] leading-relaxed" style={{ fontFamily: "'Noto Serif SC', 'Source Han Serif SC', serif" }}/></div><div className="flex gap-3 items-center"><button onClick={function() { savePost('draft'); }} disabled={saving} className="px-5 py-2.5 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-medium hover:bg-stone-300 disabled:opacity-50 transition-colors">保存草稿</button><button onClick={function() { savePost('published'); }} disabled={saving} className="px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors shadow-lg shadow-amber-500/20">{saving ? '保存中...' : '发布文章'}</button><button onClick={function() { router.push('/admin/dashboard'); }} className="px-5 py-2.5 text-stone-500 rounded-xl text-sm hover:bg-stone-200/50 transition-colors">取消</button></div></div>);
}