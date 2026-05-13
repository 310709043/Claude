import { create } from 'zustand';
import { SceneType, Profile, OnlineUser, NoteItem, PomodoroMode, FocusSession } from './types';

interface SceneStore {
  scene: SceneType;
  setScene: (s: SceneType) => void;
  autoScene: boolean;
  setAutoScene: (v: boolean) => void;
}

interface FocusStore {
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  tomatoes: number;
  focusMinutesSession: number;
  sessionId: string | null;
  partnerId: string | null;
  notes: NoteItem[];
  setMode: (m: PomodoroMode) => void;
  setTimeLeft: (t: number) => void;
  setRunning: (v: boolean) => void;
  incrementTomato: () => void;
  addNote: (text: string) => void;
  toggleNote: (id: string) => void;
  deleteNote: (id: string) => void;
  setSessionId: (id: string | null) => void;
  setPartnerId: (id: string | null) => void;
  addFocusMinute: () => void;
}

interface SocialStore {
  onlineUsers: OnlineUser[];
  setOnlineUsers: (u: OnlineUser[]) => void;
  incomingRequest: { id: string; fromUser: OnlineUser } | null;
  setIncomingRequest: (r: { id: string; fromUser: OnlineUser } | null) => void;
  showFocusRoom: boolean;
  setShowFocusRoom: (v: boolean) => void;
}

interface UserStore {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  scene: 'night',
  setScene: (scene) => set({ scene }),
  autoScene: true,
  setAutoScene: (autoScene) => set({ autoScene }),
}));

export const useFocusStore = create<FocusStore>((set) => ({
  mode: 'focus',
  timeLeft: 25 * 60,
  isRunning: false,
  tomatoes: 0,
  focusMinutesSession: 0,
  sessionId: null,
  partnerId: null,
  notes: [],
  setMode: (mode) => set({ mode, timeLeft: mode === 'focus' ? 25 * 60 : mode === 'short_break' ? 5 * 60 : 15 * 60 }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setRunning: (isRunning) => set({ isRunning }),
  incrementTomato: () => set((s) => ({ tomatoes: s.tomatoes + 1 })),
  addNote: (text) => set((s) => ({ notes: [...s.notes, { id: Date.now().toString(), text, completed: false, created_at: new Date().toISOString() }] })),
  toggleNote: (id) => set((s) => ({ notes: s.notes.map(n => n.id === id ? { ...n, completed: !n.completed } : n) })),
  deleteNote: (id) => set((s) => ({ notes: s.notes.filter(n => n.id !== id) })),
  setSessionId: (sessionId) => set({ sessionId }),
  setPartnerId: (partnerId) => set({ partnerId }),
  addFocusMinute: () => set((s) => ({ focusMinutesSession: s.focusMinutesSession + 1 })),
}));

export const useSocialStore = create<SocialStore>((set) => ({
  onlineUsers: [],
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  incomingRequest: null,
  setIncomingRequest: (incomingRequest) => set({ incomingRequest }),
  showFocusRoom: false,
  setShowFocusRoom: (showFocusRoom) => set({ showFocusRoom }),
}));

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
