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
  lf: z.number().positive().optional(),
  
  // HeartMath metrics
  mean_hr_bpm: z.number().positive().optional(),
  mean_ibi_ms: z.number().positive().optional(),
  sdnn_ms: z.number().positive().optional(),
  total_power: z.number().positive().optional(),
  vlf_power: z.number().positive().optional(),
  lf_power: z.number().positive().optional(),
  rr_intervals: z.number().int().positive().optional(),
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
    { name: 'lf', label: 'LF Power (log ms²)', widget: 'number' as const, step: 0.01, section: 'OmniFit PPG' },
    
    // HeartMath fields
    { name: 'mean_hr_bpm', label: 'Mean Heart Rate (bpm)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'mean_ibi_ms', label: 'Mean Inter-Beat Interval (ms)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'sdnn_ms', label: 'SDNN (ms)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'total_power', label: 'Total Power (ms²)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'vlf_power', label: 'VLF Power (ms²)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'lf_power', label: 'LF Power (ms²)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
    { name: 'rr_intervals', label: 'R-R Intervals (count)', widget: 'number' as const, step: 1, section: 'HeartMath' },
    { name: 'normalized_coherence_pct', label: 'Normalized Coherence (%)', widget: 'number' as const, step: 0.1, section: 'HeartMath' },
  ]
};

/* ──────────────────────────────────────────────────────────────
   3.  Color band logic
   ──────────────────────────────────────────────────────────── */
function bandColor(score: number) {
  if (score === 4) return { color: 'dark-green', label: 'Optimal' };
  if (score === 3) return { color: 'yellow', label: 'Mild' };
  if (score === 2) return { color: 'orange', label: 'Moderate' };
  return { color: 'red', label: 'High Risk' };
}

function circulationColorBand(score: number) {
  if (score >= 80) return { color: 'dark-green', label: 'Optimal' };
  if (score >= 60) return { color: 'yellow', label: 'Mild imbalance' };
  if (score >= 40) return { color: 'orange', label: 'High-risk imbalance' };
  return { color: 'red', label: 'Critical – immediate attention' };
}

/* ──────────────────────────────────────────────────────────────
   4.  Story-based Circulation Scoring
   ──────────────────────────────────────────────────────────── */
