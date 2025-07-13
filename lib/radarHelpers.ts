/* ------------------------------------------------------------------
   lib/generatePlan.ts
   → produces 2 separate health radars (subjective + objective)
------------------------------------------------------------------- */

import {
  buildSubjectiveRadar,
  calcLifestyleScore,
  normalizeScore,
} from './score';
import { scoreObjective } from './objective';

/* ---------- inbound ------------------------------------------- */
export interface PlanInput {
  hc:         Record<string, string[]>;               /* symptom chips   */
  hcSlider?:  Record<string, { main: number }>;       /* slider values   */
  life:       Record<string, any>;                    /* lifestyle Qs    */
  snapshot?:  Record<string, number>;                 /* quick sliders   */
  metrics?:   Record<string, number>;                 /* InBody / HRV…   */
  frequency?: number;                                 /* binaural Hz     */
}

/* ---------- outbound ------------------------------------------ */
export interface PlanResult {
  radarSubjective: Record<string, number>;   /* 0-10 integers */
  radarObjective : Record<string, number>;   /* 0-10 integers (all 10 if none) */
  lifestyle      : Record<string, number>;   /* 0-10 integers */
  optimisation   : string[];
  services       : string[];
  goals          : { goal: string; tips: string[] }[];
  frequency?     : number;
  note?:  string;
  color?: string;
  retestIn: string;
}

/* ---------- helpers ------------------------------------------- */
function mapFrequency(hz?: number){
  if (!hz) return { note:'', color:'' };
  if (hz>=420 && hz<=444) return { note:'A', color:'Indigo'   };
  if (hz>=524 && hz<=532) return { note:'C', color:'Green'    };
  if (hz>=638 && hz<=650) return { note:'D', color:'Turquoise'};
  return { note:'Unknown', color:'Gray' };
}

/* 0-10 → 0/1/2 band score */
const bandScore = (v:number)=> v>=8?0 : v>=6?1 : 2;

/* --------‖ subjective → optimisation buckets ‖---------------- */
function subjectiveBuckets(
  sub   : Record<string,number>,
  life  : Record<string,number>,
  snap  : Record<string,number>
){
  const b = { cellular:0, energy:0, gut:0, stress:0,
              circulation:0, brain:0, physical:0, performance:0 };

  b.physical    += bandScore(sub.musculoskeletal_subjective);
  b.energy      += bandScore(sub.energy);
  b.circulation += bandScore(sub.circulation);
  b.stress      += bandScore(life.stress ?? 10);

  if (snap.energy!==undefined) b.energy += bandScore(snap.energy);
  return b;
}

/* --------‖ objective → optimisation buckets ‖----------------- */
function objectiveBuckets(m:Record<string,number>){
  const b = { cellular:0, energy:0, gut:0, stress:0,
              circulation:0, brain:0, physical:0, performance:0 };

  /* ECW/TBW */
  if (m.ecw_tbw){
    const r = m.ecw_tbw;
    const val = r<=0.38?9 : r<=0.39?7 : r<=0.40?5 : r<=0.419?3 : 1;
    b.circulation += bandScore(val);
  }

  /* Phase-angle */
  if (m.phase_angle){
    const pa = m.phase_angle;
    const val = pa>=6 ? 9 : pa>=5.5?7 : pa>=5?5 : pa>=4.5?3 : 1;
    b.cellular += bandScore(val);
    b.energy   += bandScore(val);
  }

  /* Visceral-fat area */
  if (m.vfa){
    const v = m.vfa;
    const val = v<100?9 : v<130?6 : v<150?4 : 2;
    b.gut += bandScore(val);
  }

  /* RMSSD (HRV) */
  if (m.rmssd){
    const h = m.rmssd;
    const val = h>=60?9 : h>=45?7 : h>=30?5 : h>=20?3 : 1;
    b.stress += bandScore(val);
    b.brain  += bandScore(val);
  }
  return b;
}

/* ------------------------------------------------------------------
   MAIN
------------------------------------------------------------------- */
export function generatePlan(input: PlanInput): PlanResult {
  const {
    hc, hcSlider = {}, life,
    metrics = {}, snapshot = {}, frequency,
  } = input;

  /* 1 ▸ health radars ------------------------------------------- */
  const radarSubjective = buildSubjectiveRadar(hc, hcSlider);      // 0-10 ints
  const radarObjective  = scoreObjective(metrics).radar;           // default 10s

  /* 2 ▸ lifestyle radar ----------------------------------------- */
  const lifestyle      = normalizeScore(calcLifestyleScore(life)); // 0-10 ints

  /* 3 ▸ optimisation buckets ------------------------------------ */
  const subB = subjectiveBuckets(radarSubjective, lifestyle, snapshot);
  const objB = objectiveBuckets(metrics);

  const combined: Record<keyof typeof subB,number> = { ...subB };
  (Object.keys(objB) as (keyof typeof objB)[])
    .forEach(k => combined[k] += objB[k]);

  const optimisation = Object.entries(combined)
    .filter(([,n])=>n>0)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,4)
    .map(([k])=>`${k[0].toUpperCase()}${k.slice(1)} Optimisation`);

  /* 4 ▸ service suggestions ------------------------------------- */
  const services:string[] = [];
  if (Object.values(radarSubjective).some(v=>v<5)) services.push('MOCEAN Therapy');
  if (radarSubjective.organ_digest_hormone_detox<5 || radarSubjective.energy<5)
    services.push('Acupuncture');
  if (radarSubjective.circulation<5 || (metrics.ecw_tbw && metrics.ecw_tbw>0.39))
    services.push('ICOONE Lymphatic');

  /* 5 ▸ goals (unchanged demo logic) ----------------------------- */
  const goals: PlanResult['goals'] = [];
  if (metrics.vfa && metrics.vfa>100)
    goals.push({ goal:'Reduce visceral fat',
                 tips:['Anti-inflammatory plate','Core strength','7-9 h sleep']});
  if (metrics.phase_angle && metrics.phase_angle<5.5)
    goals.push({ goal:'Improve cellular resilience',
                 tips:['Electrolyte water','Daily movement','Deep-sleep routine']});
  if (snapshot.sleep && snapshot.sleep<=5)
    goals.push({ goal:'Upgrade sleep quality',
                 tips:['No screens 1 h before bed','Fixed bedtime','Breathing drill']});

  /* 6 ▸ wrap-up -------------------------------------------------- */
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