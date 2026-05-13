'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useFocusStore, useUserStore } from '../store';
import { createClient } from '../supabase/client';

const POMODORO_DURATIONS: Record<string, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

export function usePomodoro() {
  const {
    mode, timeLeft, isRunning, tomatoes, focusMinutesSession,
    setMode, setTimeLeft, setRunning, incrementTomato, addFocusMinute, sessionId
  } = useFocusStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const minuteRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (minuteRef.current)   clearInterval(minuteRef.current);
  }, [setRunning]);

  const start = useCallback(() => {
    setRunning(true);
  }, [setRunning]);

  const reset = useCallback(() => {
    stop();
    setTimeLeft(POMODORO_DURATIONS[mode]);
  }, [stop, setTimeLeft, mode]);

  const switchMode = useCallback((m: typeof mode) => {
    stop();
    setMode(m);
  }, [stop, setMode]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const prev = useFocusStore.getState().timeLeft;
      if (prev <= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        if (mode === 'focus') {
          incrementTomato();
          setMode('short_break');
        } else {
          setMode('focus');
        }
        setTimeLeft(POMODORO_DURATIONS[mode === 'focus' ? 'short_break' : 'focus']);
      } else {
        setTimeLeft(prev - 1);
      }
    }, 1000);

    if (mode === 'focus') {
      minuteRef.current = setInterval(() => {
        addFocusMinute();
      }, 60_000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (minuteRef.current)   clearInterval(minuteRef.current);
    };
  }, [isRunning, mode, setTimeLeft, setRunning, incrementTomato, setMode, addFocusMinute]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const progress = 1 - timeLeft / POMODORO_DURATIONS[mode];

  return { mode, minutes, seconds, progress, isRunning, tomatoes, focusMinutesSession, start, stop, reset, switchMode };
}

export function useFocusSession() {
  const supabase = createClient();
  const { profile } = useUserStore();
  const { sessionId, setSessionId, partnerId } = useFocusStore();

  const startSession = async (type: 'solo' | 'paired' = 'solo') => {
    if (!profile) return;
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({ user_id: profile.id, session_type: type, partner_id: partnerId, status: 'active' })
      .select('id')
      .single();
    if (!error && data) setSessionId(data.id);
  };

  const endSession = async () => {
    if (!sessionId) return;
    const { focusMinutesSession } = useFocusStore.getState();
    await supabase
      .from('focus_sessions')
      .update({ status: 'completed', ended_at: new Date().toISOString(), duration_minutes: focusMinutesSession })
      .eq('id', sessionId);
    setSessionId(null);
  };

  return { startSession, endSession };
}
