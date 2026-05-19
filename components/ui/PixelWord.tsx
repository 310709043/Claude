'use client';

import React from 'react';
import { PixelSprite } from '@/components/pixel/PixelSprite';

const LETTERS: Record<string, string[]> = {
  F: ['#####', '#....', '####.', '#....', '#....', '#....', '#....'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#.#.#', '#.#.#', '#..##', '#...#'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

interface Props {
  text: string;
  scale?: number;
  color?: string;
  glow?: string;
  kerning?: number;
}

export function PixelWord({
  text,
  scale = 4,
  color = '#b794f6',
  glow = '#ec4899',
  kerning = 1,
}: Props) {
  const letters = text.toUpperCase().split('').map((c) => LETTERS[c] || LETTERS[' ']);
  const h = 7;
  const rows: string[] = [];
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
