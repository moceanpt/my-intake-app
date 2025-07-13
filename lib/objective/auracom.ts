/* ------------------------------------------------------------------
   lib/objective/auracom.ts
   ------------------------------------------------------------------
   • Zod schema for staff data-entry
   • scoreAuraCom()  → { radar , bucket }   (same contract as others)
   • UI schema (auraComUISchema) consumed by <DeviceForm>
------------------------------------------------------------------- */

import { z }   from 'zod';
import { band } from './utils';
import type { MetricSchema } from '../metrics/types';

/* ──────────────────────────────────────────────────────────
   1 ▸ Colour reference table  (ID · label · scoreRef)
   ──────────────────────────────────────────────────────── */
export const AURA_PALETTE = [
  ['blackish_red',    'Blackish Red',         90],
  ['red',             'Red / Bright Red',     80],
  ['dark_orange',     'Dark Orange',          75],
  ['orange',          'Orange',               70],
  ['orangish_yellow', 'Orangish Yellow',      65],
  ['yellow',          'Yellow',               60],
  ['yellowish_green', 'Yellowish Green',      55],
  ['green',           'Green',                50],
  ['greenish_blue',   'Greenish Blue',        45],
  ['blue',            'Blue',                 40],
  ['bluish_violet',   'Bluish Violet',        35],
  ['indigo',          'Indigo / Violet',      30],
  ['violet_purple',   'Violet-Purple',        25],
  ['purple',          'Purple',               20],
  ['white',           'White',                10],
] as const;

/* ---------------------------------------------------------
   2 ▸ Data-entry form blueprint (matching extracted data)
--------------------------------------------------------- */
export const FORM = [
  /* A – Overall Assessment */
  ['ava_score', 'Aura Vitality Assessment Score', 1, 0, 1000],
  ['vigor', 'Vigor Level (0-100)', 1, 0, 100],
  ['stability', 'Stability Score (0-100)', 1, 0, 100],
  ['activity_percent', 'Activity Level (%)', 1, 0, 100],

  /* B – Five-Element Balance */
  ['wood', 'Wood Element Balance (0-100)', 1, 0, 100],
  ['fire', 'Fire Element Balance (0-100)', 1, 0, 100],
  ['earth', 'Earth Element Balance (0-100)', 1, 0, 100],
  ['metal', 'Metal Element Balance (0-100)', 1, 0, 100],
  ['water', 'Water Element Balance (0-100)', 1, 0, 100],
  ['overall_balance_score', 'Overall Elemental Balance Score (0-100)', 1, 0, 100],
] as const;

/* helper tuple → Zod shape */
const shape: Record<(typeof FORM)[number][0], z.ZodTypeAny> = {
  ava_score: z.number().positive(),
  vigor: z.number().int().min(0).max(100),
  stability: z.number().int().min(0).max(100),
  activity_percent: z.number().int().min(0).max(100),
  wood: z.number().int().min(0).max(100),
  fire: z.number().int().min(0).max(100),
  earth: z.number().int().min(0).max(100),
  metal: z.number().int().min(0).max(100),
  water: z.number().int().min(0).max(100),
  overall_balance_score: z.number().int().min(0).max(100),
};

export const auraComSchema = z.object(shape);
export type AuraComInput = z.infer<typeof auraComSchema>;
export const auraComKeys = auraComSchema.keyof().options;

/* dropdown helpers */
const colourOptions = AURA_PALETTE.map(([id, label]) => ({ value:id, label }));

/* ---------------------------------------------------------
   4 ▸ Scorer (updated for new metrics)
--------------------------------------------------------- */
// Color band logic for Auracom (consistent with other metrics)
function auraColorBand(label: string) {
  switch (label) {
    case 'Optimal':
    case 'Ideal':
    case 'Balanced':
      return { color: 'dark-green', label };
    case 'Average':
    case 'Low':
    case 'Mild imbalance':
    case 'High/Stressed':
    case 'Parasympathetic Dominance':
      return { color: 'yellow', label };
    case 'Needs improvement':
    case 'Underactive':
      return { color: 'orange', label };
    case 'Overactive':
    case 'Over-stimulated':
    case 'Red':
    case 'Fatigued':
    case 'Severe imbalance':
    case 'Sympathetic Dominance':
      return { color: 'red', label };
    default:
      return { color: 'gray', label: 'Unknown' };
  }
}

