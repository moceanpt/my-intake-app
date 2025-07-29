/* ------------------------------------------------------------------
   lib/objective/inbody.ts
   ------------------------------------------------------------------
   • FORM – blueprint consumed by <DeviceForm>
   • inBodySchema – validates staff input
   • scoreInBody() – maps the six metrics to radar + bucket
------------------------------------------------------------------- */
import { z } from 'zod';
import { band } from './utils';          // helper already in repo
import type { MetricSchema } from '../metrics/types';

/* ───── 1 ▸ UI blueprint (order matters) ───── */
export const FORM = [
  /* A. Hydration / water balance */
  ['hydration',     'Hydration %',               0.1, 30, 80],

  /* B. Body-composition core */
  ['smm_pct',       'Skeletal Muscle Mass %',    0.1, 10, 70],
  ['body_fat_pct',  'Body Fat %',                0.1,  3, 70],
  ['vfa',           'Visceral Fat Area (cm²)',   1  , 10, 250],

  /* C. Water-retention & cell health */
  ['ecw_tbw',       'ECW / TBW ratio',           0.001, 0.30, 0.50],
  ['phase_angle',   'Phase Angle (°)',           0.1,  1, 10],
] as const;

/* helper tuple → Zod shape */
const shape: Record<(typeof FORM)[number][0], z.ZodTypeAny> = {
  hydration    : z.number().positive(),
  smm_pct      : z.number().positive(),
  body_fat_pct : z.number().positive(),
  vfa          : z.number().positive(),
  ecw_tbw      : z.number().positive(),
  phase_angle  : z.number().positive(),
};
export const inBodySchema = z.object(shape);
export type InBodyInput   = z.infer<typeof inBodySchema>;
export const inBodyKeys   = Object.keys(shape) as (keyof InBodyInput)[];

/* ───── 2 ▸ Color band logic ───── */
// Total Organ-Health Score color band logic
function organHealthScoreColorBand(score: number) {
  if (score >= 80) return { color: 'dark-green', label: 'Optimal' };
  if (score >= 60) return { color: 'yellow', label: 'Moderate imbalance' };
  if (score >= 40) return { color: 'orange', label: 'High-risk imbalance' };
  return { color: 'red', label: 'Critical – immediate attention' };
}

