/* ------------------------------------------------------------------
   lib/generatePlan.ts
   High-level: intake → radar → optimisation targets → plan object
------------------------------------------------------------------- */

import {
    calcStrainCounts,
    toStrainPct,
    toRadar10,
    calcLifestyleScore,
  } from './score';
  
  /* ---------- inbound shape (same keys your /api/intake stores) ---- */
  export interface PlanInput {
    hc: Record<string, string[]>;        // health-check chips
    life: Record<string, any>;           // lifestyle answers
    snapshot?: Record<string, number>;   // quick slider page
    history?: Record<string, any>;
    discomfort?: Record<string, any>;
    reasons?: string[];
    metrics?: Record<string, number>;    // OCR’d device metrics
    frequency?: number;                  // binaural frequency Hz
  }
  
  /* ---------- outbound structure sent to Result page -------------- */
  export interface PlanResult {
    radar: Record<string, number>;       // 0-10 health spokes
    lifestyle: Record<string, number>;   // 0-10 lifestyle spokes
    optimisation: string[];              // highest-priority buckets
    services: string[];                  // “MOCEAN Therapy”, etc.
    goals: { goal: string; tips: string[] }[];
    frequency?: number;
    note?: string;                       // “C note” etc.
    color?: string;                      // “Indigo” etc.
    retestIn: string;                    // “8–12 weeks”
  }
  
  /* ---------- helper: frequency ➜ colour / note ------------------- */
  function mapFrequency(hz?: number) {
    if (!hz) return { note: '', color: '' };
    if (hz >= 420 && hz <= 444) return { note: 'A', color: 'Indigo' };
    if (hz >= 524 && hz <= 532) return { note: 'C', color: 'Green' };
    if (hz >= 638 && hz <= 650) return { note: 'D', color: 'Turquoise' };
    return { note: 'Unknown', color: 'Gray' };
  }
  
  /* ------------------------------------------------------------------
     MAIN – turn raw intake + metrics into a plan object
  ------------------------------------------------------------------- */
  export function generatePlan(input: PlanInput): PlanResult {
    const {
      hc,
      life,
      snapshot = {},
      metrics = {},
      frequency,
    } = input;
  
    /* 1 ▸ subjective radar (M-O-C-E-A-N) -------------------------- */
    const rawCounts = calcStrainCounts(hc);
    const strainPct = toStrainPct(rawCounts);
    const radar     = toRadar10(strainPct);     // 10 good → 0 bad
  
    /* 2 ▸ lifestyle radar (0-10) ----------------------------------- */
    const lifestyle = calcLifestyleScore(life); // already 0-10 in your helper
  
    /* 3 ▸ optimisation buckets ------------------------------------- */
    const bucket: Record<string, number> = {
      cellular: 0,
      energy: 0,
      gut: 0,
      stress: 0,
      circulation: 0,
      brain: 0,
      physical: 0,
      performance: 0,
    };
  
    // ←-- heuristics: tweak / extend freely
    if (metrics.phase_angle && metrics.phase_angle < 5.5) bucket.cellular += 1;
    if (metrics.vfa && metrics.vfa > 100)                 bucket.gut      += 1;
    if (metrics.rmssd && metrics.rmssd < 30)              bucket.stress   += 1;
    if (lifestyle.stress && lifestyle.stress >= 5)        bucket.stress   += 1;
    if (snapshot.energy && snapshot.energy <= 5)          bucket.energy   += 1;
    if (radar.musculoskeletal && radar.musculoskeletal < 6) bucket.physical += 1;
  
    const optimisation = Object.entries(bucket)
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([k]) => `${k[0].toUpperCase()}${k.slice(1)} Optimisation`);
  
    /* 4 ▸ service recommendations ---------------------------------- */
    const services: string[] = [];
    if (Object.values(radar).some(v => v < 5)) services.push('MOCEAN Therapy');
    if (radar.organ_digest_hormone_detox < 5 || radar.energy < 5)
      services.push('Acupuncture');
    if (radar.circulation < 5 || metrics.ecw_tbw && metrics.ecw_tbw > 0.39)
      services.push('ICOONE Lymphatic');
  
    /* 5 ▸ goal / tip snippets -------------------------------------- */
    const goals: PlanResult['goals'] = [];
    if (metrics.vfa && metrics.vfa > 100)
      goals.push({
        goal: 'Reduce visceral fat',
        tips: ['Anti-inflammatory plate', 'Core strength', '7-9 h sleep'],
      });
    if (metrics.phase_angle && metrics.phase_angle < 5.5)
      goals.push({
        goal: 'Improve cellular resilience',
        tips: ['Electrolyte water', 'Daily movement', 'Deep sleep routine'],
      });
    if (snapshot.sleep && snapshot.sleep <= 5)
      goals.push({
        goal: 'Upgrade sleep quality',
        tips: ['No screens 1 h before bed', 'Fixed bedtime', 'Breathing drill'],
      });
  
    /* 6 ▸ frequency mapping ---------------------------------------- */
    const { note, color } = mapFrequency(frequency);
  
    /* 7 ▸ ship it --------------------------------------------------- */
    return {
      radar,
      lifestyle,
      optimisation,
      services,
      goals,
      frequency,
      note,
      color,
      retestIn: '8–12 weeks',
    };
  }