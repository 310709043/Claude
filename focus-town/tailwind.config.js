/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        // Scene palettes
        dawn:  { sky: '#ff6b9d', mid: '#c44569', horizon: '#f8a5c2', building: '#2c2c54' },
        day:   { sky: '#48dbfb', mid: '#0abde3', horizon: '#ffeaa7', building: '#2d3436' },
        dusk:  { sky: '#fd79a8', mid: '#e17055', horizon: '#fdcb6e', building: '#2d3436' },
        night: { sky: '#0f0c29', mid: '#1a1a2e', horizon: '#16213e', building: '#0f0c29' },
        rainy: { sky: '#636e72', mid: '#2d3436', horizon: '#74b9ff', building: '#2d3436' },
        stormy:{ sky: '#2d3436', mid: '#1e272e', horizon: '#485460', building: '#1e272e' },
        // Lofi brand
        lofi: {
          purple: '#6c5ce7',
          pink:   '#fd79a8',
          blue:   '#74b9ff',
          yellow: '#ffeaa7',
          green:  '#55efc4',
          dark:   '#0f0c29',
        },
      },
      animation: {
        'car-scroll':    'carScroll 12s linear infinite',
        'building-glow': 'buildingGlow 3s ease-in-out infinite',
        'rain':          'rain 0.8s linear infinite',
        'ticker':        'ticker 40s linear infinite',
        'float':         'float 3s ease-in-out infinite',
        'scanline':      'scanline 8s linear infinite',
        'flicker':       'flicker 0.15s infinite',
        'shooting-star': 'shootingStar 1.5s ease-out forwards',
        'firefly':       'firefly 4s ease-in-out infinite',
        'breathing':     'breathing 2s ease-in-out infinite',
        'parallax-slow': 'parallax 60s linear infinite',
        'parallax-mid':  'parallax 30s linear infinite',
        'parallax-fast': 'parallax 15s linear infinite',
      },
      keyframes: {
        carScroll: {
          '0%':   { transform: 'translateX(110%)' },
          '100%': { transform: 'translateX(-110%)' },
        },
        buildingGlow: {
          '0%, 100%': { opacity: '0.9' },
          '50%':      { opacity: '1' },
        },
        rain: {
          '0%':   { transform: 'translateY(-100vh) translateX(0px)' },
          '100%': { transform: 'translateY(100vh) translateX(-20px)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        shootingStar: {
          '0%':   { transform: 'translateX(0) translateY(0)', opacity: '1' },
          '100%': { transform: 'translateX(300px) translateY(300px)', opacity: '0' },
        },
        firefly: {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.8' },
          '25%':      { transform: 'translate(20px, -15px)', opacity: '1' },
          '50%':      { transform: 'translate(-10px, -25px)', opacity: '0.6' },
          '75%':      { transform: 'translate(-20px, -10px)', opacity: '1' },
        },
        breathing: {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(255,255,200,0.6)' },
          '50%':      { boxShadow: '0 0 16px 6px rgba(255,255,200,0.9)' },
        },
        parallax: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'pixel-grid': 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)',
      },
    },
  },
  plugins: [],
};