/* ───── 3 ▸ Scoring logic (cleaned, no organ-health score) ───── */
export function scoreInBody(
  d   : InBodyInput,
  sex : 'M' | 'F' = 'M',
  age = 35,                       // default when DOB unknown
) {
  let total_pts = 0;
  const result: any = { bands: {} };
  
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

  // --- Hydration % (Total Body Water / Weight) ---
  let hydration_pts = 0;
  const hyd = d.hydration;
  if (sex === 'M') {
    if (hyd >= 58) hydration_pts = 4; // Normal/Optimal (58-66%)
    else if (hyd >= 52) hydration_pts = 3; // Low-Normal (52-58%)
    else if (hyd >= 50) hydration_pts = 2; // Moderately Dehydrated (50-52%)
    else hydration_pts = 1; // Severely Dehydrated (<50%)
  } else {
    if (hyd >= 48) hydration_pts = 4; // Normal/Optimal (48-60%)
    else if (hyd >= 41) hydration_pts = 3; // Low-Normal (41-48%)
    else if (hyd >= 40) hydration_pts = 2; // Moderately Dehydrated (40-41%)
    else hydration_pts = 1; // Severely Dehydrated (<40%)
  }
  total_pts += hydration_pts;

  // --- Body Fat % (BIA, Adults) ---
  let bf_pts = 0;
  const bf = d.body_fat_pct;
  if (sex === 'M') {
    const ageBands = [
      { min: 20, max: 29, low: 8, excellent: [8, 10.5], good: [10.6, 14.8], fair: [14.9, 18.6], poor: [18.7, 23.1], danger: 23.2 },
      { min: 30, max: 39, low: 8, excellent: [8, 14.5], good: [14.6, 18.2], fair: [18.3, 21.3], poor: [21.4, 24.9], danger: 25 },
      { min: 40, max: 49, low: 8, excellent: [8, 17.4], good: [17.5, 20.6], fair: [20.7, 23.4], poor: [23.5, 26.6], danger: 26.7 },
      { min: 50, max: 59, low: 8, excellent: [8, 19.1], good: [19.2, 22.1], fair: [22.2, 24.6], poor: [24.7, 27.8], danger: 27.9 },
      { min: 60, max: 69, low: 8, excellent: [8, 19.7], good: [19.8, 22.6], fair: [22.7, 25.2], poor: [25.3, 28.4], danger: 28.5 },
    ];
    const band = ageBands.find(b => age >= b.min && age <= b.max) || ageBands[0];
    
    if (bf < band.low) bf_pts = 1; // Low (Red)
    else if (bf >= band.excellent[0] && bf <= band.excellent[1]) bf_pts = 4; // Excellent (Green)
    else if (bf >= band.good[0] && bf <= band.good[1]) bf_pts = 4; // Good (Green)
    else if (bf >= band.fair[0] && bf <= band.fair[1]) bf_pts = 3; // Fair (Yellow)
    else if (bf >= band.poor[0] && bf <= band.poor[1]) bf_pts = 2; // Poor (Orange)
    else if (bf > band.danger) bf_pts = 1; // Dangerously High (Red)
  } else {
    // Body Fat % reference chart from REFERENCE_CHARTS.md
    const ageBands = [
      { min: 20, max: 29, low: 14, excellent: [14, 16.5], good: [16.6, 19.4], fair: [19.5, 22.7], poor: [22.8, 27.1], danger: 27.2 },
      { min: 30, max: 39, low: 14, excellent: [14, 17.4], good: [17.5, 20.8], fair: [20.9, 24.6], poor: [24.7, 29.1], danger: 29.2 },
      { min: 40, max: 49, low: 14, excellent: [14, 19.8], good: [19.9, 23.8], fair: [23.9, 27.6], poor: [27.7, 31.9], danger: 31.9 },
      { min: 50, max: 59, low: 14, excellent: [14, 22.5], good: [22.6, 27.0], fair: [27.1, 30.4], poor: [30.5, 34.5], danger: 34.6 },
      { min: 60, max: 69, low: 14, excellent: [14, 23.2], good: [23.3, 27.9], fair: [28.0, 31.3], poor: [31.4, 35.4], danger: 35.5 },
    ];
    const band = ageBands.find(b => age >= b.min && age <= b.max) || ageBands[0];
    
    if (bf < band.low) bf_pts = 1; // Low (Red)
    else if (bf >= band.excellent[0] && bf <= band.excellent[1]) bf_pts = 4; // Excellent (Green)
    else if (bf >= band.good[0] && bf <= band.good[1]) bf_pts = 4; // Good (Green)
    else if (bf >= band.fair[0] && bf <= band.fair[1]) bf_pts = 3; // Fair (Yellow)
    else if (bf >= band.poor[0] && bf <= band.poor[1]) bf_pts = 2; // Poor (Orange)
    else if (bf > band.danger) bf_pts = 1; // Dangerously High (Red)
  }
  total_pts += bf_pts;

  // --- Visceral Fat Area (cm²) ---
  let vfa_pts = 0;
  const vfa = d.vfa;
  if (vfa < 100) vfa_pts = 4; // Optimal (Green)
  else if (vfa < 130) vfa_pts = 3; // Elevated Risk (Yellow)
  else if (vfa < 150) vfa_pts = 2; // High (Orange)
  else vfa_pts = 1; // Very High/Warning (Red)
  total_pts += vfa_pts;

  // --- ECW/TBW Ratio ---
  let ecw_pts = 0;
  if (d.ecw_tbw >= 0.401) ecw_pts = 1; // Low/Recovery (Red)
  else if (d.ecw_tbw >= 0.391) ecw_pts = 2; // Caution (Orange)
  else if (d.ecw_tbw >= 0.381) ecw_pts = 3; // Acceptable (Yellow)
  else ecw_pts = 4; // Optimal (Green) (<0.381)
  total_pts += ecw_pts;

  // --- SMM % (Skeletal Muscle Mass / Weight) ---
  let smm_pts = 0;
  const smm_pct = d.smm_pct;
  if (sex === 'M') {
    if (smm_pct > 48) {
      smm_pts = 4; // Athletic
    } else if (age <= 35) {
      if (smm_pct >= 40) smm_pts = 4; // Green ✓ Healthy
      else if (smm_pct >= 37) smm_pts = 3; // Yellow • Acceptable
      else if (smm_pct >= 34) smm_pts = 2; // Orange ! Caution
      else smm_pts = 1; // Red ✗ Low
    } else if (age <= 55) {
      if (smm_pct >= 36) smm_pts = 4; // Green ✓ Healthy
      else if (smm_pct >= 33) smm_pts = 3; // Yellow • Acceptable
      else if (smm_pct >= 30) smm_pts = 2; // Orange ! Caution
      else smm_pts = 1; // Red ✗ Low
    } else if (age <= 75) {
      if (smm_pct >= 32) smm_pts = 4; // Green ✓ Healthy
      else if (smm_pct >= 29) smm_pts = 3; // Yellow • Acceptable
      else if (smm_pct >= 26) smm_pts = 2; // Orange ! Caution
      else smm_pts = 1; // Red ✗ Low
    } else {
      if (smm_pct >= 31) smm_pts = 4; // Green ✓ Healthy
      else if (smm_pct >= 27) smm_pts = 3; // Yellow • Acceptable
      else if (smm_pct >= 24) smm_pts = 2; // Orange ! Caution
      else smm_pts = 1; // Red ✗ Low
    }
  } else {
    if (smm_pct > 38) {
      smm_pts = 4; // Athletic
    } else if (age <= 35) {
      if (smm_pct >= 31) smm_pts = 4; // Green ✓ Healthy
      else if (smm_pct >= 28) smm_pts = 3; // Yellow • Acceptable
      else if (smm_pct >= 26) smm_pts = 2; // Orange ! Caution
      else smm_pts = 1; // Red ✗ Low
    } else if (age <= 55) {
      if (smm_pct >= 29) smm_pts = 4; // Green ✓ Healthy
      else if (smm_pct >= 26) smm_pts = 3; // Yellow • Acceptable
      else if (smm_pct >= 24) smm_pts = 2; // Orange ! Caution
      else smm_pts = 1; // Red ✗ Low
    } else if (age <= 75) {
      if (smm_pct >= 27) smm_pts = 4; // Green ✓ Healthy
      else if (smm_pct >= 24) smm_pts = 3; // Yellow • Acceptable
      else if (smm_pct >= 22) smm_pts = 2; // Orange ! Caution
      else smm_pts = 1; // Red ✗ Low
    } else {
      if (smm_pct >= 26) smm_pts = 4; // Green ✓ Healthy
      else if (smm_pct >= 23) smm_pts = 3; // Yellow • Acceptable
      else if (smm_pct >= 20) smm_pts = 2; // Orange ! Caution
      else smm_pts = 1; // Red ✗ Low
    }
  }
  total_pts += smm_pts;

  // --- Phase Angle (PhA) ---
  let pha_pts = 0;
  const pha = d.phase_angle;
  if (sex === 'M') {
    const phaBands = [
      { min: 18, max: 29, green: 6.8, yellow: 6.2, orange: 5.4, red: 5.4 },
      { min: 30, max: 39, green: 6.6, yellow: 6.0, orange: 5.2, red: 5.2 },
      { min: 40, max: 49, green: 6.4, yellow: 5.8, orange: 5.0, red: 5.0 },
      { min: 50, max: 59, green: 6.0, yellow: 5.4, orange: 4.7, red: 4.7 },
      { min: 60, max: 69, green: 5.6, yellow: 5.0, orange: 4.3, red: 4.3 },
      { min: 70, max: 79, green: 5.2, yellow: 4.6, orange: 3.9, red: 3.9 },
      { min: 80, max: 120, green: 4.8, yellow: 4.2, orange: 3.5, red: 3.5 },
    ];
    const band = phaBands.find(b => age >= b.min && age <= b.max) || phaBands[0];
    if (pha >= band.green) pha_pts = 4; // Healthy (Green)
    else if (pha >= band.yellow) pha_pts = 3; // Acceptable (Yellow)
    else if (pha >= band.orange) pha_pts = 2; // Caution (Orange)
    else pha_pts = 1; // Low/Recovery (Red)
  } else {
    const phaBands = [
      { min: 18, max: 29, green: 6.2, yellow: 5.6, orange: 4.8, red: 4.8 },
      { min: 30, max: 39, green: 6.0, yellow: 5.4, orange: 4.6, red: 4.6 },
      { min: 40, max: 49, green: 5.8, yellow: 5.2, orange: 4.4, red: 4.4 },
      { min: 50, max: 59, green: 5.4, yellow: 4.8, orange: 4.0, red: 4.0 },
      { min: 60, max: 69, green: 5.0, yellow: 4.4, orange: 3.6, red: 3.6 },
      { min: 70, max: 79, green: 4.6, yellow: 4.0, orange: 3.2, red: 3.2 },
      { min: 80, max: 120, green: 4.2, yellow: 3.6, orange: 2.9, red: 2.9 },
    ];
    const band = phaBands.find(b => age >= b.min && age <= b.max) || phaBands[0];
    if (pha >= band.green) pha_pts = 4; // Healthy (Green)
    else if (pha >= band.yellow) pha_pts = 3; // Acceptable (Yellow)
    else if (pha >= band.orange) pha_pts = 2; // Caution (Orange)
    else pha_pts = 1; // Low/Recovery (Red)
  }
  total_pts += pha_pts;

  // Cap total_pts at 40 (max possible points from all organ metrics)
  total_pts = Math.min(total_pts, 40);

  // Compute Organ-Health Score
  const Organ_Health_Score = (total_pts * 100 / 24);

  // Add total Organ-Health Score with color banding
  result.bands.organ_health_score = organHealthScoreColorBand(Organ_Health_Score);
  result.bands.organ_health_score.score = Organ_Health_Score;

  // Add individual metric scores for detailed breakdown
  result.bands.hydration = { score: (hydration_pts * 100 / 4) };
  result.bands.body_fat_pct = { score: (bf_pts * 100 / 4) };
  result.bands.vfa = { score: (vfa_pts * 100 / 4) };
  result.bands.ecw_tbw = { score: (ecw_pts * 100 / 4) };
  result.bands.smm_pct = { score: (smm_pts * 100 / 4) };
  result.bands.phase_angle = { score: (pha_pts * 100 / 4) };

  // Add radar and bucket data for integration with other devices
  result.radar = radar;
  result.bucket = bucket;

  return result;
}

