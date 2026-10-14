'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function MusicAdmin() {
  var _=useState([]), ts=_[0], st=_[1];
  var _2=useState({title:'',artist:'',file_path:'',lyrics:'',playlist:'default',cover:''}), f=_2[0], sf=_2[1];
  var _3=useState(true), ld=_3[0], sl=_3[1];
  var _4=useState(false), up=_4[0], su=_4[1];
  var _5=useState(''), err=_5[0], serr=_5[1];
  var _6=useState(false), busy=_6[0], sbusy=_6[1];
  var _7=useState(''), ok=_7[0], sok=_7[1];
  useEffect(function(){load();},[]);
  async function load(){try{var r=await fetch('/api/music');var d=await r.json();st(d.tracks||[]);}catch(e){}sl(false);}
  async function uploadFile(e){var file=e.target.files[0];if(!file)return;su(true);var fd=new FormData();fd.append('file',file);var r=await fetch('/api/upload',{method:'POST',body:fd});var d=await r.json();if(d.url)sf({...f,file_path:d.url});su(false);}
  async function uploadCover(e){var file=e.target.files[0];if(!file)return;var fd=new FormData();fd.append('file',file);var r=await fetch('/api/upload',{method:'POST',body:fd});var d=await r.json();if(d.url)sf({...f,cover:d.url});}
  async function submit(e){e.preventDefault();
    if(!f.title.trim()||!f.file_path.trim()){serr('请填写歌曲名和文件路径');return;}
    sbusy(true);serr('');sok('');
    try{
      var r=await fetch('/api/music',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});
      if(!r.ok){var d=await r.json().catch(function(){return{error:'提交失败'}});serr(d.error||'提交失败 ('+r.status+')');return;}
      sf({title:'',artist:'',file_path:'',lyrics:'',playlist:'default',cover:''});
      sok('歌曲添加成功！');
      load();
      setTimeout(function(){sok('');},3000);
    }catch(e){serr('网络错误: '+e.message);}
    finally{sbusy(false);}}
  async function del(id){if(!confirm('Delete?'))return;await fetch('/api/music',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})});load();}

  return (<AdminLayout><div className="max-w-4xl mx-auto px-4 py-8"><h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-8">音乐管理</h1>
    <form onSubmit={submit} className="soft-glass-panel p-6 mb-8 space-y-3">
      {err&&<div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{err}</div>}
      {ok&&<div className="text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">{ok}</div>}
      <div className="flex gap-3"><input type="text" value={f.title} onChange={function(e){sf({...f,title:e.target.value})}} placeholder="歌曲名" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" required />
      <input type="text" value={f.artist} onChange={function(e){sf({...f,artist:e.target.value})}} placeholder="歌手" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" /></div>
      <div className="flex gap-3"><input type="text" value={f.playlist} onChange={function(e){sf({...f,playlist:e.target.value})}} placeholder="歌单名" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
      <label className="px-3 py-2 bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer hover:bg-indigo-600">封面<input type="file" accept="image/*" onChange={uploadCover} className="hidden"/></label></div>
      <div className="flex gap-3 items-center"><input type="text" value={f.file_path} onChange={function(e){sf({...f,file_path:e.target.value})}} placeholder="文件路径 /uploads/xxx.mp3" className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" required />
      <label className={'px-3 py-2 rounded-xl text-xs font-medium cursor-pointer '+(up?'bg-stone-300 text-stone-500':'bg-indigo-500 text-white hover:bg-indigo-600')}>{up?'Uploading...':'上传音频'}<input type="file" accept="audio/*" onChange={uploadFile} className="hidden" disabled={up}/></label></div>
      <textarea value={f.lyrics} onChange={function(e){sf({...f,lyrics:e.target.value})}} placeholder="歌词" rows="4" className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm font-mono resize-y" />
      <button type="submit" disabled={busy} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-50">{busy?'提交中...':'添加歌曲'}</button>
    </form>
    <div className="space-y-2">{ts.map(function(t){return <div key={t.id} className="soft-glass-panel p-3 flex items-center gap-3">{t.cover&&<img src={t.cover} alt="" className="w-10 h-10 rounded object-cover shrink-0"/>}<div className="flex-1"><div className="font-bold text-sm">{t.title}</div><div className="text-xs text-stone-500">{t.artist} - {t.playlist||'default'}</div></div>{t.file_path&&<audio src={t.file_path} controls className="h-8 w-32"/>}<button onClick={function(){del(t.id)}} className="text-red-500 text-xs">删除</button></div>})}</div>
  </div></AdminLayout>);
}
