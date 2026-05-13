'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.href = '/';
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); }
      else if (data.user) {
        // Create profile
        const colors = ['#6c5ce7','#fd79a8','#00b894','#0984e3','#e17055','#fdcb6e','#a29bfe','#55efc4'];
        const carColor = colors[Math.floor(Math.random() * colors.length)];
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: username || email.split('@')[0],
          display_name: username || email.split('@')[0],
          role: 'Student',
          car_color: carColor,
          car_skin: 'default',
        });
        window.location.href = '/';
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}
    >
      {/* Animated pixel buildings background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${i * 12.5}%`,
              width: 60 + (i % 3) * 20,
              height: 100 + (i % 4) * 40,
              background: '#1a1a2e',
              borderTop: '2px solid #302b63',
            }}
          />
        ))}
      </div>

      <motion.div
        className="pixel-card p-8 w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3 animate-float">🏙️</div>
          <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: 14, color: '#ffeaa7', lineHeight: 1.5 }}>
            FOCUS TOWN
          </h1>
          <p style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#a29bfe', marginTop: 8, lineHeight: 2 }}>
            Lofi Pixel Focus Platform
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex mb-6">
          {(['login','signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2"
              style={{
                fontFamily: '"Press Start 2P"', fontSize: 7,
                background: mode === m ? '#6c5ce7' : 'transparent',
                color: mode === m ? 'white' : '#636e72',
                border: `2px solid ${mode === m ? '#a29bfe' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {m === 'login' ? 'LOGIN' : 'SIGN UP'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#a29bfe', display: 'block', marginBottom: 4 }}>
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your_name"
                className="w-full px-3 py-2 outline-none"
                style={{ fontFamily: '"Share Tech Mono"', fontSize: 12, background: 'rgba(15,12,41,0.8)', border: '2px solid rgba(108,92,231,0.4)', color: '#dfe6e9' }}
              />
            </div>
          )}
          <div>
            <label style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#a29bfe', display: 'block', marginBottom: 4 }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 outline-none"
              style={{ fontFamily: '"Share Tech Mono"', fontSize: 12, background: 'rgba(15,12,41,0.8)', border: '2px solid rgba(108,92,231,0.4)', color: '#dfe6e9' }}
            />
          </div>
          <div>
            <label style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#a29bfe', display: 'block', marginBottom: 4 }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 outline-none"
              style={{ fontFamily: '"Share Tech Mono"', fontSize: 12, background: 'rgba(15,12,41,0.8)', border: '2px solid rgba(108,92,231,0.4)', color: '#dfe6e9' }}
            />
          </div>

          {error && (
            <div style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#ff7675', padding: '6px 8px', background: 'rgba(214,48,49,0.15)', border: '1px solid #d63031' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full pixel-btn py-3 mt-2"
            style={{ fontSize: 8, background: loading ? '#636e72' : '#6c5ce7' }}
          >
            {loading ? 'LOADING...' : mode === 'login' ? 'ENTER TOWN' : 'JOIN TOWN'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2">
          <div className="flex-1 border-t" style={{ borderColor: 'rgba(108,92,231,0.3)' }} />
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#636e72' }}>OR</span>
          <div className="flex-1 border-t" style={{ borderColor: 'rgba(108,92,231,0.3)' }} />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full pixel-btn py-2"
          style={{ fontSize: 7, background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.2)', color: '#dfe6e9' }}
        >
          🔑 Continue with Google
        </button>
      </motion.div>
    </div>
  );
}
