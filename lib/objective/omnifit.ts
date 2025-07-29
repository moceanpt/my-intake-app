/* ------------------------------------------------------------------
   lib/objective/omnifit.ts
   – OmniFit stress check results (PPG & EEG)
------------------------------------------------------------------- */

import { z } from 'zod';
import type { MetricSchema } from '../metrics/types';

/* ──────────────────────────────────────────────────────────────
   1.  Zod schema — validates the raw data
   ──────────────────────────────────────────────────────────── */
export const omnifitSchema = z.object({
  hrv_index: z.number().positive(),
  stress: z.number().int().min(0).max(100),
  ans_health: z.number().positive(),
  ans_age: z.number().int().positive(),
  lf: z.number().positive(),
  hf: z.number().positive(),
  brain_score: z.number().nullable(),
  mental_stress: z.number().nullable(),
  intrinsic_eeg_pf: z.number().nullable(),
  brain_workload: z.number().nullable(),
  normalized_coherence: z.number().nullable(),
  rmssd: z.number().nullable(),
});

export type OmniFitInput = z.infer<typeof omnifitSchema>;
export const omniFitKeys = omnifitSchema.keyof().options;

/* ──────────────────────────────────────────────────────────────
   2.  New MetricSchema for DeviceForm
   ──────────────────────────────────────────────────────────── */
export const omnifitMetricSchema: MetricSchema = {
  slug: 'omnifit',
  title: 'OmniFit Stress Check Results',
  fields: [
    /* A. HRV Metrics (PPG Mode) */
    { name: 'hrv_index', label: 'Heart Rate Variability Index', widget: 'number' as const, step: 0.1, section: 'PPG' },
    { name: 'stress', label: 'Stress Level (0-100)', widget: 'number' as const, step: 1, section: 'PPG' },
    { name: 'ans_health', label: 'Autonomic Nervous System Health Score', widget: 'number' as const, step: 0.01, section: 'PPG' },
    { name: 'ans_age', label: 'ANS Age (biological age)', widget: 'number' as const, step: 1, section: 'PPG' },
    { name: 'lf', label: 'Low Frequency Power (ms²)', widget: 'number' as const, step: 0.01, section: 'PPG' },
    { name: 'hf', label: 'High Frequency Power (ms²)', widget: 'number' as const, step: 0.01, section: 'PPG' },

    /* B. Brain Metrics (EEG Mode) */
    { name: 'brain_score', label: 'Overall Brain Function Score (0-100)', widget: 'number' as const, step: 0.1, section: 'EEG' },
    { name: 'mental_stress', label: 'Mental Stress Level (0-100)', widget: 'number' as const, step: 0.1, section: 'EEG' },
    { name: 'intrinsic_eeg_pf', label: 'Intrinsic EEG Performance Factor', widget: 'number' as const, step: 0.01, section: 'EEG' },
    { name: 'brain_workload', label: 'Brain Workload Index', widget: 'number' as const, step: 0.1, section: 'EEG' },
  ]
};

export const omnifitEEGMetricSchema: MetricSchema = {
  slug: 'omnifit_eeg',
  title: 'OmniFit Stress Check Results (EEG)',
  fields: [
    { name: 'omnifit_eeg_table', label: 'OmniFit EEG Metrics', widget: 'omnifit-table' as const, tableType: 'eeg' },
  ]
};

export const omnifitPPGMetricSchema: MetricSchema = {
  slug: 'omnifit_ppg',
  title: 'OmniFit Stress Check Results (PPG)',
  fields: [
    { name: 'omnifit_ppg_table', label: 'OmniFit PPG Metrics', widget: 'omnifit-table' as const, tableType: 'ppg' },
  ]
};

/* ──────────────────────────────────────────────────────────────
   3.  Legacy UI schema — tells <DeviceForm> how to render fields
   ──────────────────────────────────────────────────────────── */
export const omnifitUISchema = {
  title: 'OmniFit Stress Check Results',
  description: 'PPG & EEG stress metrics from OmniFit device',
  fields: [
    { key: 'hrv_index', label: 'Heart Rate Variability Index', type: 'number' },
    { key: 'stress', label: 'Stress Level (0-100)', type: 'number', unit: '' },
    { key: 'ans_health', label: 'Autonomic Nervous System Health Score', type: 'number' },
    { key: 'ans_age', label: 'ANS Age (biological age)', type: 'number', unit: 'years' },
    { key: 'lf', label: 'Low Frequency Power (ms²)', type: 'number' },
    { key: 'hf', label: 'High Frequency Power (ms²)', type: 'number' },
    { key: 'brain_score', label: 'Overall Brain Function Score (0-100)', type: 'number' },
    { key: 'mental_stress', label: 'Mental Stress Level (0-100)', type: 'number' },
    { key: 'intrinsic_eeg_pf', label: 'Intrinsic EEG Performance Factor', type: 'number' },
    { key: 'brain_workload', label: 'Brain Workload Index', type: 'number' },
  ]
};

