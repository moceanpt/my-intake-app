/* ------------------------------------------------------------------
   lib/objective/index.ts
   – keeps the scoring code exactly as you pasted
------------------------------------------------------------------- */

import { scoreInBody }   from './inbody';
// import { scoreExBody } from './exbody';   // ← later
// import { scoreAuracom } from './auracom'; // ← later …

/* ---------- ORIGINAL  scoreObjective  (unchanged) ---------------- */
export function scoreObjective(metrics: Record<string, number>) {
  const collectors = [];

  if (['ecw_tbw','phase_angle','vfa','rmssd'].some(k => k in metrics))
    collectors.push(scoreInBody(metrics));

  /* future:
  if (exBodyKeys.some(k => k in metrics))
    collectors.push(scoreExBody(metrics));
  */

  const combinedRadar  : Record<string,number> = {};
  const combinedBucket : Record<string,number> = {
    cellular:0, energy:0, gut:0, stress:0,
    circulation:0, brain:0, physical:0, performance:0,
  };

  collectors.forEach(({ radar, bucket })=>{
    Object.entries(radar) .forEach(([k,v])=>{
      combinedRadar[k] = Math.min(v, combinedRadar[k] ?? v);
    });
    Object.entries(bucket).forEach(([k,v])=>{
      combinedBucket[k as keyof typeof combinedBucket] += v;
    });
  });

  ['musculoskeletal','organ_digest_hormone_detox','circulation',
   'energy','articular_joint','nervous_system'].forEach(k=>{
     if (combinedRadar[k] === undefined) combinedRadar[k] = 10;
   });

  return { radar: combinedRadar, bucket: combinedBucket };
}

/* ==================================================================
   ↓ ADD THIS BLOCK  —  PLAIN REGISTRY FOR THE NEW DATA-ENTRY UI
   ================================================================== */

/**
 * Each device module exports a FORM blueprint:
 *   export const FORM = [
 *     ['vfa','Visceral fat area','cm²',10,250],  … ]
 *   ‍
 * We expose them under a human-friendly label so the picker can
 * render buttons automatically.
 */
import * as inbody   from './inbody';
import * as exbody   from './exbody';
import * as auracom  from './auracom';
import * as omnifit  from './omnifit';
import * as heartmath from './heartmath';

export const OBJECTIVE_FORMS: Record<string, {
  label: string;
  form : ReturnType<typeof inbody.FORM>;   // same tuple shape for all
}> = {
  inbody   : { label:'InBody',    form: inbody.FORM    },
  exbody   : { label:'ExBody',    form: exbody.FORM    },
  auracom  : { label:'Auracom',   form: auracom.FORM   },
  omnifit  : { label:'OmniFit',   form: omnifit.FORM   },
  heartmath:{ label:'HeartMath',  form: heartmath.FORM },
};