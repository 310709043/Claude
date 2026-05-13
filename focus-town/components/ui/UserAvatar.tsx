'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, Star, Car } from 'lucide-react';
import { useUserStore, useFocusStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

const ROLE_ICONS_MAP: Record<string, string> = {
  'UI Designer': '🎨', 'Indie Dev': '💻', 'Researcher': '🔬',
  'Student': '📚', 'Writer': '✍️', 'Data Scientist': '📊',
  'Product Manager': '📋', 'Artist': '🖌️', 'Musician': '🎵',
  'Engineer': '⚙️', 'Marketer': '📣', 'Photographer': '📷',
  'Animator': '🎬', 'Game Dev': '🎮', 'DevOps': '🛠️',
  'Content Creator': '📹', 'Translator': '🌐', 'Teacher': '👩‍🏫',
  'Accountant': '💰', 'Architect': '🏗️', 'Lawyer': '⚖️', 'Scientist': '🧪',
};

export function UserAvatar() {
  const [open, setOpen] = useState(false);
  const { profile, setProfile } = useUserStore();
  const { tomatoes, focusMinutesSession } = useFocusStore();
  const supabase = createClient();

  if (!profile) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    window.location.href = '/auth/login';
  };

  const roleIcon = ROLE_ICONS_MAP[profile.role] || '🧑‍💼';
  const totalTomatoes = profile.tomato_count + tomatoes;
  const totalMinutes = profile.focus_minutes_today + focusMinutesSession;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pixel-card px-3 py-2"
      >
        {/* Car color indicator */}
        <div
          style={{
            width: 12, height: 12,
            background: profile.car_color,
            boxShadow: `0 0 6px ${profile.car_color}`,
            imageRendering: 'pixelated',
          }}
        />
        <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#dfe6e9' }}>
          {profile.display_name || profile.username}
        </span>
        {profile.is_pro && (
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, background: '#fdcb6e', color: '#2d3436', padding: '1px 3px' }}>
            PRO
          </span>
        )}
        <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6 }}>{roleIcon}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-12 left-0 pixel-card p-3 min-w-48 z-50"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {/* Stats */}
            <div className="space-y-1 mb-3">
              <div style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#a29bfe' }}>
                {roleIcon} {profile.role}
              </div>
              <div style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#fd79a8' }}>
                🍅 {totalTomatoes} tomatoes
              </div>
              <div style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#74b9ff' }}>
                ⏱ {totalMinutes}m focused
              </div>
              <div style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#ffeaa7' }}>
                🔥 {profile.streak_days} day streak
              </div>
            </div>

            <div className="border-t mb-2" style={{ borderColor: 'rgba(108,92,231,0.3)' }} />

            {/* Car color */}
            <div className="flex items-center gap-2 mb-2">
              <Car size={10} color="#a29bfe" />
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#a29bfe' }}>My Car</span>
              <div style={{ width: 16, height: 10, background: profile.car_color, boxShadow: `0 0 4px ${profile.car_color}` }} />
            </div>

            <div className="border-t mb-2" style={{ borderColor: 'rgba(108,92,231,0.3)' }} />

            {/* Actions */}
            <a href="/shop" className="flex items-center gap-2 py-1 hover:text-yellow-300 transition-colors">
              <Star size={10} color="#fdcb6e" />
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#fdcb6e' }}>Pro Shop</span>
            </a>

            <button onClick={handleLogout} className="flex items-center gap-2 py-1 hover:text-red-400 transition-colors w-full text-left mt-1">
              <LogOut size={10} color="#d63031" />
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#d63031' }}>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
