import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {APP, COLORS, FONT_FAMILY} from '../theme';
import {TaiwanMobileLogo} from './BrandLogos';

/** iOS-style status bar rendered over the top of the app screen. */
export const StatusBar: React.FC<{dark?: boolean}> = ({dark = false}) => {
  const c = dark ? '#FFFFFF' : APP.text;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 26px',
        fontFamily: FONT_FAMILY,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <div style={{fontSize: 15, fontWeight: 700, color: c, letterSpacing: 0.3}}>
        9:41
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
        {/* Signal bars */}
        <svg width={18} height={12} viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 4.6}
              y={9 - i * 3}
              width={3}
              height={3 + i * 3}
              rx={1}
              fill={c}
              opacity={i < 4 ? 1 : 0.35}
            />
          ))}
        </svg>
        {/* 5G */}
        <span style={{fontSize: 11.5, fontWeight: 800, color: c, letterSpacing: 0.5}}>
          5G
        </span>
        {/* Battery */}
        <svg width={25} height={12} viewBox="0 0 25 12">
          <rect x={0.7} y={0.7} width={20} height={10.6} rx={3} fill="none" stroke={c} strokeWidth={1.1} opacity={0.5} />
          <rect x={2.4} y={2.4} width={13} height={7.2} rx={1.6} fill={c} />
          <path d="M22.8 4 v4 a2.2 2.2 0 0 0 0 -4 z" fill={c} opacity={0.5} />
        </svg>
      </div>
    </div>
  );
};

type PhoneFrameProps = {
  children: React.ReactNode;
  /** Screen logical width; frame scales proportionally. */
  width?: number;
  enterAt?: number;
  /** Entrance direction: phone rises + settles. */
  fromY?: number;
  /** Static perspective tilt in degrees (positive = right edge away). */
  tilt?: number;
  /** Subtle idle float. */
  float?: boolean;
  /** Status bar icon color scheme inside the screen. */
  darkStatusBar?: boolean;
  /** Extra glow color under the device. */
  glow?: string;
  style?: React.CSSProperties;
};

/**
 * Premium smartphone mockup: titanium rail, dynamic island, screen
 * glare, ambient shadow + brand glow. Cinematic spring entrance with
 * optional perspective tilt — every product moment lives inside this.
 */
