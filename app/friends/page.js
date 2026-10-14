import Link from 'next/link';
var db = require('../../lib/db');
export var dynamic = 'force-dynamic';

export default function FriendsPage() {
  var friends = db.all('friends');
  friends.sort(function(a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-8">友链</h1>
      {friends.length === 0 ? (
        <div className="soft-glass-panel p-12 text-center text-stone-400"><p>暂无友链。</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {friends.map(function(fr) {
            return (
              <a key={fr.id} href={fr.url} target="_blank" className="soft-glass-panel p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-lg shrink-0">
                  {fr.avatar ? <img src={fr.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : fr.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-stone-800 dark:text-stone-100">{fr.name}</div>
                  <div className="text-xs text-stone-500">{fr.description || fr.url}</div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
