'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, X } from 'lucide-react';
import { useSocialStore, useUserStore } from '@/lib/store';
import { sendFocusRequest } from '@/lib/hooks/useRealtime';
import { OnlineUser, UserRole } from '@/lib/types';

const ROLE_ICONS: Partial<Record<UserRole, string>> = {
  'UI Designer': '🎨', 'Indie Dev': '💻', 'Researcher': '🔬',
  'Student': '📚', 'Writer': '✍️', 'Data Scientist': '📊',
  'Product Manager': '📋', 'Artist': '🖌️', 'Musician': '🎵',
  'Engineer': '⚙️', 'Marketer': '📣', 'Photographer': '📷',
  'Animator': '🎬', 'Game Dev': '🎮', 'DevOps': '🛠️',
  'Content Creator': '📹', 'Translator': '🌐', 'Teacher': '👩‍🏫',
  'Accountant': '💰', 'Architect': '🏗️', 'Lawyer': '⚖️', 'Scientist': '🧪',
};

function UserCard({ user, onInvite }: { user: OnlineUser; onInvite: (u: OnlineUser) => void }) {
  const roleIcon = ROLE_ICONS[user.role] || '🧑‍💼';

  return (
    <motion.div
      className="flex items-center gap-2 p-2 hover:bg-purple-900/30 cursor-pointer group"
      style={{ border: '1px solid rgba(108,92,231,0.2)' }}
      whileHover={{ x: 2 }}
      onClick={() => onInvite(user)}
    >
      {/* Car mini icon */}
      <div style={{ width: 16, height: 8, flexShrink: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 2, left: 0, width: 14, height: 5, background: user.car_color }} />
        <div style={{ position: 'absolute', top: 0, left: 4, width: 8, height: 3, background: user.car_color, opacity: 0.8 }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#dfe6e9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.display_name || user.username}
          </span>
          {user.is_focusing && (
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#55efc4' }}>⚡</span>
          )}
        </div>
        <div style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#636e72', marginTop: 2 }}>
          {roleIcon} {user.role} · 🍅{user.tomato_count}
        </div>
      </div>

      {/* Invite button */}
      <button
        onClick={(e) => { e.stopPropagation(); onInvite(user); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity pixel-btn px-2 py-1"
        style={{ fontSize: 5 }}
      >
        <Zap size={8} />
      </button>
    </motion.div>
  );
}

export function MatchingPanel() {
  const [open, setOpen] = useState(false);
  const [invited, setInvited] = useState<string | null>(null);
  const { onlineUsers } = useSocialStore();
  const { profile } = useUserStore();

  const handleInvite = async (user: OnlineUser) => {
    if (!profile) return;
    await sendFocusRequest(user.user_id, profile);
    setInvited(user.user_id);
    setTimeout(() => setInvited(null), 5000);
  };

  const focusingNow = onlineUsers.filter(u => u.is_focusing);
  const online = onlineUsers.filter(u => !u.is_focusing);

  return (
    <motion.div
      className="pixel-card w-64"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-3"
        style={{ borderBottom: open ? '1px solid rgba(108,92,231,0.3)' : 'none' }}
      >
        <div className="flex items-center gap-2">
          <Users size={12} color="#74b9ff" />
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#74b9ff' }}>ONLINE</span>
          <span
            className="px-1"
            style={{ fontFamily: '"Press Start 2P"', fontSize: 6, background: '#6c5ce7', color: 'white' }}
          >
            {onlineUsers.length}
          </span>
        </div>
        <span style={{ fontSize: 8, color: '#636e72' }}>{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
              {focusingNow.length > 0 && (
                <>
                  <div style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#55efc4', padding: '4px 2px' }}>
                    ⚡ FOCUSING NOW ({focusingNow.length})
                  </div>
                  {focusingNow.map(u => (
                    <UserCard key={u.user_id} user={u} onInvite={handleInvite} />
                  ))}
                </>
              )}

              {online.length > 0 && (
                <>
                  <div style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#74b9ff', padding: '4px 2px', marginTop: 4 }}>
                    🟢 ONLINE ({online.length})
                  </div>
                  {online.map(u => (
                    <UserCard key={u.user_id} user={u} onInvite={handleInvite} />
                  ))}
                </>
              )}

              {onlineUsers.length === 0 && (
                <div className="py-4 text-center" style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#636e72', lineHeight: 2 }}>
                  No one online yet.<br />Be the first!
                </div>
              )}
            </div>

            {/* Invite sent notification */}
            <AnimatePresence>
              {invited && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-2 text-center"
                  style={{ background: 'rgba(108,92,231,0.2)', borderTop: '1px solid rgba(108,92,231,0.3)', fontFamily: '"Press Start 2P"', fontSize: 5, color: '#ffeaa7' }}
                >
                  ✉️ Focus invite sent!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
