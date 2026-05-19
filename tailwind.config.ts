import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-tc)', 'ui-sans-serif', 'system-ui'],
        silkscreen: ['var(--font-silkscreen)', '"Press Start 2P"', 'monospace'],
        ps2p: ['var(--font-press-start)', 'monospace'],
        vt: ['var(--font-vt323)', 'monospace'],
        dot: ['var(--font-dot-gothic)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
