'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelSprite } from '@/components/pixel/PixelSprite';
import { LogoMark } from '@/components/ui/LogoImage';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { CornerDeco } from '@/components/ui/CornerDeco';
import { useTheme } from '@/components/ThemeProvider';
import { tFor } from '@/lib/i18n';
import { AVATARS, TOMATO_SPRITE, TOMATO_PAL } from '@/lib/sprites';
import type { Profile } from '@/app/page';

interface Props {
  profile: Profile;
  onExit: () => void;
}

const BUDDIES = [
  { id: 'b1', name: 'Hina', avatarIdx: 4, status: 'focusing' },
  { id: 'b2', name: 'Ren', avatarIdx: 1, status: 'focusing' },
  { id: 'b3', name: 'Mio', avatarIdx: 9, status: 'idle' },
];

interface Message {
  id: number;
  who: string;
  text: string;
  isMe?: boolean;
  isNote?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, who: 'Hina', text: '今天目標：寫完 PR 的測試 ✨' },
  { id: 2, who: 'Ren', text: '我來看書 30 分鐘 📖' },
  { id: 3, who: 'Mio', text: '一起加油！', isNote: true },
];

export function BuddyRoomScreen({ profile, onExit }: Props) {
  const { lang, setLang } = useTheme();
  const t = tFor(lang);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [synced, setSynced] = useState(true);
  const [elapsed, setElapsed] = useState(8 * 60 + 24);

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const txt = draft.trim();
    if (!txt) return;
    setMessages((m) => [...m, { id: Date.now(), who: profile.name || 'YOU', text: txt, isMe: true }]);
    setDraft('');
  };

  const me = AVATARS.find((a) => a.id === profile.avatarId) || AVATARS[0];

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse at 30% 30%, var(--sky-mid) 0%, var(--bg-1) 60%, var(--bg-0) 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid var(--panel-stroke)',
          background: 'rgba(7,4,26,0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onExit} className="pixel-btn" style={{ padding: '6px 12px', fontSize: 10 }}>
            ◀ {t('leaveRoom')}
          </button>
          <LogoMark size={28} />
          <span
            style={{
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize: 12,
              color: 'var(--ink)',
              letterSpacing: '0.2em',
            }}
          >
            {t('buddyRoom')}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize: 10,
              color: 'var(--accent-2)',
              letterSpacing: '0.15em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <PulseDot synced={synced} /> {t('sameFocus')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className="ps2p"
            style={{
              fontSize: 18,
              color: 'var(--accent)',
              textShadow: 'var(--neon-glow)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <LangSwitcher lang={lang} onChange={setLang} compact />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', flex: 1, overflow: 'hidden' }}>
        {/* Co-focus room scene */}
        <div
          style={{
            position: 'relative',
            background:
              'linear-gradient(180deg, rgba(34,16,80,0.5), rgba(7,4,26,0.95))',
            overflow: 'hidden',
          }}
        >
          <CornerDeco />
          {/* Tomato above heads */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: '50%',
              top: 70,
              transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 8px 14px rgba(220,38,38,0.5))',
            }}
          >
            <PixelSprite sprite={TOMATO_SPRITE} palette={TOMATO_PAL} scale={4} />
          </motion.div>
          {/* Buddies + me */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 80,
              display: 'flex',
              justifyContent: 'center',
              gap: 36,
              zIndex: 5,
            }}
          >
            {/* Me */}
            <BuddyAvatar
              avatar={me}
              name={profile.name || 'YOU'}
              status="focusing"
              isMe
              delay={0}
            />
            {BUDDIES.map((b, i) => (
              <BuddyAvatar
                key={b.id}
                avatar={AVATARS[b.avatarIdx]}
                name={b.name}
                status={b.status}
                delay={0.15 * (i + 1)}
              />
            ))}
          </div>
          {/* Floor */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 80,
              background: 'linear-gradient(180deg, rgba(7,4,26,0.2), rgba(7,4,26,0.95))',
              borderTop: '1px solid var(--panel-stroke)',
            }}
          />
          {/* Sync status */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              background: 'rgba(7,4,26,0.7)',
              border: '1px solid var(--panel-stroke)',
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize: 10,
              color: synced ? 'var(--accent-3)' : 'var(--ink-dim)',
              letterSpacing: '0.2em',
              cursor: 'pointer',
            }}
            onClick={() => setSynced((s) => !s)}
          >
            <PulseDot synced={synced} /> SYNC {synced ? 'ON' : 'OFF'}
          </div>
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize: 10,
              color: 'var(--ink-mute)',
              letterSpacing: '0.15em',
            }}
          >
            {t('sameRoom', BUDDIES.length + 1)}
          </div>
        </div>

        {/* Chat / Notes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(7,4,26,0.85)',
            borderLeft: '1px solid var(--panel-stroke)',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--panel-stroke)',
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize: 11,
              color: 'var(--accent)',
              letterSpacing: '0.2em',
            }}
          >
            ◇ {t('sharedNotes')}
          </div>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignSelf: m.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-silkscreen), monospace',
                      fontSize: 9,
                      color: m.isMe ? 'var(--accent)' : 'var(--ink-dim)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {m.who}
                  </span>
                  <span
                    style={{
                      padding: '8px 10px',
                      background: m.isNote
                        ? 'rgba(252,211,77,0.12)'
                        : m.isMe
                          ? 'rgba(183,148,246,0.18)'
                          : 'rgba(0,0,0,0.4)',
                      border: m.isNote
                        ? '1px solid var(--accent-4)'
                        : '1px solid var(--panel-stroke)',
                      fontFamily: 'var(--font-vt323), var(--font-noto-tc), monospace',
                      fontSize: 15,
                      color: 'var(--ink)',
                      lineHeight: 1.4,
                    }}
                  >
                    {m.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <form
            onSubmit={send}
            style={{
              display: 'flex',
              gap: 6,
              padding: 12,
              borderTop: '1px solid var(--panel-stroke)',
            }}
          >
            <input
              className="pixel-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('typeMsg') as string}
              style={{ flex: 1 }}
            />
            <button type="submit" className="pixel-btn primary" style={{ padding: '8px 14px', fontSize: 11 }}>
              {t('send')}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

function BuddyAvatar({
  avatar,
  name,
  status,
  isMe,
  delay,
}: {
  avatar: (typeof AVATARS)[number];
  name: string;
  status: string;
  isMe?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
    >
      <div
        style={{
          position: 'relative',
          padding: 8,
          background: isMe ? 'rgba(183,148,246,0.15)' : 'rgba(0,0,0,0.4)',
          border: `2px solid ${isMe ? 'var(--accent)' : 'var(--panel-stroke)'}`,
          boxShadow: isMe ? 'var(--neon-glow)' : 'none',
        }}
      >
        <PixelSprite sprite={avatar.sprite} palette={avatar.palette} scale={3} />
        {status === 'focusing' && (
          <motion.div
            animate={{ y: [-2, -6, -2] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: -16,
              right: -8,
              fontSize: 14,
            }}
          >
            🍅
          </motion.div>
        )}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-silkscreen), monospace',
          fontSize: 10,
          color: isMe ? 'var(--accent)' : 'var(--ink-mute)',
          letterSpacing: '0.15em',
        }}
      >
        {name}
      </span>
    </motion.div>
  );
}

function PulseDot({ synced }: { synced: boolean }) {
  return (
    <motion.span
      animate={synced ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : { scale: 1, opacity: 0.5 }}
      transition={synced ? { duration: 1.4, repeat: Infinity } : {}}
      style={{
        display: 'inline-block',
        width: 7,
        height: 7,
        background: synced ? 'var(--accent-3)' : 'var(--ink-dim)',
        boxShadow: synced ? '0 0 6px var(--accent-3)' : 'none',
      }}
    />
  );
}
