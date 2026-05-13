'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Volume2 } from 'lucide-react';

const DEFAULT_STATIONS = [
  { name: 'Lofi Hip-hop', url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1' },
  { name: 'Jazz Cafe', url: 'https://www.youtube.com/embed/Dx5qFachd3A?autoplay=1' },
  { name: 'Ambient Study', url: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1' },
];

function VisualizerBar({ delay }: { delay: number }) {
  return (
    <motion.div
      className="w-1 bg-purple-400"
      style={{ minHeight: 2 }}
      animate={{ height: [4, 16, 6, 12, 4] }}
      transition={{ duration: 0.8, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

export function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [volume, setVolume] = useState(70);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedUrl = activeStation || (customUrl ? toEmbedUrl(customUrl) : null);

  function toEmbedUrl(url: string): string {
    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    // Spotify
    const spMatch = url.match(/spotify\.com\/(track|playlist|album)\/([^?]+)/);
    if (spMatch) return `https://open.spotify.com/embed/${spMatch[1]}/${spMatch[2]}`;
    return url;
  }

  return (
    <motion.div
      className="pixel-card w-64"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-3"
        style={{ borderBottom: open ? '1px solid rgba(108,92,231,0.3)' : 'none' }}
      >
        <div className="flex items-center gap-2">
          <Music size={12} color="#fd79a8" />
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#fd79a8' }}>MUSIC</span>
        </div>
        {/* Mini visualizer when playing */}
        {playing && (
          <div className="flex items-end gap-0.5 h-4">
            {[0.1, 0.3, 0.5, 0.2, 0.4].map((d, i) => (
              <VisualizerBar key={i} delay={d} />
            ))}
          </div>
        )}
        {!playing && <span style={{ fontSize: 8, color: '#636e72' }}>▼</span>}
      </button>

      {open && (
        <div className="p-3 space-y-3">
          {/* Stations */}
          <div className="space-y-1">
            {DEFAULT_STATIONS.map(station => (
              <button
                key={station.name}
                onClick={() => { setActiveStation(station.url); setPlaying(true); }}
                className="w-full text-left px-2 py-1.5 hover:bg-purple-900/40 transition-colors"
                style={{
                  fontFamily: '"Press Start 2P"', fontSize: 6,
                  color: activeStation === station.url ? '#ffeaa7' : '#a29bfe',
                  border: activeStation === station.url ? '1px solid rgba(255,238,167,0.3)' : '1px solid transparent',
                  background: activeStation === station.url ? 'rgba(108,92,231,0.2)' : 'transparent',
                }}
              >
                {activeStation === station.url ? '▶ ' : '  '}{station.name}
              </button>
            ))}
          </div>

          {/* Custom URL */}
          <div className="space-y-1">
            <input
              type="text"
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              placeholder="YouTube / Spotify URL"
              className="w-full px-2 py-1 text-xs outline-none"
              style={{
                fontFamily: '"Share Tech Mono"', fontSize: 9,
                background: 'rgba(15,12,41,0.6)', border: '1px solid rgba(108,92,231,0.3)',
                color: '#dfe6e9',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && customUrl) {
                  setActiveStation(null);
                  setPlaying(true);
                }
              }}
            />
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 size={10} color="#a29bfe" />
            <input
              type="range" min={0} max={100} value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="flex-1 accent-purple-500"
              style={{ height: 4 }}
            />
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#a29bfe', minWidth: 24 }}>
              {volume}%
            </span>
          </div>

          {/* Hidden iframe for playback */}
          {embedUrl && playing && (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              allow="autoplay; encrypted-media"
              style={{ width: '100%', height: 80, border: 'none' }}
              title="music-player"
            />
          )}
        </div>
      )}
    </motion.div>
  );
}
