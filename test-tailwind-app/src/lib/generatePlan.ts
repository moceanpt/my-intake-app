/* ------------------------------------------------------------------
   lib/generatePlan.ts
   ------------------------------------------------------------------
   ▸ builds             ① subjective radar  (sliders + chips)
                        ② objective radar   (per-device modules)
                        ③ lifestyle radar   (Move / Rest …)
   ▸ derives optimisation buckets            (band-scored)
------------------------------------------------------------------- */

import {
    buildSubjectiveRadar,
    calcLifestyleScore,
    normalizeScore,
  } from './score';
  
  import { scoreObjective }    from './objective';       // NEW registry
  import { band }              from './objective/utils'; // shared helper
  
  /* ---------- inbound ------------------------------------------------ */
  export interface PlanInput {
    hc        : Record<string, string[]>;               // symptom chips
    hcSlider ?: Record<string, { main: number }>;       // slider values
    life      : Record<string, any>;                    // lifestyle answers
    snapshot ?: Record<string, number>;                 // quick slider page
    metrics  ?: Record<string, number>;                 // InBody / HRV …
    frequency?: number;                                 // binaural Hz
  }
  
  /* ---------- outbound ----------------------------------------------- */
  export interface PlanResult {
    radarSubjective : Record<string, number>;  // 0-10 ints
    radarObjective  : Record<string, number>;  // 0-10 ints (all 10 if none)
    lifestyle       : Record<string, number>;  // 0-10 ints
    optimisation    : string[];
    services        : string[];
    goals           : { goal: string; tips: string[] }[];
    frequency?      : number;
    note?           : string;
    color?          : string;
    retestIn        : string;
  }
  
  /* ---------- helpers ------------------------------------------------ */
  function mapFrequency(hz?: number) {
    if (!hz) return { note:'', color:'' };
    if (hz>=420 && hz<=444) return { note:'A', color:'Indigo'    };
    if (hz>=524 && hz<=532) return { note:'C', color:'Green'     };
    if (hz>=638 && hz<=650) return { note:'D', color:'Turquoise' };
    return { note:'Unknown', color:'Gray' };
  }
  
  /* ---------- subjective → bucket pts -------------------------------- */
  function bucketFromSubjective(
    sub      : Record<string,number>,
    lifestyle: Record<string,number>,
    snap     : Record<string,number>
  ){
    const b = { cellular:0, energy:0, gut:0, stress:0,
                circulation:0, brain:0, physical:0, performance:0 };
  
    b.physical    += band(sub.musculoskeletal);
    b.energy      += band(sub.energy);
    b.circulation += band(sub.circulation);
    b.stress      += band(lifestyle.stress ?? 10);
  
    if (snap.energy !== undefined) b.energy += band(snap.energy);
    return b;
  }
  
  /* ------------------------------------------------------------------
     MAIN
  ------------------------------------------------------------------- */
  export function generatePlan(input: PlanInput): PlanResult {
    const {
      hc,
      hcSlider = {},
      life,
      snapshot = {},
      metrics  = {},
      frequency,
    } = input;
  
    /* 1 ▸ health radars --------------------------------------------- */
    const radarSubjective = buildSubjectiveRadar(hc, hcSlider);   // 0-10 ints
    const { radar: radarObjective, bucket: objB } = scoreObjective(metrics);
  
    /* 2 ▸ lifestyle radar ------------------------------------------- */
    const lifestyle = normalizeScore(calcLifestyleScore(life));   // 0-10 ints
  
    /* 3 ▸ optimisation buckets -------------------------------------- */
    const subB = bucketFromSubjective(radarSubjective, lifestyle, snapshot);
  
    const combined: Record<keyof typeof subB, number> = { ...subB };
    (Object.keys(objB) as (keyof typeof objB)[])
      .forEach(k => combined[k] += objB[k]);
  
    const optimisation = Object
      .entries(combined)
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([k]) => `${k[0].toUpperCase()}${k.slice(1)} Optimisation`);
  
    /* 4 ▸ service suggestions --------------------------------------- */
    const services: string[] = [];
    if (Object.values(radarSubjective).some(v => v < 5))
      services.push('MOCEAN Therapy');
    if (radarSubjective.organ_digest_hormone_detox < 5 ||
        radarSubjective.energy < 5)
      services.push('Acupuncture');
    if (radarSubjective.circulation < 5 ||
        (metrics.ecw_tbw && metrics.ecw_tbw > 0.39))
      services.push('ICOONE Lymphatic');
  
    /* 5 ▸ simple demo goals ----------------------------------------- */
    const goals: PlanResult['goals'] = [];
    if (metrics.vfa && metrics.vfa > 100)
      goals.push({ goal:'Reduce visceral fat',
                   tips:['Anti-inflammatory plate','Core strength','7‒9 h sleep']});
    if (metrics.phase_angle && metrics.phase_angle < 5.5)
      goals.push({ goal:'Improve cellular resilience',
                   tips:['Electrolyte water','Daily movement','Deep-sleep routine']});
    if (snapshot.sleep && snapshot.sleep <= 5)
      goals.push({ goal:'Upgrade sleep quality',
                   tips:['No screens 1 h before bed','Fixed bedtime','Breathing drill']});
  
    /* 6 ▸ wrap-up ---------------------------------------------------- */
    const { note, color } = mapFrequency(frequency);
  
    return {
      radarSubjective,
      radarObjective,
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