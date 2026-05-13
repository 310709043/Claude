'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSocialStore, useUserStore, useFocusStore } from '@/lib/store';
import { LeaderboardEntry } from '@/lib/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function CarIcon({ color }: { color: string }) {
  return (
    <div style={{ position:'relative', width:16, height:8, imageRendering:'pixelated', display:'inline-block', flexShrink:0 }}>
      <div style={{ position:'absolute', top:3, left:1, width:14, height:4, background:color }} />
      <div style={{ position:'absolute', top:1, left:4, width:8, height:3, background:color, opacity:0.8 }} />
      <div style={{ position:'absolute', top:6, left:2, width:3, height:3, background:'#2d3436' }} />
      <div style={{ position:'absolute', top:6, left:11, width:3, height:3, background:'#2d3436' }} />
    </div>
  );
}

function LeaderboardItem({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) {
  const rankColors = ['#ffeaa7','#b2bec3','#e17055','#a29bfe'];
  const rankColor = rankColors[Math.min(entry.rank - 1, 3)];

  return (
    <div
      className="flex items-center gap-2 px-3 py-1 flex-shrink-0"
      style={{
        background: isMe ? 'rgba(108,92,231,0.2)' : 'transparent',
        border: isMe ? '1px solid rgba(108,92,231,0.4)' : '1px solid transparent',
      }}
    >
      {/* Rank */}
      <span style={{ fontFamily:'"Press Start 2P"', fontSize:7, color:rankColor, minWidth:16, textAlign:'center' }}>
        {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank-1] : `#${entry.rank}`}
      </span>

      {/* Car */}
      <CarIcon color={entry.car_color} />

      {/* Name + stats */}
      <div className="flex items-center gap-2">
        <span style={{ fontFamily:'"Press Start 2P"', fontSize:6, color: isMe ? '#ffeaa7' : '#dfe6e9', whiteSpace:'nowrap' }}>
          {entry.display_name}
        </span>
        <span style={{ fontFamily:'"Press Start 2P"', fontSize:5, color:'#fd79a8', whiteSpace:'nowrap' }}>
          🍅{entry.tomato_count}
        </span>
        {entry.remaining_seconds > 0 && (
          <span style={{ fontFamily:'"Press Start 2P"', fontSize:5, color:'#55efc4', whiteSpace:'nowrap' }}>
            ⏱{formatTime(entry.remaining_seconds)}
          </span>
        )}
        <span style={{ fontFamily:'"Press Start 2P"', fontSize:5, color:'#74b9ff', whiteSpace:'nowrap' }}>
          {entry.focus_minutes}m
        </span>
      </div>

      {/* Separator */}
      <div style={{ width:1, height:12, background:'rgba(255,255,255,0.1)', marginLeft:8 }} />
    </div>
  );
}

export function FocusLeaderboard() {
  const { onlineUsers } = useSocialStore();
  const { profile } = useUserStore();
  const { tomatoes, focusMinutesSession, timeLeft, isRunning } = useFocusStore();

  const entries = useMemo((): LeaderboardEntry[] => {
    const all = [
      ...(profile ? [{
        user_id: profile.id,
        display_name: profile.display_name || profile.username,
        car_color: profile.car_color,
        tomato_count: profile.tomato_count + tomatoes,
        focus_minutes: profile.focus_minutes_today + focusMinutesSession,
        remaining_seconds: isRunning ? timeLeft : 0,
      }] : []),
      ...onlineUsers.map(u => ({
        user_id: u.user_id,
        display_name: u.display_name || u.username,
        car_color: u.car_color,
        tomato_count: u.tomato_count,
        focus_minutes: u.focus_minutes_today,
        remaining_seconds: u.is_focusing ? (u.remaining_seconds || 0) : 0,
      })),
    ];

    return all
      .sort((a, b) => b.tomato_count - a.tomato_count || b.focus_minutes - a.focus_minutes)
      .map((e, i) => ({ ...e, rank: i + 1 }));
  }, [onlineUsers, profile, tomatoes, focusMinutesSession, timeLeft, isRunning]);

  if (entries.length === 0) return null;

  const doubled = [...entries, ...entries];

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden"
      style={{ height: 32, background: 'rgba(15,12,41,0.9)', borderTop: '2px solid rgba(108,92,231,0.4)', zIndex: 20 }}
    >
      {/* Label */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center px-3 z-10"
        style={{ background: '#6c5ce7', borderRight: '2px solid #a29bfe' }}
      >
        <span style={{ fontFamily:'"Press Start 2P"', fontSize:6, color:'white', whiteSpace:'nowrap' }}>
          🏆 LIVE RANK
        </span>
      </div>

      {/* Scrolling leaderboard */}
      <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden" style={{ paddingLeft: 100 }}>
        <div className="flex items-center h-full" style={{ animation: `ticker ${Math.max(doubled.length * 6, 30)}s linear infinite` }}>
          {doubled.map((entry, i) => (
            <LeaderboardItem
              key={i}
              entry={entry}
              isMe={entry.user_id === profile?.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