export function scoreAuraCom(d: AuraComInput) {
  const result: any = { bands: {} };
  // Energy Score (Ava)
  let ava_pts = 0;
  if (d.ava_score > 600) ava_pts = 6; // Orange (Excess output)
  else if (d.ava_score >= 500) ava_pts = 0; // Green
  else if (d.ava_score >= 450) ava_pts = 4; // Yellow
  else if (d.ava_score >= 400) ava_pts = 6; // Orange
  else ava_pts = 8; // Red
  result.bands.ava = { score: 100 - (ava_pts * 100 / 8) };

  // Vigor (Yang)
  let vigor_pts = 0;
  if (d.vigor > 71) vigor_pts = 8; // Red (Burnout risk)
  else if (d.vigor >= 60) vigor_pts = 0; // Green
  else if (d.vigor >= 50) vigor_pts = 4; // Yellow
  else vigor_pts = 6; // Orange
  result.bands.vigor = { score: 100 - (vigor_pts * 100 / 8) };

  // Stability (Yin)
  let stability_pts = 0;
  if (d.stability > 51) stability_pts = 8; // Red (Fatigued)
  else if (d.stability >= 41) stability_pts = 4; // Yellow
  else if (d.stability >= 30) stability_pts = 0; // Green
  else stability_pts = 6; // Orange
  result.bands.stability = { score: 100 - (stability_pts * 100 / 8) };

  // Activity % (ANS)
  let activity_pts = 0;
  if (d.activity_percent > 60) activity_pts = 8; // Red (Sympathetic dom.)
  else if (d.activity_percent >= 40 && d.activity_percent <= 60) activity_pts = 0; // Green
  else activity_pts = 4; // Yellow (Parasymp. dom.)
  result.bands.activity_pct = { score: 100 - (activity_pts * 100 / 8) };

  // Overall Elemental Balance
  let elem_pts = 0;
  if (d.overall_balance_score < 80) elem_pts = 8; // Red (Significant deficiency)
  else if (d.overall_balance_score >= 95 && d.overall_balance_score <= 110) elem_pts = 0; // Green
  else if (d.overall_balance_score >= 90 && d.overall_balance_score < 95) elem_pts = 4; // Yellow
  else if ((d.overall_balance_score >= 80 && d.overall_balance_score < 90) || d.overall_balance_score > 110) elem_pts = 6; // Orange
  result.bands.element_score = { score: 100 - (elem_pts * 100 / 8) };

  // Elemental Deviation Severity (max-min of five elements)
  const elements = [d.wood, d.fire, d.earth, d.metal, d.water];
  const deviation = Math.max(...elements) - Math.min(...elements);
  let dev_pts = 0;
  if (deviation <= 5) dev_pts = 0; // Green
  else if (deviation <= 10) dev_pts = 4; // Yellow
  else if (deviation <= 15) dev_pts = 6; // Orange
  else dev_pts = 8; // Red
  result.bands.element_deviation = { score: 100 - (dev_pts * 100 / 8) };

  // Return both bands and a summary (e.g., average of all scores)
  const allScores = Object.values(result.bands).map((b: any) => b.score).filter(Boolean);
  const avgScore = allScores.length ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
  result.radar = { energy: avgScore, organ_digest_hormone_detox: avgScore };
  result.bucket = { energy: avgScore, gut: avgScore };
  return result;
}

/* ---------------------------------------------------------
   5 ▸ New MetricSchema for DeviceForm
--------------------------------------------------------- */
export const auracomMetricSchema: MetricSchema = {
  slug: 'auracom',
  title: 'AuraCom Traditional Chinese Medicine Balance',
  fields: [
    /* A. Overall Assessment */
    { name: 'ava_score', label: 'Aura Vitality Assessment Score', widget: 'number' as const, step: 1 },
    { name: 'vigor', label: 'Vigor Level (0-100)', widget: 'number' as const, step: 1 },
    { name: 'stability', label: 'Stability Score (0-100)', widget: 'number' as const, step: 1 },
    { name: 'activity_percent', label: 'Activity Level (%)', widget: 'number' as const, step: 1 },

    /* B. Five-Element Balance */
    { name: 'wood', label: 'Wood Element Balance (0-100)', widget: 'number' as const, step: 1 },
    { name: 'fire', label: 'Fire Element Balance (0-100)', widget: 'number' as const, step: 1 },
    { name: 'earth', label: 'Earth Element Balance (0-100)', widget: 'number' as const, step: 1 },
    { name: 'metal', label: 'Metal Element Balance (0-100)', widget: 'number' as const, step: 1 },
    { name: 'water', label: 'Water Element Balance (0-100)', widget: 'number' as const, step: 1 },
    { name: 'overall_balance_score', label: 'Overall Elemental Balance Score (0-100)', widget: 'number' as const, step: 1 },
  ]
};

/* ---------------------------------------------------------
   6 ▸ Legacy UI schema consumed by <DeviceForm>
--------------------------------------------------------- */
export const auraComUISchema = {
  /* meta used by DevicePicker / DeviceForm */
  title : 'AuraCom Traditional Chinese Medicine Balance',
  slug  : 'auracom',

  fields: [
    /* A. Overall Assessment */
    { name: 'ava_score', section: 'A. Overall Assessment', label: 'Aura Vitality Assessment Score', step: 1 },
    { name: 'vigor', section: 'A. Overall Assessment', label: 'Vigor Level (0-100)', step: 1 },
    { name: 'stability', section: 'A. Overall Assessment', label: 'Stability Score (0-100)', step: 1 },
    { name: 'activity_percent', section: 'A. Overall Assessment', label: 'Activity Level (%)', step: 1 },

    /* B. Five-Element Balance */
    { name: 'wood', section: 'B. Five-Element Balance', label: 'Wood Element Balance (0-100)', step: 1 },
    { name: 'fire', section: 'B. Five-Element Balance', label: 'Fire Element Balance (0-100)', step: 1 },
    { name: 'earth', section: 'B. Five-Element Balance', label: 'Earth Element Balance (0-100)', step: 1 },
    { name: 'metal', section: 'B. Five-Element Balance', label: 'Metal Element Balance (0-100)', step: 1 },
    { name: 'water', section: 'B. Five-Element Balance', label: 'Water Element Balance (0-100)', step: 1 },
    { name: 'overall_balance_score', section: 'B. Five-Element Balance', label: 'Overall Elemental Balance Score (0-100)', step: 1 },
  ],

  /* raw → typed payload */
  toPayload(raw: Record<string, FormDataEntryValue>) {
    const n = (k:string) => Number(raw[k] ?? 0);

    return {
      ava_score: n('ava_score'),
      vigor: n('vigor'),
      stability: n('stability'),
      activity_percent: n('activity_percent'),
      wood: n('wood'),
      fire: n('fire'),
      earth: n('earth'),
      metal: n('metal'),
      water: n('water'),
      overall_balance_score: n('overall_balance_score'),
    };
  },
};