/* ──────────────────────────────────────────────────────────────
   4.  Form configuration — for staff data entry (legacy)
   ──────────────────────────────────────────────────────────── */
export const FORM = [
  /* A. HRV Metrics */
  ['hrv_index', 'HRV Index', 0.1, 1, 20],
  ['stress', 'Stress Score (0-100)', 1, 0, 100],
  ['ans_health', 'ANS Health Score', 0.01, 1, 15],
  ['ans_age', 'ANS Age (years)', 1, 10, 80],
  ['lf', 'LF Power', 0.01, 0.1, 50],
  ['hf', 'HF Power', 0.01, 0.1, 50],

  /* B. Brain Metrics */
  ['brain_score', 'Brain Score', 0.1, 1, 10],
  ['mental_stress', 'Mental Stress', 0.1, 1, 10],
  ['intrinsic_eeg_pf', 'Intrinsic EEG PF', 0.01, 0.1, 5],
  ['brain_workload', 'Brain Workload', 0.1, 1, 10],
] as const;

// Color band logic for OmniFit
function omniColorBand(label: string) {
  switch (label) {
    case 'Very Good':
    case 'Very High':
    case 'Excellent':
      return { color: 'dark-green', label };
    case 'Good':
    case 'High':
      return { color: 'light-green', label };
    case 'Normal':
    case 'Average':
      return { color: 'yellow', label };
    case 'Warning':
    case 'Low':
    case 'High-risk':
      return { color: 'orange', label };
    case 'Danger':
    case 'Very Low':
    case 'Critical':
      return { color: 'red', label };
    default:
      return { color: 'gray', label: 'Unknown' };
  }
}

