'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function FriendsAdmin() {
  var _=useState([]), fs=_[0], sf=_[1];
  var _2=useState({name:'',url:'',avatar:'',description:''}), f=_2[0], sf2=_2[1];
  var _3=useState(true), ld=_3[0], sl=_3[1];
  var _4=useState(''), err=_4[0], serr=_4[1];
  var _5=useState(false), busy=_5[0], sbusy=_5[1];
  var _6=useState(''), ok=_6[0], sok=_6[1];
  useEffect(function(){load();},[]);
  async function load(){try{var r=await fetch('/api/friends');var d=await r.json();sf(d.friends||[]);}catch(e){}sl(false);}
  async function submit(e){e.preventDefault();
    if(!f.name.trim()||!f.url.trim()){serr('请填写网站名称和链接');return;}
    sbusy(true);serr('');sok('');
    try{
      var r=await fetch('/api/friends',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});
      if(!r.ok){var d=await r.json().catch(function(){return{error:'提交失败'}});serr(d.error||'提交失败 ('+r.status+')');return;}
      sf2({name:'',url:'',avatar:'',description:''});
      sok('友链添加成功！');
      load();
      setTimeout(function(){sok('');},3000);
    }catch(e){serr('网络错误: '+e.message);}
    finally{sbusy(false);}}
  async function del(id){if(!confirm('Delete?'))return;await fetch('/api/friends',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})});load();}
  async function uploadAvatar(e){var file=e.target.files[0];if(!file)return;var fd=new FormData();fd.append('file',file);var r=await fetch('/api/upload',{method:'POST',body:fd});var d=await r.json();if(d.url)sf2({...f,avatar:d.url});}

  return (<AdminLayout><div className="max-w-4xl mx-auto px-4 py-8"><h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-8">友链管理</h1>
    <form onSubmit={submit} className="soft-glass-panel p-6 mb-8 space-y-3">
      {err&&<div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{err}</div>}
      {ok&&<div className="text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">{ok}</div>}
      <div className="flex gap-3"><input type="text" value={f.name} onChange={function(e){sf2({...f,name:e.target.value})}} placeholder="网站名称" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" required />
      <input type="text" value={f.url} onChange={function(e){sf2({...f,url:e.target.value})}} placeholder="链接" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" required /></div>
      <div className="flex gap-3"><input type="text" value={f.avatar} onChange={function(e){sf2({...f,avatar:e.target.value})}} placeholder="头像URL" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
      <label className="px-3 py-2 bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer hover:bg-indigo-600">上传头像<input type="file" accept="image/*" onChange={uploadAvatar} className="hidden"/></label></div>
      <input type="text" value={f.description} onChange={function(e){sf2({...f,description:e.target.value})}} placeholder="描述" className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
      <button type="submit" disabled={busy} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-50">{busy?'提交中...':'添加友链'}</button>
    </form>
    <div className="space-y-2">{fs.map(function(fr){return <div key={fr.id} className="soft-glass-panel p-3 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold shrink-0">{fr.avatar?<img src={fr.avatar} alt="" className="w-full h-full rounded-full object-cover"/>:fr.name.charAt(0)}</div><div className="flex-1"><div className="font-bold text-sm">{fr.name}</div><div className="text-xs text-stone-500 truncate">{fr.url}</div></div><button onClick={function(){del(fr.id)}} className="text-red-500 text-xs">删除</button></div>})}</div>
  </div></AdminLayout>);
}
