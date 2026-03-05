import { Measurement, Unit } from './types';

export const CM_TO_INCH = 0.393701;
export const INCH_TO_CM = 2.54;

// Global average data based on academic research (BJUI 2015 meta-analysis)
// Length averages in cm
export const GLOBAL_STATS = {
  length: {
    average: 13.12,
    median: 13.0,
    stdDev: 1.66,
  },
  girth: {
    average: 11.66,
    median: 11.5,
    stdDev: 1.10,
  },
};

export function convertUnit(value: number, from: Unit, to: Unit): number {
  if (from === to) return value;
  if (from === 'cm' && to === 'inch') return parseFloat((value * CM_TO_INCH).toFixed(2));
  return parseFloat((value * INCH_TO_CM).toFixed(2));
}

export function toCm(value: number, unit: Unit): number {
  return unit === 'cm' ? value : value * INCH_TO_CM;
}

// Approximation of normal distribution CDF
function normalCDF(x: number, mean: number, stdDev: number): number {
  const z = (x - mean) / stdDev;
  const t = 1 / (1 + 0.2315419 * Math.abs(z));
  const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const phi = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * poly;
  return z >= 0 ? phi : 1 - phi;
}

export function calcPercentile(valueCm: number, type: 'length' | 'girth'): number {
  const stats = GLOBAL_STATS[type];
  return Math.round(normalCDF(valueCm, stats.average, stats.stdDev) * 100);
}

export function getPercentileLabel(p: number): string {
  if (p >= 90) return '非常大 (前 10%)';
  if (p >= 75) return '偏大 (前 25%)';
  if (p >= 40) return '平均範圍 (中間 50%)';
  if (p >= 25) return '偏小 (後 25%)';
  return '非常小 (後 10%)';
}

export function getPercentileColor(p: number): string {
  if (p >= 75) return '#4ade80';
  if (p >= 40) return '#60a5fa';
  if (p >= 25) return '#facc15';
  return '#f87171';
}

export function formatValue(v: number, unit: Unit): string {
  return `${v.toFixed(1)} ${unit}`;
}

export function loadHistory(): Measurement[] {
  try {
    const raw = localStorage.getItem('bma_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: Measurement[]): void {
  localStorage.setItem('bma_history', JSON.stringify(history));
}
