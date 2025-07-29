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
  
  // Energy Score (Ava) - Max 4 points
  let ava_pts = 0;
  if (d.ava_score > 600) ava_pts = 6; // Orange (Excess output)
  else if (d.ava_score >= 500) ava_pts = 0; // Green
  else if (d.ava_score >= 450) ava_pts = 4; // Yellow
  else if (d.ava_score >= 400) ava_pts = 6; // Orange
  else ava_pts = 8; // Red
  result.bands.ava = { score: 100 - (ava_pts * 100 / 8) };

  // Vigor (Yang) - Max 2 points
  let vigor_pts = 0;
  if (d.vigor > 71) vigor_pts = 8; // Red (Burnout risk)
  else if (d.vigor >= 60) vigor_pts = 0; // Green
  else if (d.vigor >= 50) vigor_pts = 4; // Yellow
  else vigor_pts = 6; // Orange
  result.bands.vigor = { score: 100 - (vigor_pts * 100 / 8) };

  // Stability (Yin) - Max 2 points
  let stability_pts = 0;
  if (d.stability > 51) stability_pts = 8; // Red (Fatigued)
  else if (d.stability >= 41) stability_pts = 4; // Yellow
  else if (d.stability >= 30) stability_pts = 0; // Green
  else stability_pts = 6; // Orange
  result.bands.stability = { score: 100 - (stability_pts * 100 / 8) };

  // Activity % (ANS) - Max 4 points
  let activity_pts = 0;
  if (d.activity_percent > 60) activity_pts = 8; // Red (Sympathetic dom.)
  else if (d.activity_percent >= 40 && d.activity_percent <= 60) activity_pts = 0; // Green
  else activity_pts = 4; // Yellow (Parasymp. dom.)
  result.bands.activity_pct = { score: 100 - (activity_pts * 100 / 8) };

  // Overall Elemental Balance - Max 4 points
  let elem_pts = 0;
  if (d.overall_balance_score >= 111) elem_pts = 6; // Orange (Too high)
  else if (d.overall_balance_score >= 96 && d.overall_balance_score <= 110) elem_pts = 0; // Green (Ideal)
  else if (d.overall_balance_score >= 86 && d.overall_balance_score <= 95) elem_pts = 4; // Yellow (Normal-low)
  else if (d.overall_balance_score >= 75 && d.overall_balance_score <= 85) elem_pts = 6; // Orange (Below normal)
  else elem_pts = 8; // Red (Low < 74)
  result.bands.element_score = { score: 100 - (elem_pts * 100 / 8) };

  // Determine if overall balance is in green (normal) range
  const isOverallBalanceGreen = d.overall_balance_score >= 96 && d.overall_balance_score <= 110;

  // Individual Element Scoring - 5-System scoring (each 0.8 max, total 1.0-4.0)
  const elements = [
    { name: 'wood', value: d.wood },
    { name: 'fire', value: d.fire },
    { name: 'earth', value: d.earth },
    { name: 'metal', value: d.metal },
    { name: 'water', value: d.water }
  ];

  let fiveSystemTotal = 0; // Will sum to 1.0-4.0

  elements.forEach(element => {
    let element_pts = 0;
    
    if (isOverallBalanceGreen) {
      // When overall balance is green: score based on deviation from overall balance
      const deviation = Math.abs(element.value - d.overall_balance_score);
      
      if (deviation <= 5) element_pts = 0; // Green (close to balance) = 0.8 points
      else if (deviation <= 10) element_pts = 4; // Yellow (mild deviation) = 0.6 points
      else if (deviation <= 15) element_pts = 6; // Orange (moderate deviation) = 0.4 points
      else element_pts = 8; // Red (severe deviation) = 0.2 points
    } else {
      // When overall balance is below green: score based on absolute value using overall balance ranges
      if (element.value >= 111) element_pts = 6; // Orange (Too high) = 0.4 points
      else if (element.value >= 96 && element.value <= 110) element_pts = 0; // Green (Ideal) = 0.8 points
      else if (element.value >= 86 && element.value <= 95) element_pts = 4; // Yellow (Normal-low) = 0.6 points
      else if (element.value >= 75 && element.value <= 85) element_pts = 6; // Orange (Below normal) = 0.4 points
      else element_pts = 8; // Red (Low < 74) = 0.2 points
    }
    
    // Convert 8-point scale to 0.8-point scale for 5-system
    const elementScore = element_pts === 0 ? 0.8 : 
                        element_pts === 4 ? 0.6 : 
                        element_pts === 6 ? 0.4 : 0.2;
    
    fiveSystemTotal += elementScore;
    
    // Keep the original scoring for individual element display
    result.bands[element.name] = { score: 100 - (element_pts * 100 / 8) };
  });

  // Store the 5-system total score (1.0-4.0 range)
  result.bands.five_system_total = { score: fiveSystemTotal };

  // Calculate overall energy score using new formula:
  // (Exergy + Vigor+Stability + Activity + Overall Energy + 5-System Sum) / 20 * 100
  
  // Convert 8-point scores to 4-point scale for energy calculation
  const ava_4pt = ava_pts === 0 ? 4 : ava_pts === 4 ? 3 : ava_pts === 6 ? 2 : 1;
  // Vigor and Stability: green=2.0, yellow=1.5, orange=1.0, red=0.5
  const vigor_2pt = vigor_pts === 0 ? 2.0 : vigor_pts === 4 ? 1.5 : vigor_pts === 6 ? 1.0 : 0.5;
  const stability_2pt = stability_pts === 0 ? 2.0 : stability_pts === 4 ? 1.5 : stability_pts === 6 ? 1.0 : 0.5;
  const activity_4pt = activity_pts === 0 ? 4 : activity_pts === 4 ? 3 : activity_pts === 6 ? 2 : 1;
  const overall_4pt = elem_pts === 0 ? 4 : elem_pts === 4 ? 3 : elem_pts === 6 ? 2 : 1;
  
  // Calculate energy score: (sum of 5 components) / 20 * 100
  const energyScore = ((ava_4pt + vigor_2pt + stability_2pt + activity_4pt + overall_4pt + fiveSystemTotal) / 20) * 100;
  
  // Store the calculated energy score
  result.energy_score = energyScore;

  // Return both bands and a summary
  result.radar = { energy: energyScore, organ_digest_hormone_detox: energyScore };
  result.bucket = { energy: energyScore, gut: energyScore };
  return result;
}