export function scoreOmniFit(metrics: OmniFitInput) {
  const result: any = { bands: {} };
  // HRV Index
  let hrvLabel = 'Normal';
  if (metrics.hrv_index < 5.0) hrvLabel = 'Danger';
  else if (metrics.hrv_index < 6.0) hrvLabel = 'Warning';
  else if (metrics.hrv_index < 10.0) hrvLabel = 'Normal';
  else if (metrics.hrv_index < 13.0) hrvLabel = 'Good';
  else hrvLabel = 'Very Good';
  result.bands.hrv_index = omniColorBand(hrvLabel);
  result.bands.hrv_index.score = Math.max(35, [95,85,75,55,35][['Very Good','Good','Normal','Warning','Danger'].indexOf(hrvLabel)]);

  // Stress (0-100)
  let stressLabel = 'Average';
  if (metrics.stress < 20) stressLabel = 'Very Low';
  else if (metrics.stress < 40) stressLabel = 'Low';
  else if (metrics.stress < 60) stressLabel = 'Average';
  else if (metrics.stress < 80) stressLabel = 'High';
  else stressLabel = 'Very High';
  result.bands.stress = omniColorBand(stressLabel);
  result.bands.stress.score = Math.max(35, [95,85,75,55,35][['Very High','High','Average','Low','Very Low'].indexOf(stressLabel)]);

  // ANS Health (0-10)
  let ansLabel = 'Normal';
  if (metrics.ans_health < 3) ansLabel = 'Danger';
  else if (metrics.ans_health < 5) ansLabel = 'Warning';
  else if (metrics.ans_health < 7) ansLabel = 'Normal';
  else if (metrics.ans_health < 9) ansLabel = 'Good';
  else ansLabel = 'Very Good';
  result.bands.ans_health = omniColorBand(ansLabel);
  result.bands.ans_health.score = Math.max(35, [95,85,75,55,35][['Very Good','Good','Normal','Warning','Danger'].indexOf(ansLabel)]);

  // ANS Age (delta)
  let ansAgeLabel = 'Normal';
  if (metrics.ans_age <= -10) ansAgeLabel = 'Excellent';
  else if (metrics.ans_age <= -5) ansAgeLabel = 'Good';
  else if (metrics.ans_age <= 4) ansAgeLabel = 'Normal';
  else if (metrics.ans_age <= 9) ansAgeLabel = 'Warning';
  else ansAgeLabel = 'Danger';
  result.bands.ans_age = omniColorBand(ansAgeLabel);
  result.bands.ans_age.score = Math.max(35, [95,85,75,55,35][['Excellent','Good','Normal','Warning','Danger'].indexOf(ansAgeLabel)]);

  // LF Power (log)
  let lfLabel = 'Normal';
  if (metrics.lf < 2.0) lfLabel = 'Very Low';
  else if (metrics.lf < 3.59) lfLabel = 'Low';
  else if (metrics.lf < 6.0) lfLabel = 'Normal';
  else if (metrics.lf < 10.0) lfLabel = 'High';
  else lfLabel = 'Very High';
  result.bands.lf = omniColorBand(lfLabel);
  result.bands.lf.score = Math.max(35, [95,85,75,55,35][['Very High','High','Normal','Low','Very Low'].indexOf(lfLabel)]);

  // HF Power (log)
  let hfLabel = 'Normal';
  if (metrics.hf < 2.0) hfLabel = 'Very Low';
  else if (metrics.hf < 4.0) hfLabel = 'Low';
  else if (metrics.hf < 6.0) hfLabel = 'Normal';
  else if (metrics.hf < 10.0) hfLabel = 'High';
  else hfLabel = 'Very High';
  result.bands.hf = omniColorBand(hfLabel);
  result.bands.hf.score = Math.max(35, [95,85,75,55,35][['Very High','High','Normal','Low','Very Low'].indexOf(hfLabel)]);

  // EEG metrics (if present) - Updated with new 4-category scoring
  if (metrics.brain_score !== null && metrics.brain_score !== undefined) {
    let brain_pts = 0;
    if (metrics.brain_score >= 80) brain_pts = 0; // Optimal
    else if (metrics.brain_score >= 60) brain_pts = 4; // Mild dev.
    else if (metrics.brain_score >= 40) brain_pts = 6; // Moderate dev.
    else brain_pts = 8; // High-risk
    result.bands.brain_score = { score: 100 - (brain_pts * 100 / 8) };
  }
  if (metrics.mental_stress !== null && metrics.mental_stress !== undefined) {
    let ms_pts = 0;
    if (metrics.mental_stress < 3) ms_pts = 0; // Optimal
    else if (metrics.mental_stress < 5) ms_pts = 4; // Mild dev.
    else if (metrics.mental_stress < 7) ms_pts = 6; // Moderate dev.
    else ms_pts = 8; // High-risk
    result.bands.mental_stress = { score: 100 - (ms_pts * 100 / 8) };
  }
  if (metrics.intrinsic_eeg_pf !== null && metrics.intrinsic_eeg_pf !== undefined) {
    let pf_pts = 0;
    if (metrics.intrinsic_eeg_pf >= 9.0) pf_pts = 0; // Optimal
    else if (metrics.intrinsic_eeg_pf >= 8.0) pf_pts = 4; // Mild dev.
    else if (metrics.intrinsic_eeg_pf >= 7.0) pf_pts = 6; // Moderate dev.
    else pf_pts = 8; // High-risk
    result.bands.intrinsic_eeg_pf = { score: 100 - (pf_pts * 100 / 8) };
  }
  if (metrics.brain_workload !== null && metrics.brain_workload !== undefined) {
    let bw_pts = 0;
    if (metrics.brain_workload >= 15 && metrics.brain_workload <= 19.5) bw_pts = 0; // Optimal
    else if ((metrics.brain_workload >= 12 && metrics.brain_workload < 15) || 
             (metrics.brain_workload > 19.5 && metrics.brain_workload <= 24.9)) bw_pts = 4; // Mild dev.
    else if (metrics.brain_workload >= 25 && metrics.brain_workload <= 29.9) bw_pts = 6; // Moderate dev.
    else bw_pts = 8; // High-risk (< 12 or >= 30)
    result.bands.brain_workload = { score: 100 - (bw_pts * 100 / 8) };
  }

  // Return both bands and a summary (e.g., average of all scores)
  const allScores = Object.values(result.bands).map((b: any) => b.score).filter(Boolean);
  const avgScore = allScores.length ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
  result.radar = { nervous_system: avgScore, brain: avgScore };
  result.bucket = { stress: avgScore, brain: avgScore };
  return result;
}

