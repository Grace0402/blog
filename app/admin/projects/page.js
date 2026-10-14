'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function ProjectsAdmin() {
  var _=useState([]), ps=_[0], sp=_[1];
  var _2=useState({name:'',desc:'',url:'',github:'',tags:'',image:''}), f=_2[0], sf=_2[1];
  var _3=useState(true), ld=_3[0], sl=_3[1];
  var _4=useState(''), err=_4[0], serr=_4[1];
  var _5=useState(false), busy=_5[0], sbusy=_5[1];
  var _6=useState(''), ok=_6[0], sok=_6[1];
  var _7=useState(null), editId=_7[0], setEditId=_7[1];
  useEffect(function(){load();},[]);
  async function load(){try{var r=await fetch('/api/projects');var d=await r.json();sp(d.projects||[]);}catch(e){}sl(false);}
  async function submit(e){e.preventDefault();
    if(!f.name.trim()){serr('请填写项目名称');return;}
    sbusy(true);serr('');sok('');
    try{
      var isEdit = !!editId;
      var method = isEdit ? 'PUT' : 'POST';
      var body = {name:f.name,description:f.desc,url:f.url,github:f.github,tags:f.tags.split(',').map(function(t){return t.trim()}).filter(Boolean),image:f.image};
      if(isEdit) body.id = editId;
      var r=await fetch('/api/projects',{method:method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      if(!r.ok){var d=await r.json().catch(function(){return{error:'提交失败'}});serr(d.error||'提交失败 ('+r.status+')');return;}
      sf({name:'',desc:'',url:'',github:'',tags:'',image:''});
      setEditId(null);
      sok(isEdit ? '项目更新成功！' : '项目添加成功！');
      load();
      setTimeout(function(){sok('');},3000);
    }catch(e){serr('网络错误: '+e.message);}
    finally{sbusy(false);}}
  async function del(id){if(!confirm('Delete?'))return;await fetch('/api/projects',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})});load();}
  function startEdit(p){
    sf({name:p.name||'',desc:p.description||'',url:p.url||'',github:p.github||'',tags:(typeof p.tags==='string'?p.tags:(p.tags||[]).join(','))||'',image:p.image||''});
    setEditId(p.id);
  }
  function cancelEdit(){
    sf({name:'',desc:'',url:'',github:'',tags:'',image:''});
    setEditId(null);
    serr('');
    sok('');
  }

  return (<AdminLayout><div className="max-w-4xl mx-auto px-4 py-8"><h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-8">项目管理</h1>
    <form onSubmit={submit} className="soft-glass-panel p-6 mb-8 space-y-3">
      {editId&&<div className="text-amber-600 text-sm bg-amber-50 dark:bg-amber-900/20 p-2 rounded-xl">正在编辑项目</div>}
      {err&&<div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{err}</div>}
      {ok&&<div className="text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">{ok}</div>}
      <div className="flex gap-3"><input type="text" value={f.name} onChange={function(e){sf({...f,name:e.target.value})}} placeholder="项目名称" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" required />
      <input type="text" value={f.url} onChange={function(e){sf({...f,url:e.target.value})}} placeholder="链接" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" /></div>
      <div className="flex gap-3"><input type="text" value={f.github} onChange={function(e){sf({...f,github:e.target.value})}} placeholder="GitHub" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
      <input type="text" value={f.image} onChange={function(e){sf({...f,image:e.target.value})}} placeholder="截图URL" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" /></div>
      <input type="text" value={f.desc} onChange={function(e){sf({...f,desc:e.target.value})}} placeholder="描述" className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
      <input type="text" value={f.tags} onChange={function(e){sf({...f,tags:e.target.value})}} placeholder="标签（逗号分隔）" className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-50">{busy?'提交中...':(editId?'更新项目':'添加项目')}</button>
        {editId&&<button type="button" onClick={cancelEdit} className="px-4 py-2 bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-medium hover:bg-stone-400">取消</button>}
      </div>
    </form>
    {ld?<div className="text-center py-8 text-stone-400">加载中...</div>:<div className="space-y-2">{ps.map(function(p){return <div key={p.id} className="soft-glass-panel p-3 flex items-center gap-3">{p.image&&<img src={p.image} alt="" className="w-12 h-10 rounded object-cover shrink-0"/>}<div className="flex-1"><div className="font-bold text-sm">{p.name}</div><div className="text-xs text-stone-500 truncate">{p.description}</div></div><button onClick={function(){startEdit(p)}} className="text-amber-500 text-xs mr-2 hover:underline">编辑</button><button onClick={function(){del(p.id)}} className="text-red-500 text-xs">删除</button></div>})}{ps.length===0&&<div className="text-center py-8 text-stone-400">暂无项目</div>}</div>}
  </div></AdminLayout>);
}