// New story-based scoring function for energy system
export function scoreEnergySystemStory(d: AuraComInput) {
  // Calculate individual scores for each group
  const fuelTankScore = calculateFuelTankScore(d);
  const energyFlowScore = calculateEnergyFlowScore(d);
  const organEnergyScore = calculateOrganEnergyScore(d);
  
  // Calculate overall energy score (average of three groups)
  const overallScore = Math.round((fuelTankScore.score + energyFlowScore.score + organEnergyScore.score) / 3);
  
  return {
    overallScore,
    groups: [
      {
        name: 'Fuel Tank & Power',
        score: fuelTankScore.score,
        status: fuelTankScore.status,
        statusColor: fuelTankScore.statusColor,
        metrics: [
          { name: 'Energy Level', value: d.ava_score, unit: '' },
          { name: 'Vigor Level', value: d.vigor, unit: '' }
        ],
        story: `Think of this as the size and charge of your internal battery. High energy and vigor scores mean plenty of power for work, workouts, and play.`,
        statusLine: `Your Fuel Tank & Power level is in the <span style="color: ${fuelTankScore.statusColor === 'text-green-600' ? '#059669' : fuelTankScore.statusColor === 'text-yellow-600' ? '#d97706' : fuelTankScore.statusColor === 'text-orange-600' ? '#ea580c' : '#dc2626'}; font-weight: bold;">${fuelTankScore.status}</span> range.`
      },
      {
        name: 'Energy Flow & Control',
        score: energyFlowScore.score,
        status: energyFlowScore.status,
        statusColor: energyFlowScore.statusColor,
        metrics: [
          { name: 'Stability Level', value: d.stability, unit: '' },
          { name: 'Activity Level', value: d.activity_percent, unit: '%' },
          { name: 'Overall Energy Balance', value: d.overall_balance_score, unit: '' }
        ],
        story: `Stability and activity show how smoothly your body dials energy up or down. The Overall Energy Balance number is the traffic-light: green means supply meets demand; red means you're either revving too high or stuck in low gear.`,
        statusLine: `Your Energy Flow & Control Balance is in the <span style="color: ${energyFlowScore.statusColor === 'text-green-600' ? '#059669' : energyFlowScore.statusColor === 'text-yellow-600' ? '#d97706' : energyFlowScore.statusColor === 'text-orange-600' ? '#ea580c' : '#dc2626'}; font-weight: bold;">${energyFlowScore.status}</span> range.`
      },
      {
        name: 'Organ Energy Systems',
        score: organEnergyScore.score,
        status: organEnergyScore.status,
        statusColor: organEnergyScore.statusColor,
        metrics: [
          { name: 'Detoxification System', value: d.wood, unit: '' },
          { name: 'Circulation System', value: d.fire, unit: '' },
          { name: 'Digestive System', value: d.earth, unit: '' },
          { name: 'Immune System', value: d.metal, unit: '' },
          { name: 'Filtration System', value: d.water, unit: '' }
        ],
        story: `These five scores show how well your body clears waste, moves nutrients, digests food, fights bugs, and filters toxins—the backstage crew that keeps the main show running.`,
        statusLine: `Your Organ Energy System is in the <span style="color: ${organEnergyScore.statusColor === 'text-green-600' ? '#059669' : organEnergyScore.statusColor === 'text-yellow-600' ? '#d97706' : organEnergyScore.statusColor === 'text-orange-600' ? '#ea580c' : '#dc2626'}; font-weight: bold;">${organEnergyScore.status}</span> range.`
      }
    ]
  };
}