export function scoreNervousSystemStory(metrics: OmniFitInput) {
  const stories: Array<{
    title: string;
    score: number;
    status: string;
    statusColor: string;
    whyItMatters: string;
    metrics: Array<{
      name: string;
      value: number | string;
      unit: string;
    }>;
  }> = [];

  // 1. Cognitive Performance
  const cognitiveMetrics = {
    brain_score: metrics.brain_score || 0,
    intrinsic_eeg_pf: metrics.intrinsic_eeg_pf || 0,
    brain_workload: metrics.brain_workload || 0,
    normalized_coherence: metrics.normalized_coherence || (metrics.brain_score ? Math.min(100, Math.max(0, metrics.brain_score + 5)) : 85) // Calculate from brain_score if available
  };

  let cognitiveScore = 0;
  let cognitiveStatus = '';
  let cognitiveColor = '';

  // Calculate cognitive score based on brain metrics
  if (cognitiveMetrics.brain_score >= 80) cognitiveScore += 25;
  else if (cognitiveMetrics.brain_score >= 60) cognitiveScore += 20;
  else if (cognitiveMetrics.brain_score >= 40) cognitiveScore += 15;
  else cognitiveScore += 10;

  if (cognitiveMetrics.intrinsic_eeg_pf >= 9.0) cognitiveScore += 25;
  else if (cognitiveMetrics.intrinsic_eeg_pf >= 8.0) cognitiveScore += 20;
  else if (cognitiveMetrics.intrinsic_eeg_pf >= 7.0) cognitiveScore += 15;
  else cognitiveScore += 10;

  if (cognitiveMetrics.brain_workload >= 15 && cognitiveMetrics.brain_workload <= 19.5) cognitiveScore += 25;
  else if ((cognitiveMetrics.brain_workload >= 12 && cognitiveMetrics.brain_workload < 15) || 
           (cognitiveMetrics.brain_workload > 19.5 && cognitiveMetrics.brain_workload <= 24.9)) cognitiveScore += 20;
  else if (cognitiveMetrics.brain_workload >= 25 && cognitiveMetrics.brain_workload <= 29.9) cognitiveScore += 15;
  else cognitiveScore += 10;

  if (cognitiveMetrics.normalized_coherence >= 80) cognitiveScore += 25;
  else if (cognitiveMetrics.normalized_coherence >= 60) cognitiveScore += 20;
  else if (cognitiveMetrics.normalized_coherence >= 40) cognitiveScore += 15;
  else cognitiveScore += 10;

  if (cognitiveScore >= 85) {
    cognitiveStatus = 'Optimal Zone';
    cognitiveColor = 'text-green-600 font-bold';
  } else if (cognitiveScore >= 70) {
    cognitiveStatus = 'Mild Strain';
    cognitiveColor = 'text-yellow-600 font-bold';
  } else if (cognitiveScore >= 55) {
    cognitiveStatus = 'Moderate Load';
    cognitiveColor = 'text-orange-600 font-bold';
  } else {
    cognitiveStatus = 'High Strain';
    cognitiveColor = 'text-red-600 font-bold';
  }

  stories.push({
    title: 'Cognitive Performance',
    score: cognitiveScore,
    status: cognitiveStatus,
    statusColor: cognitiveColor,
    whyItMatters: 'These readings track how efficiently your brain processes information—like a "CPU health check." Higher scores mean your neural circuits are sharp, coordinated, and not overheating under mental load.',
    metrics: [
      { name: 'Overall Brain Function Score', value: cognitiveMetrics.brain_score, unit: '(0-100)' },
      { name: 'Intrinsic EEG Performance Factor', value: cognitiveMetrics.intrinsic_eeg_pf, unit: 'Hz' },
      { name: 'Brain Workload Index', value: cognitiveMetrics.brain_workload, unit: 'Hz' },
      { name: 'Normalized Coherence', value: cognitiveMetrics.normalized_coherence, unit: '%' }
    ]
  });

  // 2. Autonomic Flexibility
  const autonomicMetrics = {
    hf: metrics.hf || 0,
    rmssd: metrics.rmssd || (metrics.hf ? Math.sqrt(metrics.hf) * 2.5 : 45), // Calculate RMSSD from HF power if available
    lf_hf_ratio: metrics.lf && metrics.hf ? metrics.lf / metrics.hf : 0,
    ans_health: metrics.ans_health || 0,
    ans_age: metrics.ans_age || 0
  };

  let autonomicScore = 0;

  // Calculate autonomic score
  if (autonomicMetrics.hf >= 6.0) autonomicScore += 20;
  else if (autonomicMetrics.hf >= 4.0) autonomicScore += 16;
  else if (autonomicMetrics.hf >= 2.0) autonomicScore += 12;
  else autonomicScore += 8;

  if (autonomicMetrics.rmssd >= 50) autonomicScore += 20;
  else if (autonomicMetrics.rmssd >= 30) autonomicScore += 16;
  else if (autonomicMetrics.rmssd >= 20) autonomicScore += 12;
  else autonomicScore += 8;

  if (autonomicMetrics.lf_hf_ratio >= 0.5 && autonomicMetrics.lf_hf_ratio <= 2.0) autonomicScore += 20;
  else if (autonomicMetrics.lf_hf_ratio >= 0.3 && autonomicMetrics.lf_hf_ratio <= 3.0) autonomicScore += 16;
  else if (autonomicMetrics.lf_hf_ratio >= 0.1 && autonomicMetrics.lf_hf_ratio <= 4.0) autonomicScore += 12;
  else autonomicScore += 8;

  if (autonomicMetrics.ans_health >= 7) autonomicScore += 20;
  else if (autonomicMetrics.ans_health >= 5) autonomicScore += 16;
  else if (autonomicMetrics.ans_health >= 3) autonomicScore += 12;
  else autonomicScore += 8;

  if (autonomicMetrics.ans_age <= -5) autonomicScore += 20;
  else if (autonomicMetrics.ans_age <= 4) autonomicScore += 16;
  else if (autonomicMetrics.ans_age <= 9) autonomicScore += 12;
  else autonomicScore += 8;

  let autonomicStatus = '';
  let autonomicColor = '';

  if (autonomicScore >= 85) {
    autonomicStatus = 'Optimal Zone';
    autonomicColor = 'text-green-600 font-bold';
  } else if (autonomicScore >= 70) {
    autonomicStatus = 'Mild Strain';
    autonomicColor = 'text-yellow-600 font-bold';
  } else if (autonomicScore >= 55) {
    autonomicStatus = 'Moderate Load';
    autonomicColor = 'text-orange-600 font-bold';
  } else {
    autonomicStatus = 'High Strain';
    autonomicColor = 'text-red-600 font-bold';
  }

  stories.push({
    title: 'Autonomic Flexibility',
    score: autonomicScore,
    status: autonomicStatus,
    statusColor: autonomicColor,
    whyItMatters: 'Your autonomic nervous system is the body\'s automatic gearbox, shifting between "rev up" and "rest." Strong high-frequency power and RMSSD indicate a responsive brake pedal, while a healthy LF/HF ratio and ANS scores show the gearbox isn\'t stuck in one gear.',
    metrics: [
      { name: 'HF Power', value: autonomicMetrics.hf, unit: 'ms²' },
      { name: 'RMSSD', value: autonomicMetrics.rmssd, unit: 'ms' },
      { name: 'LF/HF Ratio', value: autonomicMetrics.lf_hf_ratio.toFixed(2), unit: '' },
      { name: 'ANS Health Score', value: autonomicMetrics.ans_health, unit: '(0-10)' },
      { name: 'ANS Age', value: autonomicMetrics.ans_age, unit: 'years' }
    ]
  });

  // 3. Stress Load
  const stressMetrics = {
    mental_stress: metrics.mental_stress || 0,
    stress: metrics.stress || 0
  };

  let stressScore = 0;

  // Calculate stress score (inverted - lower stress = higher score)
  if (stressMetrics.mental_stress < 3) stressScore += 50;
  else if (stressMetrics.mental_stress < 5) stressScore += 40;
  else if (stressMetrics.mental_stress < 7) stressScore += 30;
  else stressScore += 20;

  if (stressMetrics.stress < 20) stressScore += 50;
  else if (stressMetrics.stress < 40) stressScore += 40;
  else if (stressMetrics.stress < 60) stressScore += 30;
  else if (stressMetrics.stress < 80) stressScore += 20;
  else stressScore += 10;

  let stressStatus = '';
  let stressColor = '';

  if (stressScore >= 85) {
    stressStatus = 'Optimal Zone';
    stressColor = 'text-green-600 font-bold';
  } else if (stressScore >= 70) {
    stressStatus = 'Mild Strain';
    stressColor = 'text-yellow-600 font-bold';
  } else if (stressScore >= 55) {
    stressStatus = 'Moderate Load';
    stressColor = 'text-orange-600 font-bold';
  } else {
    stressStatus = 'High Strain';
    stressColor = 'text-red-600 font-bold';
  }

  stories.push({
    title: 'Stress Load',
    score: stressScore,
    status: stressStatus,
    statusColor: stressColor,
    whyItMatters: 'These two gauges show how much conscious and background stress your brain is carrying—think of them as the dashboard lights for mental tension.',
    metrics: [
      { name: 'Mental Stress Level', value: stressMetrics.mental_stress, unit: '(0-10)' },
      { name: 'Stress Level', value: stressMetrics.stress, unit: '(0-100)' }
    ]
  });

  // Calculate overall nervous system score
  const overallScore = Math.round((cognitiveScore + autonomicScore + stressScore) / 3);

  return {
    overallScore,
    stories
  };
}


