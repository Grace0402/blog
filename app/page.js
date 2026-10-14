import SearchBar from '../components/SearchBar';
import ClockWidget from '../components/ClockWidget';
import MusicWidget from '../components/MusicWidget';
import Calendar from '../components/Calendar';
import AuthorCard from '../components/AuthorCard';
import PaginatedPostList from '../components/PaginatedPostList';

async function getPosts(tag) {
  try {
    var baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    var res = await fetch(baseUrl + '/api/posts?limit=999' + (tag ? '&tag=' + tag : ''), { cache: 'no-store' });
    return await res.json();
  } catch (e) { return { posts: [], total: 0 }; }
}
async function getStats() {
  try {
    var baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    var res = await fetch(baseUrl + '/api/site-stats', { cache: 'no-store' });
    return await res.json();
  } catch (e) { return { postCount: 0, tagCount: 0, commentCount: 0, daysRunning: 0 }; }
}
async function getTags() {
  try {
    var baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    var res = await fetch(baseUrl + '/api/tags', { cache: 'no-store' });
    return await res.json();
  } catch (e) { return { tags: [] }; }
}
async function getSettings() {
  try {
    var baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    var res = await fetch(baseUrl + '/api/site-settings', { cache: 'no-store' });
    var d = await res.json();
    return d.settings || {};
  } catch (e) { return {}; }
}

export default async function HomePage({ searchParams }) {
  var postsData = await getPosts();
  var stats = await getStats();
  var tagsData = await getTags();
  var settings = await getSettings();
  var tagFilter = (searchParams && searchParams.tag) || '';
  var posts = postsData.posts || [];
  var tags = tagsData.tags || [];
  var heroBg = settings.hero_bg || '';

  return (
    <div>
      <section className="relative w-screen z-10 flex flex-col items-center justify-between overflow-hidden py-12 -mt-28 lg:-mt-20" style={{ height: '80vh', minHeight: '500px', }}>
        {heroBg && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(' + heroBg + ')' }} />}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto mt-8">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            MirrorMoon<span className="text-amber-500">&apos;</span>s Blog
          </h1>
          <p className="text-lg md:text-xl text-white/80 drop-shadow">Where Words Embrace the Way</p>
        </div>
        <div className="relative z-[100] w-full max-w-md px-4 mx-auto mb-8">
          <SearchBar />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-[260px] shrink-0 space-y-4 sticky top-28 self-start">
            <AuthorCard />
            <div className="soft-glass-panel p-4">
              <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">Stats</h3>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div><div className="text-lg font-black text-amber-500">{stats.postCount}</div><div className="text-xs text-stone-400">文章</div></div>
                <div><div className="text-lg font-black text-amber-500">{stats.tagCount}</div><div className="text-xs text-stone-400">标签</div></div>
                <div><div className="text-lg font-black text-amber-500">{stats.commentCount}</div><div className="text-xs text-stone-400">评论</div></div>
                <div><div className="text-lg font-black text-amber-500">{stats.daysRunning}</div><div className="text-xs text-stone-400">天</div></div>
              </div>
            </div>
            <div className="soft-glass-panel p-4">
              <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">热门话题</h3>
              <div className="flex flex-wrap gap-1.5">{tags.slice(0, 15).map(function(tag) { return <span key={tag.id} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">{tag.name}</span>; })}</div>
            </div>
          </aside>
          <main className="flex-1 min-w-0 space-y-4">
            <PaginatedPostList posts={posts} />
          </main>
          <aside className="hidden lg:block w-[280px] shrink-0 space-y-4 sticky top-28 self-start">
            <ClockWidget /><MusicWidget /><Calendar />
          </aside>
        </div>
      </div>
    </div>
  );
}