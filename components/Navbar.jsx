'use client';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import { usePathname } from 'next/navigation';

var navItems = [
  { key: 'home', href: '/', label: '首页' },
  { key: 'projects', href: '/projects', label: '开源项目' },
  { key: 'timeline', href: '/timeline', label: '归档' },
  { key: 'tags', href: '/tags', label: '标签' },
  { key: 'friends', href: '/friends', label: '友链' },
  { key: 'chatter', href: '/chatter', label: '留言墙' },
  { key: 'about', href: '/about', label: '关于我' },
];

export default function Navbar() {
  var theme = useTheme().theme;
  var toggleTheme = useTheme().toggleTheme;
  var pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 soft-glass-panel-strong rounded-none border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-black text-stone-800 dark:text-stone-100">
            My Blog
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(function(item) {
            return (
              <Link key={item.key} href={item.href} className={'px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ' + (pathname === item.href ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'text-stone-600 dark:text-stone-400 hover:text-amber-500 hover:bg-amber-500/5')}>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl transition-all duration-200 bg-stone-200/70 dark:bg-stone-700/70 hover:bg-amber-100 dark:hover:bg-amber-900/30 border-2 border-stone-300/60 dark:border-stone-600/60 hover:border-amber-400/60 dark:hover:border-amber-500/40"
            title={theme === 'light' ? '切换暗色模式' : '切换亮色模式'}
          >
            {theme === 'light' ? (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-stone-700 dark:text-stone-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="lg:hidden flex overflow-x-auto px-4 pb-2 gap-1 scrollbar-hide">
        {navItems.map(function(item) {
          return (
            <Link key={item.key} href={item.href} className={'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ' + (pathname === item.href ? 'bg-amber-500/10 text-amber-600' : 'text-stone-500')}>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}