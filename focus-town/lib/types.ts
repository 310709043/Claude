export type SceneType = 'dawn' | 'day' | 'dusk' | 'night' | 'rainy' | 'stormy';

export type UserRole =
  | 'UI Designer' | 'Indie Dev' | 'Researcher' | 'Student' | 'Writer'
  | 'Data Scientist' | 'Product Manager' | 'Artist' | 'Musician' | 'Engineer'
  | 'Marketer' | 'Photographer' | 'Animator' | 'Game Dev' | 'DevOps'
  | 'Content Creator' | 'Translator' | 'Teacher' | 'Accountant' | 'Architect'
  | 'Lawyer' | 'Scientist';

export type SessionStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type SessionType = 'solo' | 'paired';
export type PomodoroMode = 'focus' | 'short_break' | 'long_break';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  car_color: string;
  car_skin: string;
  is_pro: boolean;
  focus_minutes_today: number;
  tomato_count: number;
  streak_days: number;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  partner_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  session_type: SessionType;
  status: SessionStatus;
  tomatoes_earned: number;
  notes: string | null;
}

export interface FocusRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  from_profile?: Profile;
}

export interface Message {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Pick<Profile, 'username' | 'display_name' | 'avatar_url' | 'car_color'>;
}

export interface GarageItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'car_skin' | 'weather_theme' | 'avatar_frame';
  unlocked_at: string;
}

export interface Award {
  id: string;
  user_id: string;
  award_type: string;
  value: number;
  earned_at: string;
}

export interface OnlineUser {
  user_id: string;
  username: string;
  display_name: string;
  car_color: string;
  car_skin: string;
  role: UserRole;
  is_focusing: boolean;
  focus_minutes_today: number;
  tomato_count: number;
  remaining_seconds?: number;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  car_color: string;
  tomato_count: number;
  focus_minutes: number;
  remaining_seconds: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price_nt: number;
  item_type: 'car_skin' | 'weather_theme' | 'pro_subscription';
  preview_color?: string;
  is_pro_only: boolean;
}

export interface NoteItem {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export interface ScenePalette {
  sky: string;
  sky2: string;
  horizon: string;
  buildingFar: string;
  buildingMid: string;
  buildingNear: string;
  windowLit: string;
  windowDark: string;
  ambientLight: string;
  starOpacity: number;
  fogOpacity: number;
}

export const SCENE_PALETTES: Record<SceneType, ScenePalette> = {
  dawn: {
    sky: '#1a1a2e', sky2: '#ff6b9d', horizon: '#ffd460',
    buildingFar: '#2c2c54', buildingMid: '#40407a', buildingNear: '#706fd3',
    windowLit: '#ffd460', windowDark: '#2c2c54',
    ambientLight: 'rgba(255,107,157,0.15)', starOpacity: 0.4, fogOpacity: 0.1,
  },
  day: {
    sky: '#48dbfb', sky2: '#0abde3', horizon: '#ffeaa7',
    buildingFar: '#636e72', buildingMid: '#4a4a5e', buildingNear: '#2d3436',
    windowLit: '#fdcb6e', windowDark: '#2d3436',
    ambientLight: 'rgba(72,219,251,0.1)', starOpacity: 0, fogOpacity: 0,
  },
  dusk: {
    sky: '#2d3436', sky2: '#fd79a8', horizon: '#fdcb6e',
    buildingFar: '#2d3436', buildingMid: '#353b48', buildingNear: '#485460',
    windowLit: '#ffeaa7', windowDark: '#2d3436',
    ambientLight: 'rgba(253,121,168,0.2)', starOpacity: 0.2, fogOpacity: 0.05,
  },
  night: {
    sky: '#0f0c29', sky2: '#302b63', horizon: '#24243e',
    buildingFar: '#0f0c29', buildingMid: '#1a1a2e', buildingNear: '#2c2c54',
    windowLit: '#ffeaa7', windowDark: '#0f0c29',
    ambientLight: 'rgba(108,92,231,0.1)', starOpacity: 1, fogOpacity: 0,
  },
  rainy: {
    sky: '#2d3436', sky2: '#636e72', horizon: '#74b9ff',
    buildingFar: '#2d3436', buildingMid: '#353b48', buildingNear: '#485460',
    windowLit: '#74b9ff', windowDark: '#2d3436',
    ambientLight: 'rgba(116,185,255,0.15)', starOpacity: 0, fogOpacity: 0.3,
  },
  stormy: {
    sky: '#1e272e', sky2: '#2d3436', horizon: '#485460',
    buildingFar: '#1e272e', buildingMid: '#2d3436', buildingNear: '#353b48',
    windowLit: '#a29bfe', windowDark: '#1e272e',
    ambientLight: 'rgba(162,155,254,0.1)', starOpacity: 0, fogOpacity: 0.5,
  },
};
