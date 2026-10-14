'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/AdminLayout';

export default function AboutAdmin() {
  var router = useRouter();
  var _ = useState({ avatar: '', name: 'MirrorMoon', bio: 'Where Words Embrace the Way', github: '', email: '', wechat: '', qq: '', intro: '', hero_bg: '' }), f = _[0], sf = _[1];
  var _2 = useState(false), loading = _2[0], setLoading = _2[1];
  var _3 = useState(false), saving = _3[0], setSaving = _3[1];
  var _4 = useState(''), msg = _4[0], setMsg = _4[1];

  useEffect(function() {
    if (!localStorage.getItem('admin-token')) { router.push('/admin/login'); return; }
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      var r = await fetch('/api/site-settings');
      var d = await r.json();
      if (d.settings && d.settings.id) {
        sf({
          avatar: d.settings.avatar || '',
          name: d.settings.name || 'MirrorMoon',
          bio: d.settings.bio || 'Where Words Embrace the Way',
          github: d.settings.github || '',
          email: d.settings.email || '',
          wechat: d.settings.wechat || '',
          qq: d.settings.qq || '',
          intro: d.settings.intro || '',
          hero_bg: d.settings.hero_bg || ''
        });
      }
    } catch (e) {}
    setLoading(false);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      var r = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f)
      });
      var d = await r.json();
      if (d.success) {
        setMsg('保存成功！前台已同步更新');
        setTimeout(function() { setMsg(''); }, 3000);
      } else {
        setMsg('保存失败: ' + (d.error || ''));
      }
    } catch (ex) {
      setMsg('网络错误，请重试');
    }
    setSaving(false);
  }

  async function uploadAvatar(e) {
    var file = e.target.files[0];
    if (!file) return;
    var fd = new FormData();
    fd.append('file', file);
    try {
      var r = await fetch('/api/upload', { method: 'POST', body: fd });
      var d = await r.json();
      if (d.url) sf({ ...f, avatar: d.url });
    } catch (ex) { alert('上传失败'); }
  }

  async function uploadHeroBg(e) {
    var file = e.target.files[0];
    if (!file) return;
    var fd = new FormData();
    fd.append('file', file);
    try {
      var r = await fetch('/api/upload', { method: 'POST', body: fd });
      var d = await r.json();
      if (d.url) sf({ ...f, hero_bg: d.url });
    } catch (ex) { alert('上传失败'); }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-2">关于页编辑</h1>
        <p className="text-sm text-stone-500 mb-8">修改头像、昵称、社交链接、背景图和个人介绍。保存后前台立即生效。</p>

        {msg && (
          <div className={'mb-4 px-4 py-3 rounded-xl text-sm ' + (msg.indexOf('成功') !== -1 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500')}>
            {msg}
          </div>
        )}

        {loading ? (
          <div className="soft-glass-panel p-12 text-center text-stone-400">加载中...</div>
        ) : (
          <form onSubmit={save} className="soft-glass-panel p-6 space-y-5">
            <div className="flex gap-4 items-start">
              {f.avatar && <img src={f.avatar} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-amber-500/30" />}
              <div className="flex-1">
                <label className="text-xs font-medium text-stone-500 mb-1 block">头像</label>
                <input type="text" value={f.avatar} onChange={function(e) { sf({ ...f, avatar: e.target.value }); }}
                  placeholder="头像图片 URL"
                  className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
                <label className="inline-block mt-2 px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-indigo-600 transition-colors">
                  上传头像
                  <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 mb-1 block">首页背景图</label>
              <div className="flex gap-2">
                <input type="text" value={f.hero_bg} onChange={function(e) { sf({ ...f, hero_bg: e.target.value }); }}
                  placeholder="背景图片 URL（留空使用默认渐变）"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
                <label className="px-3 py-2 bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer hover:bg-indigo-600 shrink-0 flex items-center">
                  上传
                  <input type="file" accept="image/*" onChange={uploadHeroBg} className="hidden" />
                </label>
              </div>
              {f.hero_bg && <img src={f.hero_bg} alt="" className="mt-2 w-full h-24 object-cover rounded-xl" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">昵称</label>
                <input type="text" value={f.name} onChange={function(e) { sf({ ...f, name: e.target.value }); }}
                  className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">签名</label>
                <input type="text" value={f.bio} onChange={function(e) { sf({ ...f, bio: e.target.value }); }}
                  className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">GitHub</label>
                <input type="text" value={f.github} onChange={function(e) { sf({ ...f, github: e.target.value }); }}
                  placeholder="https://github.com/你的用户名"
                  className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">邮箱</label>
                <input type="text" value={f.email} onChange={function(e) { sf({ ...f, email: e.target.value }); }}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">微信</label>
                <input type="text" value={f.wechat} onChange={function(e) { sf({ ...f, wechat: e.target.value }); }}
                  placeholder="你的微信号"
                  className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">QQ</label>
                <input type="text" value={f.qq} onChange={function(e) { sf({ ...f, qq: e.target.value }); }}
                  placeholder="你的QQ号码"
                  className="w-full px-3 py-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500 mb-1 block">个人介绍（支持 Markdown）</label>
              <textarea value={f.intro} onChange={function(e) { sf({ ...f, intro: e.target.value }); }}
                placeholder="写一段自我介绍..."
                rows="10"
                className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm resize-y font-sans leading-relaxed" />
            </div>

            <button type="submit" disabled={saving}
              className={'px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ' + (saving ? 'bg-stone-400 text-white' : 'bg-amber-500 text-white hover:bg-amber-600')}>
              {saving ? '保存中...' : '保存设置'}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
