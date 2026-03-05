export type Unit = 'cm' | 'inch';

export interface Measurement {
  id: string;
  date: string;
  length: number;
  girth: number;
  unit: Unit;
  note?: string;
}

export interface Stats {
  average: number;
  median: number;
  percentile: number;
}