export function scoreOrganSystemStory(metrics: InBodyInput, sex: 'M' | 'F' = 'M', age = 35) {
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

  // 1. Cellular Hydration & Integrity
  let hydrationScore = 0;
  const hyd = metrics.hydration;
  if (sex === 'M') {
    if (hyd >= 58) hydrationScore = 100;
    else if (hyd >= 52) hydrationScore = 75;
    else if (hyd >= 50) hydrationScore = 50;
    else hydrationScore = 25;
  } else {
    if (hyd >= 48) hydrationScore = 100;
    else if (hyd >= 41) hydrationScore = 75;
    else if (hyd >= 40) hydrationScore = 50;
    else hydrationScore = 25;
  }

  let ecwScore = 0;
  if (metrics.ecw_tbw >= 0.401) ecwScore = 25;
  else if (metrics.ecw_tbw >= 0.391) ecwScore = 50;
  else if (metrics.ecw_tbw >= 0.381) ecwScore = 75;
  else ecwScore = 100;

  let phaseScore = 0;
  const pha = metrics.phase_angle;
  if (sex === 'M') {
    const phaBands = [
      { min: 18, max: 29, green: 6.8, yellow: 6.2, orange: 5.4, red: 5.4 },
      { min: 30, max: 39, green: 6.6, yellow: 6.0, orange: 5.2, red: 5.2 },
      { min: 40, max: 49, green: 6.4, yellow: 5.8, orange: 5.0, red: 5.0 },
      { min: 50, max: 59, green: 6.0, yellow: 5.4, orange: 4.7, red: 4.7 },
      { min: 60, max: 69, green: 5.6, yellow: 5.0, orange: 4.3, red: 4.3 },
      { min: 70, max: 79, green: 5.2, yellow: 4.6, orange: 3.9, red: 3.9 },
      { min: 80, max: 120, green: 4.8, yellow: 4.2, orange: 3.5, red: 3.5 },
    ];
    const band = phaBands.find(b => age >= b.min && age <= b.max) || phaBands[0];
    if (pha >= band.green) phaseScore = 100;
    else if (pha >= band.yellow) phaseScore = 75;
    else if (pha >= band.orange) phaseScore = 50;
    else phaseScore = 25;
  } else {
    const phaBands = [
      { min: 18, max: 29, green: 6.2, yellow: 5.6, orange: 4.8, red: 4.8 },
      { min: 30, max: 39, green: 6.0, yellow: 5.4, orange: 4.6, red: 4.6 },
      { min: 40, max: 49, green: 5.8, yellow: 5.2, orange: 4.4, red: 4.4 },
      { min: 50, max: 59, green: 5.4, yellow: 4.8, orange: 4.0, red: 4.0 },
      { min: 60, max: 69, green: 5.0, yellow: 4.4, orange: 3.6, red: 3.6 },
      { min: 70, max: 79, green: 4.6, yellow: 4.0, orange: 3.2, red: 3.2 },
      { min: 80, max: 120, green: 4.2, yellow: 3.6, orange: 2.9, red: 2.9 },
    ];
    const band = phaBands.find(b => age >= b.min && age <= b.max) || phaBands[0];
    if (pha >= band.green) phaseScore = 100;
    else if (pha >= band.yellow) phaseScore = 75;
    else if (pha >= band.orange) phaseScore = 50;
    else phaseScore = 25;
  }

  const cellularScore = Math.round((hydrationScore + ecwScore + phaseScore) / 3);
  const cellularStatus = cellularScore >= 80 ? 'Optimal Zone' : 
                        cellularScore >= 60 ? 'Mild Strain' : 
                        cellularScore >= 40 ? 'Moderate Load' : 'High Strain';
  const cellularColor = cellularScore >= 80 ? '#10b981' : 
                       cellularScore >= 60 ? '#f59e0b' : 
                       cellularScore >= 40 ? '#f97316' : '#ef4444';

  stories.push({
    title: 'Cellular Hydration & Integrity',
    score: cellularScore,
    status: cellularStatus,
    statusColor: cellularColor,
    whyItMatters: `Water lives both inside and outside your cells. The hydration percent and ECW/TBW ratio tell us whether that fluid is in the right places, while Phase Angle shows how sturdy your cell walls are—think of it as the springiness of every cell in your body.

Your Cellular Hydration & Integrity is in <span style="font-weight: bold; color: ${cellularColor};">${cellularStatus}</span> range.`,
    metrics: [
      { name: 'Hydration %', value: hyd, unit: '%' },
      { name: 'ECW/TBW Ratio', value: metrics.ecw_tbw, unit: '' },
      { name: 'Phase Angle', value: pha, unit: '°' },
      { name: 'Total Body Water', value: Math.round(metrics.hydration * 0.01 * 150), unit: 'lb' }
    ]
  });

  // 2. Body-Composition Balance
  let smmScore = 0;
  const smm_pct = metrics.smm_pct;
  if (sex === 'M') {
    if (smm_pct > 48) smmScore = 100;
    else if (age <= 35) {
      if (smm_pct >= 40) smmScore = 100;
      else if (smm_pct >= 37) smmScore = 75;
      else if (smm_pct >= 34) smmScore = 50;
      else smmScore = 25;
    } else if (age <= 55) {
      if (smm_pct >= 36) smmScore = 100;
      else if (smm_pct >= 33) smmScore = 75;
      else if (smm_pct >= 30) smmScore = 50;
      else smmScore = 25;
    } else if (age <= 75) {
      if (smm_pct >= 32) smmScore = 100;
      else if (smm_pct >= 29) smmScore = 75;
      else if (smm_pct >= 26) smmScore = 50;
      else smmScore = 25;
    } else {
      if (smm_pct >= 31) smmScore = 100;
      else if (smm_pct >= 27) smmScore = 75;
      else if (smm_pct >= 24) smmScore = 50;
      else smmScore = 25;
    }
  } else {
    if (smm_pct > 38) smmScore = 100;
    else if (age <= 35) {
      if (smm_pct >= 31) smmScore = 100;
      else if (smm_pct >= 28) smmScore = 75;
      else if (smm_pct >= 26) smmScore = 50;
      else smmScore = 25;
    } else if (age <= 55) {
      if (smm_pct >= 29) smmScore = 100;
      else if (smm_pct >= 26) smmScore = 75;
      else if (smm_pct >= 24) smmScore = 50;
      else smmScore = 25;
    } else if (age <= 75) {
      if (smm_pct >= 27) smmScore = 100;
      else if (smm_pct >= 24) smmScore = 75;
      else if (smm_pct >= 22) smmScore = 50;
      else smmScore = 25;
    } else {
      if (smm_pct >= 26) smmScore = 100;
      else if (smm_pct >= 23) smmScore = 75;
      else if (smm_pct >= 20) smmScore = 50;
      else smmScore = 25;
    }
  }

  let bfScore = 0;
  const bf = metrics.body_fat_pct;
  if (sex === 'M') {
    const ageBands = [
      { min: 20, max: 29, low: 8, excellent: [8, 10.5], good: [10.6, 14.8], fair: [14.9, 18.6], poor: [18.7, 23.1], danger: 23.2 },
      { min: 30, max: 39, low: 8, excellent: [8, 14.5], good: [14.6, 18.2], fair: [18.3, 21.3], poor: [21.4, 24.9], danger: 25 },
      { min: 40, max: 49, low: 8, excellent: [8, 17.4], good: [17.5, 20.6], fair: [20.7, 23.4], poor: [23.5, 26.6], danger: 26.7 },
      { min: 50, max: 59, low: 8, excellent: [8, 19.1], good: [19.2, 22.1], fair: [22.2, 24.6], poor: [24.7, 27.8], danger: 27.9 },
      { min: 60, max: 69, low: 8, excellent: [8, 19.7], good: [19.8, 22.6], fair: [22.7, 25.2], poor: [25.3, 28.4], danger: 28.5 },
    ];
    const band = ageBands.find(b => age >= b.min && age <= b.max) || ageBands[0];
    
    if (bf < band.low) bfScore = 25;
    else if (bf >= band.excellent[0] && bf <= band.excellent[1]) bfScore = 100;
    else if (bf >= band.good[0] && bf <= band.good[1]) bfScore = 100;
    else if (bf >= band.fair[0] && bf <= band.fair[1]) bfScore = 75;
    else if (bf >= band.poor[0] && bf <= band.poor[1]) bfScore = 50;
    else if (bf > band.danger) bfScore = 25;
  } else {
    const ageBands = [
      { min: 20, max: 29, low: 14, excellent: [14, 16.5], good: [16.6, 19.4], fair: [19.5, 22.7], poor: [22.8, 27.1], danger: 27.2 },
      { min: 30, max: 39, low: 14, excellent: [14, 17.4], good: [17.5, 20.8], fair: [20.9, 24.6], poor: [24.7, 29.1], danger: 29.2 },
      { min: 40, max: 49, low: 14, excellent: [14, 19.8], good: [19.9, 23.8], fair: [23.9, 27.6], poor: [27.7, 31.9], danger: 31.9 },
      { min: 50, max: 59, low: 14, excellent: [14, 22.5], good: [22.6, 27.0], fair: [27.1, 30.4], poor: [30.5, 34.5], danger: 34.6 },
      { min: 60, max: 69, low: 14, excellent: [14, 23.2], good: [23.3, 27.9], fair: [28.0, 31.3], poor: [31.4, 35.4], danger: 35.5 },
    ];
    const band = ageBands.find(b => age >= b.min && age <= b.max) || ageBands[0];
    
    if (bf < band.low) bfScore = 25;
    else if (bf >= band.excellent[0] && bf <= band.excellent[1]) bfScore = 100;
    else if (bf >= band.good[0] && bf <= band.good[1]) bfScore = 100;
    else if (bf >= band.fair[0] && bf <= band.fair[1]) bfScore = 75;
    else if (bf >= band.poor[0] && bf <= band.poor[1]) bfScore = 50;
    else if (bf > band.danger) bfScore = 25;
  }

  const compositionScore = Math.round((smmScore + bfScore) / 2);
  const compositionStatus = compositionScore >= 80 ? 'Optimal Zone' : 
                           compositionScore >= 60 ? 'Mild Strain' : 
                           compositionScore >= 40 ? 'Moderate Load' : 'High Strain';
  const compositionColor = compositionScore >= 80 ? '#10b981' : 
                          compositionScore >= 60 ? '#f59e0b' : 
                          compositionScore >= 40 ? '#f97316' : '#ef4444';

  stories.push({
    title: 'Body-Composition Balance',
    score: compositionScore,
    status: compositionStatus,
    statusColor: compositionColor,
    whyItMatters: `This block looks at how much of you is supportive muscle versus stored fat, and whether the scale weight reflects a healthy mix. A higher Skeletal-Muscle % means more "active engine" tissue, while Body-Fat % shows stored energy. Balance here supports strength, metabolism, and joint load.

Your Body-Composition Balance is in <span style="font-weight: bold; color: ${compositionColor};">${compositionStatus}</span> range.`,
    metrics: [
      { name: 'SMM %', value: smm_pct, unit: '%' },
      { name: 'SMM Mass', value: Math.round(smm_pct * 0.01 * 150), unit: 'lb' },
      { name: 'Body-Fat %', value: bf, unit: '%' },
      { name: 'Body-Fat Mass', value: Math.round(bf * 0.01 * 150), unit: 'lb' },
      { name: 'Weight', value: 150, unit: 'lb' }
    ]
  });

  // 3. Visceral Fat & Fluid Load
  let vfaScore = 0;
  const vfa = metrics.vfa;
  if (vfa < 100) vfaScore = 100;
  else if (vfa < 130) vfaScore = 75;
  else if (vfa < 150) vfaScore = 50;
  else vfaScore = 25;

  // Use ECW/TBW ratio if it's high for fluid load assessment
  let fluidScore = 100;
  if (metrics.ecw_tbw >= 0.401) fluidScore = 25;
  else if (metrics.ecw_tbw >= 0.391) fluidScore = 50;
  else if (metrics.ecw_tbw >= 0.381) fluidScore = 75;

  const visceralScore = Math.round((vfaScore + fluidScore) / 2);
  const visceralStatus = visceralScore >= 80 ? 'Optimal Zone' : 
                        visceralScore >= 60 ? 'Mild Strain' : 
                        visceralScore >= 40 ? 'Moderate Load' : 'High Strain';
  const visceralColor = visceralScore >= 80 ? '#10b981' : 
                       visceralScore >= 60 ? '#f59e0b' : 
                       visceralScore >= 40 ? '#f97316' : '#ef4444';

  stories.push({
    title: 'Visceral Fat & Fluid Load',
    score: visceralScore,
    status: visceralStatus,
    statusColor: visceralColor,
    whyItMatters: `Visceral fat is the internal padding around your organs. More than about 100 cm² raises the risk of blood-sugar and cholesterol issues. If excess fluid shifts outside cells, it often travels with visceral fat and can stress the heart and kidneys.

Your Visceral Fat & Fluid Load is in <span style="font-weight: bold; color: ${visceralColor};">${visceralStatus}</span> range.`,
    metrics: [
      { name: 'Visceral Fat Area', value: vfa, unit: 'cm²' },
      { name: 'ECW/TBW Ratio', value: metrics.ecw_tbw, unit: '' }
    ]
  });

  // Calculate overall score
  const overallScore = Math.round((cellularScore + compositionScore + visceralScore) / 3);

  return {
    overallScore,
    stories
  };
}

