/* Buddy Room — two-user focus session with shared chat + notes */
(function () {
  const {
    PixelSprite, AnimatedSprite, StarField, RainOverlay, AVATARS,
    TOMATO_SPRITE, TOMATO_PAL, COFFEE, COFFEE_PAL, NOTE, NOTE_PAL,
    LogoImage, PixelWord, LangSwitcher, CornerDeco, TCoinBadge, tFor,
  } = window;

  function BuddyRoomScreen({ profile, lang, setLang, onExit }) {
    const t = tFor(lang);
    const me = profile?.avatar || AVATARS[0];
    const buddy = AVATARS[3]; // pretend match
    const [tab, setTab] = React.useState('chat'); // chat | notes
    const [seconds, setSeconds] = React.useState(22 * 60 + 14);
    const [running, setRunning] = React.useState(true);
    const wrapRef = React.useRef(null);
    const [size, setSize] = React.useState({ w: 1280, h: 800 });

    React.useEffect(() => {
      const update = () => wrapRef.current && setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
      update(); window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, []);

    React.useEffect(() => {
      if (!running) return;
      const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
      return () => clearInterval(id);
    }, [running]);

    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    const pct = (1 - seconds / (25 * 60)) * 100;

    return (
      <div ref={wrapRef} className="crt" style={{
        position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
        background: 'linear-gradient(180deg, #07041a 0%, #1a0d3d 60%, #2a1854 100%)',
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <StarField width={size.w} height={size.h} density={0.0008} />
        </div>
        <RainOverlay width={size.w} height={size.h} color="rgba(167,139,250,0.4)" density={0.5} />

        {/* Top bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid var(--panel-stroke)', background: 'rgba(7,4,26,0.75)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onExit} className="pixel-btn" style={{ padding: '6px 12px', fontSize: 10 }}>◀ {t('leaveRoom')}</button>
            <LogoImage size={36} />
            <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--accent-2)', letterSpacing: '0.2em', padding: '2px 8px', border: '1px solid var(--accent-2)' }}>{t('buddyRoom').toUpperCase()}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent)' }}>
            <span className="blink" style={{ width: 8, height: 8, background: 'var(--accent-2)', boxShadow: 'var(--neon-glow-pink)', display: 'inline-block' }} />
            <span style={{ letterSpacing: '0.25em' }}>{t('sameFocus').toUpperCase()}</span>
            <span style={{ color: 'var(--ink-dim)' }}>·</span>
            <span style={{ color: 'var(--ink-mute)', letterSpacing: '0.15em' }}>ROOM #2847-A · 22 min</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <TCoinBadge amount={1247} label={t('tcoin').toUpperCase()} />
            <LangSwitcher lang={lang} onChange={setLang} compact />
          </div>
        </div>

        {/* Body */}
        <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 14, padding: 14, height: 'calc(100% - 56px)', overflow: 'hidden' }}>
          {/* Left: buddy stats + shared timer + side panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto', paddingRight: 4 }}>
            {/* Two-user header */}
            <div className="pixel-panel" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
              <CornerDeco />
              <BuddyCard profile={{ name: profile?.name || 'Yuki', avatar: me, level: 4 }} side="me" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '0 8px' }}>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 18, color: 'var(--accent-2)', textShadow: 'var(--neon-glow-pink)' }}>×</span>
                <PixelSprite sprite={`
.YYY.
YBYBY
.YYY.
`} palette={{ Y: 'var(--accent-2)', B: 'transparent' }} scale={2} />
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-dim)', letterSpacing: '0.2em' }}>SAME TAG</span>
                <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--accent)', letterSpacing: '0.1em' }}>#WRITING</span>
              </div>
              <BuddyCard profile={{ name: 'Aria', avatar: buddy, level: 6, online: true }} side="buddy" />
            </div>

            {/* Shared timer */}
            <div className="pixel-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.25em' }}>● SHARED FOCUS · #3</div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[...Array(8)].map((_, i) => (
                    <PixelSprite key={i} sprite={TOMATO_SPRITE}
                      palette={i < 3 ? TOMATO_PAL : { R: '#3a2820', G: '#1a0f3d', W: '#5a4a7a' }}
                      scale={1.3} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0' }}>
                <PixelDigits text={`${mins}:${secs}`} scale={7} color="var(--ink)" glow="var(--accent-2)" />
              </div>
              <div style={{ height: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--panel-stroke)' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', boxShadow: 'var(--neon-glow-pink)', transition: 'width 0.3s linear' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button className="pixel-btn" style={{ padding: '6px 12px', fontSize: 11 }}>↺ {t('reset')}</button>
                <button className="pixel-btn primary" onClick={() => setRunning(!running)} style={{ padding: '8px 24px', fontSize: 12 }}>
                  {running ? '⏸ ' + t('pause') : '▶ ' + t('start')}
                </button>
                <button className="pixel-btn" style={{ padding: '6px 12px', fontSize: 11 }}>{t('skip')} ⏭</button>
              </div>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', textAlign: 'center', letterSpacing: '0.2em' }}>
                兩人都按下開始才會計時 · 中途離開 -10 T 幣
              </div>
            </div>

            {/* Status mini */}
            <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent-3)', letterSpacing: '0.2em' }}>● 即時狀態</div>
              {[
                { av: me, name: profile?.name || 'Yuki', task: '寫 PRD', color: 'var(--accent)' },
                { av: buddy, name: 'Aria', task: '寫小說第七章', color: 'var(--accent-2)' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PixelSprite sprite={p.av.sprite} palette={p.av.palette} scale={1.8} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--ink)' }}>{p.name}</div>
                    <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: p.color, letterSpacing: '0.1em' }}>♪ {p.task}</div>
                  </div>
                  <TypingDots />
                </div>
              ))}
            </div>

            {/* Shared agenda */}
            <SharedAgenda />

            {/* Room music sync */}
            <RoomMusic />
          </div>

          {/* Right: shared chat / notes */}
          <SharedPanel t={t} tab={tab} setTab={setTab} me={me} buddy={buddy} myName={profile?.name || 'Yuki'} buddyName="Aria" />
        </div>
      </div>
    );
  }

  function SharedAgenda() {
    const [items, setItems] = React.useState([
      { id: 1, text: '番茄 #1 · 各自寫 25 min', who: 'both', done: true },
      { id: 2, text: '5 min 互唸對方寫的東西', who: 'both', done: true },
      { id: 3, text: '番茄 #2 · 各自寫 25 min', who: 'both', done: false, current: true },
      { id: 4, text: '番茄 #3 · 改寫 + 互評', who: 'both', done: false },
      { id: 5, text: '一起去 LOFI BAR 慶祝 ✦', who: 'fun', done: false },
    ]);
    return (
      <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em' }}>● 共同行程</div>
          <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)' }}>{items.filter(x => x.done).length} / {items.length}</span>
        </div>
        {items.map((it) => (
          <div key={it.id} onClick={() => setItems(items.map(x => x.id === it.id ? { ...x, done: !x.done } : x))}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px',
              background: it.current ? 'rgba(236,72,153,0.1)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${it.current ? 'var(--accent-2)' : 'var(--panel-stroke)'}`,
              cursor: 'pointer',
              boxShadow: it.current ? 'var(--neon-glow-pink)' : 'none',
            }}>
            <span style={{
              width: 14, height: 14, border: '1px solid var(--accent-3)',
              background: it.done ? 'var(--accent-3)' : 'transparent',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {it.done && <span style={{ color: '#0a0524', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>}
            </span>
            <span style={{ flex: 1, fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: it.done ? 'var(--ink-dim)' : 'var(--ink)', textDecoration: it.done ? 'line-through' : 'none' }}>
              {it.text}
            </span>
            {it.current && <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--accent-2)', letterSpacing: '0.2em', textShadow: 'var(--neon-glow-pink)' }}>NOW</span>}
          </div>
        ))}
      </div>
    );
  }

  function RoomMusic() {
    const [playing, setPlaying] = React.useState(true);
    return (
      <div className="pixel-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Silkscreen, monospace', fontSize: 10, color: 'var(--accent-3)', letterSpacing: '0.2em' }}>
            <span><span style={{ display: 'inline-block', width: 6, height: 6, background: 'var(--accent-3)', boxShadow: 'var(--neon-glow-cyan)' }} className="blink" /> ROOM SYNC</span>
          </div>
          <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 8, color: 'var(--ink-dim)', letterSpacing: '0.2em' }}>2/2 同步中</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--neon-glow)' }}>
            <PixelSprite sprite={`
..NN.
.NNN.
NNN..
NN...
NN...
NNNN.
.NN..
`} palette={{ N: '#0a0524' }} scale={2} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Silkscreen, "Noto Sans TC", monospace', fontSize: 11, color: 'var(--ink)' }}>midnight city — lofi</span>
            <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--accent-3)', letterSpacing: '0.1em' }}>♪ 1 / 5 · lofi radio</span>
          </div>
          <button onClick={() => setPlaying(!playing)} className="pixel-btn primary" style={{ padding: '4px 8px', fontSize: 10 }}>{playing ? '⏸' : '▶'}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.1em', marginRight: 4 }}>EQ</span>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{ width: 3, height: 4 + ((i * 7) % 9), background: 'var(--accent-3)', boxShadow: 'var(--neon-glow-cyan)' }} />
          ))}
        </div>
      </div>
    );
  }

  function BuddyCard({ profile, side }) {
    const isMe = side === 'me';
    const color = isMe ? 'var(--accent)' : 'var(--accent-2)';
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', padding: 6 }}>
        <div style={{ position: 'relative' }}>
          <PixelSprite sprite={profile.avatar.sprite} palette={profile.avatar.palette} scale={3} glow={color} />
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, background: '#06d6a0', border: '2px solid var(--bg-0)' }} />
        </div>
        <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 13, color, textShadow: `0 0 6px ${color}` }}>{profile.name}</div>
        <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.15em' }}>{profile.avatar.name} · LV.{profile.level}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
          <Pill>#寫作</Pill>
          <Pill>#lofi</Pill>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4, fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)' }}>
          <span>🍅 {isMe ? 9 : 11}</span>
          <span>·</span>
          <span>⏱ {isMe ? '142' : '275'}min</span>
        </div>
      </div>
    );
  }

  function Pill({ children }) {
    return (
      <span style={{
        fontFamily: 'Silkscreen, monospace', fontSize: 8,
        padding: '1px 5px', background: 'rgba(34,211,238,0.1)',
        border: '1px solid var(--accent-3)', color: 'var(--accent-3)',
        letterSpacing: '0.1em',
      }}>{children}</span>
    );
  }

  function TypingDots() {
    const [d, setD] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(() => setD((x) => (x + 1) % 4), 350);
      return () => clearInterval(id);
    }, []);
    return (
      <div style={{ display: 'flex', gap: 2 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 4, height: 4, background: i < d ? 'var(--accent-3)' : 'var(--panel-stroke)', boxShadow: i < d ? 'var(--neon-glow-cyan)' : 'none' }} />
        ))}
      </div>
    );
  }

  // -------- Shared chat + notes --------
  function SharedPanel({ t, tab, setTab, me, buddy, myName, buddyName }) {
    return (
      <div className="pixel-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid var(--panel-stroke)', background: 'rgba(7,4,26,0.5)' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <TabBtn active={tab === 'chat'} onClick={() => setTab('chat')}>💬 {t('sharedNotes')}</TabBtn>
            <TabBtn active={tab === 'notes'} onClick={() => setTab('notes')}>✎ {t('myNotes')}</TabBtn>
          </div>
          <div style={{ display: 'flex', gap: 6, fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.15em' }}>
            <span>● LIVE</span>
            <span>·</span>
            <span>2 ONLINE</span>
          </div>
        </div>
        {tab === 'chat'
          ? <ChatStream me={me} buddy={buddy} myName={myName} buddyName={buddyName} t={t} />
          : <NotesStream t={t} />}
      </div>
    );
  }

  function TabBtn({ children, active, onClick }) {
    return (
      <button onClick={onClick} style={{
        padding: '5px 12px',
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#0a0524' : 'var(--ink-mute)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--panel-stroke)'}`,
        fontFamily: 'Silkscreen, monospace', fontSize: 11, letterSpacing: '0.1em',
        cursor: 'pointer',
      }}>{children}</button>
    );
  }

  function ChatStream({ me, buddy, myName, buddyName, t }) {
    const [messages, setMessages] = React.useState([
      { who: 'sys', kind: 'sys', text: 'ROOM #2847-A 已建立 · 你和 Aria 都同意一起寫作 25 min' },
      { who: 'buddy', kind: 'chat', text: '嗨～我打算第七章寫完，你呢？', time: '21:25' },
      { who: 'me', kind: 'chat', text: '我寫 PRD，預計兩個番茄解決', time: '21:25' },
      { who: 'buddy', kind: 'note', text: '## 共同筆記\n- 25min 後互相唸給對方聽 ✓\n- 不開鏡頭、只開麥', time: '21:26' },
      { who: 'sys', kind: 'sys', text: '🍅 第 1 顆番茄開始 · 不要分心喔' },
      { who: 'me', kind: 'chat', text: '開工！加油 ✦', time: '21:27' },
      { who: 'buddy', kind: 'chat', text: '✦', time: '21:27' },
      { who: 'sys', kind: 'sys', text: '🍅 第 1 顆番茄完成 · 你們都堅持下來了 +5 T 幣' },
      { who: 'buddy', kind: 'chat', text: '剛剛寫到一段卡住，這是寫的開頭：', time: '21:53' },
      { who: 'buddy', kind: 'note', text: '> 那座小鎮的燈光從來不熄滅，因為總有人在某個房間裡，把今晚當成新的一天的開始。', time: '21:53' },
      { who: 'me', kind: 'chat', text: '太喜歡了 · 我能截圖嗎？', time: '21:54' },
    ]);
    const [input, setInput] = React.useState('');
    const [type, setType] = React.useState('chat'); // chat | note
    const scrollRef = React.useRef(null);

    React.useEffect(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages.length]);

    const send = () => {
      if (!input.trim()) return;
      const now = new Date();
      setMessages([...messages, { who: 'me', kind: type, text: input, time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}` }]);
      setInput('');
    };

    return (
      <>
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(7,4,26,0.3)' }}>
          {messages.map((m, i) => (
            <Message key={i} m={m} me={me} buddy={buddy} myName={myName} buddyName={buddyName} />
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--panel-stroke)', padding: 10, display: 'flex', flexDirection: 'column', gap: 6, background: 'rgba(7,4,26,0.6)' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setType('chat')} style={mode(type === 'chat')}>💬 訊息</button>
            <button onClick={() => setType('note')} style={mode(type === 'note')}>✎ 筆記</button>
            <button style={mode(false)}>📎 附件</button>
            <button style={mode(false)}>🎵 分享音樂</button>
            <div style={{ flex: 1 }} />
            <button style={mode(false)}>🍅 暫停</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input className="pixel-input" placeholder={t('typeMsg')} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              style={{ flex: 1, fontSize: 12 }} />
            <button className="pixel-btn primary" onClick={send} style={{ padding: '0 18px' }}>→</button>
          </div>
        </div>
      </>
    );
  }

  function mode(active) {
    return {
      padding: '4px 10px',
      fontSize: 10,
      fontFamily: 'Silkscreen, monospace',
      background: active ? 'var(--accent)' : 'rgba(0,0,0,0.4)',
      color: active ? '#0a0524' : 'var(--ink-mute)',
      border: `1px solid ${active ? 'var(--accent)' : 'var(--panel-stroke)'}`,
      letterSpacing: '0.1em', cursor: 'pointer',
    };
  }

  function Message({ m, me, buddy, myName, buddyName }) {
    if (m.kind === 'sys') {
      return (
        <div style={{ alignSelf: 'center', fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.15em', padding: '4px 10px', background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--panel-stroke)' }}>
          {m.text}
        </div>
      );
    }
    const isMe = m.who === 'me';
    const av = isMe ? me : buddy;
    const name = isMe ? myName : buddyName;
    const color = isMe ? 'var(--accent)' : 'var(--accent-2)';
    return (
      <div style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start' }}>
        <PixelSprite sprite={av.sprite} palette={av.palette} scale={1.6} />
        <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap: 2 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-mute)' }}>
            <span style={{ color }}>{name}</span>
            <span>·</span>
            <span>{m.time}</span>
            {m.kind === 'note' && <span style={{ color: 'var(--accent-3)' }}>NOTE</span>}
          </div>
          <div style={{
            padding: m.kind === 'note' ? '8px 12px' : '6px 10px',
            background: m.kind === 'note' ? 'rgba(34,211,238,0.08)' : isMe ? 'rgba(183,148,246,0.12)' : 'rgba(236,72,153,0.1)',
            border: `1px solid ${m.kind === 'note' ? 'var(--accent-3)' : color}55`,
            fontFamily: m.kind === 'note' ? '"VT323", "Noto Sans TC", monospace' : '"Noto Sans TC", sans-serif',
            fontSize: m.kind === 'note' ? 15 : 12,
            lineHeight: 1.5,
            color: 'var(--ink)',
            whiteSpace: 'pre-wrap',
          }}>{m.text}</div>
        </div>
      </div>
    );
  }

  function NotesStream({ t }) {
    const [text, setText] = React.useState(`# 共同筆記 · 寫作番茄場
( 兩人都可以編輯 )

## 約定
- 25 min 寫，5 min 休息對唸
- 不開鏡頭只開麥
- 完成就互按 ✦

## Aria 寫的開頭
> 那座小鎮的燈光從來不熄滅，因為總有人
> 在某個房間裡，把今晚當成新的一天的開始。

## Yuki 寫的 PRD 結構
1. 動機
2. 目標用戶
3. 功能（含一起專注、共筆、配對）
4. 成功指標：留存、共同專注時長
`);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} style={{
          flex: 1,
          background: 'rgba(7,4,26,0.5)',
          color: 'var(--ink)',
          border: 'none',
          borderBottom: '1px solid var(--panel-stroke)',
          fontFamily: '"VT323", "Noto Sans TC", monospace',
          fontSize: 17,
          lineHeight: 1.45,
          padding: 16,
          resize: 'none',
          outline: 'none',
        }} />
        <div style={{ padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,4,26,0.6)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)' }}>
            <span style={{ width: 6, height: 6, background: 'var(--accent-3)', boxShadow: 'var(--neon-glow-cyan)' }} className="blink" />
            <span>Aria 正在編輯第 8 行</span>
          </div>
          <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 9, color: 'var(--ink-dim)' }}>自動儲存 · 已同步</span>
        </div>
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

  window.BuddyRoomScreen = BuddyRoomScreen;
})();