export function scoreCirculationStories(data: CirculationInput) {
  const result: any = { 
    bands: {},
    stories: {
      heart_rhythm_strength: { score: 0, status: '', story: '', metrics: {} },
      autonomic_balance: { score: 0, status: '', story: '', metrics: {} },
      heart_rate_load: { score: 0, status: '', story: '', metrics: {} }
    }
  };

  // 1. Heart-Rhythm Strength (25 points)
  let heartRhythmPts = 0;
  let heartRhythmMetrics = 0;
  const heartRhythmValues: any = {};

  if (data.hrv_index !== undefined) {
    heartRhythmMetrics++;
    heartRhythmValues.hrv_index = data.hrv_index;
    if (data.hrv_index >= 13.0) heartRhythmPts += 6.25;
    else if (data.hrv_index >= 10.0) heartRhythmPts += 4.69;
    else if (data.hrv_index >= 6.0) heartRhythmPts += 3.13;
    else heartRhythmPts += 1.56;
  }

  if (data.sdnn_ms !== undefined) {
    heartRhythmMetrics++;
    heartRhythmValues.sdnn_ms = data.sdnn_ms;
    if (data.sdnn_ms >= 50) heartRhythmPts += 6.25;
    else if (data.sdnn_ms >= 45) heartRhythmPts += 4.69;
    else if (data.sdnn_ms >= 30) heartRhythmPts += 3.13;
    else heartRhythmPts += 1.56;
  }

  if (data.total_power !== undefined) {
    heartRhythmMetrics++;
    heartRhythmValues.total_power = data.total_power;
    if (data.total_power >= 1000) heartRhythmPts += 6.25;
    else if (data.total_power >= 750) heartRhythmPts += 4.69;
    else if (data.total_power >= 500) heartRhythmPts += 3.13;
    else heartRhythmPts += 1.56;
  }

  if (data.rr_intervals !== undefined) {
    heartRhythmMetrics++;
    heartRhythmValues.rr_intervals = data.rr_intervals;
    if (data.rr_intervals >= 60) heartRhythmPts += 6.25;
    else if (data.rr_intervals >= 50) heartRhythmPts += 4.69;
    else if (data.rr_intervals >= 40) heartRhythmPts += 3.13;
    else heartRhythmPts += 1.56;
  }

  const heartRhythmScore = heartRhythmMetrics > 0 ? (heartRhythmPts * 100) / 25 : 0;
  const heartRhythmStatus = getStatusLabel(heartRhythmScore);
  const heartRhythmStory = generateHeartRhythmStory(heartRhythmValues, heartRhythmStatus);

  result.stories.heart_rhythm_strength = {
    score: heartRhythmScore,
    status: heartRhythmStatus,
    story: heartRhythmStory,
    metrics: heartRhythmValues
  };

  // 2. Autonomic Balance (25 points)
  let autonomicPts = 0;
  let autonomicMetrics = 0;
  const autonomicValues: any = {};

  if (data.lf !== undefined) {
    autonomicMetrics++;
    autonomicValues.lf = data.lf;
    if (data.lf >= 6.0) autonomicPts += 8.33;
    else if (data.lf >= 3.59) autonomicPts += 6.25;
    else if (data.lf >= 2.0) autonomicPts += 4.17;
    else autonomicPts += 2.08;
  }

  if (data.lf_power !== undefined) {
    autonomicMetrics++;
    autonomicValues.lf_power = data.lf_power;
    if (data.lf_power >= 300 && data.lf_power <= 1170) autonomicPts += 8.33;
    else if ((data.lf_power >= 200 && data.lf_power < 300) || (data.lf_power > 1170 && data.lf_power <= 2000)) autonomicPts += 6.25;
    else if ((data.lf_power >= 100 && data.lf_power < 200) || (data.lf_power > 2000)) autonomicPts += 4.17;
    else autonomicPts += 2.08;
  }

  if (data.vlf_power !== undefined) {
    autonomicMetrics++;
    autonomicValues.vlf_power = data.vlf_power;
    if (data.vlf_power >= 100 && data.vlf_power <= 500) autonomicPts += 8.33;
    else if ((data.vlf_power >= 50 && data.vlf_power < 100) || (data.vlf_power > 500 && data.vlf_power <= 1000)) autonomicPts += 6.25;
    else if ((data.vlf_power >= 20 && data.vlf_power < 50) || (data.vlf_power > 1000 && data.vlf_power <= 2000)) autonomicPts += 4.17;
    else autonomicPts += 2.08;
  }

  const autonomicScore = autonomicMetrics > 0 ? (autonomicPts * 100) / 25 : 0;
  const autonomicStatus = getStatusLabel(autonomicScore);
  const autonomicStory = generateAutonomicStory(autonomicValues, autonomicStatus);

  result.stories.autonomic_balance = {
    score: autonomicScore,
    status: autonomicStatus,
    story: autonomicStory,
    metrics: autonomicValues
  };

  // 3. Heart-Rate Load (25 points)
  let heartRatePts = 0;
  let heartRateMetrics = 0;
  const heartRateValues: any = {};

  if (data.mean_hr_bpm !== undefined) {
    heartRateMetrics++;
    heartRateValues.mean_hr_bpm = data.mean_hr_bpm;
    if (data.mean_hr_bpm >= 60 && data.mean_hr_bpm <= 100) heartRatePts += 12.5;
    else if ((data.mean_hr_bpm >= 50 && data.mean_hr_bpm < 60) || (data.mean_hr_bpm > 100 && data.mean_hr_bpm <= 120)) heartRatePts += 9.38;
    else if ((data.mean_hr_bpm >= 40 && data.mean_hr_bpm < 50) || (data.mean_hr_bpm > 120)) heartRatePts += 6.25;
    else heartRatePts += 3.13;
  }

  if (data.mean_ibi_ms !== undefined) {
    heartRateMetrics++;
    heartRateValues.mean_ibi_ms = data.mean_ibi_ms;
    if (data.mean_ibi_ms >= 600 && data.mean_ibi_ms <= 1000) heartRatePts += 12.5;
    else if ((data.mean_ibi_ms >= 500 && data.mean_ibi_ms < 600) || (data.mean_ibi_ms > 1000 && data.mean_ibi_ms <= 1500)) heartRatePts += 9.38;
    else if ((data.mean_ibi_ms >= 400 && data.mean_ibi_ms < 500) || (data.mean_ibi_ms > 1500)) heartRatePts += 6.25;
    else heartRatePts += 3.13;
  }

  const heartRateScore = heartRateMetrics > 0 ? (heartRatePts * 100) / 25 : 0;
  const heartRateStatus = getStatusLabel(heartRateScore);
  const heartRateStory = generateHeartRateStory(heartRateValues, heartRateStatus);

  result.stories.heart_rate_load = {
    score: heartRateScore,
    status: heartRateStatus,
    story: heartRateStory,
    metrics: heartRateValues
  };

  // Calculate overall circulation score
  const totalScore = (heartRhythmScore + autonomicScore + heartRateScore) / 3;
  result.bands.circulation_score = { score: totalScore };
  result.radar = { circulation: totalScore };
  result.bucket = { circulation: totalScore };

  return result;
}