/* ───── 3 ▸ New MetricSchema for DeviceForm ───── */
export const inbodyMetricSchema: MetricSchema = {
  slug: 'inbody',
  title: 'InBody Body Composition',
  fields: [
    /* Body Composition Core */
    { name: 'tbw_lb', label: 'Total Body Water (lb)', widget: 'inbody-table' as const, tableType: 'composition' },
    { name: 'weight_lb', label: 'Weight (lb)', widget: 'inbody-table' as const, tableType: 'composition' },
    { name: 'smm_lb', label: 'Skeletal Muscle Mass (lb)', widget: 'inbody-table' as const, tableType: 'composition' },
    { name: 'body_fat_lb', label: 'Body Fat Mass (lb)', widget: 'inbody-table' as const, tableType: 'composition' },
    { name: 'pbf_pct', label: 'Percent Body Fat (%)', widget: 'inbody-table' as const, tableType: 'composition' },

    /* Cellular Health & Water Balance */
    { name: 'ecw_tbw', label: 'ECW/TBW Ratio', widget: 'inbody-table' as const, tableType: 'cellular' },
    { name: 'vfa_cm2', label: 'Visceral Fat Area (cm²)', widget: 'inbody-table' as const, tableType: 'cellular' },
    { name: 'phase_angle_deg', label: 'Whole-Body Phase Angle (°)', widget: 'inbody-table' as const, tableType: 'cellular' },
  ]
};

