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

/* ──────────────────────────────────────────────────────────────
   1 ▸ UI-blueprint
   ──────────────────────────────────────────────────────────── */
export const FORM = [
  ['mean_hr_bpm',        'Mean HR (bpm)',          0.1, 40, 120],
  ['sdnn_ms',            'SDNN (ms)',              0.1,  5, 150],
  ['rmssd_ms',           'RMSSD (ms)',             0.1,  5, 150],
  ['total_power_ms2',    'Total Power (ms²)',      1,   100, 10_000],
  ['lf_hf_ratio',        'LF : HF ratio',          0.01,0.10, 10],
  ['high_coherence_pct', 'High-coherence %',       0.1,  0, 100],
] as const;

/* helper: tuple-array ➜ Zod shape */
const shape: Record<(typeof FORM)[number][0], z.ZodTypeAny> = {
  mean_hr_bpm        : z.number().positive(),
  sdnn_ms            : z.number().positive(),
  rmssd_ms           : z.number().positive(),
  total_power_ms2    : z.number().positive(),
  lf_hf_ratio        : z.number().positive(),
  high_coherence_pct : z.number().nonnegative(),
};
export const heartMathSchema = z.object(shape);
export type HeartMathInput = z.infer<typeof heartMathSchema>;

export const heartMathKeys =
  Object.keys(shape) as (keyof HeartMathInput)[];

/* ──────────────────────────────────────────────────────────────
   2 ▸  Device-form object (NEW)  ← import THIS in the page
   ──────────────────────────────────────────────────────────── */
export const heartMathUI = {
  slug : 'heartmath',
  title: 'HeartMath Metrics',
  fields: FORM.map(([name, label, step]) => ({ name, label, step })),

  /** convert raw FormData ➜ typed payload */
  toPayload(raw: Record<string, FormDataEntryValue>): HeartMathInput {
    const n = (k: string) => Number(raw[k] ?? 0);

    return {
      mean_hr_bpm        : n('mean_hr_bpm'),
      sdnn_ms            : n('sdnn_ms'),
      rmssd_ms           : n('rmssd_ms'),
      total_power_ms2    : n('total_power_ms2'),
      lf_hf_ratio        : n('lf_hf_ratio'),
      high_coherence_pct : n('high_coherence_pct'),
    };
  },
} as const;

/* ──────────────────────────────────────────────────────────────
   3 ▸ Scorer – unchanged
   ──────────────────────────────────────────────────────────── */
function band(metric: keyof HeartMathInput, v: number): 0 | 1 | 2 {
  switch (metric) {
    case 'mean_hr_bpm':        return 60 <= v && v <= 80
                                  ? 2 : (50 <= v && v <= 90 ? 1 : 0);
    case 'sdnn_ms':            return v >= 50 ? 2 : v >= 30 ? 1 : 0;
    case 'rmssd_ms':           return v >= 40 ? 2 : v >= 20 ? 1 : 0;
    case 'total_power_ms2':    return v >= 1500 ? 2 : v >= 500 ? 1 : 0;
    case 'lf_hf_ratio':        return 0.5 <= v && v <= 2.0
                                  ? 2 : ((0.3 <= v && v < 0.5) || (2.0 < v && v <= 4.0) ? 1 : 0);
    case 'high_coherence_pct': return v >= 80 ? 2 : v >= 50 ? 1 : 0;
  }
}

export function scoreHeartMath(d: HeartMathInput) {
  const radar: Record<string, number> = {
    musculoskeletal: 10,
    organ_digest_hormone_detox: 10,
    circulation: 10,
    energy: 10,
    articular_joint: 10,
    nervous_system: 10,
  };
  const bucket = {
    cellular: 0, energy: 0, gut: 0, stress: 0,
    circulation: 0, brain: 0, physical: 0, performance: 0,
  };

  /* Mean HR ---------------------------------------------------- */
  const hrBand = band('mean_hr_bpm', d.mean_hr_bpm);
  if (hrBand === 0) { bucket.stress += 2; radar.circulation = 6; }
  else if (hrBand === 1) bucket.stress += 1;

  /* SDNN ------------------------------------------------------- */
  const sdnnBand = band('sdnn_ms', d.sdnn_ms);
  if (sdnnBand === 0) { bucket.stress += 1; radar.energy = 6; }
  else if (sdnnBand === 1) bucket.stress += 0.5;

  /* RMSSD ------------------------------------------------------ */
  if (band('rmssd_ms', d.rmssd_ms) === 0)
    { bucket.stress += 1; radar.energy = 6; }

  /* Total Power ----------------------------------------------- */
  const tpBand = band('total_power_ms2', d.total_power_ms2);
  if (tpBand === 0) { bucket.energy += 2; radar.energy = 5; }
  else if (tpBand === 1) { bucket.energy += 1; radar.energy = 6; }

  /* LF / HF balance ------------------------------------------- */
  const balBand = band('lf_hf_ratio', d.lf_hf_ratio);
  if (balBand === 0) { bucket.stress += 2; radar.nervous_system = 5; }
  else if (balBand === 1) { bucket.stress += 1; }

  /* High-coherence % ------------------------------------------ */
  const cohBand = band('high_coherence_pct', d.high_coherence_pct);
  if (cohBand === 0) { bucket.stress += 2; radar.nervous_system = 5; }
  else if (cohBand === 1) { bucket.stress += 1; }

  return { radar, bucket };
}