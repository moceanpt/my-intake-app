/* ------------------------------------------------------------------
   lib/objective/nervous.ts
   – Nervous System Score using OmniFit EEG + HeartMath + OmniFit PPG
------------------------------------------------------------------- */

import { z } from 'zod';
import type { MetricSchema } from '../metrics/types';

/* ──────────────────────────────────────────────────────────────
   1.  Zod schema — validates the EEG data
   ──────────────────────────────────────────────────────────── */
export const nervousSchema = z.object({
  // OmniFit EEG metrics for nervous system assessment
  brain_score: z.number().min(0).max(100).optional(),
  mental_stress: z.number().min(0).max(10).optional(),
  intrinsic_eeg_pf: z.number().positive().optional(),
  brain_workload: z.number().positive().optional(),
  
  // HeartMath metrics for nervous system assessment
  lf_hf_ratio: z.number().positive().optional(),
  hf_power: z.number().positive().optional(),
  rmssd_ms: z.number().positive().optional(),
  normalized_coherence_pct: z.number().nonnegative().optional(),
  
  // OmniFit PPG metrics for nervous system assessment
  stress: z.number().int().min(0).max(100).optional(),
  ans_health: z.number().positive().optional(),
  ans_age: z.number().int().positive().optional(),
});

export type NervousInput = z.infer<typeof nervousSchema>;
export const nervousKeys = nervousSchema.keyof().options;

/* ──────────────────────────────────────────────────────────────
   2.  New MetricSchema for DeviceForm
   ──────────────────────────────────────────────────────────── */
