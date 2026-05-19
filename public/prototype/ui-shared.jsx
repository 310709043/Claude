/* Shared UI primitives: LogoMark with the real image, LangSwitcher, TCoinBadge */
(function () {
  const { LANGS, LANG_LABEL, LANG_FULL } = window;

  // Wide pixel-art wordmark logo (PNG asset). 712x284 native aspect ratio (~2.5:1).
  // Pass `size` as the desired *height* in px.
  function LogoImage({ size = 56, style = {}, glow = 'rgba(34,211,238,0.45)' }) {
    return (
      <img
        src="logo.png"
        alt="LowBatteryTown"
        style={{
          height: size, width: 'auto',
          imageRendering: 'pixelated',
          display: 'block',
          filter: `drop-shadow(0 0 ${Math.max(6, size / 8)}px ${glow})`,
          ...style,
        }}
      />
    );
  }

  // Compact battery-only mark for tight spots (square-ish)
  function LogoMark({ size = 28, style = {}, glow = 'rgba(34,211,238,0.5)' }) {
    return (
      <img
        src="logo.png"
        alt="LBT"
        style={{
          height: size, width: 'auto', maxWidth: size * 2.6,
          imageRendering: 'pixelated', display: 'block',
          filter: `drop-shadow(0 0 ${Math.max(4, size / 8)}px ${glow})`,
          ...style,
        }}
      />
    );
  }

  // Word "FOCUSTOWN" rendered as block pixel font (matches the logo's lettering)
  const LETTERS = {
    F: ['#####','#....','####.','#....','#....','#....','#....'],
    O: ['.###.','#...#','#...#','#...#','#...#','#...#','.###.'],
    C: ['.###.','#...#','#....','#....','#....','#...#','.###.'],
    U: ['#...#','#...#','#...#','#...#','#...#','#...#','.###.'],
    S: ['.####','#....','#....','.###.','....#','....#','####.'],
    T: ['#####','..#..','..#..','..#..','..#..','..#..','..#..'],
    W: ['#...#','#...#','#...#','#.#.#','#.#.#','##.##','#...#'],
    N: ['#...#','##..#','#.#.#','#.#.#','#.#.#','#..##','#...#'],
    ' ': ['.....','.....','.....','.....','.....','.....','.....'],
  };

  function PixelWord({ text, scale = 4, color = '#b794f6', glow = '#ec4899', kerning = 1 }) {
    const { PixelSprite } = window;
    const letters = text.toUpperCase().split('').map((c) => LETTERS[c] || LETTERS[' ']);
    const h = 7;
    const rows = [];
    for (let r = 0; r < h; r++) {
      let line = '';
      letters.forEach((g, i) => {
        line += g[r].replaceAll('#', 'B').replaceAll('.', '.');
        if (i < letters.length - 1) line += '.'.repeat(kerning);
      });
      rows.push(line);
    }
    const sprite = rows.join('\n');
    return <PixelSprite sprite={sprite} palette={{ B: color }} scale={scale} glow={glow} />;
  }

  // Language switcher
  function LangSwitcher({ lang, onChange, compact = false }) {
    return (
      <div style={{
        display: 'inline-flex', border: '1px solid var(--panel-stroke)',
        background: 'rgba(7,4,26,0.7)',
        fontFamily: 'Silkscreen, monospace', fontSize: compact ? 9 : 10,
      }}>
        {LANGS.map((l) => (
          <button key={l} onClick={() => onChange(l)} style={{
            padding: compact ? '4px 8px' : '5px 10px',
            border: 'none',
            borderRight: l !== 'ja' ? '1px solid var(--panel-stroke)' : 'none',
            background: lang === l ? 'var(--accent)' : 'transparent',
            color: lang === l ? '#0a0524' : 'var(--ink-mute)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.1em',
            fontWeight: lang === l ? 700 : 400,
            transition: 'all 0.12s steps(2)',
          }}>{LANG_LABEL[l]}</button>
        ))}
      </div>
    );
  }

  // T-coin badge
  function TCoinBadge({ amount = 247, delta = 0, label = 'T-COIN' }) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 10px',
        background: 'linear-gradient(180deg, rgba(252,211,77,0.15), rgba(252,211,77,0.05))',
        border: '1px solid var(--accent-4)',
        boxShadow: '0 0 8px rgba(252,211,77,0.3), inset 0 0 8px rgba(252,211,77,0.1)',
        fontFamily: 'Silkscreen, monospace',
        letterSpacing: '0.1em',
        position: 'relative',
      }}>
        {/* Coin icon (pixel) */}
        <CoinIcon scale={2} />
        <span style={{ fontSize: 13, color: 'var(--accent-4)', fontWeight: 700, textShadow: '0 0 6px var(--accent-4)' }}>{amount.toLocaleString()}</span>
        <span style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.2em' }}>{label}</span>
        {delta > 0 && (
          <span style={{ fontSize: 9, color: '#6ee7b7', textShadow: '0 0 4px #6ee7b7' }}>+{delta}</span>
        )}
      </div>
    );
  }

  function CoinIcon({ scale = 3 }) {
    const { PixelSprite } = window;
    const sprite = `
.OOOO.
OYYYYO
OYTYYO
OYTTYO
OYTYYO
OYYYYO
.OOOO.
`;
    return <PixelSprite sprite={sprite} palette={{ O: '#92400e', Y: '#fbbf24', T: '#fcd34d' }} scale={scale} glow="rgba(252,211,77,0.5)" />;
  }

  // Small star tile reused everywhere
  const STAR_TINY = `
.Y.
YYY
.Y.
`;

  // Corner deco for panels
  function CornerDeco({ color = 'var(--accent)' }) {
    const c = { position: 'absolute', width: 12, height: 12 };
    return (
      <>
        <span style={{ ...c, top: -1, left: -1, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
        <span style={{ ...c, top: -1, right: -1, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
        <span style={{ ...c, bottom: -1, left: -1, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
        <span style={{ ...c, bottom: -1, right: -1, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      </>
    );
  }

  Object.assign(window, { LogoImage, LogoMark, PixelWord, LangSwitcher, TCoinBadge, CoinIcon, CornerDeco, STAR_TINY });
})();
