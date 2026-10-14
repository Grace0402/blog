'use client';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

var MusicContext = createContext(null);

export function MusicProvider({ children }) {
  var _tracks = useState([]), tracks = _tracks[0], setTracks = _tracks[1];
  var _index = useState(-1), currentIndex = _index[0], setCurrentIndex = _index[1];
  var _playing = useState(false), isPlaying = _playing[0], setIsPlaying = _playing[1];
  var _time = useState(0), currentTime = _time[0], setCurrentTime = _time[1];
  var _dur = useState(0), duration = _dur[0], setDuration = _dur[1];
  var _pl = useState('default'), activePlaylist = _pl[0], setActivePlaylist = _pl[1];
  var _pls = useState(['default']), playlists = _pls[0], setPlaylists = _pls[1];
  var audioRef = useRef(null);

  useEffect(function() {
    fetch('/api/music').then(function(r) { return r.json(); }).then(function(data) {
      if (data.tracks) {
        setTracks(data.tracks);
        var pls = data.tracks.map(function(t) { return t.playlist || 'default'; });
        setPlaylists(Array.from(new Set(pls)));
      }
    }).catch(function() {});
  }, []);

  var filteredTracks = tracks.filter(function(t) { return (t.playlist || 'default') === activePlaylist; });
  var currentTrack = filteredTracks[currentIndex >= 0 ? currentIndex : 0];

  function play(index) {
    setCurrentIndex(index);
    setIsPlaying(true);
    setTimeout(function() {
      if (audioRef.current) { audioRef.current.play().catch(function() {}); }
    }, 100);
  }

  function togglePlay() {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) { audioRef.current.pause(); }
    else { audioRef.current.play().catch(function() {}); }
    setIsPlaying(!isPlaying);
  }

  function nextTrack() {
    if (filteredTracks.length === 0) return;
    var next = (currentIndex + 1) % filteredTracks.length;
    play(next);
  }

  function prevTrack() {
    if (filteredTracks.length === 0) return;
    var prev = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length;
    play(prev);
  }

  return (
    <MusicContext.Provider value={{
      tracks, currentIndex, isPlaying, currentTime, duration,
      activePlaylist, playlists, filteredTracks, currentTrack,
      play, togglePlay, nextTrack, prevTrack,
      setActivePlaylist, setCurrentIndex, setIsPlaying, setCurrentTime, setDuration
    }}>
      {children}
      <audio
        ref={audioRef}
        src={currentTrack ? currentTrack.file_path : ''}
        onTimeUpdate={function() { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); }}
        onLoadedMetadata={function() { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={nextTrack}
        onPlay={function() { setIsPlaying(true); }}
        onPause={function() { setIsPlaying(false); }}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}