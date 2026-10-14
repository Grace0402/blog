'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  var router = useRouter();
  var _useState = useState(''), username = _useState[0], setUsername = _useState[1];
  var _useState2 = useState(''), password = _useState2[0], setPassword = _useState2[1];
  var _useState3 = useState(''), error = _useState3[0], setError = _useState3[1];
  var _useState4 = useState(false), loading = _useState4[0], setLoading = _useState4[1];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      var res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      });
      var data = await res.json();
      if (data.token) {
        localStorage.setItem('admin-token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="soft-glass-panel-strong p-8 w-full max-w-sm">
        <h1 className="text-2xl font-black text-center text-stone-800 dark:text-stone-100 mb-6">Admin Login</h1>
        {error && <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-xl mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={username} onChange={function(e) { setUsername(e.target.value); }} placeholder="Username" className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" required />
          <input type="password" value={password} onChange={function(e) { setPassword(e.target.value); }} placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-white/20 dark:border-white/5 outline-none focus:border-amber-500/50 text-sm" required />
          <button type="submit" disabled={loading} className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
