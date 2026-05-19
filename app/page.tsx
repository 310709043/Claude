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
          <PlaceholderScreen
            key="character"
            title={t('regTitle')}
            subtitle="(porting in progress)"
            onBack={() => setScreen('login')}
            backLabel={t('backToSignin') as string}
            onPrimary={() => setScreen('town')}
            primaryLabel={t('next') as string}
          />
        )}
        {screen === 'town' && (
          <PlaceholderScreen
            key="town"
            title={t('appName')}
            subtitle={t('tagline') as string}
            onBack={() => setScreen('login')}
            backLabel={t('logout') as string}
            onPrimary={() => setScreen('solo')}
            primaryLabel={t('soloFocus') as string}
          />
        )}
        {screen === 'solo' && (
          <PlaceholderScreen
            key="solo"
            title={t('soloRoom')}
            onBack={() => setScreen('town')}
            backLabel={t('back') as string}
          />
        )}
        {screen === 'buddy' && (
          <PlaceholderScreen
            key="buddy"
            title={t('buddyRoom')}
            onBack={() => setScreen('town')}
            backLabel={t('back') as string}
          />
        )}
      </AnimatePresence>
    </>
  );
}
