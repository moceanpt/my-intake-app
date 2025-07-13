/* ------------------------------------------------------------------
   lib/objective/circulation.ts
   – Total Circulation Score combining OmniFit PPG + HeartMath
------------------------------------------------------------------- */

import { z } from 'zod';
import type { MetricSchema } from '../metrics/types';

/* ──────────────────────────────────────────────────────────────
   1.  Zod schema — validates the combined data
   ──────────────────────────────────────────────────────────── */
export const circulationSchema = z.object({
  // OmniFit PPG metrics
  hrv_index: z.number().positive().optional(),
  stress: z.number().int().min(0).max(100).optional(),
  ans_health: z.number().positive().optional(),
  ans_age: z.number().int().positive().optional(),
  lf: z.number().positive().optional(),
  hf: z.number().positive().optional(),
  
  // HeartMath metrics
  sdnn_ms: z.number().positive().optional(),
  rmssd_ms: z.number().positive().optional(),
  total_power: z.number().positive().optional(),
  lf_power: z.number().positive().optional(),
  hf_power: z.number().positive().optional(),
  lf_hf_ratio: z.number().positive().optional(),
  normalized_coherence_pct: z.number().nonnegative().optional(),
});

export type CirculationInput = z.infer<typeof circulationSchema>;
export const circulationKeys = circulationSchema.keyof().options;

/* ──────────────────────────────────────────────────────────────
   2.  New MetricSchema for DeviceForm
   ──────────────────────────────────────────────────────────── */
