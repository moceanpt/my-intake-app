/* ------------------------------------------------------------------
   lib/objective/index.ts
   – keeps the scoring code exactly as you pasted
------------------------------------------------------------------- */

import { scoreInBody }   from './inbody';
import { scoreAuraCom, auraComKeys } from './auracom';
import { scoreExBody, exBodyKeys } from './exbody';
import { scoreOmniFit, omniFitKeys } from './omnifit';
import { scoreHeartMath, heartMathKeys } from './heartmath';
import { scoreCirculation, circulationKeys } from './circulation';
import type { MetricSchema } from '../metrics/types';

/* ──────────────────────────────────────────────────────────────
   1.  Master scorer — merge all per-device outputs
   ──────────────────────────────────────────────────────────── */
   export function scoreObjective(metrics: Record<string, number>) {
    const collectors: { radar: Record<string, number>;
                        bucket: Record<string, number> }[] = [];
  
    /* InBody ---------------------------------------------------- */
    if (['ecw_tbw', 'phase_angle', 'vfa', 'rmssd'].some(k => k in metrics))
      collectors.push(scoreInBody(metrics));
  
    /* AuraCom --------------------------------------------------- */
    if (auraComKeys.some(k => k in metrics))
      collectors.push(scoreAuraCom(metrics as any));
    if (heartMathKeys.some(k => k in metrics)) collectors.push(scoreHeartMath(metrics));
    if (omniFitKeys.some(k => k in metrics)) collectors.push(scoreOmniFit(metrics as any));
    if (exBodyKeys.some(k => k in metrics)) collectors.push(scoreExBody({ data: metrics as any }));
    if (circulationKeys.some(k => k in metrics)) collectors.push(scoreCirculation(metrics as any));
  

   /* ---- combine outputs -------------------------------------- */
   const combinedRadar:  Record<string, number> = {};
   const combinedBucket: Record<string, number> = {
     cellular:0, energy:0, gut:0, stress:0,
     circulation:0, brain:0, physical:0, performance:0,
   };
 
   collectors.forEach(({ radar, bucket }) => {
     Object.entries(radar).forEach(([k, v]) => {
       combinedRadar[k] = Math.min(v, combinedRadar[k] ?? v);
     });
     Object.entries(bucket).forEach(([k, v]) => {
       combinedBucket[k as keyof typeof combinedBucket] += v;
     });
   });
 
   /* fill missing spokes with 10 ( = "ideal") */
   [
     'musculoskeletal_objective','organ_digest_hormone_detox','circulation',
     'energy','articular_joint','nervous_system',
   ].forEach(k => { if (combinedRadar[k] === undefined) combinedRadar[k] = 10; });
 
   return { radar: combinedRadar, bucket: combinedBucket };
 }
 
 /* ──────────────────────────────────────────────────────────────
    2.  UI registry — tells <DevicePicker> what forms exist
    ──────────────────────────────────────────────────────────── */
 
 /* Form blueprints ------------------------------------------------ */
 import * as inbody  from './inbody';
 import * as auracom from './auracom';
 import * as exbody   from './exbody';
 import * as omnifit  from './omnifit';
 import * as heartmath from './heartmath';
 import * as circulation from './circulation';
 
 /** Helper: all FORM constants share the same tuple-array shape */
 type DeviceForm = readonly (readonly [string, string, number, number, number])[];
 
 export const OBJECTIVE_FORMS: Record<
  string,
  { label: string; form: DeviceForm }
> = {
  inbody : { label: 'InBody',  form: inbody.FORM  },
  auracom: { label: 'AuraCom', form: auracom.FORM },
  // exbody   : { label: 'ExBody',   form: exbody.FORM   },
  omnifit  : { label: 'OmniFit',  form: omnifit.FORM  },
  heartmath: { label: 'HeartMath',form: heartmath.FORM},
  circulation: { label: 'Circulation', form: circulation.FORM },
};

/* ──────────────────────────────────────────────────────────────
   3.  New MetricSchema registry for DeviceForm
   ──────────────────────────────────────────────────────────── */
export const OBJECTIVE_SCHEMAS: Record<string, MetricSchema> = {
  inbody: inbody.inbodyMetricSchema,
  auracom: auracom.auracomMetricSchema,
  exbody: exbody.exbodyMetricSchema,
  omnifit: omnifit.omnifitMetricSchema,
  heartmath: heartmath.heartmathMetricSchema,
  circulation: circulation.circulationMetricSchema,
};