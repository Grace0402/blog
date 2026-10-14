'use client';
import { useState, useEffect } from 'react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(function() { fetchWeather(); }, []);

  async function fetchWeather(queryCity) {
    setLoading(true);
    try {
      if (queryCity) {
        var geoRes = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(queryCity) + '&count=1&language=zh');
        var geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          var r = geoData.results[0];
          setCity(r.name + (r.admin1 ? ', ' + r.admin1 : ''));
          fetchWeatherData(r.latitude, r.longitude);
        } else {
          setWeather({ error: 'City not found' });
          setLoading(false);
        }
      } else {
        var ipRes = await fetch('https://ipapi.co/json/');
        var ipData = await ipRes.json();
        setCity(ipData.city || 'Unknown');
        fetchWeatherData(ipData.latitude, ipData.longitude);
      }
    } catch(e) {
      setWeather({ error: 'Failed to load' });
      setLoading(false);
    }
  }

  async function fetchWeatherData(lat, lon) {
    try {
      var res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current_weather=true&timezone=auto');
      var data = await res.json();
      setWeather(data.current_weather);
    } catch(e) {
      setWeather({ error: 'Failed to load weather' });
    }
    setLoading(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
      setSearchCity('');
    }
  }

  function getIcon(code) {
    if (code <= 1) return '\u2600';
    if (code <= 3) return '\u2601';
    if (code <= 49) return '\u2601';
    if (code <= 69) return '\u2602';
    if (code <= 79) return '\u2744';
    return '\u26C8';
  }

  function getDesc(code) {
    if (code <= 1) return 'Clear';
    if (code <= 3) return 'Cloudy';
    if (code <= 49) return 'Fog';
    if (code <= 59) return 'Drizzle';
    if (code <= 69) return 'Rain';
    if (code <= 79) return 'Snow';
    return 'Storm';
  }

  return (
    <div className="soft-glass-panel p-4">
      <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">Weather</h3>
      <form onSubmit={handleSearch} className="mb-3">
        <input
          type="text"
          value={searchCity}
          onChange={function(e) { setSearchCity(e.target.value); }}
          placeholder="Search city..."
          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 transition-colors text-stone-700 dark:text-stone-200"
        />
      </form>
      {loading ? (
        <div className="text-center py-2 text-xs text-stone-400">Loading...</div>
      ) : weather && !weather.error ? (
        <div className="text-center">
          <div className="text-3xl mb-1">{getIcon(weather.weathercode)}</div>
          <div className="text-2xl font-black text-stone-800 dark:text-stone-100">{weather.temperature}&deg;C</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">{getDesc(weather.weathercode)}</div>
          <div className="text-xs text-stone-400 mt-1">Wind: {weather.windspeed} km/h</div>
          <div className="text-xs text-amber-500 font-medium mt-1 truncate">{city}</div>
        </div>
      ) : (
        <div className="text-center py-2 text-xs text-stone-400">Unable to load weather</div>
      )}
    </div>
  );
}
