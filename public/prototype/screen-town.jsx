/* Main Town Screen — complete rewrite for v2.
   - Distinct named buildings (no procedural skyline)
   - Sky leaderboard window in mid-sky
   - T-coin in top bar
   - Find Buddy / Solo buttons replace bottom-HUD leaderboard slot
   - Differentiated moving entities: humans / cats / birds / cars, each with name + status
   - Strong weather + time cycling (clear/cloudy/rain/snow/storm)
*/

(function () {
  const {
    PixelSprite, AnimatedSprite, StarField, ShootingStars, RainOverlay,
    AVATARS, WALKERS, CAT_WALK, TREE, BENCH, LAMP,
    TOMATO_SPRITE, TOMATO_PAL, MOON, MOON_PAL, SUN, SUN_PAL,
    COFFEE, COFFEE_PAL, NOTE, NOTE_PAL, TROPHY, TROPHY_PAL,
    BUILDINGS, Snow, Clouds, LightningFlash, Fog,
    LogoImage, PixelWord, LangSwitcher, TCoinBadge, CoinIcon, CornerDeco, STAR_TINY, tFor,
  } = window;

  // ---- Time + Weather config ----
  const TIMES = ['dawn', 'day', 'dusk', 'night', 'midnight'];
  const TIME_LABEL_KEY = { dawn: 'timeDawn', day: 'timeDay', dusk: 'timeDusk', night: 'timeNight', midnight: 'timeMidnight' };
  const TIME_BG = {
    dawn:     { top: '#3a2552', mid: '#6e3a6e', low: '#d97a8a' },
    day:      { top: '#1e4a8a', mid: '#3a7ab8', low: '#9ec5e8' },
    dusk:     { top: '#2a0d1f', mid: '#b94a6e', low: '#f0825a' },
    night:    { top: '#07041a', mid: '#1a0d3d', low: '#2a1854' },
    midnight: { top: '#020208', mid: '#0a0820', low: '#15093a' },
  };
  const TIME_TEMP = { dawn: 12, day: 22, dusk: 19, night: 16, midnight: 11 };

  const WEATHERS = ['clear', 'cloudy', 'rain', 'snow', 'storm'];
  const WEATHER_LABEL_KEY = { clear: 'weatherSunny', cloudy: 'weatherCloudy', rain: 'weatherRain', snow: 'weatherSnow', storm: 'weatherStorm' };
  const WEATHER_ICON = { clear: '☀', cloudy: '☁', rain: '☂', snow: '❄', storm: '⚡' };

  function TownScreen({ profile, direction, lang, setLang, autoTime, onLogout, onOpenBuddy, onOpenSolo }) {
    const t = tFor(lang);
    const wrapRef = React.useRef(null);
    const [size, setSize] = React.useState({ w: 1280, h: 800 });
    const [timeOfDay, setTimeOfDay] = React.useState('night');
    const [weather, setWeather] = React.useState('clear');
    const [openModal, setOpenModal] = React.useState(null);
    const [clock, setClock] = React.useState(() => new Date(2026, 4, 16, 21, 47));
    const [coins, setCoins] = React.useState(1247);

    React.useEffect(() => {
      const update = () => wrapRef.current && setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
      update(); window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, []);

    React.useEffect(() => {
      const id = setInterval(() => setClock((c) => new Date(c.getTime() + 60_000)), 1000);
      return () => clearInterval(id);
    }, []);

    React.useEffect(() => {
      if (!autoTime) return;
      // Slow ambient cycle: each phase ~60s in demo (represents 1-2h real time).
      // Crossfade is handled by CSS transition (var(--env-trans)).
      const id = setInterval(() => {
        setTimeOfDay((tm) => TIMES[(TIMES.indexOf(tm) + 1) % TIMES.length]);
      }, 60000);
      const id2 = setInterval(() => {
        setWeather((w) => WEATHERS[(WEATHERS.indexOf(w) + 1) % WEATHERS.length]);
      }, 90000);
      return () => { clearInterval(id); clearInterval(id2); };
    }, [autoTime]);

    // Periodically tick coins up to feel alive
    React.useEffect(() => {
      const id = setInterval(() => setCoins((c) => c + Math.floor(Math.random() * 3)), 8000);
      return () => clearInterval(id);
    }, []);

    const bg = TIME_BG[timeOfDay];
    const dayLike = timeOfDay === 'day' || timeOfDay === 'dawn';

    return (
      <div ref={wrapRef} className="crt" style={{
        position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
        background: `linear-gradient(180deg, ${bg.top} 0%, ${bg.mid} 65%, ${bg.low} 100%)`,
        transition: 'background 2s linear',
      }}>
        {/* Stars (visible at night-ish) */}
        {(timeOfDay === 'night' || timeOfDay === 'midnight' || timeOfDay === 'dusk') && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <StarField width={size.w} height={Math.floor(size.h * 0.55)} density={timeOfDay === 'midnight' ? 0.0010 : 0.0007} />
          </div>
        )}
        {(timeOfDay === 'night' || timeOfDay === 'midnight') && weather === 'clear' && (
          <ShootingStars width={size.w} height={Math.floor(size.h * 0.45)} />
        )}

        {/* Weather */}
        {weather === 'cloudy' && <Clouds width={size.w} height={size.h} count={5} color="rgba(245,243,255,0.7)" />}
        {weather === 'rain' && <RainOverlay width={size.w} height={size.h} color="var(--accent-3)" density={0.9} />}
        {weather === 'snow' && <Snow width={size.w} height={size.h} density={1.5} />}
        {weather === 'storm' && (
          <>
            <RainOverlay width={size.w} height={size.h} color="var(--accent-3)" density={1.4} />
            <LightningFlash />
          </>
        )}

        {/* Sun / Moon */}
        <CelestialBody timeOfDay={timeOfDay} />

        {/* Birds */}
        <Birds width={size.w} timeOfDay={timeOfDay} />

        {/* Sky leaderboard window (centered upper area) */}
        <SkyWindow lang={lang} t={t} />

        {/* Top HUD */}
        <TopHUD
          profile={profile} clock={clock} timeOfDay={timeOfDay} weather={weather}
          coins={coins} t={t} lang={lang} setLang={setLang}
          onOpen={setOpenModal} onLogout={onLogout}
        />

        {/* Cityscape */}
        <Cityscape width={size.w} height={size.h} direction={direction} timeOfDay={timeOfDay} weather={weather} t={t} />

        {/* Street */}
        <Street width={size.w} timeOfDay={timeOfDay} weather={weather} />

        {/* Ticker */}
        <Ticker t={t} lang={lang} />
        <Ticker t={t} lang={lang} />

        {/* Bottom HUD */}
        <BottomHUD
          t={t} timeOfDay={timeOfDay} weather={weather}
          onSolo={onOpenSolo} onBuddy={onOpenBuddy}
          setTimeOfDay={setTimeOfDay} setWeather={setWeather}
        />

        {/* Modals */}
        {openModal === 'shop' && <ShopModal t={t} onClose={() => setOpenModal(null)} />}
        {openModal === 'achievements' && <AchievementsModal t={t} onClose={() => setOpenModal(null)} />}
        {openModal === 'friends' && <FriendsModal t={t} onClose={() => setOpenModal(null)} />}
        {openModal === 'profile' && <ProfileModal t={t} profile={profile} onClose={() => setOpenModal(null)} onLogout={onLogout} onOpenSection={(s) => setOpenModal(s)} />}
        {openModal === 'feedback' && <FeedbackModal t={t} onClose={() => setOpenModal(null)} />}
        {openModal === 'support' && <SupportModal t={t} onClose={() => setOpenModal(null)} />}
      </div>
    );
  }

  // ============ Top HUD ============
  function TopHUD({ profile, clock, timeOfDay, weather, coins, t, lang, setLang, onOpen, onLogout }) {
    const day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][clock.getDay()];
    const mo = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][clock.getMonth()];
    const dd = String(clock.getDate()).padStart(2, '0');
    const hh = String(clock.getHours()).padStart(2, '0');
    const mm = String(clock.getMinutes()).padStart(2, '0');
    const avatar = profile?.avatar || AVATARS[0];

    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '10px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 14, zIndex: 20,
        background: 'linear-gradient(180deg, rgba(7,4,26,0.85) 0%, rgba(7,4,26,0) 100%)',
      }}>
        {/* Left cluster: logo + weather chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LogoImage size={44} />
          <div style={{ width: 1, height: 28, background: 'var(--panel-stroke)' }} />
          <div className="pixel-panel" style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Silkscreen, monospace', fontSize: 10, letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 13 }}>{timeOfDay === 'night' || timeOfDay === 'midnight' ? '🌙' : timeOfDay === 'dawn' ? '🌅' : timeOfDay === 'dusk' ? '🌆' : '☀'}</span>
            <span>{t(TIME_LABEL_KEY[timeOfDay])}</span>
            <span style={{ color: 'var(--ink-dim)' }}>·</span>
            <span>{WEATHER_ICON[weather]} {t(WEATHER_LABEL_KEY[weather])}</span>
            <span style={{ color: 'var(--ink-dim)' }}>·</span>
            <span>{TIME_TEMP[timeOfDay]}°C</span>
            <span style={{ color: 'var(--ink-dim)' }}>·</span>
            <span style={{ color: '#6ee7b7' }}>ONLINE 2,847</span>
          </div>
        </div>

        {/* Center: user status pill */}
        <UserStatusPill profile={profile} t={t} onOpen={() => onOpen('profile')} />

        {/* Right cluster: nav + clock + T-coin + lang */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NavButton icon={<PixelSprite sprite={TROPHY} palette={TROPHY_PAL} scale={1.3} />} label="ACHV" onClick={() => onOpen('achievements')} />
          <NavButton icon="🛒" label="SHOP" onClick={() => onOpen('shop')} />
          <NavButton icon={<PixelSprite sprite={CAT_WALK.frames[0]} palette={CAT_WALK.palette} scale={1.3} />} label="FRDS" onClick={() => onOpen('friends')} />

          {/* Clock */}
          <div className="pixel-panel" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 16, color: 'var(--ink)', letterSpacing: '0.05em' }}>{hh}:{mm}</div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-mute)', letterSpacing: '0.18em' }}>{day} · {mo} {dd}</div>
            </div>
          </div>

          {/* T-coin (moved here from center) */}
          <TCoinBadge amount={coins} delta={2} label={t('tcoin').toUpperCase()} />

          {/* Language switcher */}
          <LangSwitcher lang={lang} onChange={setLang} compact />
        </div>
      </div>
    );
  }

  // Center: avatar + name + current focus state, click → profile
  function UserStatusPill({ profile, t, onOpen }) {
    const avatar = profile?.avatar || AVATARS[0];
    return (
      <button onClick={onOpen} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '5px 14px 5px 5px',
        background: 'rgba(7,4,26,0.92)',
        border: '1px solid var(--accent)',
        boxShadow: 'var(--neon-glow), inset 0 0 12px rgba(183,148,246,0.1)',
        cursor: 'pointer',
        fontFamily: 'Silkscreen, "Noto Sans TC", monospace',
        position: 'relative',
        transition: 'all 0.12s steps(2)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
        {/* Avatar tile */}
        <div style={{
          width: 36, height: 36, background: 'rgba(0,0,0,0.5)',
          border: '1px solid var(--accent-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', flexShrink: 0,
        }}>
          <PixelSprite sprite={avatar.sprite} palette={avatar.palette} scale={2} />
          {/* online dot */}
          <span style={{ position: 'absolute', bottom: -2, right: -2, width: 8, height: 8, background: '#6ee7b7', border: '2px solid var(--bg-0)' }} />
        </div>
        {/* Name + level row */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--ink)', letterSpacing: '0.08em' }}>{profile?.name || 'Yuki'}</span>
            <span style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.15em', padding: '0 4px', border: '1px solid var(--accent)' }}>LV.{profile?.level || 4}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9 }}>
            <span style={{ width: 6, height: 6, background: 'var(--accent-2)', boxShadow: 'var(--neon-glow-pink)' }} className="blink" />
            <span style={{ color: 'var(--accent-2)', letterSpacing: '0.15em' }}>專注中 · 🍅 #5</span>
            <span style={{ color: 'var(--ink-dim)' }}>·</span>
            <span style={{ color: 'var(--accent-3)', letterSpacing: '0.1em' }}>22 min</span>
          </div>
        </div>
        {/* Tomato chips */}
        <div style={{ display: 'flex', gap: 1, marginLeft: 6, alignItems: 'center' }}>
          {[...Array(4)].map((_, i) => <PixelSprite key={i} sprite={TOMATO_SPRITE} palette={TOMATO_PAL} scale={1.1} />)}
          <span style={{ fontSize: 9, color: 'var(--ink-dim)', marginLeft: 4 }}>4/8</span>
        </div>
      </button>
    );
  }

  function NavButton({ icon, label, onClick }) {
    return (
      <button onClick={onClick} style={{
        background: 'rgba(7,4,26,0.75)', border: '1px solid var(--panel-stroke)',
        padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)',
        letterSpacing: '0.15em', cursor: 'pointer',
        transition: 'all 0.12s steps(2)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--ink)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--panel-stroke)'; e.currentTarget.style.color = 'var(--ink-mute)'; }}>
        {typeof icon === 'string' ? <span style={{ fontSize: 11 }}>{icon}</span> : icon}
        <span>{label}</span>
      </button>
    );
  }

  // ============ Sky window (leaderboard + ad rotation) ============
  function SkyWindow({ lang, t }) {
    const [tab, setTab] = React.useState('rank'); // rank | ad
    React.useEffect(() => {
      const id = setInterval(() => setTab((x) => (x === 'rank' ? 'ad' : 'rank')), 6000);
      return () => clearInterval(id);
    }, []);

    return (
      <div style={{
        position: 'absolute', top: 92, left: '50%', transform: 'translateX(-50%)',
        width: 520, zIndex: 5,
      }}>
        <div className="pixel-panel" style={{
          padding: 0, background: 'rgba(7,4,26,0.94)',
          border: '2px solid var(--accent)',
          boxShadow: 'var(--neon-glow), 0 18px 40px rgba(0,0,0,0.6)',
          position: 'relative',
        }}>
          <CornerDeco />
          {/* Title bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 12px', borderBottom: '1px solid var(--panel-stroke)',
            background: 'linear-gradient(90deg, rgba(183,148,246,0.15), transparent)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: 'var(--accent-2)', boxShadow: 'var(--neon-glow-pink)' }} className="blink" />
              <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.3em', textShadow: 'var(--neon-glow)' }}>
                FOCUS&nbsp;BROADCAST
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <TabPill active={tab === 'rank'} onClick={() => setTab('rank')}>{t('todayRank')}</TabPill>
              <TabPill active={tab === 'ad'} onClick={() => setTab('ad')}>{t('skyAd')}</TabPill>
            </div>
          </div>

          {/* Content */}
          {tab === 'rank' ? <RankBoard t={t} /> : <AdSpace lang={lang} t={t} />}

          {/* Bottom signal bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px', borderTop: '1px solid var(--panel-stroke)', background: 'rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.15em' }}>
              <SignalBars />
              <span>LIVE · 2,847 ONLINE</span>
            </div>
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--accent-3)', letterSpacing: '0.15em' }}>CH 04 · LBT.TV</span>
          </div>
        </div>

        {/* Antenna / mount */}
        <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', width: 4, height: 24, background: 'var(--accent)', boxShadow: 'var(--neon-glow)' }} />
        <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, background: 'var(--accent-2)', borderRadius: '50%', boxShadow: 'var(--neon-glow-pink)' }} className="blink" />
      </div>
    );
  }

  function TabPill({ children, active, onClick }) {
    return (
      <button onClick={onClick} style={{
        padding: '4px 10px',
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#0a0524' : 'var(--ink-mute)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--panel-stroke)'}`,
        fontFamily: 'Silkscreen, monospace', fontSize: 9, letterSpacing: '0.1em',
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}>{children}</button>
    );
  }

  function RankBoard({ t }) {
    const rows = [
      { rank: 1, name: 'Kai',   avatar: AVATARS[3], pomos: 13, mins: 325, badge: 'CHAMP',   color: '#fcd34d' },
      { rank: 2, name: 'Bear',  avatar: AVATARS[7], pomos: 11, mins: 275, badge: 'SILVER',  color: '#cbd5e1' },
      { rank: 3, name: 'Aria',  avatar: AVATARS[2], pomos: 9,  mins: 225, badge: 'BRONZE',  color: '#fb923c' },
      { rank: 4, name: 'Panda', avatar: AVATARS[9], pomos: 8,  mins: 200 },
      { rank: 5, name: 'Doc',   avatar: AVATARS[11], pomos: 7, mins: 175 },
    ];
    return (
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {rows.map((r) => (
          <div key={r.rank} style={{
            display: 'grid', gridTemplateColumns: '28px 28px 1fr auto 60px', gap: 10, alignItems: 'center',
            padding: '4px 8px',
            background: r.rank === 1 ? 'rgba(252,211,77,0.1)' : r.rank === 2 ? 'rgba(203,213,225,0.07)' : r.rank === 3 ? 'rgba(251,146,60,0.07)' : 'transparent',
            border: r.rank <= 3 ? `1px solid ${r.color}44` : '1px solid transparent',
          }}>
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 14, color: r.color || 'var(--ink-mute)', textShadow: r.color ? `0 0 6px ${r.color}` : 'none' }}>#{r.rank}</span>
            <PixelSprite sprite={r.avatar.sprite} palette={r.avatar.palette} scale={1.5} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 12, color: 'var(--ink)' }}>{r.name}</span>
              <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.1em' }}>{r.mins}min · {r.avatar.name}</span>
            </div>
            {r.badge ? (
              <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: r.color, letterSpacing: '0.2em', textShadow: `0 0 6px ${r.color}` }}>{r.badge}</span>
            ) : <span />}
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
              {r.pomos} <PixelSprite sprite={TOMATO_SPRITE} palette={TOMATO_PAL} scale={1.2} />
            </span>
          </div>
        ))}
      </div>
    );
  }

  function AdSpace({ lang, t }) {
    const ads = {
      zh: [
        { tag: '贊助商', title: 'Notion · 一個地方寫下你所有想法', cta: '免費試用 ▶', accent: '#fff' },
        { tag: 'FT PRO', title: '解鎖無限主題、自訂背景與雲端同步', cta: '升級 PRO ▶', accent: 'var(--accent-2)' },
        { tag: '社群活動', title: '本週五晚 9pm · 深夜寫作馬拉松 ✎', cta: '報名 ▶', accent: 'var(--accent-3)' },
      ],
      en: [
        { tag: 'SPONSOR', title: 'Notion · One workspace for everything', cta: 'Try free ▶', accent: '#fff' },
        { tag: 'FT PRO', title: 'Unlock themes, custom backgrounds, cloud sync', cta: 'Upgrade PRO ▶', accent: 'var(--accent-2)' },
        { tag: 'EVENT', title: 'Friday 9pm · Late-night writing marathon ✎', cta: 'Sign up ▶', accent: 'var(--accent-3)' },
      ],
      ko: [
        { tag: '스폰서', title: 'Notion · 모든 것을 위한 하나의 공간', cta: '무료 체험 ▶', accent: '#fff' },
        { tag: 'FT PRO', title: '테마 · 배경 · 클라우드 동기화 해제', cta: 'PRO 업그레이드 ▶', accent: 'var(--accent-2)' },
        { tag: '이벤트', title: '금요일 9pm · 심야 글쓰기 마라톤 ✎', cta: '참가 ▶', accent: 'var(--accent-3)' },
      ],
      ja: [
        { tag: 'スポンサー', title: 'Notion · すべてを一つに', cta: '無料で試す ▶', accent: '#fff' },
        { tag: 'FT PRO', title: 'テーマ · 背景 · クラウド同期を解放', cta: 'PRO へ ▶', accent: 'var(--accent-2)' },
        { tag: 'イベント', title: '金曜 21:00 · 深夜ライティング ✎', cta: '参加 ▶', accent: 'var(--accent-3)' },
      ],
    };
    const list = ads[lang] || ads.en;
    const [idx, setIdx] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(() => setIdx((i) => (i + 1) % list.length), 3000);
      return () => clearInterval(id);
    }, [list.length]);
    const ad = list[idx];
    return (
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 156 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            padding: '2px 8px', background: ad.accent, color: '#0a0524',
            fontFamily: 'Silkscreen, monospace', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700,
          }}>{ad.tag}</span>
          <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-dim)', letterSpacing: '0.2em' }}>
            AD · {idx + 1}/{list.length}
          </span>
        </div>
        <div style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.4, fontFamily: 'Noto Sans TC, sans-serif', fontWeight: 500 }}>
          {ad.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <button className="pixel-btn primary" style={{ padding: '8px 16px', fontSize: 11 }}>{ad.cta}</button>
          <div style={{ flex: 1, display: 'flex', gap: 4 }}>
            {list.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, background: i === idx ? 'var(--accent)' : 'var(--panel-stroke)' }} />
            ))}
          </div>
        </div>
        <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-dim)', letterSpacing: '0.15em', marginTop: 'auto' }}>
          想在這裡投放廣告？ ad@lowbatterytown.app
        </div>
      </div>
    );
  }

  function SignalBars() {
    const [step, setStep] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(() => setStep((s) => (s + 1) % 4), 400);
      return () => clearInterval(id);
    }, []);
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 8 }}>
        {[2, 4, 6, 8].map((h, i) => (
          <div key={i} style={{ width: 2, height: h, background: i <= step ? 'var(--accent-3)' : 'var(--panel-stroke)' }} />
        ))}
      </div>
    );
  }

  // ============ Celestial body ============
  function CelestialBody({ timeOfDay }) {
    const isNight = timeOfDay === 'night' || timeOfDay === 'midnight';
    return (
      <div style={{ position: 'absolute', top: '8%', right: '6%', opacity: 0.95, zIndex: 1 }}>
        <PixelSprite sprite={isNight ? MOON : SUN} palette={isNight ? MOON_PAL : SUN_PAL} scale={6}
          glow={isNight ? 'rgba(252,211,77,0.4)' : 'rgba(252,211,77,0.9)'} />
      </div>
    );
  }

  // ============ Birds (flying entities) ============
  function Birds({ width, timeOfDay }) {
    const birdSprite1 = `
.BB....BB.
BBBB..BBBB
.BBBBBBBB.
..BBBBBB..
`;
    const birdSprite2 = `
.B......B.
BBB....BBB
.BBBBBBBB.
..BBBBBB..
`;
    const birds = React.useMemo(() => [
      { name: 'Whisp',  status: '夜飛', y: 90,  v: 0.15, color: '#a78bfa' },
      { name: 'Echo',   status: '巡邏', y: 130, v: 0.18, color: '#22d3ee' },
      { name: 'Wren',   status: '尋食', y: 160, v: 0.12, color: '#fcd34d' },
    ], []);
    const [pos, setPos] = React.useState(birds.map((_, i) => 10 + i * 30));
    React.useEffect(() => {
      let raf;
      const tick = () => {
        setPos((ps) => ps.map((p, i) => {
          let np = p + birds[i].v;
          if (np > 105) np = -8;
          return np;
        }));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [birds]);
    return (
      <>
        {birds.map((b, i) => (
          <div key={i} style={{ position: 'absolute', left: `${pos[i]}%`, top: b.y, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              fontFamily: 'Silkscreen, monospace', fontSize: 8, color: b.color,
              background: 'rgba(7,4,26,0.7)', padding: '0px 4px',
              border: `1px solid ${b.color}55`,
              marginBottom: 2, whiteSpace: 'nowrap', letterSpacing: '0.05em',
              textShadow: `0 0 4px ${b.color}`,
            }}>{b.name} · {b.status}</div>
            <AnimatedSprite frames={[birdSprite1, birdSprite2]} palette={{ B: b.color }} scale={2} fps={6} glow={`${b.color}aa`} />
          </div>
        ))}
      </>
    );
  }

  // ============ Cityscape (placed buildings + signage) ============
  function Cityscape({ width, height, direction, timeOfDay, weather, t }) {
    const layout = [
      { key: 'cafe',    scale: 2.8 },
      { key: 'study',   scale: 3.0 },
      { key: 'cwork',   scale: 2.6 },
      { key: 'lofi',    scale: 2.8 },
      { key: 'arcade',  scale: 2.8 },
      { key: 'library', scale: 2.8 },
      { key: 'ramen',   scale: 2.8 },
      { key: 'gallery', scale: 2.6 },
      { key: 'ink',     scale: 2.6 },
    ];

    // Weather-based color overlay applied to all buildings
    const weatherTint = {
      clear:  'transparent',
      cloudy: 'rgba(110,110,140,0.18)',
      rain:   'rgba(34,80,180,0.28)',
      snow:   'rgba(220,230,250,0.18)',
      storm:  'rgba(20,30,80,0.4)',
    }[weather] || 'transparent';

    // Time tint (subtle)
    const timeTint = {
      dawn:     'rgba(217,122,138,0.12)',
      day:      'rgba(255,255,255,0.04)',
      dusk:     'rgba(240,130,90,0.12)',
      night:    'rgba(20,8,58,0.2)',
      midnight: 'rgba(2,2,10,0.35)',
    }[timeOfDay] || 'transparent';

    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 215, height: 420, pointerEvents: 'none', zIndex: 3 }}>
        {/* Distant night skyline silhouette behind */}
        <FarSilhouette width={width} timeOfDay={timeOfDay} weather={weather} direction={direction} />
        <MidSilhouette width={width} timeOfDay={timeOfDay} weather={weather} direction={direction} />

        {/* Main buildings line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '0 26px',
        }}>
          {layout.map((it, i) => {
            const b = BUILDINGS.find((x) => x.key === it.key);
            if (!b) return null;
            const labelKey = ({ cafe: 'cafe', study: 'studyHall', lofi: 'lofiBar', arcade: 'arcade', ramen: 'ramen', library: 'library', cwork: 'coworking', gallery: 'gallery', ink: 'inkStore' })[it.key];
            const label = t(labelKey);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
                <BuildingTag label={label} idx={i} />
                <div style={{ position: 'relative' }}>
                  <PixelSprite sprite={b.sprite} palette={b.palette} scale={it.scale} />
                  {/* Weather/time tint overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: weatherTint, pointerEvents: 'none', mixBlendMode: 'multiply' }} />
                  <div style={{ position: 'absolute', inset: 0, background: timeTint, pointerEvents: 'none', mixBlendMode: 'overlay' }} />
                  {/* Lit window glow at night */}
                  {(timeOfDay === 'night' || timeOfDay === 'midnight') && (
                    <div style={{
                      position: 'absolute', inset: -8,
                      background: `radial-gradient(ellipse at center, ${getBuildingGlow(it.key)}33 0%, transparent 60%)`,
                      pointerEvents: 'none', zIndex: -1,
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function getBuildingGlow(key) {
    return ({
      cafe: '#fcd34d', study: '#a78bfa', lofi: '#ec4899', arcade: '#22d3ee',
      ramen: '#fef9c3', library: '#a78bfa', cwork: '#22d3ee', gallery: '#ec4899', ink: '#fcd34d',
    })[key] || '#a78bfa';
  }

  function BuildingTag({ label, idx }) {
    const colors = ['var(--accent)', 'var(--accent-2)', 'var(--accent-3)', 'var(--accent-4)'];
    const c = colors[idx % colors.length];
    return (
      <div className="float" style={{
        padding: '3px 8px',
        background: 'rgba(7,4,26,0.92)',
        border: `1.5px solid ${c}`,
        color: c,
        fontFamily: 'Silkscreen, monospace', fontSize: 9, letterSpacing: '0.15em',
        boxShadow: `0 0 10px ${c}66`,
        textShadow: `0 0 4px ${c}`,
        whiteSpace: 'nowrap',
        position: 'relative',
        animationDelay: `${idx * 0.18}s`,
        zIndex: 5,
      }}>
        {label}
        <span style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 2, height: 6, background: c }} />
      </div>
    );
  }

  function FarSilhouette({ width, timeOfDay, weather, direction }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const c = ref.current; if (!c) return;
      const H = 240;
      c.width = width; c.height = H;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, width, H);
      ctx.imageSmoothingEnabled = false;
      const palettes = {
        neon: { body: '#0b0524', mid: '#1a0d3d', win: ['#fcd34d', '#67e8f9', '#f0abfc', '#a78bfa'] },
        dusk: { body: '#1a0f1f', mid: '#3a1a2e', win: ['#ffd166', '#ff6b9d', '#ffb86b'] },
        rain: { body: '#050d2a', mid: '#0a1640', win: ['#00f5d4', '#ff006e', '#ffbe0b'] },
      };
      const p = palettes[direction] || palettes.neon;

      // Apply weather tint via fill operations
      let s = 33;
      const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

      // Layer 1: tallest distant buildings
      let x = 0;
      while (x < width + 20) {
        const w = 26 + Math.floor(rng() * 44);
        const h = 130 + Math.floor(rng() * 100); // bigger!
        const kind = Math.floor(rng() * 4);
        ctx.fillStyle = p.body;
        ctx.fillRect(x, H - h, w, h);
        // Tower shapes: roof variations
        if (kind === 0) {
          // antenna
          ctx.fillRect(x + w / 2 - 1, H - h - 12, 2, 12);
          ctx.fillStyle = '#fcd34d';
          ctx.fillRect(x + w / 2 - 1, H - h - 13, 2, 2);
        } else if (kind === 1) {
          // small roof box
          ctx.fillRect(x + 6, H - h - 8, w - 12, 8);
        } else if (kind === 2) {
          // pyramid roof
          for (let y = 0; y < 8; y++) {
            ctx.fillRect(x + y + 2, H - h - (8 - y), w - 2 * (y + 2), 1);
          }
        }
        // Edge highlight
        ctx.fillStyle = p.mid;
        ctx.fillRect(x, H - h, 1, h);
        ctx.fillRect(x + w - 1, H - h, 1, h);

        // Lit windows
        const lit = timeOfDay === 'day' ? 0.25 : timeOfDay === 'dusk' ? 0.55 : 0.7;
        const cols = Math.floor((w - 6) / 5);
        const rows = Math.floor((h - 12) / 7);
        for (let r = 0; r < rows; r++) {
          for (let c2 = 0; c2 < cols; c2++) {
            if (rng() < lit) {
              const col = p.win[Math.floor(rng() * p.win.length)];
              ctx.fillStyle = col;
              ctx.fillRect(x + 3 + c2 * 5, H - h + 6 + r * 7, 2, 3);
            }
          }
        }
        x += w + 1;
      }

      // Weather overlay
      const wtint = {
        clear: null,
        cloudy: 'rgba(100,100,140,0.25)',
        rain: 'rgba(20,40,120,0.35)',
        snow: 'rgba(220,230,250,0.18)',
        storm: 'rgba(10,15,60,0.45)',
      }[weather];
      if (wtint) {
        ctx.fillStyle = wtint;
        ctx.fillRect(0, 0, width, H);
      }
    }, [width, timeOfDay, weather, direction]);
    return <canvas ref={ref} style={{ position: 'absolute', left: 0, bottom: 130, width: '100%', height: 240, imageRendering: 'pixelated', opacity: 0.75 }} />;
  }

  // Middle silhouette — closer than far, behind foreground buildings
  function MidSilhouette({ width, timeOfDay, weather, direction }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const c = ref.current; if (!c) return;
      const H = 200;
      c.width = width; c.height = H;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, width, H);
      ctx.imageSmoothingEnabled = false;
      const palettes = {
        neon: { body: '#150a30', mid: '#2a1556', win: ['#fcd34d', '#67e8f9', '#f0abfc'] },
        dusk: { body: '#2a1525', mid: '#5a2540', win: ['#ffb86b', '#ff6b9d'] },
        rain: { body: '#0a1845', mid: '#1f2f70', win: ['#00f5d4', '#ff006e'] },
      };
      const p = palettes[direction] || palettes.neon;
      let s = 91;
      const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

      let x = 0;
      while (x < width + 20) {
        const w = 32 + Math.floor(rng() * 50);
        const h = 100 + Math.floor(rng() * 80);
        ctx.fillStyle = p.body;
        ctx.fillRect(x, H - h, w, h);
        // accent neon strip on top
        if (rng() < 0.3) {
          const col = p.win[Math.floor(rng() * p.win.length)];
          ctx.fillStyle = col;
          ctx.fillRect(x + 4, H - h, w - 8, 2);
        }
        // windows
        const lit = timeOfDay === 'day' ? 0.2 : 0.65;
        const cols = Math.floor((w - 6) / 6);
        const rows = Math.floor((h - 8) / 8);
        for (let r = 0; r < rows; r++) {
          for (let c2 = 0; c2 < cols; c2++) {
            if (rng() < lit) {
              const col = p.win[Math.floor(rng() * p.win.length)];
              ctx.fillStyle = col;
              ctx.fillRect(x + 3 + c2 * 6, H - h + 4 + r * 8, 3, 4);
            }
          }
        }
        x += w + 1;
      }
      const wtint = {
        clear: null, cloudy: 'rgba(110,110,150,0.2)', rain: 'rgba(20,40,140,0.3)',
        snow: 'rgba(220,230,250,0.15)', storm: 'rgba(10,15,60,0.4)',
      }[weather];
      if (wtint) { ctx.fillStyle = wtint; ctx.fillRect(0, 0, width, H); }
    }, [width, timeOfDay, weather, direction]);
    return <canvas ref={ref} style={{ position: 'absolute', left: 0, bottom: 60, width: '100%', height: 200, imageRendering: 'pixelated', opacity: 0.9 }} />;
  }

  // ============ Street ============
  function Street({ width, timeOfDay, weather }) {
    // Weather-derived sidewalk tint
    const groundTint = {
      clear: 'transparent',
      cloudy: 'rgba(80,80,120,0.2)',
      rain: 'rgba(50,80,180,0.35)',
      snow: 'rgba(220,230,250,0.25)',
      storm: 'rgba(20,30,80,0.45)',
    }[weather] || 'transparent';

    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 215, height: 110, overflow: 'hidden', pointerEvents: 'none', zIndex: 6 }}>
        {/* Sidewalk neon edge line */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: 'var(--panel-stroke-strong)', boxShadow: 'var(--neon-glow)' }} />

        {/* Sidewalk surface — tiled pattern with depth */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 2, height: 50,
          background: `
            linear-gradient(180deg, rgba(7,4,26,0.4) 0%, rgba(20,12,45,0.7) 100%),
            repeating-linear-gradient(90deg, rgba(167,139,250,0.08) 0 32px, transparent 32px 33px),
            repeating-linear-gradient(180deg, rgba(167,139,250,0.05) 0 8px, transparent 8px 9px)
          `,
        }} />

        {/* Neon street markings — sub-tile glow */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 50, height: 4,
          background: 'linear-gradient(90deg, var(--accent-3), var(--accent), var(--accent-2), var(--accent-3))',
          opacity: 0.25, filter: 'blur(1px)',
        }} />

        {/* Road */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 54, bottom: 0,
          background: 'linear-gradient(180deg, #0a0820 0%, #050214 100%)',
          borderTop: '1px solid rgba(167,139,250,0.3)',
        }} />
        {/* Center dashed line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 78, height: 2,
          background: 'repeating-linear-gradient(90deg, var(--accent-4) 0 18px, transparent 18px 36px)',
          opacity: 0.6,
          boxShadow: '0 0 4px var(--accent-4)',
        }} />
        {/* Curb edge below */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: 'var(--panel-stroke)' }} />

        {/* Weather tint overlay */}
        <div style={{ position: 'absolute', inset: 0, background: groundTint, pointerEvents: 'none' }} />

        {/* Manhole covers / decorative */}
        {[12, 38, 64, 88].map((x, i) => (
          <div key={'mh' + i} style={{
            position: 'absolute', left: `${x}%`, top: 88, width: 22, height: 4,
            background: 'rgba(167,139,250,0.2)', border: '1px solid var(--panel-stroke)',
            borderRadius: 1,
          }} />
        ))}

        {/* Lamp posts */}
        {[...Array(8)].map((_, i) => (
          <div key={'l' + i} style={{ position: 'absolute', left: `${i * 13 + 4}%`, bottom: 55 }}>
            <PixelSprite sprite={LAMP.sprite} palette={LAMP.palette} scale={2}
              glow={(timeOfDay === 'night' || timeOfDay === 'midnight' || timeOfDay === 'dusk') ? 'rgba(252,211,77,0.7)' : 'rgba(252,211,77,0.2)'} />
          </div>
        ))}

        {/* Trees & benches */}
        {[...Array(5)].map((_, i) => (
          <div key={'t' + i} style={{ position: 'absolute', left: `${i * 21 + 9}%`, bottom: 60 }}>
            <PixelSprite sprite={TREE.sprite} palette={TREE.palette} scale={2} />
          </div>
        ))}
        {[...Array(3)].map((_, i) => (
          <div key={'b' + i} style={{ position: 'absolute', left: `${i * 32 + 16}%`, bottom: 55 }}>
            <PixelSprite sprite={BENCH.sprite} palette={BENCH.palette} scale={2} />
          </div>
        ))}

        {/* Walkers */}
        <WalkingCitizens width={width} />

        {/* Cats */}
        <WanderingCats />

        {/* Cars */}
        <DrivingCars width={width} />
      </div>
    );
  }

  // Walking citizens with name + status tag
  function WalkingCitizens({ width }) {
    const citizens = React.useMemo(() => [
      { name: 'Yuki',  walker: WALKERS[0], speed: 0.05, x: 5,  dir: 1,  status: 'STUDY HALL' },
      { name: 'Aria',  walker: WALKERS[2], speed: 0.04, x: 22, dir: 1,  status: '寫作中' },
      { name: 'Kai',   walker: WALKERS[5], speed: 0.06, x: 38, dir: 1,  status: '番茄 #5' },
      { name: 'Doc',   walker: WALKERS[1], speed: 0.04, x: 52, dir: -1, status: '研究' },
      { name: 'Bear',  walker: WALKERS[4], speed: 0.05, x: 66, dir: 1,  status: '深度工作' },
      { name: 'Milo',  walker: WALKERS[6], speed: 0.05, x: 80, dir: -1, status: 'LOFI BAR' },
      { name: 'Nova',  walker: WALKERS[7], speed: 0.05, x: 93, dir: 1,  status: '配對中' },
    ], []);
    const [pos, setPos] = React.useState(citizens.map((c) => c.x));
    React.useEffect(() => {
      let raf;
      const tick = () => {
        setPos((ps) => ps.map((p, i) => {
          let np = p + citizens[i].speed * citizens[i].dir;
          if (np > 102) np = -4;
          if (np < -6) np = 102;
          return np;
        }));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [citizens]);
    return (
      <>
        {citizens.map((c, i) => (
          <div key={i} style={{ position: 'absolute', left: `${pos[i]}%`, bottom: 56, transform: c.dir < 0 ? 'scaleX(-1)' : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <div style={{
                fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink)',
                background: 'rgba(7,4,26,0.85)', padding: '1px 4px',
                border: '1px solid var(--panel-stroke)',
                whiteSpace: 'nowrap', letterSpacing: '0.05em',
                transform: c.dir < 0 ? 'scaleX(-1)' : 'none',
                marginBottom: 1,
              }}>
                <span>{c.name}</span>
                {c.status && <span style={{ color: 'var(--accent-3)', marginLeft: 4 }}>· {c.status}</span>}
              </div>
              <AnimatedSprite frames={c.walker.frames} palette={c.walker.palette} scale={2.4} fps={3} />
            </div>
          </div>
        ))}
      </>
    );
  }

  function WanderingCats() {
    const cats = [
      { name: '小黑', status: '巡邏', x: 30, v: 0.04, palette: { B: '#0a0524', W: '#fcd34d' } },
      { name: '奶茶', status: '覓食', x: 70, v: 0.03, palette: { B: '#fef9c3', W: '#92400e' } },
    ];
    const [pos, setPos] = React.useState(cats.map((c) => c.x));
    React.useEffect(() => {
      let raf;
      const tick = () => {
        setPos((ps) => ps.map((p, i) => (p + cats[i].v) % 100));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);
    return (
      <>
        {cats.map((c, i) => (
          <div key={i} style={{ position: 'absolute', left: `${pos[i]}%`, bottom: 55, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <div style={{
              fontFamily: 'Silkscreen, monospace', fontSize: 7, color: 'var(--accent-2)',
              background: 'rgba(7,4,26,0.85)', padding: '0 3px', border: '1px solid var(--panel-stroke)',
              whiteSpace: 'nowrap',
            }}>🐾 {c.name} · {c.status}</div>
            <AnimatedSprite frames={CAT_WALK.frames} palette={c.palette} scale={2} fps={3} />
          </div>
        ))}
      </>
    );
  }

  function DrivingCars({ width }) {
    const cars = [
      { name: 'Uber-Mira',  color: '#22d3ee', speed: 0.22, x: 10, status: '通勤' },
      { name: 'Bolt-Ren',   color: '#ec4899', speed: 0.18, x: 50, status: '夜班' },
      { name: 'GoGo-Lin',   color: '#fbbf24', speed: 0.16, x: 80, status: '外送' },
    ];
    const [pos, setPos] = React.useState(cars.map((c) => c.x));
    React.useEffect(() => {
      let raf;
      const tick = () => {
        setPos((ps) => ps.map((p, i) => {
          let np = p + cars[i].speed;
          if (np > 115) np = -10;
          return np;
        }));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);
    return (
      <>
        {cars.map((c, i) => (
          <div key={i} style={{ position: 'absolute', left: `${pos[i]}%`, bottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <div style={{
              fontFamily: 'Silkscreen, monospace', fontSize: 7, color: c.color,
              background: 'rgba(7,4,26,0.85)', padding: '0 3px', border: `1px solid ${c.color}55`,
              whiteSpace: 'nowrap', textShadow: `0 0 3px ${c.color}`,
            }}>{c.name} · {c.status}</div>
            <CarSprite color={c.color} kind={i} />
          </div>
        ))}
      </>
    );
  }

  function CarSprite({ color, kind = 0 }) {
    const sprites = [
      // sedan
      `
.....XXXXXX....
....XXXXXXXX...
...XXWWWXWWXX..
..XXXXXXXXXXX..
.KK.KK....KK.K.
`,
      // truck/box
      `
..XXXXXXXXXX...
..XXXXXXXXXX...
..XXXWWWWWWX...
..XXXWWWWWWX...
..XXXXXXXXXX...
.KK..KK..KK.K..
`,
      // scooter / kei car
      `
...XXXXXXX....
..XXXWWWXX....
..XXXXXXXX....
..KK....KK....
`,
    ];
    return (
      <PixelSprite sprite={sprites[kind % 3]} palette={{ X: color, W: '#fcd34d', K: '#0a0524' }} scale={2.5} glow={`${color}aa`} />
    );
  }

  // ============ News Ticker ============
  function Ticker({ t, lang }) {
    const items = {
      zh: [
        '🍅 Kai 完成今日第 13 顆番茄 · 領先全鎮',
        '🎵 LOFI BAR 新主題曲：midnight city',
        '✦ 12 位鎮民正在 STUDY HALL 深度工作',
        '⚡ 天氣將轉為小雨 · 在 6 分鐘後',
        '💰 你獲得 +25 T 幣 · 連續登入 7 天',
        '🎯 新成就解鎖：深夜行者',
      ],
      en: [
        '🍅 Kai finished pomodoro #13 — leading the town',
        '🎵 LOFI BAR new track: midnight city',
        '✦ 12 citizens are deep-working in STUDY HALL',
        '⚡ Weather turning to light rain in 6 minutes',
        '💰 You earned +25 T-coin · 7-day streak',
        '🎯 New achievement unlocked: Night Owl',
      ],
      ko: [
        '🍅 Kai · 오늘의 13번째 뽀모도로 완료',
        '🎵 LOFI BAR 신곡: midnight city',
        '✦ 12 명이 STUDY HALL에서 집중 중',
        '⚡ 6 분 후 약한 비가 시작됩니다',
        '💰 +25 T-coin · 7일 연속 출석',
        '🎯 새로운 업적: 야행성',
      ],
      ja: [
        '🍅 Kai が今日 13 個目のポモドーロを完了',
        '🎵 LOFI BAR の新曲：midnight city',
        '✦ 12 名が STUDY HALL で深い集中中',
        '⚡ 6 分後に小雨に変わります',
        '💰 T コイン +25 · 7 日連続ログイン',
        '🎯 新実績解放：夜行性',
      ],
    };
    const list = items[lang] || items.en;
    return (
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 188, height: 26,
        background: 'rgba(7,4,26,0.9)', borderTop: '1px solid var(--panel-stroke)', borderBottom: '1px solid var(--panel-stroke)',
        overflow: 'hidden', display: 'flex', alignItems: 'center', zIndex: 9,
      }}>
        <div style={{ padding: '0 12px', background: 'var(--accent)', color: '#0a0524', fontFamily: 'Silkscreen, monospace', fontSize: 10, letterSpacing: '0.2em', height: '100%', display: 'flex', alignItems: 'center' }}>
          📡 LIVE
        </div>
        <div style={{
          display: 'inline-flex', whiteSpace: 'nowrap', gap: 60,
          animation: 'drift 75s linear infinite',
          fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em',
          marginLeft: 12,
        }}>
          {[...list, ...list, ...list].map((s, i) => (<span key={i}>{s}</span>))}
        </div>
      </div>
    );
  }

  // ============ Bottom HUD ============
  function BottomHUD({ t, timeOfDay, weather, onSolo, onBuddy, setTimeOfDay, setWeather }) {
    return (
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 180,
        background: 'linear-gradient(180deg, transparent 0%, rgba(7,4,26,0.92) 30%, rgba(7,4,26,1) 100%)',
        borderTop: '1px solid var(--panel-stroke)',
        display: 'grid', gridTemplateColumns: '1.05fr 1fr 1fr', gap: 12, padding: 12,
        zIndex: 12,
      }}>
        <FocusTimer t={t} timeOfDay={timeOfDay} weather={weather} setTimeOfDay={setTimeOfDay} setWeather={setWeather} />
        <MatchPanel t={t} onSolo={onSolo} onBuddy={onBuddy} />
        <MusicPlayer t={t} />
      </div>
    );
  }

  function FocusTimer({ t, timeOfDay, weather, setTimeOfDay, setWeather }) {
    const [seconds, setSeconds] = React.useState(25 * 60);
    const [running, setRunning] = React.useState(true);
    const [mode, setMode] = React.useState('focus');
    const total = mode === 'focus' ? 25 * 60 : 5 * 60;

    React.useEffect(() => {
      if (!running) return;
      const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
      return () => clearInterval(id);
    }, [running]);

    React.useEffect(() => {
      if (seconds === 0) {
        const nm = mode === 'focus' ? 'break' : 'focus';
        setMode(nm);
        setSeconds(nm === 'focus' ? 25 * 60 : 5 * 60);
      }
    }, [seconds, mode]);

    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    const pct = (1 - seconds / total) * 100;

    return (
      <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em' }}>
            <PixelSprite sprite={TOMATO_SPRITE} palette={TOMATO_PAL} scale={1.4} />
            <span>{mode === 'focus' ? 'FOCUS · #5' : 'BREAK'}</span>
          </div>
          <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)' }}>4 / 8 🍅</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '4px 0' }}>
          <PixelDigits text={`${mins}:${secs}`} scale={4} color="var(--ink)" glow="var(--accent)" />
        </div>

        <div style={{ height: 8, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--panel-stroke)', position: 'relative' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', boxShadow: 'var(--neon-glow)', transition: 'width 0.3s linear' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
          <button className="pixel-btn" style={{ padding: '5px 8px', fontSize: 11 }} onClick={() => { setSeconds(total); setRunning(false); }}>↺</button>
          <button className="pixel-btn primary" style={{ padding: '5px 14px', fontSize: 11, minWidth: 78 }} onClick={() => setRunning((r) => !r)}>
            {running ? '⏸ ' + t('pause') : '▶ ' + t('start')}
          </button>
          <button className="pixel-btn" style={{ padding: '5px 8px', fontSize: 11 }} onClick={() => setSeconds(0)}>⏭</button>
          <div style={{ width: 1, height: 18, background: 'var(--panel-stroke)', margin: '0 2px' }} />
          {/* Weather cycle button */}
          <button className="pixel-btn" style={{ padding: '4px 6px', fontSize: 12 }} title="time" onClick={() => {
            setTimeOfDay && setTimeOfDay((tm) => TIMES[(TIMES.indexOf(tm) + 1) % TIMES.length]);
          }}>
            {timeOfDay === 'night' || timeOfDay === 'midnight' ? '🌙' : timeOfDay === 'dawn' ? '🌅' : timeOfDay === 'dusk' ? '🌆' : '☀'}
          </button>
          <button className="pixel-btn" style={{ padding: '4px 6px', fontSize: 12 }} title="weather" onClick={() => {
            setWeather && setWeather((w) => WEATHERS[(WEATHERS.indexOf(w) + 1) % WEATHERS.length]);
          }}>
            {WEATHER_ICON[weather]}
          </button>
        </div>
      </div>
    );
  }

  // 5x7 digit font
  function PixelDigits({ text, scale = 4, color = '#fff', glow = null }) {
    const DIGITS = {
      '0': ['111','101','101','101','101','101','111'],
      '1': ['010','110','010','010','010','010','111'],
      '2': ['110','001','001','010','100','100','111'],
      '3': ['110','001','001','110','001','001','110'],
      '4': ['101','101','101','111','001','001','001'],
      '5': ['111','100','100','110','001','001','110'],
      '6': ['111','100','100','110','101','101','111'],
      '7': ['111','001','001','010','010','100','100'],
      '8': ['111','101','101','111','101','101','111'],
      '9': ['111','101','101','111','001','001','111'],
      ':': ['000','010','010','000','010','010','000'],
    };
    const glyphs = text.split('').map((c) => DIGITS[c] || DIGITS['0']);
    const rows = [];
    for (let r = 0; r < 7; r++) {
      let line = '';
      glyphs.forEach((g, i) => {
        line += g[r].replaceAll('1', 'B').replaceAll('0', '.');
        if (i < glyphs.length - 1) line += '.';
      });
      rows.push(line);
    }
    return <PixelSprite sprite={rows.join('\n')} palette={{ B: color }} scale={scale} glow={glow} />;
  }

  // === Find Buddy / Solo (the panel replacing the leaderboard slot) ===
  function MatchPanel({ t, onSolo, onBuddy }) {
    const [tag, setTag] = React.useState('all');
    const tags = [
      { k: 'code', zh: '程式', en: 'Code', ko: '코딩', ja: 'コード' },
      { k: 'write', zh: '寫作', en: 'Write', ko: '글쓰기', ja: '執筆' },
      { k: 'study', zh: '學習', en: 'Study', ko: '학습', ja: '学習' },
      { k: 'design', zh: '設計', en: 'Design', ko: '디자인', ja: 'デザイン' },
      { k: 'all', zh: '任何', en: 'Any', ko: '아무거나', ja: '何でも' },
    ];

    return (
      <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent-2)', letterSpacing: '0.2em' }}>
            <span style={{ width: 8, height: 8, background: 'var(--accent-2)', boxShadow: 'var(--neon-glow-pink)' }} className="blink" />
            <span>{t('findBuddy').toUpperCase()}</span>
          </div>
          <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.1em' }}>~8s avg wait</span>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '4px 0' }}>
          <PixelSprite sprite={AVATARS[0].sprite} palette={AVATARS[0].palette} scale={2.6} glow="var(--accent)" />
          <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 18, color: 'var(--accent-2)' }}>+</div>
          <div style={{
            width: 40, height: 40, border: '2px dashed var(--accent-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Silkscreen, monospace', fontSize: 22, color: 'var(--accent-2)',
          }} className="shimmer">?</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--ink)', letterSpacing: '0.1em' }}>尋找做類似事情的鎮民</div>
            <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-dim)', letterSpacing: '0.15em' }}>3 候選人 · 平均專注 142 min</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tags.map((tg) => (
            <button key={tg.k}
              onClick={() => setTag(tg.k)}
              style={{
                padding: '3px 7px', fontSize: 9,
                background: tag === tg.k ? 'var(--accent)' : 'transparent',
                color: tag === tg.k ? '#0a0524' : 'var(--ink-mute)',
                border: `1px solid ${tag === tg.k ? 'var(--accent)' : 'var(--panel-stroke)'}`,
                fontFamily: 'Silkscreen, monospace', letterSpacing: '0.1em',
                cursor: 'pointer',
              }}>
              #{tg.zh}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button className="pixel-btn primary" onClick={onBuddy} style={{ padding: '10px 8px', fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span>✦ {t('findBuddy')}</span>
            <span style={{ fontSize: 8, opacity: 0.7 }}>一起專注</span>
          </button>
          <button className="pixel-btn" onClick={onSolo} style={{ padding: '10px 8px', fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, borderColor: 'var(--accent-3)', color: 'var(--accent-3)' }}>
            <span>{t('soloFocus')}</span>
            <span style={{ fontSize: 8, opacity: 0.7 }}>進入專注室</span>
          </button>
        </div>
      </div>
    );
  }

  function MusicPlayer({ t }) {
    const [playing, setPlaying] = React.useState(true);
    const [pos, setPos] = React.useState(60);
    React.useEffect(() => {
      if (!playing) return;
      const id = setInterval(() => setPos((p) => (p + 0.3) % 100), 300);
      return () => clearInterval(id);
    }, [playing]);
    return (
      <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent-3)', letterSpacing: '0.2em' }}>
            <PixelSprite sprite={NOTE} palette={NOTE_PAL} scale={1.4} />
            <span>lofi · LIVE</span>
          </div>
          <EQViz playing={playing} />
        </div>
        <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 12, color: 'var(--ink)' }}>midnight city · lofi remix</div>
        <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>♪ 1/5 · lofi radio · @ neko ramen</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
          <button className="pixel-btn" style={{ padding: '4px 6px', fontSize: 10 }}>◀◀</button>
          <button className="pixel-btn primary" style={{ padding: '4px 8px', fontSize: 10 }} onClick={() => setPlaying((p) => !p)}>{playing ? '⏸' : '▶'}</button>
          <button className="pixel-btn" style={{ padding: '4px 6px', fontSize: 10 }}>▶▶</button>
          <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--panel-stroke)', position: 'relative' }}>
            <div style={{ width: `${pos}%`, height: '100%', background: 'var(--accent-3)', boxShadow: 'var(--neon-glow-cyan)' }} />
          </div>
          <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)' }}>{String(Math.floor(pos*0.024)).padStart(2,'0')}:{String(Math.floor(pos*1.5)%60).padStart(2,'0')}</span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {['lofi', 'classical', 'rain', 'cafe', 'forest'].map((g) => (
            <span key={g} style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: g === 'lofi' ? 'var(--accent-3)' : 'var(--ink-dim)', padding: '1px 5px', border: '1px solid var(--panel-stroke)', cursor: 'pointer', letterSpacing: '0.1em' }}>#{g}</span>
          ))}
        </div>
      </div>
    );
  }

  function EQViz({ playing }) {
    const [bars, setBars] = React.useState([3, 6, 4, 8, 5, 7, 3, 6]);
    React.useEffect(() => {
      if (!playing) return;
      const id = setInterval(() => setBars(bars.map(() => 2 + Math.floor(Math.random() * 8))), 150);
      return () => clearInterval(id);
    }, [playing, bars.length]);
    return (
      <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 14 }}>
        {bars.map((b, i) => <div key={i} style={{ width: 2, height: b, background: 'var(--accent-3)', boxShadow: 'var(--neon-glow-cyan)' }} />)}
      </div>
    );
  }

  // ============ Modals ============
  function Modal({ title, onClose, children, width = 640, t }) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,4,26,0.88)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
        <div className="pixel-panel" style={{ width, maxHeight: '82%', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <CornerDeco />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--panel-stroke)', paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: 'var(--accent)', boxShadow: 'var(--neon-glow)' }} />
              <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 13, color: 'var(--ink)', letterSpacing: '0.15em' }}>{title}</span>
            </div>
            <button onClick={onClose} className="pixel-btn" style={{ padding: '4px 10px', fontSize: 10 }}>✕ {t ? t('close') : 'CLOSE'}</button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  function ShopModal({ t, onClose }) {
    const items = [
      { icon: <PixelSprite sprite={TOMATO_SPRITE} palette={TOMATO_PAL} scale={3} />, name: '黃金番茄', desc: '+50% 完成獎勵', price: 120 },
      { icon: <PixelSprite sprite={COFFEE} palette={COFFEE_PAL} scale={3} />, name: '濃縮咖啡', desc: '下一輪 +10 min', price: 60 },
      { icon: <PixelSprite sprite={NOTE} palette={NOTE_PAL} scale={3} />, name: '專屬 BGM', desc: '解鎖 lofi 曲庫', price: 200 },
      { icon: <PixelSprite sprite={CAT_WALK.frames[0]} palette={CAT_WALK.palette} scale={3} />, name: '陪伴貓', desc: '可愛 +5 心情', price: 300 },
      { icon: '🎩', name: '紳士禮帽', desc: '角色裝飾', price: 80 },
      { icon: '🧣', name: '冬日圍巾', desc: '角色裝飾', price: 80 },
      { icon: '🌸', name: '櫻花樹', desc: '小鎮裝飾', price: 250 },
      { icon: '🏠', name: '專屬小屋', desc: '可邀好友', price: 500 },
    ];
    return (
      <Modal t={t} title={t('shopTitle').toUpperCase()} onClose={onClose} width={720}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <TCoinBadge amount={1247} label={t('tcoin').toUpperCase()} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Tag2 active>{t('shopTitle').slice(0, 2)}</Tag2><Tag2>裝飾</Tag2><Tag2>音樂</Tag2><Tag2>夥伴</Tag2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {items.map((it, i) => (
            <div key={i} style={{ border: '1px solid var(--panel-stroke)', padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.3)' }}>
              <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{it.icon}</div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--ink)' }}>{it.name}</div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', textAlign: 'center' }}>{it.desc}</div>
              <button className="pixel-btn" style={{ padding: '3px 8px', fontSize: 10, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CoinIcon scale={1.5} /> {it.price}
              </button>
            </div>
          ))}
        </div>
      </Modal>
    );
  }

  function Tag2({ children, active }) {
    return (
      <button style={{
        fontFamily: 'Silkscreen, monospace', fontSize: 10, padding: '4px 10px',
        background: active ? 'var(--accent)' : 'transparent', color: active ? '#0a0524' : 'var(--ink-mute)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--panel-stroke)'}`, cursor: 'pointer', letterSpacing: '0.1em',
      }}>{children}</button>
    );
  }

  function AchievementsModal({ t, onClose }) {
    const achievements = [
      { name: '第一顆番茄', desc: '完成第 1 個番茄鐘', unlocked: true, icon: '🍅' },
      { name: '深夜行者', desc: '凌晨 1 點後完成 5 顆', unlocked: true, icon: '🌙' },
      { name: '小鎮新人', desc: '建立角色', unlocked: true, icon: '✦' },
      { name: '陪伴者', desc: '與他人共同專注 10 次', unlocked: true, icon: '👥' },
      { name: '咖啡因依賴', desc: '連續 7 天到 CAFE PIXEL', unlocked: false, icon: '☕' },
      { name: '百日不墜', desc: '連續 100 天專注', unlocked: false, icon: '🏆' },
      { name: 'lofi 鎮民', desc: '聽完 50 首', unlocked: false, icon: '🎵' },
      { name: '深度工作者', desc: '單日 12 顆番茄', unlocked: false, icon: '⚡' },
    ];
    return (
      <Modal t={t} title={t('achievementsTitle').toUpperCase()} onClose={onClose} width={680}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(167,139,250,0.08)', border: '1px solid var(--panel-stroke)' }}>
          <div>
            <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--ink-mute)' }}>本週進度</div>
            <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 16, color: 'var(--accent)' }}>4 / 24</div>
          </div>
          <div style={{ width: 240, height: 10, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--panel-stroke)' }}>
            <div style={{ width: '16%', height: '100%', background: 'var(--accent)', boxShadow: 'var(--neon-glow)' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {achievements.map((a, i) => (
            <div key={i} style={{
              padding: 10, border: `1px solid ${a.unlocked ? 'var(--accent)' : 'var(--panel-stroke)'}`,
              opacity: a.unlocked ? 1 : 0.4, background: 'rgba(0,0,0,0.3)',
              boxShadow: a.unlocked ? 'var(--neon-glow)' : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <div style={{ fontSize: 24, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--ink)' }}>{a.name}</div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)', textAlign: 'center' }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </Modal>
    );
  }

  function FriendsModal({ t, onClose }) {
    const friends = [
      { name: 'Kai',  avatar: AVATARS[3],  status: 'STUDY HALL · 已專注 92 分', online: true, pomos: 13 },
      { name: 'Aria', avatar: AVATARS[2],  status: 'LOFI BAR · 寫作中', online: true, pomos: 9 },
      { name: 'Bear', avatar: AVATARS[7],  status: 'CAFE PIXEL · 休息', online: true, pomos: 11 },
      { name: 'Doc',  avatar: AVATARS[11], status: '離線 · 2 小時前', online: false, pomos: 0 },
      { name: 'Milo', avatar: AVATARS[14], status: 'PIXEL ARCADE · 玩遊戲', online: true, pomos: 4 },
      { name: 'Nova', avatar: AVATARS[18], status: '離線 · 昨天', online: false, pomos: 0 },
    ];
    return (
      <Modal t={t} title={t('friendsTitle').toUpperCase()} onClose={onClose} width={580}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {friends.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-stroke)' }}>
              <div style={{ position: 'relative' }}>
                <PixelSprite sprite={f.avatar.sprite} palette={f.avatar.palette} scale={3} />
                <div style={{ position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, background: f.online ? '#06d6a0' : '#6b5e9a', border: '2px solid var(--bg-0)' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 13, color: 'var(--ink)' }}>{f.name}</div>
                <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 10, color: f.online ? 'var(--accent-3)' : 'var(--ink-dim)' }}>{f.status}</div>
              </div>
              {f.online && <button className="pixel-btn primary" style={{ padding: '6px 12px', fontSize: 10 }}>✦ 一起專注</button>}
              <button className="pixel-btn" style={{ padding: '6px 10px', fontSize: 10 }}>♪ 訊息</button>
            </div>
          ))}
        </div>
        <button className="pixel-btn" style={{ alignSelf: 'center', padding: '8px 20px' }}>+ 邀請好友</button>
      </Modal>
    );
  }

  // ============ Profile Modal (rich stats + notes + friends + logout + feedback) ============
  function ProfileModal({ t, profile, onClose, onLogout, onOpenSection }) {
    const [tab, setTab] = React.useState('stats');
    const avatar = profile?.avatar || AVATARS[0];

    return (
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,4,26,0.88)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
        <div className="pixel-panel" style={{
          width: 820, maxWidth: '95%', maxHeight: '90%',
          padding: 0, display: 'flex', overflow: 'hidden', position: 'relative',
        }} onClick={(e) => e.stopPropagation()}>
          <CornerDeco />

          {/* Left rail: profile card + nav */}
          <div style={{
            width: 230, background: 'linear-gradient(180deg, rgba(183,148,246,0.1), rgba(7,4,26,0.5))',
            borderRight: '1px solid var(--panel-stroke)', padding: 16,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingBottom: 14, borderBottom: '1px solid var(--panel-stroke)' }}>
              <div style={{
                width: 80, height: 80, background: 'rgba(0,0,0,0.5)',
                border: '2px solid var(--accent)', boxShadow: 'var(--neon-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              }}>
                <PixelSprite sprite={avatar.sprite} palette={avatar.palette} scale={4} />
                <span style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, background: '#6ee7b7', border: '2px solid var(--bg-0)' }} />
              </div>
              <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 16, color: 'var(--ink)', textShadow: 'var(--neon-glow)' }}>{profile?.name || 'Yuki'}</div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--accent-3)', letterSpacing: '0.2em' }}>{avatar.name} · LV.{profile?.level || 4}</div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-dim)', letterSpacing: '0.15em' }}>{profile?.age || 27} y/o · TW-TPE</div>
              {/* XP bar */}
              <div style={{ width: '100%', marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>
                  <span>XP</span><span>1,247 / 2,000</span>
                </div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--panel-stroke)' }}>
                  <div style={{ width: '62%', height: '100%', background: 'var(--accent)', boxShadow: 'var(--neon-glow)' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { k: 'stats',    label: t('myStats'),         emoji: '📊' },
                { k: 'wallet',   label: 'T 幣錢包',           emoji: '💰' },
                { k: 'notes',    label: t('myNotesArchive'),  emoji: '✎' },
                { k: 'friends-tab', label: t('myFriends'),    emoji: '👥' },
                { k: 'settings', label: t('settings'),        emoji: '⚙' },
                { k: 'feedback', label: t('feedback'),        emoji: '💬' },
                { k: 'support',  label: t('support'),         emoji: '?' },
              ].map((it) => (
                <button key={it.k} onClick={() => {
                  if (it.k === 'feedback') { onOpenSection('feedback'); return; }
                  if (it.k === 'support')  { onOpenSection('support'); return; }
                  setTab(it.k);
                }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  background: tab === it.k ? 'var(--accent)' : 'transparent',
                  color: tab === it.k ? '#0a0524' : 'var(--ink-mute)',
                  border: `1px solid ${tab === it.k ? 'var(--accent)' : 'transparent'}`,
                  fontFamily: 'Silkscreen, "Noto Sans TC", monospace',
                  fontSize: 11, letterSpacing: '0.1em',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 14, width: 16, textAlign: 'center' }}>{it.emoji}</span>
                  <span style={{ flex: 1 }}>{it.label}</span>
                  {tab === it.k && <span>▶</span>}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={onLogout} className="pixel-btn" style={{
                padding: '8px 10px', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                borderColor: 'var(--accent-2)', color: 'var(--accent-2)',
              }}>
                <span>⏻</span><span>{t('logout')}</span>
              </button>
            </div>
          </div>

          {/* Right content */}
          <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--panel-stroke)', paddingBottom: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: 'var(--accent)', boxShadow: 'var(--neon-glow)' }} />
                <span style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 14, color: 'var(--ink)', letterSpacing: '0.15em' }}>
                  {tab === 'stats' ? t('myStats') : tab === 'wallet' ? 'T 幣錢包 · WALLET' : tab === 'notes' ? t('myNotesArchive') : tab === 'friends-tab' ? t('myFriends') : t('settings')}
                </span>
              </div>
              <button onClick={onClose} className="pixel-btn" style={{ padding: '4px 10px', fontSize: 10 }}>✕ {t('close')}</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
              {tab === 'stats' && <StatsView />}
              {tab === 'wallet' && <WalletView />}
              {tab === 'notes' && <NotesArchiveView />}
              {tab === 'friends-tab' && <FriendsView />}
              {tab === 'settings' && <SettingsView t={t} profile={profile} />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function StatsView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Top KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <StatCard icon={<PixelSprite sprite={TOMATO_SPRITE} palette={TOMATO_PAL} scale={2.2} />} value="247" label="總番茄" color="var(--accent)" />
          <StatCard icon="⏱" value="103h" label="累計專注" color="var(--accent-2)" />
          <StatCard icon="🔥" value="22 天" label="連續打卡" color="var(--accent-3)" />
          <StatCard icon="🏆" value="#7" label="本週排名" color="var(--accent-4)" />
        </div>

        {/* 7-day heatmap */}
        <div className="pixel-panel" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em' }}>● 7-DAY FOCUS</span>
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)' }}>本週共 18.2 h</span>
          </div>
          <Heatmap />
        </div>

        {/* Recent achievements */}
        <div className="pixel-panel" style={{ padding: 14 }}>
          <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent-3)', letterSpacing: '0.2em', marginBottom: 10 }}>
            ● 最近成就
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { i: '🍅', t: '第一顆番茄' },
              { i: '🌙', t: '深夜行者' },
              { i: '👥', t: '陪伴者' },
              { i: '✦', t: '小鎮新人' },
            ].map((a, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', border: '1px solid var(--accent)',
                background: 'rgba(183,148,246,0.1)',
                fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--ink)',
                boxShadow: 'var(--neon-glow)',
              }}>
                <span style={{ fontSize: 14 }}>{a.i}</span>
                <span>{a.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Focus distribution */}
        <div className="pixel-panel" style={{ padding: 14 }}>
          <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent-2)', letterSpacing: '0.2em', marginBottom: 10 }}>
            ● 標籤分布
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { tag: '寫程式', pct: 45, color: 'var(--accent)' },
              { tag: '寫作', pct: 25, color: 'var(--accent-2)' },
              { tag: '研究 / 閱讀', pct: 18, color: 'var(--accent-3)' },
              { tag: '其他', pct: 12, color: 'var(--accent-4)' },
            ].map((b) => (
              <div key={b.tag} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--ink)', width: 100 }}>{b.tag}</span>
                <div style={{ flex: 1, height: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--panel-stroke)' }}>
                  <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, boxShadow: `0 0 6px ${b.color}` }} />
                </div>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: b.color, width: 36, textAlign: 'right' }}>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function WalletView() {
    const PACKS = [
      { coins: 100,   price: 30,   bonus: 0,   tag: null },
      { coins: 500,   price: 140,  bonus: 50,  tag: '熱門' },
      { coins: 1200,  price: 320,  bonus: 200, tag: '划算' },
      { coins: 3000,  price: 720,  bonus: 600, tag: 'BEST' },
    ];
    const [selectedPack, setSelectedPack] = React.useState(1);
    const txns = [
      { date: '05-16 21:47', type: 'earn', amt: +25, label: '完成 🍅 #5 連續番茄' },
      { date: '05-16 19:12', type: 'spend', amt: -60, label: '購買 濃縮咖啡 ×1' },
      { date: '05-16 14:08', type: 'earn', amt: +5, label: '送出意見反饋 +5' },
      { date: '05-15 23:00', type: 'topup', amt: +500, label: '儲值 NT$140 · 含 50 贈送' },
      { date: '05-15 09:30', type: 'earn', amt: +10, label: '連續登入 7 天' },
      { date: '05-14 22:18', type: 'spend', amt: -200, label: '解鎖 lofi 曲庫' },
      { date: '05-14 12:05', type: 'earn', amt: +25, label: '與 Aria 一起專注 25 min' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Balance card */}
        <div style={{
          padding: 16,
          background: 'linear-gradient(135deg, rgba(252,211,77,0.18), rgba(236,72,153,0.1) 60%, rgba(34,211,238,0.1))',
          border: '2px solid var(--accent-4)',
          boxShadow: '0 0 18px rgba(252,211,77,0.25), inset 0 0 18px rgba(252,211,77,0.08)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: `${i * 12 + 4}%`, top: `${(i * 17) % 60}px`, animation: `coin-fall ${3 + i * 0.3}s linear infinite`, animationDelay: `-${i * 0.4}s` }}>
                <CoinIcon scale={1.5} />
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <CoinIcon scale={5} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.3em' }}>BALANCE</span>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 32, color: 'var(--accent-4)', textShadow: '0 0 12px var(--accent-4)', lineHeight: 1 }}>1,247</span>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.2em' }}>T COIN · LBT</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: '#6ee7b7', letterSpacing: '0.2em' }}>+125 本週</div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: '#f87171', letterSpacing: '0.2em' }}>−260 本週</div>
              <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)' }}>淨增 −135</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <button className="pixel-btn primary" style={{ padding: '10px 6px', fontSize: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 16 }}>＋</span><span>儲值</span>
          </button>
          <button className="pixel-btn" style={{ padding: '10px 6px', fontSize: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 16 }}>↗</span><span>送禮</span>
          </button>
          <button className="pixel-btn" style={{ padding: '10px 6px', fontSize: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 16 }}>📜</span><span>兌換碼</span>
          </button>
        </div>

        <div className="pixel-panel" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent-4)', letterSpacing: '0.2em' }}>● 儲值方案 · TOP-UP</div>
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.15em' }}>TWD · 信用卡 / Apple / Google</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {PACKS.map((p, i) => (
              <button key={i} onClick={() => setSelectedPack(i)} style={{
                padding: 12,
                background: selectedPack === i ? 'rgba(252,211,77,0.12)' : 'rgba(0,0,0,0.3)',
                border: `1.5px solid ${selectedPack === i ? 'var(--accent-4)' : 'var(--panel-stroke)'}`,
                boxShadow: selectedPack === i ? '0 0 12px rgba(252,211,77,0.4)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                cursor: 'pointer', position: 'relative',
                transition: 'all 0.12s steps(2)',
              }}>
                {p.tag && (
                  <span style={{
                    position: 'absolute', top: -8, right: -6,
                    padding: '2px 6px', fontFamily: 'Silkscreen, monospace', fontSize: 8,
                    background: 'var(--accent-2)', color: '#0a0524', letterSpacing: '0.15em',
                    boxShadow: 'var(--neon-glow-pink)',
                  }}>{p.tag}</span>
                )}
                <CoinIcon scale={2.5} />
                <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 16, color: 'var(--accent-4)', textShadow: '0 0 6px var(--accent-4)' }}>{p.coins.toLocaleString()}</div>
                {p.bonus > 0 && (
                  <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: '#6ee7b7', letterSpacing: '0.1em' }}>+{p.bonus} 贈送</div>
                )}
                <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 12, color: 'var(--ink)' }}>NT$ {p.price}</div>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--panel-stroke)', paddingTop: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--ink)' }}>
                你選了 <span style={{ color: 'var(--accent-4)' }}>{PACKS[selectedPack].coins.toLocaleString()} + {PACKS[selectedPack].bonus} T 幣</span>
              </span>
              <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.15em' }}>
                金額 NT$ {PACKS[selectedPack].price} · 立即到帳
              </span>
            </div>
            <button className="pixel-btn primary" style={{ padding: '10px 22px', fontSize: 12 }}>✦ 立即儲值 ▶</button>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-dim)', letterSpacing: '0.15em' }}>
            <span>付款方式：</span>
            <PayLogo>VISA</PayLogo><PayLogo>MC</PayLogo><PayLogo>JCB</PayLogo>
            <PayLogo>Apple Pay</PayLogo><PayLogo>Google Pay</PayLogo><PayLogo>LINE Pay</PayLogo>
          </div>
        </div>

        <div className="pixel-panel" style={{ padding: 14 }}>
          <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent-3)', letterSpacing: '0.2em', marginBottom: 10 }}>● 免費賺 T 幣</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {[
              { i: '🍅', t: '完成一顆番茄', r: '+5' },
              { i: '🌙', t: '深夜時段專注', r: '+10' },
              { i: '👥', t: '與他人一起專注 25min', r: '+15' },
              { i: '🔥', t: '連續登入 7 天', r: '+50' },
              { i: '🎯', t: '解鎖新成就', r: '+30' },
              { i: '💬', t: '送出意見反饋', r: '+5' },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-stroke)' }}>
                <span style={{ fontSize: 14 }}>{e.i}</span>
                <span style={{ flex: 1, fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--ink)' }}>{e.t}</span>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: '#6ee7b7', textShadow: '0 0 4px #6ee7b7' }}>{e.r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pixel-panel" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent-2)', letterSpacing: '0.2em' }}>● 交易紀錄</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <Tag2 active>全部</Tag2><Tag2>收入</Tag2><Tag2>支出</Tag2><Tag2>儲值</Tag2>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {txns.map((tx, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderBottom: '1px solid var(--panel-stroke)' }}>
                <span style={{
                  width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: tx.type === 'spend' ? 'rgba(248,113,113,0.2)' : tx.type === 'topup' ? 'rgba(252,211,77,0.2)' : 'rgba(110,231,183,0.2)',
                  border: `1px solid ${tx.type === 'spend' ? '#f87171' : tx.type === 'topup' ? 'var(--accent-4)' : '#6ee7b7'}`,
                  fontSize: 12, flexShrink: 0,
                }}>
                  {tx.type === 'spend' ? '−' : tx.type === 'topup' ? '$' : '＋'}
                </span>
                <span style={{ flex: 1, fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--ink)' }}>{tx.label}</span>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.1em' }}>{tx.date}</span>
                <span style={{
                  fontFamily: 'Silkscreen, monospace', fontSize: 12, width: 56, textAlign: 'right',
                  color: tx.amt > 0 ? '#6ee7b7' : '#f87171',
                  textShadow: `0 0 4px ${tx.amt > 0 ? '#6ee7b7' : '#f87171'}`,
                }}>{tx.amt > 0 ? '+' : ''}{tx.amt}</span>
              </div>
            ))}
          </div>
        </div>

        <style>{`@keyframes coin-fall { 0% { transform: translateY(-10px); opacity: 0.6 } 100% { transform: translateY(120px); opacity: 0 } }`}</style>
      </div>
    );
  }

  function PayLogo({ children }) {
    return (
      <span style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--panel-stroke)', color: 'var(--ink)', fontFamily: 'Silkscreen, monospace', fontSize: 8, letterSpacing: '0.1em' }}>{children}</span>
    );
  }

  function StatCard({ icon, value, label, color }) {
    return (
      <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', borderColor: color }}>
        <div style={{ fontSize: 22, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 18, color, textShadow: `0 0 6px ${color}` }}>{value}</div>
        <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.15em' }}>{label}</div>
      </div>
    );
  }

  function Heatmap() {
    // 7 days × 24 hours
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {days.map((d, di) => (
          <div key={di} style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <span style={{ width: 14, fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 10, color: 'var(--ink-mute)' }}>{d}</span>
            {[...Array(24)].map((_, hi) => {
              // Synthetic data: low/med/high based on hour pattern
              let v = 0;
              if (hi >= 9 && hi <= 11) v = (di + hi) % 4;
              else if (hi >= 14 && hi <= 17) v = ((di * 2 + hi) % 4);
              else if (hi >= 20 && hi <= 23) v = ((di + hi * 2) % 4);
              const colors = ['rgba(167,139,250,0.08)', 'rgba(167,139,250,0.3)', 'rgba(167,139,250,0.55)', 'var(--accent)'];
              return <div key={hi} style={{ width: 18, height: 14, background: colors[v], border: '1px solid rgba(0,0,0,0.2)' }} />;
            })}
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-dim)', marginTop: 4, marginLeft: 16, marginRight: 4 }}>
          <span>0時</span><span>6</span><span>12</span><span>18</span><span>24</span>
        </div>
      </div>
    );
  }

  function NotesArchiveView() {
    const notes = [
      { date: '2026-05-16', title: '今日專注主題 — LowBatteryTown v1.4 設計', tags: ['#設計', '#工作'], snippet: '建築物可加上「鎮民燈光」: 每個用戶選擇的小屋會點亮...', pomos: 4 },
      { date: '2026-05-15', title: '寫作番茄 with Aria — 第七章開頭', tags: ['#寫作', '#共筆'], snippet: '那座小鎮的燈光從來不熄滅，因為總有人在某個房間裡...', pomos: 2 },
      { date: '2026-05-14', title: 'PRD — 配對演算法草稿', tags: ['#PRD', '#研究'], snippet: '1. 興趣標籤交集 → 加權\n2. 線上時段 → 加權\n3. 已配過的人...', pomos: 5 },
      { date: '2026-05-13', title: '閱讀筆記 — 深度工作', tags: ['#閱讀'], snippet: '專注的能力像肌肉。能在「無聊」的時刻不去抓手機，是非常珍貴的能力。', pomos: 2 },
      { date: '2026-05-12', title: '想法雜記', tags: ['#雜記'], snippet: '小鎮的天空可以下流星雨；用戶完成 100 顆番茄會有煙火慶祝。', pomos: 1 },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input className="pixel-input" placeholder="搜尋筆記..." style={{ flex: 1, fontSize: 11 }} />
          <button className="pixel-btn" style={{ padding: '6px 10px', fontSize: 10 }}>+ 新筆記</button>
        </div>
        {notes.map((n, i) => (
          <div key={i} className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 12, color: 'var(--ink)', fontWeight: 600 }}>{n.title}</div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.15em' }}>{n.date}</div>
            </div>
            <div style={{ fontFamily: '"VT323", "Noto Sans TC", monospace', fontSize: 14, color: 'var(--ink-mute)', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{n.snippet}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Silkscreen, monospace', fontSize: 9 }}>
              {n.tags.map((tg) => <span key={tg} style={{ color: 'var(--accent-3)', padding: '1px 5px', border: '1px solid var(--accent-3)', letterSpacing: '0.1em' }}>{tg}</span>)}
              <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>🍅 ×{n.pomos}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function FriendsView() {
    const friends = [
      { name: 'Kai',  avatar: AVATARS[3],  status: 'STUDY HALL · 已專注 92 分', online: true, pomos: 13, mutual: 3 },
      { name: 'Aria', avatar: AVATARS[2],  status: 'LOFI BAR · 寫作中', online: true, pomos: 9, mutual: 8 },
      { name: 'Bear', avatar: AVATARS[7],  status: 'CAFE PIXEL · 休息', online: true, pomos: 11, mutual: 5 },
      { name: 'Doc',  avatar: AVATARS[11], status: '離線 · 2 小時前', online: false, pomos: 0, mutual: 2 },
      { name: 'Milo', avatar: AVATARS[14], status: 'PIXEL ARCADE', online: true, pomos: 4, mutual: 1 },
      { name: 'Nova', avatar: AVATARS[18], status: '離線 · 昨天', online: false, pomos: 0, mutual: 4 },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tag2 active>全部 {friends.length}</Tag2>
          <Tag2>在線 {friends.filter(f => f.online).length}</Tag2>
          <Tag2>近期一起 3</Tag2>
          <div style={{ flex: 1 }} />
          <button className="pixel-btn primary" style={{ padding: '6px 10px', fontSize: 10 }}>+ 邀請好友</button>
        </div>
        {friends.map((f, i) => (
          <div key={i} className="pixel-panel" style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <PixelSprite sprite={f.avatar.sprite} palette={f.avatar.palette} scale={2.4} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, background: f.online ? '#06d6a0' : '#6b5e9a', border: '2px solid var(--bg-0)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 12, color: 'var(--ink)' }}>{f.name}</span>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--accent-3)', padding: '0 4px', border: '1px solid var(--accent-3)' }}>{f.mutual} 共同</span>
              </div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: f.online ? 'var(--accent-3)' : 'var(--ink-dim)', letterSpacing: '0.1em' }}>{f.status}</div>
            </div>
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent)' }}>🍅 {f.pomos}</span>
            {f.online && <button className="pixel-btn primary" style={{ padding: '5px 10px', fontSize: 10 }}>✦ 一起</button>}
            <button className="pixel-btn" style={{ padding: '5px 10px', fontSize: 10 }}>♪</button>
          </div>
        ))}
      </div>
    );
  }

  function SettingsView({ t, profile }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Section title="個人資料">
          <Row label="稱呼" value={profile?.name || 'Yuki'} edit />
          <Row label="年齡" value={`${profile?.age || 27} 歲`} locked />
          <Row label="所在地區" value="🇹🇼 台北 · Taipei" edit />
          <Row label="角色" value={profile?.avatar?.name || 'UI 設計師'} edit />
          <Row label="興趣 / 專長" value="寫程式 · lofi · 茶/咖啡 · 設計" edit />
          <Row label="每日目標" value={`${profile?.goal || 4} 顆番茄`} edit />
        </Section>
        <Section title="通知">
          <Toggle label="一起專注邀請" on />
          <Toggle label="排行榜每日推送" on />
          <Toggle label="好友上線通知" />
          <Toggle label="廣告通知" />
        </Section>
        <Section title="隱私">
          <Toggle label="顯示我在排行榜" on />
          <Toggle label="允許其他鎮民配對" on />
          <Toggle label="顯示真實所在地區" />
        </Section>
      </div>
    );
  }

  function Section({ title, children }) {
    return (
      <div className="pixel-panel" style={{ padding: 14 }}>
        <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: 10 }}>● {title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
      </div>
    );
  }
  function Row({ label, value, edit, locked }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 8px', borderBottom: '1px solid var(--panel-stroke)' }}>
        <span style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.15em', width: 100 }}>{label}</span>
        <span style={{ flex: 1, fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 12, color: 'var(--ink)' }}>{value}</span>
        {locked && <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--accent-2)', letterSpacing: '0.15em' }}>🔒 已鎖定</span>}
        {edit && <button className="pixel-btn" style={{ padding: '3px 8px', fontSize: 10 }}>編輯</button>}
      </div>
    );
  }
  function Toggle({ label, on }) {
    const [v, setV] = React.useState(!!on);
    return (
      <div onClick={() => setV(!v)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 8px', cursor: 'pointer' }}>
        <span style={{ flex: 1, fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--ink)' }}>{label}</span>
        <div style={{
          width: 36, height: 16, background: v ? 'var(--accent)' : 'rgba(0,0,0,0.5)',
          border: '1px solid var(--panel-stroke-strong)', position: 'relative',
          boxShadow: v ? 'var(--neon-glow)' : 'none',
        }}>
          <div style={{ position: 'absolute', top: 1, left: v ? 20 : 2, width: 12, height: 12, background: v ? '#0a0524' : 'var(--ink-mute)', transition: 'left 0.15s steps(3)' }} />
        </div>
      </div>
    );
  }

  // ============ Feedback Modal ============
  function FeedbackModal({ t, onClose }) {
    const [type, setType] = React.useState('bug');
    const [text, setText] = React.useState('');
    const [sent, setSent] = React.useState(false);
    return (
      <Modal t={t} title={t('feedback').toUpperCase() + ' · WE LISTEN'} onClose={onClose} width={520}>
        {sent ? (
          <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 36 }}>✦</div>
            <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 14, color: 'var(--accent)', textShadow: 'var(--neon-glow)' }}>已收到，謝謝你！</div>
            <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.15em' }}>編號 #FB-2026-1247</div>
            <button className="pixel-btn primary" onClick={onClose} style={{ marginTop: 10 }}>✦ 繼續專注</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--accent-3)', letterSpacing: '0.15em' }}>類型</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { k: 'bug', l: '🐛 Bug', c: 'var(--accent-2)' },
                  { k: 'idea', l: '💡 想法', c: 'var(--accent-3)' },
                  { k: 'praise', l: '✦ 讚美', c: 'var(--accent-4)' },
                  { k: 'other', l: '其他', c: 'var(--accent)' },
                ].map((o) => (
                  <button key={o.k} onClick={() => setType(o.k)} style={{
                    flex: 1, padding: '8px 4px',
                    background: type === o.k ? o.c : 'rgba(0,0,0,0.3)',
                    color: type === o.k ? '#0a0524' : 'var(--ink-mute)',
                    border: `1px solid ${type === o.k ? o.c : 'var(--panel-stroke)'}`,
                    fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}>{o.l}</button>
                ))}
              </div>
            </div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="想說的話、希望加的功能、遇到的問題..."
              style={{
                background: 'rgba(0,0,0,0.5)', color: 'var(--ink)', border: '1px solid var(--panel-stroke)',
                fontFamily: '"Noto Sans TC", "VT323", monospace', fontSize: 13, padding: 12, resize: 'vertical', outline: 'none',
              }} />
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input className="pixel-input" placeholder="信箱（可選，回覆用）" style={{ flex: 1, fontSize: 11 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.1em' }}>
                送出後 +5 T 幣 · 我們會在 24 小時內回覆
              </div>
              <button className="pixel-btn primary" onClick={() => setSent(true)} style={{ padding: '8px 18px', fontSize: 12 }}>{t('send')} ▶</button>
            </div>
          </>
        )}
      </Modal>
    );
  }

  // ============ Support Modal ============
  function SupportModal({ t, onClose }) {
    const faqs = [
      { q: '怎麼開始一場專注？', a: '在主畫面底部的「找夥伴」或「個人專注」按鈕，選一個就會進入專注室。番茄鐘預設 25 分鐘，可在設定改。' },
      { q: 'T 幣怎麼累積？', a: '完成番茄、連續打卡、邀請好友、送出反饋都會送 T 幣。在商店可以解鎖音樂、貓咪、裝飾等。' },
      { q: '配對是怎麼運作的？', a: '系統會依照你的興趣標籤、所在時區、線上狀態找出 3-5 個正在做類似事情的鎮民，按下「一起專注」就會進入夥伴房間。' },
      { q: '可以匿名嗎？', a: '可以。在 設定 → 隱私 把「顯示真實所在地區」關掉、把名字改為暱稱。資料永遠不會賣給第三方。' },
      { q: '網路斷了怎麼辦？', a: '本地仍會繼續計時，重新連上時自動把番茄補回。共筆會在斷線時暫存，連上後合併。' },
    ];
    const [open, setOpen] = React.useState(0);
    return (
      <Modal t={t} title={t('support').toUpperCase() + ' · HELP CENTER'} onClose={onClose} width={620}>
        {/* Channels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <Channel icon="✉" label="Email" value="help@lowbatterytown.app" />
          <Channel icon="💬" label="Discord" value="discord.gg/lowbatterytown" />
          <Channel icon="🐦" label="X / Twitter" value="@lowbatterytown" />
        </div>
        {/* FAQ */}
        <div className="pixel-panel" style={{ padding: 14 }}>
          <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: 10 }}>● 常見問題</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--panel-stroke)' }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} style={{
                  width: '100%', padding: '8px 0',
                  background: 'transparent', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 12, color: 'var(--ink)',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <span>Q. {f.q}</span>
                  <span style={{ color: 'var(--accent)' }}>{open === i ? '▼' : '▶'}</span>
                </button>
                {open === i && (
                  <div style={{ padding: '0 12px 12px', fontFamily: '"Noto Sans TC", "VT323", monospace', fontSize: 13, color: 'var(--ink-mute)', lineHeight: 1.6 }}>
                    A. {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="pixel-btn" style={{ padding: '8px 16px' }}>+ 開新工單</button>
        </div>
      </Modal>
    );
  }

  function Channel({ icon, label, value }) {
    return (
      <div className="pixel-panel" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.2em' }}>{label}</span>
        <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent-3)', letterSpacing: '0.05em', textAlign: 'center' }}>{value}</span>
      </div>
    );
  }

  window.TownScreen = TownScreen;
})();
