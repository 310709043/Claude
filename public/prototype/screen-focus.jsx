/* Solo Focus Room — focus timer + personal notes + tasks + ambient controls */
(function () {
  const {
    PixelSprite, AnimatedSprite, StarField, RainOverlay, AVATARS,
    TOMATO_SPRITE, TOMATO_PAL, COFFEE, COFFEE_PAL, NOTE, NOTE_PAL, MOON, MOON_PAL,
    LogoImage, PixelWord, LangSwitcher, CornerDeco, TCoinBadge, tFor,
  } = window;

  // Order matters: cycle through these in sequence.
  const BG_OPTIONS = [
    { id: 'lofi',   zh: 'lofi 房',  en: 'lofi room',  ko: 'lofi 방',  ja: 'lofi 部屋', emoji: '☁' },
    { id: 'cafe',   zh: '咖啡館',   en: 'Cafe',       ko: '카페',     ja: 'カフェ',    emoji: '☕' },
    { id: 'rain',   zh: '雨夜',     en: 'Rain',       ko: '비',       ja: '雨',        emoji: '☂' },
    { id: 'forest', zh: '森林',     en: 'Forest',     ko: '숲',       ja: '森',        emoji: '🌲' },
    { id: 'fire',   zh: '火爐',     en: 'Fireplace',  ko: '벽난로',   ja: '暖炉',      emoji: '🔥' },
    { id: 'space',  zh: '太空',     en: 'Space',      ko: '우주',     ja: '宇宙',      emoji: '🌌' },
  ];

  // Platform-driven environment cycling (real cycle ≈ 90 min, demoed compressed).
  // Crossfades happen over ~25s so the transition feels gentle, never jarring.
  function useEnvironmentCycle({ cycleMs = 90 * 1000 } = {}) {
    const [phase, setPhase] = React.useState({ from: 'lofi', to: 'lofi', t: 1 }); // t in [0,1]
    const startedAt = React.useRef(performance.now());
    const fromIdx = React.useRef(0);
    const transitioning = React.useRef(false);

    React.useEffect(() => {
      let raf;
      const FADE_MS = 25 * 1000; // 25 seconds of crossfade

      const tick = () => {
        const elapsed = performance.now() - startedAt.current;
        const into = elapsed % cycleMs;

        if (into < cycleMs - FADE_MS) {
          // Stable phase
          if (transitioning.current) {
            transitioning.current = false;
          }
          const id = BG_OPTIONS[fromIdx.current % BG_OPTIONS.length].id;
          setPhase((p) => (p.to === id && p.t === 1 ? p : { from: id, to: id, t: 1 }));
        } else {
          // Crossfade phase
          const f = Math.min(1, (into - (cycleMs - FADE_MS)) / FADE_MS);
          if (!transitioning.current) transitioning.current = true;
          const from = BG_OPTIONS[fromIdx.current % BG_OPTIONS.length].id;
          const to = BG_OPTIONS[(fromIdx.current + 1) % BG_OPTIONS.length].id;
          setPhase({ from, to, t: f });
          if (f >= 1) {
            // Advance source for the next cycle
            fromIdx.current = (fromIdx.current + 1) % BG_OPTIONS.length;
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [cycleMs]);

    return phase;
  }

  function SoloRoomScreen({ profile, lang, setLang, onExit }) {
    const t = tFor(lang);
    const wrapRef = React.useRef(null);
    const [size, setSize] = React.useState({ w: 1280, h: 800 });
    // Platform-controlled environment (no manual switcher).
    const env = useEnvironmentCycle();

    React.useEffect(() => {
      const update = () => wrapRef.current && setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
      update(); window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, []);

    const avatar = profile?.avatar || AVATARS[0];
    const currentBgLabel = (BG_OPTIONS.find((o) => o.id === env.to) || BG_OPTIONS[0])[lang] || 'lofi room';
    const currentBgEmoji = (BG_OPTIONS.find((o) => o.id === env.to) || BG_OPTIONS[0]).emoji;
    const fromLabel = (BG_OPTIONS.find((o) => o.id === env.from) || BG_OPTIONS[0])[lang] || 'lofi';
    const isFading = env.from !== env.to && env.t < 1;

    return (
      <div ref={wrapRef} className="crt" style={{
        position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
        background: '#02020a',
      }}>
        {/* Two stacked backdrops crossfading by opacity */}
        <BackdropLayer bg={env.from} width={size.w} height={size.h} opacity={1 - env.t} />
        <BackdropLayer bg={env.to}   width={size.w} height={size.h} opacity={env.t} />

        {/* Top bar */}
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px', borderBottom: '1px solid var(--panel-stroke)', background: 'rgba(7,4,26,0.78)',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onExit} className="pixel-btn" style={{ padding: '6px 12px', fontSize: 10 }}>◀ {t('back')}</button>
            <LogoImage size={36} />
            <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--accent-3)', letterSpacing: '0.2em', padding: '2px 8px', border: '1px solid var(--accent-3)' }}>{t('soloRoom').toUpperCase()}</div>

            {/* Auto environment indicator */}
            <div style={{
              padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(7,4,26,0.7)', border: '1px solid var(--panel-stroke)',
              fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.15em',
            }}>
              <span style={{ fontSize: 13 }}>{currentBgEmoji}</span>
              <span style={{ color: 'var(--accent-3)' }}>AUTO</span>
              <span style={{ color: 'var(--ink-dim)' }}>·</span>
              <span style={{ color: 'var(--ink)' }}>{currentBgLabel}</span>
              {isFading && (
                <>
                  <span style={{ color: 'var(--ink-dim)' }}>·</span>
                  <span style={{ color: 'var(--accent-2)' }}>fading from {fromLabel}…</span>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PixelSprite sprite={avatar.sprite} palette={avatar.palette} scale={1.8} />
              <div>
                <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 12, color: 'var(--ink)' }}>{profile?.name || 'Yuki'}</div>
                <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--accent)', letterSpacing: '0.2em' }}>專注中 · 連續 22 min</div>
              </div>
            </div>
            <TCoinBadge amount={1247} label={t('tcoin').toUpperCase()} />
            <LangSwitcher lang={lang} onChange={setLang} compact />
          </div>
        </div>

        {/* Body grid: Notes wide (2 cols) + Right rail (1 col) */}
        <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, padding: 12, height: 'calc(100% - 56px)', overflow: 'hidden' }}>
          {/* Left: Notes spans the wide area */}
          <NotesPanel t={t} />

          {/* Right rail: timer + insight + friends + tasks + sound + quick */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto', paddingRight: 4 }}>
            <BigTimer t={t} avatar={avatar} compact />
            <SessionInsight />
            <FriendsNow t={t} />
            <TasksPanel t={t} />
            <SoundMixer />
            <NextEnvCard t={t} env={env} lang={lang} />
            <QuickActions t={t} onExit={onExit} />
          </div>
        </div>
      </div>
    );
  }

  // Stacked backdrop layer (color gradient + ambient particles, all controlled by opacity for crossfade)
  function BackdropLayer({ bg, width, height, opacity }) {
    if (opacity <= 0.01) return null;
    return (
      <div style={{
        position: 'absolute', inset: 0,
        background: getBgGradient(bg),
        opacity,
        transition: 'background 1.5s ease',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <AmbientBackdrop bg={bg} width={width} height={height} />
      </div>
    );
  }

  // "Next environment" card — show what's coming and progress until it happens
  function NextEnvCard({ t, env, lang }) {
    const fromIdx = BG_OPTIONS.findIndex((o) => o.id === env.to);
    const nextEnv = BG_OPTIONS[(fromIdx + 1) % BG_OPTIONS.length];
    return (
      <div className="pixel-panel" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent-3)', letterSpacing: '0.2em' }}>
          <span>● 接下來的環境</span>
          <span style={{ color: 'var(--ink-dim)', fontSize: 9 }}>由平台自動調整</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 22 }}>{nextEnv.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 12, color: 'var(--ink)' }}>{nextEnv[lang] || nextEnv.en}</div>
            <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.15em' }}>
              {env.t < 1 && env.from !== env.to ? '正在切換 · ' + Math.round(env.t * 100) + '%' : '約 60 分鐘後'}
            </div>
          </div>
        </div>
        {/* mini timeline of upcoming environments */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2, 3].map((k) => {
            const e = BG_OPTIONS[(fromIdx + k) % BG_OPTIONS.length];
            return (
              <div key={k} style={{
                flex: 1, padding: '4px 2px', textAlign: 'center',
                background: k === 0 ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0.3)',
                border: `1px solid ${k === 0 ? 'var(--accent-3)' : 'var(--panel-stroke)'}`,
                fontFamily: 'Silkscreen, monospace', fontSize: 13,
              }}>{e.emoji}</div>
            );
          })}
        </div>
      </div>
    );
  }

  function getBgGradient(bg) {
    return {
      cafe: 'linear-gradient(180deg, #3a2820 0%, #5a3a2a 60%, #7c4a2a 100%)',
      rain: 'linear-gradient(180deg, #03061a 0%, #0a1845 60%, #1a2a6a 100%)',
      forest: 'linear-gradient(180deg, #0d2818 0%, #1f4a32 60%, #2d6e48 100%)',
      space: 'linear-gradient(180deg, #02020a 0%, #0a0524 60%, #2a1854 100%)',
      lofi: 'linear-gradient(180deg, #1a0d3d 0%, #2a1854 60%, #6e3a6e 100%)',
      fire: 'linear-gradient(180deg, #2a0d0a 0%, #5a2a1a 60%, #8a3a1a 100%)',
    }[bg] || 'var(--bg-0)';
  }

  function AmbientBackdrop({ bg, width, height }) {
    if (bg === 'space') return <StarField width={width} height={height} density={0.0015} />;
    if (bg === 'rain') return <RainOverlay width={width} height={height} color="#67e8f9" density={1.2} />;
    if (bg === 'forest') return <Fireflies width={width} height={height} />;
    if (bg === 'fire') return <Embers width={width} height={height} />;
    if (bg === 'cafe') return <CafeAmbient width={width} height={height} />;
    if (bg === 'lofi') return <LofiAmbient width={width} height={height} />;
    return null;
  }

  function Fireflies({ width, height }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const c = ref.current; if (!c) return;
      c.width = width; c.height = height;
      const ctx = c.getContext('2d');
      const flies = Array.from({ length: 30 }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
      }));
      let raf;
      const tick = (t) => {
        ctx.clearRect(0, 0, width, height);
        for (const f of flies) {
          f.x += f.dx; f.y += f.dy;
          if (f.x < 0 || f.x > width) f.dx *= -1;
          if (f.y < 0 || f.y > height) f.dy *= -1;
          ctx.globalAlpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t / 500 + f.phase));
          ctx.fillStyle = '#fef9c3';
          ctx.fillRect(Math.floor(f.x), Math.floor(f.y), 2, 2);
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [width, height]);
    return <canvas ref={ref} style={{ position: 'absolute', inset: 0, imageRendering: 'pixelated', pointerEvents: 'none' }} />;
  }

  function Embers({ width, height }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const c = ref.current; if (!c) return;
      c.width = width; c.height = height;
      const ctx = c.getContext('2d');
      const sparks = Array.from({ length: 80 }, () => ({
        x: Math.random() * width,
        y: height + Math.random() * 100,
        v: 0.4 + Math.random() * 1.2,
        col: ['#fbbf24', '#fb923c', '#dc2626'][Math.floor(Math.random() * 3)],
      }));
      let raf;
      const tick = () => {
        ctx.clearRect(0, 0, width, height);
        for (const s of sparks) {
          s.y -= s.v; s.x += (Math.random() - 0.5) * 0.6;
          if (s.y < -10) { s.y = height + 20; s.x = Math.random() * width; }
          ctx.fillStyle = s.col;
          ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 2, 2);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [width, height]);
    return <canvas ref={ref} style={{ position: 'absolute', inset: 0, imageRendering: 'pixelated', pointerEvents: 'none' }} />;
  }

  function CafeAmbient({ width, height }) {
    // Steam wafts from below
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: 0, left: `${i * 17 + 5}%`,
            width: 24, height: 200,
            background: 'radial-gradient(ellipse at center bottom, rgba(245,243,255,0.15), transparent 60%)',
            animation: `steam-${i} 8s ease-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }} />
        ))}
        <style>{`
          @keyframes steam-0 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateY(-40px); } }
          @keyframes steam-1 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateY(-50px); } }
          @keyframes steam-2 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateY(-45px); } }
          @keyframes steam-3 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateY(-55px); } }
          @keyframes steam-4 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateY(-42px); } }
          @keyframes steam-5 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateY(-48px); } }
        `}</style>
      </div>
    );
  }

  function LofiAmbient({ width, height }) {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: 20 + i * 80, left: -100,
            opacity: 0.3,
            animation: `lofi-drift 30s linear infinite`,
            animationDelay: `${i * 4}s`,
          }}>
            <PixelSprite sprite={`
