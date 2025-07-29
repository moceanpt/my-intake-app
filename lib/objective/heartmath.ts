/* ------------------------------------------------------------------
   lib/objective/heartmath.ts
   ------------------------------------------------------------------
   • FORM            – array blueprint (order drives DeviceForm layout)
   • heartMathSchema – staff-input validation
   • heartMathUI     – the object passed to <DeviceForm>
   • scoreHeartMath  – maps six inputs to radar + bucket
------------------------------------------------------------------- */

import { z } from 'zod';
import { band as bucketBand } from './utils';
import type { MetricSchema } from '../metrics/types';

/* ──────────────────────────────────────────────────────────────
   1 ▸ UI-blueprint (matching extracted data)
   ──────────────────────────────────────────────────────────── */
export const FORM = [
  ['rr_intervals', 'R-R Intervals (count)', 1, 100, 1000],
  ['mean_hr_bpm', 'Mean Heart Rate (bpm)', 0.1, 40, 120],
  ['mean_ibi_ms', 'Mean Inter-Beat Interval (ms)', 0.1, 500, 1500],
  ['sdnn_ms', 'SDNN (ms)', 0.1, 5, 150],
  ['rmssd_ms', 'RMSSD (ms)', 0.1, 5, 150],
  ['total_power', 'Total Power (ms²)', 0.1, 100, 10000],
  ['vlf_power', 'VLF Power (ms²)', 0.1, 10, 1000],
  ['lf_power', 'LF Power (ms²)', 0.1, 10, 1000],
  ['hf_power', 'HF Power (ms²)', 0.1, 10, 1000],
  ['lf_hf_ratio', 'LF/HF Ratio', 0.01, 0.1, 10],
  ['normalized_coherence_pct', 'Normalized Coherence (%)', 0.1, 0, 100],
] as const;

/* helper: tuple-array ➜ Zod shape */
const shape: Record<(typeof FORM)[number][0], z.ZodTypeAny> = {
  rr_intervals: z.number().int().positive(),
  mean_hr_bpm: z.number().positive(),
  mean_ibi_ms: z.number().positive(),
  sdnn_ms: z.number().positive(),
  rmssd_ms: z.number().positive(),
  total_power: z.number().positive(),
  vlf_power: z.number().positive(),
  lf_power: z.number().positive(),
  hf_power: z.number().positive(),
  lf_hf_ratio: z.number().positive(),
  normalized_coherence_pct: z.number().nonnegative(),
};
export const heartMathSchema = z.object(shape);
export type HeartMathInput = z.infer<typeof heartMathSchema>;

export const heartMathKeys =
  Object.keys(shape) as (keyof HeartMathInput)[];

/* ──────────────────────────────────────────────────────────────
   2 ▸ New MetricSchema for DeviceForm
   ──────────────────────────────────────────────────────────── */
export const heartmathMetricSchema: MetricSchema = {
  slug: 'heartmath',
  title: 'HeartMath Heart Rate Variability & Coherence',
  fields: [
    { name: 'heartmath_table', label: 'HeartMath Metrics', widget: 'heartmath-table' as const, tableType: 'combined' },
  ]
};

/* ──────────────────────────────────────────────────────────────
   3 ▸  Device-form object (NEW)  ← import THIS in the page
   ──────────────────────────────────────────────────────────── */
export const heartMathUI = {
  slug : 'heartmath',
  title: 'HeartMath Heart Rate Variability & Coherence',
  fields: FORM.map(([name, label, step]) => ({ name, label, step })),

  /** convert raw FormData ➜ typed payload */
  toPayload(raw: Record<string, FormDataEntryValue>): HeartMathInput {
    const n = (k: string) => Number(raw[k] ?? 0);

    return {
      rr_intervals: n('rr_intervals'),
      mean_hr_bpm: n('mean_hr_bpm'),
      mean_ibi_ms: n('mean_ibi_ms'),
      sdnn_ms: n('sdnn_ms'),
      rmssd_ms: n('rmssd_ms'),
      total_power: n('total_power'),
      vlf_power: n('vlf_power'),
      lf_power: n('lf_power'),
      hf_power: n('hf_power'),
      lf_hf_ratio: n('lf_hf_ratio'),
      normalized_coherence_pct: n('normalized_coherence_pct'),
    };
  },
} as const;

/* ──────────────────────────────────────────────────────────────
   4 ▸ Scorer – updated for new metrics
   ──────────────────────────────────────────────────────────── */
// Color band logic for HeartMath (consistent with other metrics)
function heartMathColorBand(label: string) {
  switch (label) {
    case 'Green':
      return { color: 'dark-green', label: 'Optimal' };
    case 'Yellow':
      return { color: 'yellow', label: 'Mild' };
    case 'Orange':
      return { color: 'orange', label: 'Moderate' };
    case 'Red':
      return { color: 'red', label: 'Critical' };
    default:
      return { color: 'gray', label: 'Unknown' };
  }
}