export const nervousMetricSchema: MetricSchema = {
  slug: 'nervous',
  title: 'Nervous System Score (OmniFit EEG + HeartMath + OmniFit PPG)',
  fields: [
    // OmniFit EEG fields
    { name: 'brain_score', label: 'Overall Brain Function Score (0-100)', widget: 'number' as const, step: 0.1, section: 'OmniFit EEG' },
    { name: 'mental_stress', label: 'Mental Stress Level (0-10)', widget: 'number' as const, step: 0.1, section: 'OmniFit EEG' },
    { name: 'intrinsic_eeg_pf', label: 'Intrinsic EEG Performance Factor (Hz)', widget: 'number' as const, step: 0.01, section: 'OmniFit EEG' },
    { name: 'brain_workload', label: 'Brain Workload Index (Hz)', widget: 'number' as const, step: 0.1, section: 'OmniFit EEG' },
    
    // HeartMath fields
    { name: 'lf_hf_ratio', label: 'LF/HF Ratio', widget: 'number' as const, step: 0.01, section: 'HeartMath' },
    { name: 'hf_power', label: 'HF Power (ms²)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'rmssd_ms', label: 'RMSSD (ms)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'normalized_coherence_pct', label: 'Normalized Coherence (%)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    
    // OmniFit PPG fields
    { name: 'stress', label: 'Stress Level (0-100)', widget: 'number' as const, step: 1, section: 'OmniFit PPG' },
    { name: 'ans_health', label: 'ANS Health Score', widget: 'number' as const, step: 0.01, section: 'OmniFit PPG' },
    { name: 'ans_age', label: 'ANS Age (years)', widget: 'number' as const, step: 1, section: 'OmniFit PPG' },
  ]
};

/* ──────────────────────────────────────────────────────────────
   3.  Color banding functions
   ──────────────────────────────────────────────────────────── */
function bandColor(score: number) {
  if (score === 4) return { color: 'dark-green', label: 'Optimal' };
  if (score === 3) return { color: 'yellow', label: 'Mild deviation' };
  if (score === 2) return { color: 'orange', label: 'Moderate deviation' };
  return { color: 'red', label: 'High-risk' };
}

function nervousColorBand(score: number) {
  if (score >= 80) return { color: 'dark-green', label: 'Optimal' };
  if (score >= 60) return { color: 'yellow', label: 'Mild deviation' };
  if (score >= 40) return { color: 'orange', label: 'Moderate deviation' };
  return { color: 'red', label: 'High-risk – immediate attention' };
}

/* ──────────────────────────────────────────────────────────────
   4.  Scorer — focuses on EEG metrics for nervous system health
   ──────────────────────────────────────────────────────────── */
export function scoreNervous(data: NervousInput) {
  const result: any = { bands: {} };
  let total_pts = 0;
  let metric_count = 0;

  // Overall Brain Function Score (0-100) - 4 points
  if (data.brain_score !== undefined) {
    metric_count++;
    let brain_pts = 1;
    if (data.brain_score >= 80) brain_pts = 4; // Green (Optimal)
    else if (data.brain_score >= 60) brain_pts = 3; // Yellow (Mild)
    else if (data.brain_score >= 40) brain_pts = 2; // Orange (Moderate)
    else brain_pts = 1; // Red (High-risk)
    result.bands.brain_score = { ...bandColor(brain_pts), score: (brain_pts * 100) / 4 };
    total_pts += brain_pts;
  }

  // Mental Stress Level (0-10) - 4 points
  if (data.mental_stress !== undefined) {
    metric_count++;
    let stress_pts = 1;
    if (data.mental_stress < 3) stress_pts = 4; // Green (Optimal)
    else if (data.mental_stress < 5) stress_pts = 3; // Yellow (Mild)
    else if (data.mental_stress < 7) stress_pts = 2; // Orange (Moderate)
    else stress_pts = 1; // Red (High-risk)
    result.bands.mental_stress = { ...bandColor(stress_pts), score: (stress_pts * 100) / 4 };
    total_pts += stress_pts;
  }

  // Intrinsic EEG Performance Factor (Peak α-freq, Hz) - 4 points
  if (data.intrinsic_eeg_pf !== undefined) {
    metric_count++;
    let pf_pts = 1;
    if (data.intrinsic_eeg_pf >= 9.0) pf_pts = 4; // Green (Optimal)
    else if (data.intrinsic_eeg_pf >= 8.0) pf_pts = 3; // Yellow (Mild)
    else if (data.intrinsic_eeg_pf >= 7.0) pf_pts = 2; // Orange (Moderate)
    else pf_pts = 1; // Red (High-risk)
    result.bands.intrinsic_eeg_pf = { ...bandColor(pf_pts), score: (pf_pts * 100) / 4 };
    total_pts += pf_pts;
  }

  // Brain Workload Index (dominant β burst, Hz) - 4 points
  if (data.brain_workload !== undefined) {
    metric_count++;
    let workload_pts = 1;
    if (data.brain_workload >= 15 && data.brain_workload <= 19.5) workload_pts = 4; // Green (Optimal)
    else if ((data.brain_workload >= 12 && data.brain_workload < 15) || 
             (data.brain_workload > 19.5 && data.brain_workload <= 24.9)) workload_pts = 3; // Yellow (Mild)
    else if (data.brain_workload >= 25 && data.brain_workload <= 29.9) workload_pts = 2; // Orange (Moderate)
    else workload_pts = 1; // Red (High-risk: < 12 or >= 30)
    result.bands.brain_workload = { ...bandColor(workload_pts), score: (workload_pts * 100) / 4 };
    total_pts += workload_pts;
  }

  // HeartMath metrics for nervous system assessment
  
  // LF/HF Ratio - 4 points
  if (data.lf_hf_ratio !== undefined) {
    metric_count++;
    let lfhf_pts = 1;
    if (data.lf_hf_ratio >= 0.8 && data.lf_hf_ratio <= 1.25) lfhf_pts = 4; // Green (Optimal)
    else if ((data.lf_hf_ratio >= 0.99 && data.lf_hf_ratio < 1.01) || (data.lf_hf_ratio > 1.01 && data.lf_hf_ratio <= 2.0)) lfhf_pts = 3; // Yellow (Mild)
    else if ((data.lf_hf_ratio >= 0.21 && data.lf_hf_ratio < 0.79) || (data.lf_hf_ratio > 2.01 && data.lf_hf_ratio <= 4.0)) lfhf_pts = 2; // Orange (Moderate)
    else lfhf_pts = 1; // Red (High-risk)
    result.bands.lf_hf_ratio = { ...bandColor(lfhf_pts), score: (lfhf_pts * 100) / 4 };
    total_pts += lfhf_pts;
  }

  // HF Power (ms²) - 4 points
  if (data.hf_power !== undefined) {
    metric_count++;
    let hf_power_pts = 1;
    if (data.hf_power >= 300 && data.hf_power <= 975) hf_power_pts = 4; // Green (Optimal)
    else if ((data.hf_power >= 200 && data.hf_power < 300) || (data.hf_power > 975 && data.hf_power <= 2000)) hf_power_pts = 3; // Yellow (Mild)
    else if ((data.hf_power >= 100 && data.hf_power < 200) || (data.hf_power > 2000)) hf_power_pts = 2; // Orange (Moderate)
    else hf_power_pts = 1; // Red (High-risk)
    result.bands.hf_power = { ...bandColor(hf_power_pts), score: (hf_power_pts * 100) / 4 };
    total_pts += hf_power_pts;
  }

  // RMSSD (ms) - 4 points
  if (data.rmssd_ms !== undefined) {
    metric_count++;
    let rmssd_pts = 1;
    if (data.rmssd_ms >= 40) rmssd_pts = 4; // Green (Optimal)
    else if (data.rmssd_ms >= 35) rmssd_pts = 3; // Yellow (Mild)
    else if (data.rmssd_ms >= 20) rmssd_pts = 2; // Orange (Moderate)
    else rmssd_pts = 1; // Red (High-risk)
    result.bands.rmssd_ms = { ...bandColor(rmssd_pts), score: (rmssd_pts * 100) / 4 };
    total_pts += rmssd_pts;
  }

  // Normalized Coherence (%) - 4 points
  if (data.normalized_coherence_pct !== undefined) {
    metric_count++;
    let coh_pts = 1;
    if (data.normalized_coherence_pct >= 60) coh_pts = 4; // Green (Optimal)
    else if (data.normalized_coherence_pct >= 50) coh_pts = 3; // Yellow (Mild)
    else if (data.normalized_coherence_pct >= 30) coh_pts = 2; // Orange (Moderate)
    else coh_pts = 1; // Red (High-risk)
    result.bands.normalized_coherence_pct = { ...bandColor(coh_pts), score: (coh_pts * 100) / 4 };
    total_pts += coh_pts;
  }

  // OmniFit PPG metrics for nervous system assessment
  
  // Stress Level (0-100) - 4 points
  if (data.stress !== undefined) {
    metric_count++;
    let stress_pts = 1;
    if (data.stress < 20) stress_pts = 4; // Green (Optimal)
    else if (data.stress < 40) stress_pts = 3; // Yellow (Mild)
    else if (data.stress < 60) stress_pts = 2; // Orange (Moderate)
    else stress_pts = 1; // Red (High-risk)
    result.bands.stress = { ...bandColor(stress_pts), score: (stress_pts * 100) / 4 };
    total_pts += stress_pts;
  }

  // ANS Health Score - 4 points
  if (data.ans_health !== undefined) {
    metric_count++;
    let ans_pts = 1;
    if (data.ans_health >= 9.0) ans_pts = 4; // Green (Optimal)
    else if (data.ans_health >= 7.0) ans_pts = 3; // Yellow (Mild)
    else if (data.ans_health >= 5.0) ans_pts = 2; // Orange (Moderate)
    else ans_pts = 1; // Red (High-risk)
    result.bands.ans_health = { ...bandColor(ans_pts), score: (ans_pts * 100) / 4 };
    total_pts += ans_pts;
  }

  // ANS Age (years) - 4 points
  if (data.ans_age !== undefined) {
    metric_count++;
    let age_pts = 1;
    if (data.ans_age <= -10) age_pts = 4; // Green (Optimal)
    else if (data.ans_age <= -5) age_pts = 3; // Yellow (Mild)
    else if (data.ans_age <= 4) age_pts = 2; // Orange (Moderate)
    else age_pts = 1; // Red (High-risk)
    result.bands.ans_age = { ...bandColor(age_pts), score: (age_pts * 100) / 4 };
    total_pts += age_pts;
  }

  // Calculate Nervous System Score
  const Nervous_Score = metric_count > 0 ? (total_pts * 100) / (metric_count * 4) : 100;
  result.bands.nervous_score = { ...nervousColorBand(Nervous_Score), score: Nervous_Score };
  result.radar = { nervous_system: Nervous_Score };
  result.bucket = { brain: Nervous_Score };
  return result;
}

/* ──────────────────────────────────────────────────────────────
   5.  Registry export
   ──────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────
   6.  Form configuration — for staff data entry (legacy)
   ──────────────────────────────────────────────────────────── */
export const FORM = [
  ['brain_score', 'Overall Brain Function Score (0-100)', 0.1, 0, 100],
  ['mental_stress', 'Mental Stress Level (0-10)', 0.1, 0, 10],
  ['intrinsic_eeg_pf', 'Intrinsic EEG Performance Factor (Hz)', 0.01, 5, 15],
  ['brain_workload', 'Brain Workload Index (Hz)', 0.1, 10, 35],
] as const;

export const nervousModule = {
  slug: 'nervous',
  zod: nervousSchema,
  ui: nervousMetricSchema,
  scorer: scoreNervous,
} as const;

export default nervousModule; 