function calculateFuelTankScore(d: AuraComInput) {
  // Energy Level (ava_score) scoring
  let energyScore = 0;
  if (d.ava_score >= 500) energyScore = 100; // Optimal
  else if (d.ava_score >= 450) energyScore = 75; // Good
  else if (d.ava_score >= 400) energyScore = 50; // Average
  else if (d.ava_score >= 350) energyScore = 25; // Below average
  else energyScore = 0; // Poor

  // Vigor Level scoring
  let vigorScore = 0;
  if (d.vigor >= 60 && d.vigor <= 71) vigorScore = 100; // Optimal
  else if (d.vigor >= 50 && d.vigor < 60) vigorScore = 75; // Good
  else if (d.vigor >= 40 && d.vigor < 50) vigorScore = 50; // Average
  else if (d.vigor >= 30 && d.vigor < 40) vigorScore = 25; // Below average
  else vigorScore = 0; // Poor

  const avgScore = Math.round((energyScore + vigorScore) / 2);
  
  return {
    score: avgScore,
    status: avgScore >= 80 ? 'Optimal Zone' : avgScore >= 60 ? 'Mild Strain' : avgScore >= 40 ? 'Moderate Load' : 'High Strain',
    statusColor: avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-yellow-600' : avgScore >= 40 ? 'text-orange-600' : 'text-red-600'
  };
}

function calculateEnergyFlowScore(d: AuraComInput) {
  // Stability Level scoring
  let stabilityScore = 0;
  if (d.stability >= 30 && d.stability <= 51) stabilityScore = 100; // Optimal
  else if (d.stability >= 20 && d.stability < 30) stabilityScore = 75; // Good
  else if (d.stability >= 10 && d.stability < 20) stabilityScore = 50; // Average
  else if (d.stability >= 5 && d.stability < 10) stabilityScore = 25; // Below average
  else stabilityScore = 0; // Poor

  // Activity Level scoring
  let activityScore = 0;
  if (d.activity_percent >= 40 && d.activity_percent <= 60) activityScore = 100; // Optimal
  else if (d.activity_percent >= 30 && d.activity_percent < 40) activityScore = 75; // Good
  else if (d.activity_percent >= 20 && d.activity_percent < 30) activityScore = 50; // Average
  else if (d.activity_percent >= 10 && d.activity_percent < 20) activityScore = 25; // Below average
  else activityScore = 0; // Poor

  // Overall Energy Balance scoring (drives block color)
  let balanceScore = 0;
  if (d.overall_balance_score >= 96 && d.overall_balance_score <= 110) balanceScore = 100; // Optimal
  else if (d.overall_balance_score >= 86 && d.overall_balance_score < 96) balanceScore = 75; // Good
  else if (d.overall_balance_score >= 75 && d.overall_balance_score < 86) balanceScore = 50; // Average
  else if (d.overall_balance_score >= 65 && d.overall_balance_score < 75) balanceScore = 25; // Below average
  else balanceScore = 0; // Poor

  const avgScore = Math.round((stabilityScore + activityScore + balanceScore) / 3);
  
  return {
    score: avgScore,
    status: avgScore >= 80 ? 'Optimal Zone' : avgScore >= 60 ? 'Mild Strain' : avgScore >= 40 ? 'Moderate Load' : 'High Strain',
    statusColor: avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-yellow-600' : avgScore >= 40 ? 'text-orange-600' : 'text-red-600'
  };
}

function calculateOrganEnergyScore(d: AuraComInput) {
  const elements = [d.wood, d.fire, d.earth, d.metal, d.water];
  let totalScore = 0;

  elements.forEach(element => {
    let elementScore = 0;
    if (element >= 96 && element <= 110) elementScore = 100; // Optimal
    else if (element >= 86 && element < 96) elementScore = 75; // Good
    else if (element >= 75 && element < 86) elementScore = 50; // Average
    else if (element >= 65 && element < 75) elementScore = 25; // Below average
    else elementScore = 0; // Poor
    
    totalScore += elementScore;
  });

  const avgScore = Math.round(totalScore / elements.length);
  
  return {
    score: avgScore,
    status: avgScore >= 80 ? 'Optimal Zone' : avgScore >= 60 ? 'Mild Strain' : avgScore >= 40 ? 'Moderate Load' : 'High Strain',
    statusColor: avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-yellow-600' : avgScore >= 40 ? 'text-orange-600' : 'text-red-600'
  };
}

/* ---------------------------------------------------------
   5 ▸ New MetricSchema for DeviceForm
--------------------------------------------------------- */
export const auracomMetricSchema: MetricSchema = {
  slug: 'auracom',
  title: 'AuraCom Traditional Chinese Medicine Balance',
  fields: [
    { name: 'auracom_table', label: 'AuraCom Metrics', widget: 'auracom-table' as const, tableType: 'combined' },
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