export function scoreHeartMath(d: HeartMathInput) {
  const result: any = { bands: {} };
  
  // SDNN (ms)
  let sdnnLabel = 'Red';
  if (d.sdnn_ms >= 50) sdnnLabel = 'Green';
  else if (d.sdnn_ms >= 45) sdnnLabel = 'Yellow';
  else if (d.sdnn_ms >= 30) sdnnLabel = 'Orange';
  result.bands.sdnn = heartMathColorBand(sdnnLabel);
  result.bands.sdnn.score = [0, 25, 50, 100][['Red','Orange','Yellow','Green'].indexOf(sdnnLabel)];

  // RMSSD (ms)
  let rmssdLabel = 'Red';
  if (d.rmssd_ms >= 40) rmssdLabel = 'Green';
  else if (d.rmssd_ms >= 35) rmssdLabel = 'Yellow';
  else if (d.rmssd_ms >= 20) rmssdLabel = 'Orange';
  result.bands.rmssd = heartMathColorBand(rmssdLabel);
  result.bands.rmssd.score = [0, 25, 50, 100][['Red','Orange','Yellow','Green'].indexOf(rmssdLabel)];

  // Total Power (ms²)
  let tpLabel = 'Red';
  if (d.total_power >= 1000) tpLabel = 'Green';
  else if (d.total_power >= 750) tpLabel = 'Yellow';
  else if (d.total_power >= 500) tpLabel = 'Orange';
  result.bands.total_power = heartMathColorBand(tpLabel);
  result.bands.total_power.score = [0, 25, 50, 100][['Red','Orange','Yellow','Green'].indexOf(tpLabel)];

  // LF Power (ms²)
  let lfLabel = 'Red';
  if (d.lf_power >= 300 && d.lf_power <= 1170) lfLabel = 'Green';
  else if (d.lf_power >= 200 && d.lf_power < 300) lfLabel = 'Yellow';
  else if (d.lf_power >= 100 && d.lf_power < 200) lfLabel = 'Orange';
  result.bands.lf_power = heartMathColorBand(lfLabel);
  result.bands.lf_power.score = [0, 25, 50, 100][['Red','Orange','Yellow','Green'].indexOf(lfLabel)];

  // HF Power (ms²)
  let hfLabel = 'Red';
  if (d.hf_power >= 300 && d.hf_power <= 975) hfLabel = 'Green';
  else if (d.hf_power >= 200 && d.hf_power < 300) hfLabel = 'Yellow';
  else if (d.hf_power >= 100 && d.hf_power < 200) hfLabel = 'Orange';
  result.bands.hf_power = heartMathColorBand(hfLabel);
  result.bands.hf_power.score = [0, 25, 50, 100][['Red','Orange','Yellow','Green'].indexOf(hfLabel)];

  // LF/HF ratio
  let lfhfLabel = 'Red';
  if (d.lf_hf_ratio >= 0.5 && d.lf_hf_ratio <= 2.0) lfhfLabel = 'Green';
  else if ((d.lf_hf_ratio >= 0.8 && d.lf_hf_ratio < 0.99) || (d.lf_hf_ratio > 1.01 && d.lf_hf_ratio <= 1.25)) lfhfLabel = 'Yellow';
  else if ((d.lf_hf_ratio >= 0.21 && d.lf_hf_ratio < 0.79) || (d.lf_hf_ratio > 2.01 && d.lf_hf_ratio <= 4.0)) lfhfLabel = 'Orange';
  result.bands.lf_hf_ratio = heartMathColorBand(lfhfLabel);
  result.bands.lf_hf_ratio.score = [0, 25, 50, 100][['Red','Orange','Yellow','Green'].indexOf(lfhfLabel)];

  // Normalized Coherence (%)
  let cohLabel = 'Red';
  if (d.normalized_coherence_pct >= 60) cohLabel = 'Green';
  else if (d.normalized_coherence_pct >= 50) cohLabel = 'Yellow';
  else if (d.normalized_coherence_pct >= 30) cohLabel = 'Orange';
  result.bands.normalized_coherence_pct = heartMathColorBand(cohLabel);
  result.bands.normalized_coherence_pct.score = [0, 25, 50, 100][['Red','Orange','Yellow','Green'].indexOf(cohLabel)];

  // Return both bands and a summary (e.g., average of all scores)
  const allScores = Object.values(result.bands).map((b: any) => b.score).filter(Boolean);
  const avgScore = allScores.length ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
  result.radar = { stress: avgScore, nervous_system: avgScore };
  result.bucket = { stress: avgScore, brain: avgScore };
  return result;
}