....CCCCCCC....
..CCCCCCCCCCC..
.CCCCCCCCCCCC.
CCCCCCCCCCCCCC
.CCCCCCCCCCCC.
`} palette={{ C: '#a78bfa' }} scale={3} />
          </div>
        ))}
        <style>{`@keyframes lofi-drift { from { transform: translateX(0); } to { transform: translateX(120vw); } }`}</style>
      </div>
    );
  }

  // -------- Session insight (motivational + tip + progress vs goal) --------
  function SessionInsight() {
    const tips = [
      { i: '💡', t: '研究顯示：寫下你「下一個動作」會讓你更快重新進入心流。' },
      { i: '🌿', t: '休息時起身、看遠方 20 秒，比滑手機讓你更專注。' },
      { i: '☕', t: '咖啡因半衰期約 5 小時，下午 3 點後喝可能影響睡眠。' },
      { i: '🌙', t: '深夜專注：每 90 分鐘起身走動，比熬到底高效。' },
    ];
    const [idx, setIdx] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(() => setIdx((i) => (i + 1) % tips.length), 8000);
      return () => clearInterval(id);
    }, []);
    const tip = tips[idx];
    return (
      <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Progress vs goal */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.15em' }}>
            <span>● 今日目標 4 🍅</span><span style={{ color: 'var(--accent)' }}>3 / 4 完成</span>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ flex: 1, height: 12, border: '1px solid var(--panel-stroke)', background: i < 3 ? 'var(--accent)' : 'rgba(0,0,0,0.4)', boxShadow: i < 3 ? '0 0 6px var(--accent)' : 'none', position: 'relative' }}>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Silkscreen, monospace', fontSize: 9, color: i < 3 ? '#0a0524' : 'var(--ink-dim)' }}>
                  {i < 3 ? '✓' : i === 3 ? '在這' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Tip */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 10px',
          background: 'rgba(34,211,238,0.08)', border: '1px solid var(--accent-3)',
        }}>
          <span style={{ fontSize: 16 }}>{tip.i}</span>
          <span style={{ fontFamily: '"VT323", "Noto Sans TC", monospace', fontSize: 14, color: 'var(--ink)', lineHeight: 1.4 }}>{tip.t}</span>
        </div>
      </div>
    );
  }

  // -------- Friends focusing right now --------
  function FriendsNow({ t }) {
    const list = [
      { name: 'Kai',   avatar: AVATARS[3],  task: '#PRD',     pomos: 13 },
      { name: 'Aria',  avatar: AVATARS[2],  task: '#寫作',    pomos: 9 },
      { name: 'Bear',  avatar: AVATARS[7],  task: '#研究',    pomos: 11 },
      { name: 'Milo',  avatar: AVATARS[14], task: '#閱讀',    pomos: 4 },
    ];
    return (
      <div className="pixel-panel" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent-2)', letterSpacing: '0.2em' }}>
          <span><span style={{ display: 'inline-block', width: 6, height: 6, background: 'var(--accent-2)', boxShadow: 'var(--neon-glow-pink)', marginRight: 6 }} className="blink" />FRIENDS NOW</span>
          <span style={{ color: 'var(--ink-dim)', fontSize: 9 }}>{list.length} 在線</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {list.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-stroke)' }}>
              <div style={{ position: 'relative' }}>
                <PixelSprite sprite={f.avatar.sprite} palette={f.avatar.palette} scale={1.4} />
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: 6, height: 6, background: '#6ee7b7', border: '1px solid var(--bg-0)' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 10, color: 'var(--ink)' }}>{f.name}</span>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--accent-3)', letterSpacing: '0.1em' }}>{f.task} · 🍅 {f.pomos}</span>
              </div>
              <button className="pixel-btn primary" style={{ padding: '3px 6px', fontSize: 9 }}>+1</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------- Sound mixer --------
  function SoundMixer() {
    const [vol, setVol] = React.useState({ rain: 60, fire: 0, cafe: 30, music: 40 });
    const tracks = [
      { id: 'music', label: '🎵 lofi', color: 'var(--accent-2)' },
      { id: 'rain',  label: '☂ 雨聲', color: 'var(--accent-3)' },
      { id: 'cafe',  label: '☕ 咖啡館', color: 'var(--accent-4)' },
      { id: 'fire',  label: '🔥 火爐', color: 'var(--accent)' },
    ];
    return (
      <div className="pixel-panel" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent-3)', letterSpacing: '0.2em' }}>● SOUND MIX</div>
        {tracks.map((tr) => (
          <div key={tr.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 10, color: 'var(--ink)', width: 64 }}>{tr.label}</span>
            <input type="range" min={0} max={100} value={vol[tr.id]} onChange={(e) => setVol({ ...vol, [tr.id]: +e.target.value })}
              style={{ flex: 1, accentColor: tr.color, height: 4 }} />
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: tr.color, width: 22, textAlign: 'right' }}>{vol[tr.id]}</span>
          </div>
        ))}
      </div>
    );
  }

  function QuickActions({ t, onExit }) {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="pixel-btn" style={{ flex: 1, padding: '6px 4px', fontSize: 10 }}>🔕 勿擾</button>
        <button className="pixel-btn" style={{ flex: 1, padding: '6px 4px', fontSize: 10 }}>📱 鎖手機</button>
        <button onClick={onExit} className="pixel-btn" style={{ flex: 1, padding: '6px 4px', fontSize: 10, borderColor: 'var(--accent-2)', color: 'var(--accent-2)' }}>← 回小鎮</button>
      </div>
    );
  }
  function BigTimer({ t, avatar, compact = false }) {
    const [seconds, setSeconds] = React.useState(25 * 60);
    const [running, setRunning] = React.useState(true);
    const [mode, setMode] = React.useState('focus');
    const [count, setCount] = React.useState(4);
    const total = mode === 'focus' ? 25 * 60 : 5 * 60;

    React.useEffect(() => {
      if (!running) return;
      const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
      return () => clearInterval(id);
    }, [running]);

    React.useEffect(() => {
      if (seconds === 0) {
        const nm = mode === 'focus' ? 'break' : 'focus';
        if (mode === 'focus') setCount((c) => c + 1);
        setMode(nm);
        setSeconds(nm === 'focus' ? 25 * 60 : 5 * 60);
      }
    }, [seconds, mode]);

    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    const pct = (1 - seconds / total) * 100;

    return (
      <div className="pixel-panel" style={{ padding: compact ? 12 : 18, display: 'flex', flexDirection: 'column', gap: compact ? 8 : 14, position: 'relative' }}>
        <CornerDeco />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.25em' }}>
            ● {mode === 'focus' ? 'DEEP FOCUS' : 'BREAK'}
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[...Array(8)].map((_, i) => (
              <PixelSprite key={i} sprite={TOMATO_SPRITE}
                palette={i < count ? TOMATO_PAL : { R: '#3a2820', G: '#1a0f3d', W: '#5a4a7a' }}
                scale={compact ? 1.1 : 1.4} />
            ))}
          </div>
        </div>

        {/* Big timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: compact ? '2px 0' : '8px 0' }}>
          <PixelDigits text={`${mins}:${secs}`} scale={compact ? 5 : 8} color="var(--ink)" glow="var(--accent)" />
        </div>

        {/* Progress */}
        <div style={{ height: compact ? 8 : 12, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--panel-stroke)' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', boxShadow: 'var(--neon-glow)', transition: 'width 0.3s linear' }} />
        </div>

        <div style={{ display: 'flex', gap: compact ? 4 : 8, justifyContent: 'center' }}>
          <button className="pixel-btn" style={{ padding: compact ? '5px 8px' : '8px 14px', fontSize: compact ? 10 : 11 }} onClick={() => { setSeconds(total); setRunning(false); }}>
            ↺
          </button>
          <button className="pixel-btn primary" style={{ padding: compact ? '6px 14px' : '10px 28px', fontSize: compact ? 11 : 13 }} onClick={() => setRunning((r) => !r)}>
            {running ? '⏸ ' + t('pause') : '▶ ' + t('start')}
          </button>
          <button className="pixel-btn" style={{ padding: compact ? '5px 8px' : '8px 14px', fontSize: compact ? 10 : 11 }} onClick={() => setSeconds(0)}>
            ⏭
          </button>
        </div>

        {!compact && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 'auto', borderTop: '1px solid var(--panel-stroke)', paddingTop: 12 }}>
            <Stat label="今日專注" value="142 min" color="var(--accent)" />
            <Stat label="連續天數" value="22 天" color="var(--accent-2)" />
            <Stat label="本週排名" value="#7" color="var(--accent-3)" />
          </div>
        )}
        {compact && (
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--panel-stroke)', paddingTop: 6, fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.15em' }}>
            <span style={{ color: 'var(--accent)' }}>142m 今日</span>
            <span style={{ color: 'var(--accent-2)' }}>22天 連續</span>
            <span style={{ color: 'var(--accent-3)' }}>#7 週</span>
          </div>
        )}
      </div>
    );
  }

  function Stat({ label, value, color }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-mute)', letterSpacing: '0.2em' }}>{label}</span>
        <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 16, color, textShadow: `0 0 6px ${color}` }}>{value}</span>
      </div>
    );
  }

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

  // -------- Notes --------
  function NotesPanel({ t }) {
    const [text, setText] = React.useState(`# 今日專注主題\n\n## 主要目標\n- [ ] 完成 LowBatteryTown v1.4 設計稿\n- [ ] 寫完 PRD 第三章\n- [ ] code review × 2\n\n## 想法\n- 建築物可加上「鎮民燈光」: 每個用戶選擇的小屋會點亮\n- 排行榜可以加入週/月切換\n\n## 突發\n- Aria 邀請 9pm 一起寫作 ✓`);

    return (
      <div className="pixel-panel" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent-2)', letterSpacing: '0.2em' }}>
            <span style={{ width: 6, height: 6, background: 'var(--accent-2)', boxShadow: 'var(--neon-glow-pink)' }} />
            <span>{t('myNotes').toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <Mini>B</Mini><Mini>I</Mini><Mini>•</Mini><Mini>✓</Mini><Mini>#</Mini>
          </div>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} style={{
          flex: 1,
          background: 'rgba(0,0,0,0.5)',
          color: 'var(--ink)',
          border: '1px solid var(--panel-stroke)',
          fontFamily: '"VT323", "Noto Sans TC", monospace',
          fontSize: 17,
          lineHeight: 1.45,
          padding: 12,
          resize: 'none',
          outline: 'none',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)' }}>
          <span>自動儲存 · 24 秒前</span>
          <span>{text.length} 字 · {text.split('\n').length} 行</span>
        </div>
      </div>
    );
  }

  function Mini({ children }) {
    return (
      <button style={{
        width: 22, height: 22,
        background: 'rgba(0,0,0,0.4)', color: 'var(--ink-mute)',
        border: '1px solid var(--panel-stroke)',
        fontFamily: 'Silkscreen, monospace', fontSize: 10, cursor: 'pointer',
      }}>{children}</button>
    );
  }

  // -------- Tasks --------
  function TasksPanel({ t }) {
    const [tasks, setTasks] = React.useState([
      { id: 1, text: '完成設計稿', done: true },
      { id: 2, text: '寫 PRD 第三章', done: false, pomos: 2 },
      { id: 3, text: '與 Aria 共筆', done: false, pomos: 1 },
      { id: 4, text: 'code review', done: false, pomos: 3 },
    ]);
    const [newText, setNewText] = React.useState('');
    const add = () => {
      if (!newText.trim()) return;
      setTasks([...tasks, { id: Date.now(), text: newText, done: false }]);
      setNewText('');
    };
    return (
      <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent-3)', letterSpacing: '0.2em' }}>
            <span style={{ width: 6, height: 6, background: 'var(--accent-3)', boxShadow: 'var(--neon-glow-cyan)' }} />
            <span>{t('tasks').toUpperCase()}</span>
          </div>
          <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)' }}>{tasks.filter(x => x.done).length} / {tasks.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', flex: 1 }}>
          {tasks.map((tk) => (
            <div key={tk.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-stroke)' }}>
              <span onClick={() => setTasks(tasks.map((x) => x.id === tk.id ? { ...x, done: !x.done } : x))}
                style={{
                  width: 14, height: 14, border: '1px solid var(--accent-3)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: tk.done ? 'var(--accent-3)' : 'transparent', cursor: 'pointer', flexShrink: 0,
                }}>
                {tk.done && <span style={{ color: '#0a0524', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </span>
              <span style={{ flex: 1, fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: tk.done ? 'var(--ink-dim)' : 'var(--ink)', textDecoration: tk.done ? 'line-through' : 'none' }}>{tk.text}</span>
              {tk.pomos && <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--accent)' }}>🍅×{tk.pomos}</span>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <input className="pixel-input" placeholder={t('addTask')} style={{ flex: 1, fontSize: 11 }} value={newText} onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') add(); }} />
          <button className="pixel-btn primary" style={{ padding: '0 12px', fontSize: 11 }} onClick={add}>+</button>
        </div>
      </div>
    );
  }

  // -------- Ambient bg picker --------
  function AmbientPanel({ t, bg, setBg }) {
    return (
      <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em' }}>
          <span style={{ width: 6, height: 6, background: 'var(--accent)', boxShadow: 'var(--neon-glow)' }} />
          <span>{t('background').toUpperCase()}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {BG_OPTIONS.map((o) => (
            <button key={o.id} onClick={() => setBg(o.id)} style={{
              padding: '8px 4px',
              background: bg === o.id ? 'var(--accent)' : 'rgba(0,0,0,0.3)',
              color: bg === o.id ? '#0a0524' : 'var(--ink-mute)',
              border: `1px solid ${bg === o.id ? 'var(--accent)' : 'var(--panel-stroke)'}`,
              fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 10, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 16 }}>{o.emoji}</span>
              <span style={{ letterSpacing: '0.1em' }}>{o.zh}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  window.SoloRoomScreen = SoloRoomScreen;
})();
