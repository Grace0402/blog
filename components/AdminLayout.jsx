'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

var items = [
  { h: '/admin/dashboard', l: '仪表盘', i: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { h: '/admin/editor', l: '写文章', i: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { h: '/admin/projects', l: '项目管理', i: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { h: '/admin/music', l: '音乐管理', i: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
  { h: '/admin/chatter', l: '留言管理', i: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { h: '/admin/friends', l: '友链管理', i: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { h: '/admin/about', l: '关于页', i: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { h: '/admin/upload', l: '文件上传', i: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
];

export default function AdminLayout(_ref) {
  var children = _ref.children;
  var pathname = usePathname();
  var router = useRouter();
  useEffect(function() { if (!localStorage.getItem('admin-token')) router.push('/admin/login'); }, []);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-white/10 soft-glass-panel rounded-none fixed top-16 bottom-0 z-40">
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map(function(x) { var a = pathname === x.h || (x.h !== '/admin/editor' && x.h !== '/admin/dashboard' && pathname.startsWith(x.h)); return <Link key={x.h} href={x.h} className={'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium '+(a?'bg-amber-500/10 text-amber-600 dark:text-amber-400':'text-stone-600 dark:text-stone-400 hover:bg-stone-200/30')}><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d={x.i}/></svg>{x.l}</Link>; })}
        </nav>
        <div className="p-3 border-t border-white/10"><Link href="/" target="_blank" className="text-xs text-stone-400 hover:text-amber-500">查看前台</Link></div>
      </aside>
      <main className="flex-1 lg:ml-56 pb-20 lg:pb-0">{children}</main>
    </div>
  );
}