export const circulationMetricSchema: MetricSchema = {
  slug: 'circulation',
  title: 'Total Circulation Score (OmniFit PPG + HeartMath)',
  fields: [
    // OmniFit PPG fields
    { name: 'hrv_index', label: 'HRV Index (OmniFit)', widget: 'number' as const, step: 0.1, section: 'OmniFit PPG' },
    { name: 'stress', label: 'Stress Level (0-100)', widget: 'number' as const, step: 1, section: 'OmniFit PPG' },
    { name: 'ans_health', label: 'ANS Health Score', widget: 'number' as const, step: 0.01, section: 'OmniFit PPG' },
    { name: 'ans_age', label: 'ANS Age (years)', widget: 'number' as const, step: 1, section: 'OmniFit PPG' },
    { name: 'lf', label: 'LF Power (log ms²)', widget: 'number' as const, step: 0.01, section: 'OmniFit PPG' },
    { name: 'hf', label: 'HF Power (log ms²)', widget: 'number' as const, step: 0.01, section: 'OmniFit PPG' },
    
    // HeartMath fields
    { name: 'sdnn_ms', label: 'SDNN (ms)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'rmssd_ms', label: 'RMSSD (ms)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'total_power', label: 'Total Power (ms²)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'lf_power', label: 'LF Power (ms²)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'hf_power', label: 'HF Power (ms²)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'lf_hf_ratio', label: 'LF/HF Ratio', widget: 'number' as const, step: 0.01, section: 'HeartMath' },
    { name: 'normalized_coherence_pct', label: 'Normalized Coherence (%)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
  ]
};

/* ──────────────────────────────────────────────────────────────
   3.  Color band logic
   ──────────────────────────────────────────────────────────── */
// Total Circulation Score color band logic
function circulationColorBand(score: number) {
  if (score >= 80) return { color: 'dark-green', label: 'Optimal' };
  if (score >= 60) return { color: 'yellow', label: 'Mild imbalance' };
  if (score >= 40) return { color: 'orange', label: 'High-risk imbalance' };
  return { color: 'red', label: 'Critical – immediate attention' };
}

/* ──────────────────────────────────────────────────────────────
   4.  Scorer — combines OmniFit PPG + HeartMath
   ──────────────────────────────────────────────────────────── */
export function scoreCirculation(data: CirculationInput) {
  const result: any = { bands: {} };
  let total_pts = 0;
  let metric_count = 0;

  // OmniFit PPG Scoring
  if (data.hrv_index !== undefined) {
    metric_count++;
    let hrv_pts = 0;
    if (data.hrv_index < 5.0) hrv_pts = 8; // Danger
    else if (data.hrv_index < 6.0) hrv_pts = 6; // Warning
    else if (data.hrv_index < 10.0) hrv_pts = 4; // Normal
    else if (data.hrv_index < 13.0) hrv_pts = 2; // Good
    else hrv_pts = 0; // Very Good
    total_pts += hrv_pts;
    result.bands.hrv_index = { score: 100 - (hrv_pts * 100 / 8) };
  }

  if (data.stress !== undefined) {
    metric_count++;
    let stress_pts = 0;
    if (data.stress >= 80) stress_pts = 8; // Very High
    else if (data.stress >= 60) stress_pts = 6; // High
    else if (data.stress >= 40) stress_pts = 4; // Average
    else if (data.stress >= 20) stress_pts = 2; // Low
    else stress_pts = 0; // Very Low
    total_pts += stress_pts;
    result.bands.stress = { score: 100 - (stress_pts * 100 / 8) };
  }

  if (data.ans_health !== undefined) {
    metric_count++;
    let ans_pts = 0;
    if (data.ans_health < 3) ans_pts = 8; // Danger
    else if (data.ans_health < 5) ans_pts = 6; // Warning
    else if (data.ans_health < 7) ans_pts = 4; // Normal
    else if (data.ans_health < 9) ans_pts = 2; // Good
    else ans_pts = 0; // Very Good
    total_pts += ans_pts;
    result.bands.ans_health = { score: 100 - (ans_pts * 100 / 8) };
  }

  if (data.ans_age !== undefined) {
    metric_count++;
    let age_pts = 0;
    if (data.ans_age > 9) age_pts = 8; // Danger
    else if (data.ans_age > 4) age_pts = 6; // Warning
    else if (data.ans_age > -5) age_pts = 4; // Normal
    else if (data.ans_age > -10) age_pts = 2; // Good
    else age_pts = 0; // Excellent
    total_pts += age_pts;
    result.bands.ans_age = { score: 100 - (age_pts * 100 / 8) };
  }

  if (data.lf !== undefined) {
    metric_count++;
    let lf_pts = 0;
    if (data.lf < 2.0) lf_pts = 8; // Very Low
    else if (data.lf < 3.59) lf_pts = 6; // Low
    else if (data.lf < 6.0) lf_pts = 4; // Normal
    else if (data.lf < 10.0) lf_pts = 2; // High
    else lf_pts = 0; // Very High
    total_pts += lf_pts;
    result.bands.lf = { score: 100 - (lf_pts * 100 / 8) };
  }

  if (data.hf !== undefined) {
    metric_count++;
    let hf_pts = 0;
    if (data.hf < 2.0) hf_pts = 8; // Very Low
    else if (data.hf < 4.0) hf_pts = 6; // Low
    else if (data.hf < 6.0) hf_pts = 4; // Normal
    else if (data.hf < 10.0) hf_pts = 2; // High
    else hf_pts = 0; // Very High
    total_pts += hf_pts;
    result.bands.hf = { score: 100 - (hf_pts * 100 / 8) };
  }

  // HeartMath Scoring
  if (data.sdnn_ms !== undefined) {
    metric_count++;
    let sdnn_pts = 0;
    if (data.sdnn_ms < 30) sdnn_pts = 8; // Red
    else if (data.sdnn_ms < 45) sdnn_pts = 6; // Orange
    else if (data.sdnn_ms < 50) sdnn_pts = 4; // Yellow
    else sdnn_pts = 0; // Green
    total_pts += sdnn_pts;
    result.bands.sdnn_ms = { score: 100 - (sdnn_pts * 100 / 8) };
  }

  if (data.rmssd_ms !== undefined) {
    metric_count++;
    let rmssd_pts = 0;
    if (data.rmssd_ms < 20) rmssd_pts = 8; // Red
    else if (data.rmssd_ms < 35) rmssd_pts = 6; // Orange
    else if (data.rmssd_ms < 40) rmssd_pts = 4; // Yellow
    else rmssd_pts = 0; // Green
    total_pts += rmssd_pts;
    result.bands.rmssd_ms = { score: 100 - (rmssd_pts * 100 / 8) };
  }

  if (data.total_power !== undefined) {
    metric_count++;
    let tp_pts = 0;
    if (data.total_power < 500) tp_pts = 8; // Red
    else if (data.total_power < 750) tp_pts = 6; // Orange
    else if (data.total_power < 1000) tp_pts = 4; // Yellow
    else tp_pts = 0; // Green
    total_pts += tp_pts;
    result.bands.total_power = { score: 100 - (tp_pts * 100 / 8) };
  }

  if (data.lf_power !== undefined) {
    metric_count++;
    let lf_power_pts = 0;
    if (data.lf_power < 100) lf_power_pts = 8; // Red
    else if (data.lf_power < 200) lf_power_pts = 6; // Orange
    else if (data.lf_power < 300) lf_power_pts = 4; // Yellow
    else if (data.lf_power > 1170) lf_power_pts = 6; // Orange (too high)
    else lf_power_pts = 0; // Green
    total_pts += lf_power_pts;
    result.bands.lf_power = { score: 100 - (lf_power_pts * 100 / 8) };
  }

  if (data.hf_power !== undefined) {
    metric_count++;
    let hf_power_pts = 0;
    if (data.hf_power < 100) hf_power_pts = 8; // Red
    else if (data.hf_power < 200) hf_power_pts = 6; // Orange
    else if (data.hf_power < 300) hf_power_pts = 4; // Yellow
    else if (data.hf_power > 975) hf_power_pts = 6; // Orange (too high)
    else hf_power_pts = 0; // Green
    total_pts += hf_power_pts;
    result.bands.hf_power = { score: 100 - (hf_power_pts * 100 / 8) };
  }

  if (data.lf_hf_ratio !== undefined) {
    metric_count++;
    let lfhf_pts = 0;
    if (data.lf_hf_ratio < 0.20 || data.lf_hf_ratio > 4.0) lfhf_pts = 8; // Red
    else if ((data.lf_hf_ratio >= 0.21 && data.lf_hf_ratio < 0.79) || (data.lf_hf_ratio > 2.01 && data.lf_hf_ratio <= 4.0)) lfhf_pts = 6; // Orange
    else if ((data.lf_hf_ratio >= 0.8 && data.lf_hf_ratio < 0.99) || (data.lf_hf_ratio > 1.01 && data.lf_hf_ratio <= 1.25)) lfhf_pts = 4; // Yellow
    else lfhf_pts = 0; // Green
    total_pts += lfhf_pts;
    result.bands.lf_hf_ratio = { score: 100 - (lfhf_pts * 100 / 8) };
  }

  if (data.normalized_coherence_pct !== undefined) {
    metric_count++;
    let coh_pts = 0;
    if (data.normalized_coherence_pct < 30) coh_pts = 8; // Red
    else if (data.normalized_coherence_pct < 50) coh_pts = 6; // Orange
    else if (data.normalized_coherence_pct < 60) coh_pts = 4; // Yellow
    else coh_pts = 0; // Green
    total_pts += coh_pts;
    result.bands.normalized_coherence_pct = { score: 100 - (coh_pts * 100 / 8) };
  }

  // Calculate Total Circulation Score
  const max_possible_pts = metric_count * 8;
  const Circulation_Score = max_possible_pts > 0 ? 100 - (total_pts * 100 / max_possible_pts) : 100;

  // Add total Circulation Score with color banding
  result.bands.circulation_score = circulationColorBand(Circulation_Score);
  result.bands.circulation_score.score = Circulation_Score;

  result.radar = { circulation: Circulation_Score };
  result.bucket = { circulation: Circulation_Score };
  return result;
}

/* ──────────────────────────────────────────────────────────────
   4.  Form configuration — for staff data entry (legacy)
   ──────────────────────────────────────────────────────────── */
export const FORM = [
  // OmniFit PPG fields
  ['hrv_index', 'HRV Index (OmniFit)', 0.1, 1, 20],
  ['stress', 'Stress Level (0-100)', 1, 0, 100],
  ['ans_health', 'ANS Health Score', 0.01, 1, 15],
  ['ans_age', 'ANS Age (years)', 1, 10, 80],
  ['lf', 'LF Power (log ms²)', 0.01, 0.1, 50],
  ['hf', 'HF Power (log ms²)', 0.01, 0.1, 50],
  
  // HeartMath fields
  ['sdnn_ms', 'SDNN (ms)', 0.1, 10, 100],
  ['rmssd_ms', 'RMSSD (ms)', 0.1, 10, 100],
  ['total_power', 'Total Power (ms²)', 0.1, 100, 5000],
  ['lf_power', 'LF Power (ms²)', 0.1, 50, 2000],
  ['hf_power', 'HF Power (ms²)', 0.1, 50, 2000],
  ['lf_hf_ratio', 'LF/HF Ratio', 0.01, 0.1, 10],
  ['normalized_coherence_pct', 'Normalized Coherence (%)', 0.1, 0, 100],
] as const;

/* ──────────────────────────────────────────────────────────────
   5.  Registry export
   ──────────────────────────────────────────────────────────── */
export const circulationModule = {
  slug: 'circulation',
  zod: circulationSchema,
  ui: circulationMetricSchema,
  scorer: scoreCirculation,
} as const;

export default circulationModule; 