/* ───── 4 ▸ Legacy schema for backward compatibility ───── */
export const inbodySchema = z.object({
  tbw_lb: z.number().nullable(),
  weight_lb: z.number().nullable(),
  smm_lb: z.number().nullable(),
  body_fat_lb: z.number().nullable(),
  pbf_pct: z.number().nullable(),
  ecw_tbw: z.number().nullable(),
  vfa_cm2: z.number().nullable(),
  phase_angle_deg: z.number().nullable(),
});

export const inbodyUISchema = {
  title: 'InBody Body Composition',
  description: 'Extracted metrics from InBody report',
  fields: [
    { key: 'tbw_lb', label: 'Total Body Water (lb)', type: 'number', unit: 'lb' },
    { key: 'weight_lb', label: 'Weight (lb)', type: 'number', unit: 'lb' },
    { key: 'smm_lb', label: 'Skeletal Muscle Mass (lb)', type: 'number', unit: 'lb' },
    { key: 'body_fat_lb', label: 'Body Fat Mass (lb)', type: 'number', unit: 'lb' },
    { key: 'pbf_pct', label: 'Percent Body Fat (%)', type: 'number', unit: '%' },
    { key: 'ecw_tbw', label: 'ECW/TBW Ratio', type: 'number' },
    { key: 'vfa_cm2', label: 'Visceral Fat Area (cm²)', type: 'number', unit: 'cm²' },
    { key: 'phase_angle_deg', label: 'Whole-Body Phase Angle (°)', type: 'number', unit: '°' },
  ]
};