export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  width = 380,
  enterAt = 0,
  fromY = 120,
  tilt = 0,
  float = true,
  darkStatusBar = false,
  glow = 'rgba(245,130,31,0.35)',
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: {damping: 26, stiffness: 70, mass: 1.1},
  });

  const screenH = width * 2.1;
  const bezel = width * 0.028;
  const railR = width * 0.155;
  const floatY = float ? Math.sin(frame * 0.045) * 5 : 0;
  const rotY = tilt * (0.4 + 0.6 * enter);

  return (
    <div style={{perspective: 1600, ...style}}>
      <div
        style={{
          position: 'relative',
          width: width + bezel * 2,
          height: screenH + bezel * 2,
          opacity: enter,
          transform: `translateY(${(1 - enter) * fromY + floatY}px) rotateY(${rotY}deg) scale(${0.94 + 0.06 * enter})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient drop shadow + brand glow */}
        <div
          style={{
            position: 'absolute',
            left: '6%',
            right: '6%',
            bottom: -34,
            height: 60,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)`,
            filter: 'blur(14px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '-8%',
            borderRadius: railR * 1.4,
            background: `radial-gradient(ellipse 60% 50% at 50% 55%, ${glow} 0%, transparent 70%)`,
            filter: 'blur(28px)',
            opacity: 0.8,
          }}
        />

        {/* Titanium rail */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: railR,
            background:
              'linear-gradient(115deg, #4A4A52 0%, #23232A 18%, #55555E 38%, #1C1C22 62%, #3E3E46 84%, #26262C 100%)',
            boxShadow:
              '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.14)',
          }}
        />
        {/* Inner bezel */}
        <div
          style={{
            position: 'absolute',
            inset: bezel * 0.55,
            borderRadius: railR - bezel * 0.5,
            backgroundColor: '#000',
          }}
        />

        {/* Screen */}
        <div
          style={{
            position: 'absolute',
            inset: bezel,
            borderRadius: railR - bezel,
            overflow: 'hidden',
            backgroundColor: APP.bg,
          }}
        >
          {children}
          <StatusBar dark={darkStatusBar} />
          {/* Dynamic island */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: width * 0.29,
              height: 26,
              borderRadius: 20,
              backgroundColor: '#000',
              zIndex: 40,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 35% 35%, #1E2A4A 0%, #0A0E1A 70%)',
              }}
            />
          </div>
          {/* Home indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: width * 0.36,
              height: 5,
              borderRadius: 3,
              backgroundColor: darkStatusBar
                ? 'rgba(255,255,255,0.45)'
                : 'rgba(24,34,56,0.32)',
              zIndex: 40,
            }}
          />
          {/* Glass glare sweep */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: railR - bezel,
              background:
                'linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.035) 24%, transparent 42%)',
              pointerEvents: 'none',
              zIndex: 50,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/** MyClaw app header bar (inside the phone screen). */
export const AppHeader: React.FC<{
  title?: string;
  subtitle?: string;
}> = ({title = 'MyClaw', subtitle}) => (
  <div
    style={{
      padding: '56px 20px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: FONT_FAMILY,
      backgroundColor: APP.card,
      borderBottom: `1px solid ${APP.border}`,
    }}
  >
    <TaiwanMobileLogo size={26} />
    <div style={{flex: 1}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
        <span style={{fontSize: 19, fontWeight: 800, color: APP.text}}>
          {title}
        </span>
        <span style={{fontSize: 12, fontWeight: 800, color: APP.orange}}>AI</span>
      </div>
      {subtitle ? (
        <div style={{fontSize: 10.5, color: APP.textFaint, letterSpacing: 0.6}}>
          {subtitle}
        </div>
      ) : null}
    </div>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: APP.orangeTint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
      }}
    >
      🔔
    </div>
  </div>
);

/** Bottom tab bar for the MyClaw app. */
export const AppTabBar: React.FC<{active?: number}> = ({active = 0}) => {
  const tabs = [
    {icon: '🏠', label: '首頁'},
    {icon: '📞', label: '通話'},
    {icon: '🦞', label: 'AI'},
    {icon: '📈', label: '商機'},
    {icon: '👤', label: '我的'},
  ];
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 74,
        display: 'flex',
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderTop: `1px solid ${APP.border}`,
        fontFamily: FONT_FAMILY,
        zIndex: 20,
        paddingBottom: 10,
      }}
    >
      {tabs.map((t, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <span
            style={{
              fontSize: 19,
              filter: i === active ? 'none' : 'grayscale(1) opacity(0.45)',
            }}
          >
            {t.icon}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: i === active ? 800 : 500,
              color: i === active ? APP.orange : APP.textFaint,
            }}
          >
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/** White app card used inside phone screens. */
export const AppCard: React.FC<{
  children: React.ReactNode;
  enterAt?: number;
  padding?: number;
  style?: React.CSSProperties;
}> = ({children, enterAt = 0, padding = 16, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: frame - enterAt,
    fps,
    config: {damping: 24, stiffness: 110, mass: 0.8},
  });
  return (
    <div
      style={{
        backgroundColor: APP.card,
        borderRadius: 18,
        padding,
        boxShadow: APP.shadow,
        border: `1px solid ${APP.border}`,
        opacity: s,
        transform: `translateY(${(1 - s) * 26}px)`,
        fontFamily: FONT_FAMILY,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Section label inside app screens. */
export const AppSectionLabel: React.FC<{text: string; icon?: string}> = ({
  text,
  icon,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: FONT_FAMILY,
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: 1.2,
      color: APP.textSub,
    }}
  >
    {icon ? <span style={{fontSize: 13}}>{icon}</span> : null}
    {text}
  </div>
);
