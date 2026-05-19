/* Pixel sprite system
   Sprites are written as multi-line strings where each character is a pixel.
   "." or " " = transparent.  Any other char looks up a color in the palette.
   spriteToDataURL converts to a data: URL we can use in <img> or background.
*/

(function () {
  const cache = new Map();

  function spriteToCanvas(sprite, palette) {
    const lines = sprite.replace(/^\n+/, '').replace(/\n+$/, '').split('\n');
    const h = lines.length;
    const w = Math.max(...lines.map((l) => l.length));
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    for (let y = 0; y < h; y++) {
      const row = lines[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === '.' || ch === ' ') continue;
        const col = palette[ch];
        if (!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }

  function spriteToDataURL(sprite, palette) {
    const key = sprite + '|' + JSON.stringify(palette);
    if (cache.has(key)) return cache.get(key);
    const c = spriteToCanvas(sprite, palette);
    const url = c.toDataURL();
    cache.set(key, url);
    return url;
  }

  function spriteSize(sprite) {
    const lines = sprite.replace(/^\n+/, '').replace(/\n+$/, '').split('\n');
    return { w: Math.max(...lines.map((l) => l.length)), h: lines.length };
  }

  // React component: <PixelSprite sprite={s} palette={p} scale={4} />
  function PixelSprite({ sprite, palette, scale = 4, style = {}, className = '', flip = false, glow = null }) {
    const { w, h } = React.useMemo(() => spriteSize(sprite), [sprite]);
    const url = React.useMemo(() => spriteToDataURL(sprite, palette), [sprite, palette]);
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          width: w * scale,
          height: h * scale,
          backgroundImage: `url(${url})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          imageRendering: 'pixelated',
          transform: flip ? 'scaleX(-1)' : undefined,
          filter: glow ? `drop-shadow(0 0 ${scale}px ${glow})` : undefined,
          ...style,
        }}
      />
    );
  }

  // Animated multi-frame sprite. frames = array of sprite strings (same palette/size)
  function AnimatedSprite({ frames, palette, scale = 4, fps = 4, style = {}, flip = false, glow = null }) {
    const [idx, setIdx] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(() => setIdx((i) => (i + 1) % frames.length), 1000 / fps);
      return () => clearInterval(id);
    }, [frames.length, fps]);
    return <PixelSprite sprite={frames[idx]} palette={palette} scale={scale} style={style} flip={flip} glow={glow} />;
  }

  // Random pixel star field rendered to canvas
  function StarField({ width, height, density = 0.0015, palette = ['#fff', '#cfd', '#dcf', '#ffd'], twinkle = true }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const c = ref.current;
      if (!c) return;
      c.width = width; c.height = height;
      const ctx = c.getContext('2d');
      const n = Math.floor(width * height * density);
      const stars = [];
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          col: palette[Math.floor(Math.random() * palette.length)],
          phase: Math.random() * Math.PI * 2,
          big: Math.random() < 0.04,
        });
      }
      let raf;
      const draw = (t) => {
        ctx.clearRect(0, 0, width, height);
        for (const s of stars) {
          const a = twinkle ? 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t / 700 + s.phase)) : 1;
          ctx.globalAlpha = a;
          ctx.fillStyle = s.col;
          if (s.big) {
            ctx.fillRect(s.x, s.y, 1, 1);
            ctx.fillRect(s.x - 1, s.y, 1, 1);
            ctx.fillRect(s.x + 1, s.y, 1, 1);
            ctx.fillRect(s.x, s.y - 1, 1, 1);
            ctx.fillRect(s.x, s.y + 1, 1, 1);
          } else {
            ctx.fillRect(s.x, s.y, 1, 1);
          }
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(raf);
    }, [width, height, density]);
    return <canvas ref={ref} style={{ width, height, imageRendering: 'pixelated', display: 'block' }} />;
  }

  // Shooting star animation
  function ShootingStars({ width, height }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const c = ref.current; if (!c) return;
      c.width = width; c.height = height;
      const ctx = c.getContext('2d');
      const stars = [];
      let last = 0;
      let raf;
      const spawn = () => stars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        vx: 2 + Math.random() * 2,
        vy: 0.6 + Math.random() * 0.4,
        life: 0,
        max: 40 + Math.random() * 20,
      });
      const tick = (t) => {
        ctx.clearRect(0, 0, width, height);
        if (t - last > 2500 + Math.random() * 4000) { spawn(); last = t; }
        for (let i = stars.length - 1; i >= 0; i--) {
          const s = stars[i];
          s.x += s.vx; s.y += s.vy; s.life++;
          if (s.life > s.max) { stars.splice(i, 1); continue; }
          // tail
          for (let k = 0; k < 8; k++) {
            const a = 1 - k / 8;
            ctx.globalAlpha = a * (1 - s.life / s.max);
            ctx.fillStyle = '#fff';
            ctx.fillRect(s.x - k * s.vx, s.y - k * s.vy, 1, 1);
          }
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [width, height]);
    return <canvas ref={ref} style={{ width, height, position: 'absolute', inset: 0, imageRendering: 'pixelated', pointerEvents: 'none' }} />;
  }

  // Rain particles for "rain" direction
  function RainOverlay({ width, height, color = '#00f5d4', density = 1 }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const c = ref.current; if (!c) return;
      c.width = width; c.height = height;
      const ctx = c.getContext('2d');
      const drops = [];
      const n = Math.floor(width / 8 * density);
      for (let i = 0; i < n; i++) drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        v: 6 + Math.random() * 6,
        len: 4 + Math.floor(Math.random() * 6),
      });
      let raf;
      const tick = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = color;
        for (const d of drops) {
          d.y += d.v;
          d.x -= d.v * 0.3;
          if (d.y > height) { d.y = -d.len; d.x = Math.random() * width + width * 0.2; }
          for (let k = 0; k < d.len; k++) {
            ctx.globalAlpha = (1 - k / d.len) * 0.35;
            ctx.fillRect(d.x + k * 0.3, d.y - k, 1, 1);
          }
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [width, height, color, density]);
    return <canvas ref={ref} style={{ width, height, position: 'absolute', inset: 0, imageRendering: 'pixelated', pointerEvents: 'none', opacity: 0.7 }} />;
  }

  // Pixel-grid "logo" letters
  // 5x7 font for tiny labels (only what we need)
  const FONT5x7 = {
    F: ['11111','10000','10000','11110','10000','10000','10000'],
    T: ['11111','00100','00100','00100','00100','00100','00100'],
    O: ['01110','10001','10001','10001','10001','10001','01110'],
    C: ['01110','10001','10000','10000','10000','10001','01110'],
    U: ['10001','10001','10001','10001','10001','10001','01110'],
    S: ['01111','10000','10000','01110','00001','00001','11110'],
    W: ['10001','10001','10001','10101','10101','11011','10001'],
    N: ['10001','11001','10101','10101','10101','10011','10001'],
  };

  function FT_BIG_LOGO({ scale = 6, color = '#b794f6', glow = '#ec4899' }) {
    // Big F and T blocky logo (the "FT" tile in the user's screenshot)
    const sprite = `
.....BBBBBBBBB.BBBBBBBBB.....
.....BBBBBBBBB.BBBBBBBBB.....
.....BB........BBBBBBBBB.....
.....BB........BBBBBBBBB.....
.....BB............BB........
.....BBBBBBBB......BB........
.....BBBBBBBB......BB........
.....BB............BB........
.....BB............BB........
.....BB............BB........
`;
    return <PixelSprite sprite={sprite} palette={{ B: color }} scale={scale} glow={glow} />;
  }

  Object.assign(window, { spriteToDataURL, spriteToCanvas, PixelSprite, AnimatedSprite, StarField, ShootingStars, RainOverlay, FT_BIG_LOGO });
})();
