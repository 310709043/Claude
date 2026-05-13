'use client';
import React, { useEffect } from 'react';
import { SceneManager } from '@/components/scene/SceneManager';
import { PomodoroTimer, FocusInvitation } from '@/components/focus/PomodoroTimer';
import { FocusLeaderboard } from '@/components/focus/FocusLeaderboard';
import { NotePanel } from '@/components/focus/NotePanel';
import { MusicPlayer } from '@/components/focus/MusicPlayer';
import { MatchingPanel } from '@/components/social/MatchingPanel';
import { motion } from 'framer-motion';
import { useUserStore, useSocialStore } from '@/lib/store';
import { Profile, OnlineUser } from '@/lib/types';

// Mock data for preview
const MOCK_PROFILE: Profile = {
  id: 'demo-user',
  username: 'pixel_coder',
  display_name: 'Pixel Coder',
  avatar_url: null,
  role: 'Indie Dev',
  car_color: '#6c5ce7',
  car_skin: 'default',
  is_pro: false,
  focus_minutes_today: 47,
  tomato_count: 5,
  streak_days: 7,
  bio: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_ONLINE_USERS: OnlineUser[] = [
  { user_id: 'u1', username: 'lofi_lee',    display_name: 'Lofi Lee',    car_color: '#fd79a8', car_skin: 'default', role: 'UI Designer',     is_focusing: true,  focus_minutes_today: 120, tomato_count: 8,  remaining_seconds: 845 },
  { user_id: 'u2', username: 'study_sam',   display_name: 'Study Sam',   car_color: '#00b894', car_skin: 'default', role: 'Student',         is_focusing: false, focus_minutes_today: 55,  tomato_count: 3,  remaining_seconds: 0 },
  { user_id: 'u3', username: 'code_kai',    display_name: 'Code Kai',    car_color: '#0984e3', car_skin: 'default', role: 'Engineer',        is_focusing: true,  focus_minutes_today: 90,  tomato_count: 6,  remaining_seconds: 1200 },
  { user_id: 'u4', username: 'art_ami',     display_name: 'Art Ami',     car_color: '#fdcb6e', car_skin: 'default', role: 'Artist',          is_focusing: false, focus_minutes_today: 30,  tomato_count: 2,  remaining_seconds: 0 },
  { user_id: 'u5', username: 'data_dev',    display_name: 'Data Dev',    car_color: '#a29bfe', car_skin: 'default', role: 'Data Scientist',  is_focusing: true,  focus_minutes_today: 200, tomato_count: 12, remaining_seconds: 600 },
  { user_id: 'u6', username: 'writer_w',    display_name: 'Writer W',    car_color: '#e17055', car_skin: 'default', role: 'Writer',          is_focusing: false, focus_minutes_today: 75,  tomato_count: 4,  remaining_seconds: 0 },
];

export default function DemoPage() {
  const { setProfile } = useUserStore();
  const { setOnlineUsers } = useSocialStore();

  useEffect(() => {
    setProfile(MOCK_PROFILE);
    setOnlineUsers(MOCK_ONLINE_USERS);
  }, [setProfile, setOnlineUsers]);

  return (
    <SceneManager>
      {/* Demo banner */}
      <motion.div
        className="absolute top-0 left-0 right-0 text-center py-1 z-50"
        style={{ background: 'rgba(108,92,231,0.8)', fontFamily: '"Press Start 2P"', fontSize: 6, color: '#ffeaa7', letterSpacing: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ✨ DEMO MODE — 6 mock users online
      </motion.div>

      {/* Top nav */}
      <motion.div
        className="absolute top-7 left-0 right-0 flex items-center justify-between px-4 py-3 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🏙️</span>
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 9, color: '#ffeaa7', textShadow: '0 0 10px rgba(255,238,167,0.5)' }}>
            FOCUS TOWN
          </span>
        </div>
        {/* Mock user avatar */}
        <div className="pixel-card px-3 py-2 flex items-center gap-2">
          <div style={{ width: 12, height: 12, background: '#6c5ce7', boxShadow: '0 0 6px #6c5ce7' }} />
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#dfe6e9' }}>Pixel Coder</span>
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6 }}>💻</span>
        </div>
      </motion.div>

      {/* Left: Pomodoro */}
      <motion.div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <PomodoroTimer />
      </motion.div>

      {/* Right: Notes + Music + Social */}
      <motion.div
        className="absolute right-4 z-20 flex flex-col gap-3"
        style={{ top: 72, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
      >
        <NotePanel />
        <MusicPlayer />
        <MatchingPanel />
      </motion.div>

      {/* Bottom leaderboard */}
      <FocusLeaderboard />
    </SceneManager>
  );
}