function getStatusLabel(score: number): string {
  if (score >= 80) return '<span style="color: #10b981; font-weight: bold;">Optimal Zone</span>';
  if (score >= 60) return '<span style="color: #f59e0b; font-weight: bold;">Mild Strain</span>';
  if (score >= 40) return '<span style="color: #f97316; font-weight: bold;">Moderate Load</span>';
  return '<span style="color: #ef4444; font-weight: bold;">High Strain</span>';
}

function generateHeartRhythmStory(values: any, status: string): string {
  return `Heart-rate variability (HRV) is the tiny beat-to-beat wiggle room your heart keeps in reserve. The bigger the wiggle, the more relaxed and adaptable your nervous system is—like suspension on a mountain bike that soaks up bumps.

Your Heart-Rhythm Strength is in the ${status} range.`;
}

function generateAutonomicStory(values: any, status: string): string {
  return `These numbers show how your "gas pedal" (sympathetic) and "brake pedal" (parasympathetic) share the driving. A smooth hand-off means your body can rev up for action and coast down for recovery without grinding the gears.

Your Autonomic Balance is in the ${status} zone.`;
}

function generateHeartRateStory(values: any, status: string): string {
  return `Your resting heart rate is the engine's idle speed. Lower but steady idling saves wear-and-tear and leaves horsepower for when you need it.

Your Heart-Rate Load is in the ${status} range.`;
}

/* ──────────────────────────────────────────────────────────────
   5.  Original Scorer — combines OmniFit PPG + HeartMath
   ──────────────────────────────────────────────────────────── */
export function scoreCirculation(data: CirculationInput) {
  const result: any = { bands: {} };
  let total_pts = 0;
  let metric_count = 0;

  // OmniFit PPG Scoring
  if (data.hrv_index !== undefined) {
    metric_count++;
    let hrv_pts = 1;
    if (data.hrv_index >= 13.0) hrv_pts = 4;
    else if (data.hrv_index >= 10.0) hrv_pts = 3;
    else if (data.hrv_index >= 6.0) hrv_pts = 2;
    else hrv_pts = 1;
    result.bands.hrv_index = { ...bandColor(hrv_pts), score: (hrv_pts * 100) / 4 };
    total_pts += hrv_pts;
  }

  if (data.lf !== undefined) {
    metric_count++;
    let lf_pts = 1;
    if (data.lf >= 6.0) lf_pts = 4;
    else if (data.lf >= 3.59) lf_pts = 3;
    else if (data.lf >= 2.0) lf_pts = 2;
    else lf_pts = 1;
    result.bands.lf = { ...bandColor(lf_pts), score: (lf_pts * 100) / 4 };
    total_pts += lf_pts;
  }

  // HeartMath Scoring
  if (data.mean_hr_bpm !== undefined) {
    metric_count++;
    let mean_hr_pts = 1;
    if (data.mean_hr_bpm >= 60 && data.mean_hr_bpm <= 100) mean_hr_pts = 4;
    else if ((data.mean_hr_bpm >= 50 && data.mean_hr_bpm < 60) || (data.mean_hr_bpm > 100 && data.mean_hr_bpm <= 120)) mean_hr_pts = 3;
    else if ((data.mean_hr_bpm >= 40 && data.mean_hr_bpm < 50) || (data.mean_hr_bpm > 120)) mean_hr_pts = 2;
    else mean_hr_pts = 1;
    result.bands.mean_hr_bpm = { ...bandColor(mean_hr_pts), score: (mean_hr_pts * 100) / 4 };
    total_pts += mean_hr_pts;
  }

  if (data.mean_ibi_ms !== undefined) {
    metric_count++;
    let mean_ibi_pts = 1;
    if (data.mean_ibi_ms >= 600 && data.mean_ibi_ms <= 1000) mean_ibi_pts = 4;
    else if ((data.mean_ibi_ms >= 500 && data.mean_ibi_ms < 600) || (data.mean_ibi_ms > 1000 && data.mean_ibi_ms <= 1500)) mean_ibi_pts = 3;
    else if ((data.mean_ibi_ms >= 400 && data.mean_ibi_ms < 500) || (data.mean_ibi_ms > 1500)) mean_ibi_pts = 2;
    else mean_ibi_pts = 1;
    result.bands.mean_ibi_ms = { ...bandColor(mean_ibi_pts), score: (mean_ibi_pts * 100) / 4 };
    total_pts += mean_ibi_pts;
  }

  if (data.sdnn_ms !== undefined) {
    metric_count++;
    let sdnn_pts = 1;
    if (data.sdnn_ms >= 50) sdnn_pts = 4;
    else if (data.sdnn_ms >= 45) sdnn_pts = 3;
    else if (data.sdnn_ms >= 30) sdnn_pts = 2;
    else sdnn_pts = 1;
    result.bands.sdnn_ms = { ...bandColor(sdnn_pts), score: (sdnn_pts * 100) / 4 };
    total_pts += sdnn_pts;
  }

  if (data.total_power !== undefined) {
    metric_count++;
    let tp_pts = 1;
    if (data.total_power >= 1000) tp_pts = 4;
    else if (data.total_power >= 750) tp_pts = 3;
    else if (data.total_power >= 500) tp_pts = 2;
    else tp_pts = 1;
    result.bands.total_power = { ...bandColor(tp_pts), score: (tp_pts * 100) / 4 };
    total_pts += tp_pts;
  }

  if (data.vlf_power !== undefined) {
    metric_count++;
    let vlf_power_pts = 1;
    if (data.vlf_power >= 100 && data.vlf_power <= 500) vlf_power_pts = 4;
    else if ((data.vlf_power >= 50 && data.vlf_power < 100) || (data.vlf_power > 500 && data.vlf_power <= 1000)) vlf_power_pts = 3;
    else if ((data.vlf_power >= 20 && data.vlf_power < 50) || (data.vlf_power > 1000 && data.vlf_power <= 2000)) vlf_power_pts = 2;
    else vlf_power_pts = 1;
    result.bands.vlf_power = { ...bandColor(vlf_power_pts), score: (vlf_power_pts * 100) / 4 };
    total_pts += vlf_power_pts;
  }

  if (data.lf_power !== undefined) {
    metric_count++;
    let lf_power_pts = 1;
    if (data.lf_power >= 300 && data.lf_power <= 1170) lf_power_pts = 4;
    else if ((data.lf_power >= 200 && data.lf_power < 300) || (data.lf_power > 1170 && data.lf_power <= 2000)) lf_power_pts = 3;
    else if ((data.lf_power >= 100 && data.lf_power < 200) || (data.lf_power > 2000)) lf_power_pts = 2;
    else lf_power_pts = 1;
    result.bands.lf_power = { ...bandColor(lf_power_pts), score: (lf_power_pts * 100) / 4 };
    total_pts += lf_power_pts;
  }

  if (data.rr_intervals !== undefined) {
    metric_count++;
    let rr_intervals_pts = 1;
    if (data.rr_intervals >= 60) rr_intervals_pts = 4;
    else if (data.rr_intervals >= 50) rr_intervals_pts = 3;
    else if (data.rr_intervals >= 40) rr_intervals_pts = 2;
    else rr_intervals_pts = 1;
    result.bands.rr_intervals = { ...bandColor(rr_intervals_pts), score: (rr_intervals_pts * 100) / 4 };
    total_pts += rr_intervals_pts;
  }

  if (data.normalized_coherence_pct !== undefined) {
    metric_count++;
    let coh_pts = 1;
    if (data.normalized_coherence_pct >= 60) coh_pts = 4;
    else if (data.normalized_coherence_pct >= 50) coh_pts = 3;
    else if (data.normalized_coherence_pct >= 30) coh_pts = 2;
    else coh_pts = 1;
    result.bands.normalized_coherence_pct = { ...bandColor(coh_pts), score: (coh_pts * 100) / 4 };
    total_pts += coh_pts;
  }

  // Calculate Total Circulation Score
  const Circulation_Score = metric_count > 0 ? (total_pts * 100) / (metric_count * 4) : 100;
  result.bands.circulation_score = { ...circulationColorBand(Circulation_Score), score: Circulation_Score };
  result.radar = { circulation: Circulation_Score };
  result.bucket = { circulation: Circulation_Score };
  return result;
}

