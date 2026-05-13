'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SceneManager } from './scene/SceneManager';
import { PomodoroTimer, FocusInvitation } from './focus/PomodoroTimer';
import { FocusLeaderboard } from './focus/FocusLeaderboard';
import { NotePanel } from './focus/NotePanel';
import { MusicPlayer } from './focus/MusicPlayer';
import { MatchingPanel } from './social/MatchingPanel';
import { FocusRoom } from './social/FocusRoom';
import { UserAvatar } from './ui/UserAvatar';
import { useUserStore, useSocialStore } from '@/lib/store';
import { useOnlineUsers, useFocusRequests } from '@/lib/hooks/useRealtime';
import { Profile } from '@/lib/types';

interface MainAppProps {
  initialProfile: Profile | null;
}

export function MainApp({ initialProfile }: MainAppProps) {
  const { setProfile } = useUserStore();
  const { showFocusRoom } = useSocialStore();

  useEffect(() => {
    if (initialProfile) setProfile(initialProfile);
  }, [initialProfile, setProfile]);

  // Initialize realtime subscriptions
  useOnlineUsers();
  useFocusRequests();

  return (
    <SceneManager>
      {/* Top nav */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3"
        style={{ zIndex: 20 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🏙️</span>
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 9, color: '#ffeaa7', textShadow: '0 0 10px rgba(255,238,167,0.5)' }}>
            FOCUS TOWN
          </span>
        </div>

        {/* Right: Avatar */}
        <UserAvatar />
      </motion.div>

      {/* Left panel: Pomodoro Timer */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2"
        style={{ zIndex: 20 }}
      >
        <PomodoroTimer />
      </motion.div>

      {/* Right panel: Notes + Music + Social */}
      <motion.div
        className="absolute right-4 top-16 flex flex-col gap-3"
        style={{ zIndex: 20, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
      >
        <NotePanel />
        <MusicPlayer />
        <MatchingPanel />
      </motion.div>

      {/* Focus Leaderboard at the bottom */}
      <FocusLeaderboard />

      {/* Focus Room overlay */}
      <FocusRoom />

      {/* Incoming focus invitation */}
      <FocusInvitation />
    </SceneManager>
  );
}
