'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { usePomodoro, useFocusSession } from '@/lib/hooks/useFocus';
import { useFocusStore, useSocialStore } from '@/lib/store';
import { PomodoroMode } from '@/lib/types';

function TomatoCount({ count }: { count: number }) {
  return (
    <div className="flex gap-1 flex-wrap justify-center mt-2">
      {Array.from({ length: Math.min(count, 12) }, (_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-base"
          style={{ imageRendering: 'pixelated' }}
        >
          🍅
        </motion.span>
      ))}
      {count > 12 && (
        <span style={{ fontFamily: '"Press Start 2P"', fontSize: 8, color: '#fd79a8' }}>
          +{count - 12}
        </span>
      )}
    </div>
  );
}

function CircularProgress({ progress, mode }: { progress: number; mode: PomodoroMode }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - progress);
  const colors: Record<PomodoroMode, string> = {
    focus: '#6c5ce7',
    short_break: '#00b894',
    long_break: '#0984e3',
  };

  return (
    <svg width={140} height={140} className="absolute inset-0 m-auto" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Background circle */}
      <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={6} />
      {/* Progress arc */}
      <motion.circle
        cx={70} cy={70} r={r}
        fill="none"
        stroke={colors[mode]}
        strokeWidth={6}
        strokeLinecap="square"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
        style={{ filter: `drop-shadow(0 0 6px ${colors[mode]})` }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}

const MODE_LABELS: Record<PomodoroMode, string> = {
  focus: 'FOCUS',
  short_break: 'BREAK',
  long_break: 'LONG BREAK',
};

const MODE_COLORS: Record<PomodoroMode, string> = {
  focus: '#6c5ce7',
  short_break: '#00b894',
  long_break: '#0984e3',
};

export function PomodoroTimer() {
  const { mode, minutes, seconds, progress, isRunning, tomatoes, focusMinutesSession, start, stop, reset, switchMode } = usePomodoro();
  const { startSession, endSession } = useFocusSession();
  const { partnerId, sessionId } = useFocusStore();
  const { showFocusRoom } = useSocialStore();

  const handleToggle = async () => {
    if (!isRunning) {
      start();
      if (!sessionId) await startSession(partnerId ? 'paired' : 'solo');
    } else {
      stop();
    }
  };

  const handleReset = async () => {
    reset();
    if (sessionId) await endSession();
  };

  return (
    <motion.div
      className="pixel-card rounded-none p-4 w-64 select-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Mode tabs */}
      <div className="flex gap-1 mb-4">
        {(['focus','short_break','long_break'] as PomodoroMode[]).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className="flex-1 py-1 text-center"
            style={{
              fontFamily: '"Press Start 2P"', fontSize: 5,
              background: mode === m ? MODE_COLORS[m] : 'rgba(255,255,255,0.05)',
              color: mode === m ? 'white' : '#636e72',
              border: `1px solid ${mode === m ? MODE_COLORS[m] : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            {m === 'focus' ? '25' : m === 'short_break' ? '5' : '15'}m
          </button>
        ))}
      </div>

      {/* Mode label */}
      <div className="text-center mb-2" style={{ fontFamily: '"Press Start 2P"', fontSize: 8, color: MODE_COLORS[mode] }}>
        {MODE_LABELS[mode]}
        {partnerId && <span className="ml-1 text-pink-400">👥</span>}
      </div>

      {/* Clock */}
      <div className="relative flex items-center justify-center" style={{ height: 140 }}>
        <CircularProgress progress={progress} mode={mode} />
        <div className="relative z-10 text-center">
          <div
            className="tabular-nums"
            style={{ fontFamily: '"Press Start 2P"', fontSize: 28, color: 'white', letterSpacing: 4, lineHeight: 1 }}
          >
            {minutes}:{seconds}
          </div>
          {focusMinutesSession > 0 && (
            <div style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#a29bfe', marginTop: 4 }}>
              {focusMinutesSession}m today
            </div>
          )}
        </div>
      </div>

      {/* Emotion-first reward hint */}
      <AnimatePresence>
        {focusMinutesSession >= 60 && isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mb-2"
            style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#ffeaa7' }}
          >
            ✨ Stars blessing the sky!
          </motion.div>
        )}
        {focusMinutesSession >= 30 && focusMinutesSession < 60 && isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-2"
            style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#55efc4' }}
          >
            🌟 Fireflies awakening...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-2 justify-center mt-3">
        <button
          onClick={handleToggle}
          className={`pixel-btn flex items-center gap-1 ${isRunning ? 'pixel-btn-red' : 'pixel-btn-green'}`}
        >
          {isRunning ? <Pause size={10} /> : <Play size={10} />}
          {isRunning ? 'PAUSE' : 'START'}
        </button>
        <button onClick={handleReset} className="pixel-btn flex items-center gap-1">
          <RotateCcw size={10} />
          RESET
        </button>
      </div>

      {/* Tomatoes */}
      <div className="mt-3 border-t border-purple-900 pt-2">
        <div className="text-center" style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#a29bfe' }}>
          🍅 × {tomatoes}
        </div>
        <TomatoCount count={tomatoes} />
      </div>
    </motion.div>
  );
}

// Full-screen focus invitation overlay
export function FocusInvitation() {
  const { incomingRequest, setIncomingRequest, setShowFocusRoom } = useSocialStore();
  const { setPartnerId } = useFocusStore();

  if (!incomingRequest) return null;

  const accept = () => {
    setPartnerId(incomingRequest.fromUser.user_id);
    setShowFocusRoom(true);
    setIncomingRequest(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.8)', zIndex: 200 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="pixel-card p-8 text-center max-w-sm"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
        >
          {/* Animated pixel art character */}
          <div className="text-5xl mb-4 animate-float">👨‍💻</div>
          <div style={{ fontFamily: '"Press Start 2P"', fontSize: 10, color: '#ffeaa7', marginBottom: 8 }}>
            FOCUS INVITE!
          </div>
          <div style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#a29bfe', marginBottom: 16 }}>
            {incomingRequest.fromUser.display_name || incomingRequest.fromUser.username}
          </div>
          <div style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#74b9ff', marginBottom: 24, lineHeight: 2 }}>
            wants to focus together!
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={accept} className="pixel-btn pixel-btn-green">
              ✓ ACCEPT
            </button>
            <button onClick={() => setIncomingRequest(null)} className="pixel-btn pixel-btn-red">
              ✗ DECLINE
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
