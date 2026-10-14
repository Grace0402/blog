'use client';
import { useMusic } from '../contexts/MusicContext';

export default function MusicWidget() {
  var ctx = useMusic();
  var tracks = ctx.tracks;
  var currentIndex = ctx.currentIndex;
  var isPlaying = ctx.isPlaying;
  var currentTime = ctx.currentTime;
  var duration = ctx.duration;
  var activePlaylist = ctx.activePlaylist;
  var playlists = ctx.playlists;
  var filteredTracks = ctx.filteredTracks;
  var currentTrack = ctx.currentTrack;
  var play = ctx.play;
  var togglePlay = ctx.togglePlay;
  var nextTrack = ctx.nextTrack;
  var prevTrack = ctx.prevTrack;
  var setActivePlaylist = ctx.setActivePlaylist;

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  }

  return (
    <div className="soft-glass-panel p-4">
      <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">Music</h3>
      {playlists.length > 1 && (
        <div className="flex gap-1 mb-3 flex-wrap">
          {playlists.map(function(pl) {
            return (
              <button
                key={pl}
                onClick={function() { setActivePlaylist(pl); }}
                className={'px-2 py-0.5 rounded-lg text-xs transition-all ' + (activePlaylist === pl ? 'bg-amber-500 text-white' : 'bg-stone-200/50 dark:bg-stone-700/50 text-stone-600 dark:text-stone-300')}
              >{pl}</button>
            );
          })}
        </div>
      )}
      {filteredTracks.length > 0 && (
        <div className="mb-2">
          <select
            onChange={function(e) { play(parseInt(e.target.value)); }}
            value={currentIndex >= 0 ? currentIndex : 0}
            className="w-full px-2 py-1 rounded-lg text-xs bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none text-stone-600 dark:text-stone-300"
          >
            {filteredTracks.map(function(track, i) {
              return <option key={track.id} value={i}>{track.title} - {track.artist}</option>;
            })}
          </select>
        </div>
      )}
      {currentTrack ? (
        <div className="text-center mb-2">
          <div className="text-sm font-bold text-stone-800 dark:text-stone-100 truncate">{currentTrack.title}</div>
          <div className="text-xs text-stone-500">{currentTrack.artist}</div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mt-1 justify-center">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-stone-200 dark:bg-stone-700 rounded-full max-w-[120px]">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: duration ? (currentTime/duration)*100 + '%' : '0%' }} />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-2 text-xs text-stone-400">
          {tracks.length === 0 ? 'No music yet' : '选择歌曲播放'}
        </div>
      )}
      <div className="flex items-center justify-center gap-3">
        <button onClick={prevTrack} className="text-stone-500 hover:text-amber-500 transition-colors">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>
        <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors">
          {isPlaying ? (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <button onClick={nextTrack} className="text-stone-500 hover:text-amber-500 transition-colors">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>
    </div>
  );
}