/* ──────────────────────────────────────────────────────────────
   6.  Form configuration — for staff data entry (legacy)
   ──────────────────────────────────────────────────────────── */
export const FORM = [
  // OmniFit PPG fields
  ['hrv_index', 'HRV Index (OmniFit)', 0.1, 1, 20],
  ['lf', 'LF Power (log ms²)', 0.01, 0.1, 50],
  
  // HeartMath fields
  ['mean_hr_bpm', 'Mean Heart Rate (bpm)', 0.1, 40, 100],
  ['mean_ibi_ms', 'Mean Inter-Beat Interval (ms)', 0.1, 50, 200],
  ['sdnn_ms', 'SDNN (ms)', 0.1, 10, 100],
  ['total_power', 'Total Power (ms²)', 0.1, 100, 5000],
  ['vlf_power', 'VLF Power (ms²)', 0.1, 20, 500],
  ['lf_power', 'LF Power (ms²)', 0.1, 50, 2000],
  ['rr_intervals', 'R-R Intervals (count)', 1, 40, 100],
  ['normalized_coherence_pct', 'Normalized Coherence (%)', 0.1, 0, 100],
] as const;

/* ──────────────────────────────────────────────────────────────
   7.  Registry export
   ──────────────────────────────────────────────────────────── */
export const circulationModule = {
  slug: 'circulation',
  zod: circulationSchema,
  ui: circulationMetricSchema,
  scorer: scoreCirculation,
} as const;

export default circulationModule; 