'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Splash } from '@/components/Splash';
import { PlaceholderScreen } from '@/components/screens/PlaceholderScreen';
import { useTheme } from '@/components/ThemeProvider';
import { tFor } from '@/lib/i18n';

const LoginScreen = dynamic(
  () => import('@/components/screens/LoginScreen').then((m) => m.LoginScreen),
  { ssr: false, loading: () => null },
);
const CharacterScreen = dynamic(
  () => import('@/components/screens/CharacterScreen').then((m) => m.CharacterScreen),
  { ssr: false, loading: () => null },
);
const TownScreen = dynamic(
  () => import('@/components/screens/TownScreen').then((m) => m.TownScreen),
  { ssr: false, loading: () => null },
);
const SoloFocusScreen = dynamic(
  () => import('@/components/screens/SoloFocusScreen').then((m) => m.SoloFocusScreen),
  { ssr: false, loading: () => null },
);
const BuddyRoomScreen = dynamic(
  () => import('@/components/screens/BuddyRoomScreen').then((m) => m.BuddyRoomScreen),
  { ssr: false, loading: () => null },
);

type Screen = 'login' | 'character' | 'town' | 'solo' | 'buddy';

export interface Profile {
  name: string;
  avatarId?: string;
  level: number;
  interests: string[];
  skills: string[];
  goal: number;
}

const initialProfile: Profile = {
  name: 'Yuki',
  level: 4,
  interests: ['coding', 'lofi', 'tea'],
  skills: ['frontend', 'design'],
  goal: 4,
};

export default function Page() {
  const { lang } = useTheme();
  const t = tFor(lang);
  const [screen, setScreen] = useState<Screen>('login');
  const [profile, setProfile] = useState<Profile>(initialProfile);

  return (
    <>
      <Splash />
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <LoginScreen
            key="login"
            onLogin={(p) => {
              setProfile({ ...profile, ...p });
              setScreen('character');
            }}
          />
        )}
        {screen === 'character' && (
          <CharacterScreen
            key="character"
            onBack={() => setScreen('login')}
            onContinue={(p) => {
              setProfile({
                ...profile,
                name: p.name,
                avatarId: p.avatarId,
                interests: p.interests,
                skills: p.skills,
                goal: p.goal,
              });
              setScreen('town');
            }}
          />
        )}
        {screen === 'town' && (
          <TownScreen
            key="town"
            profile={profile}
            onLogout={() => setScreen('login')}
            onOpenSolo={() => setScreen('solo')}
            onOpenBuddy={() => setScreen('buddy')}
          />
        )}
        {screen === 'solo' && (
          <SoloFocusScreen
            key="solo"
            profile={profile}
            onExit={() => setScreen('town')}
          />
        )}
        {screen === 'buddy' && (
          <BuddyRoomScreen
            key="buddy"
            profile={profile}
            onExit={() => setScreen('town')}
          />
        )}
      </AnimatePresence>
    </>
  );
}
