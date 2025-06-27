/* ------------------------------------------------------------------
   lib/objective/inbody.ts
   ------------------------------------------------------------------
   • FORM – blueprint consumed by <DeviceForm>
   • inBodySchema – validates staff input
   • scoreInBody() – maps the six metrics to radar + bucket
------------------------------------------------------------------- */
import { z } from 'zod';
import { band } from './utils';          // helper already in repo

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

/* ───── 2 ▸ Scoring logic (unchanged) ───── */
export function scoreInBody(
  d   : InBodyInput,
  sex : 'M' | 'F' = 'M',
  age = 35,                       // default when DOB unknown
) {
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

  /* Hydration % -------------------------------------------------- */
  const hyd = d.hydration;
  if (hyd < (sex === 'M' ? 50 : 40)) { bucket.energy += band(3); radar.energy = 4; }
  else if (hyd < (sex === 'M' ? 58 : 48)) { bucket.energy += band(1); radar.energy = 6; }
  else if (hyd > (sex === 'M' ? 66 : 60)) { bucket.stress += band(1); radar.circulation = 6; }

  /* Body-fat % (age & sex table) -------------------------------- */
  const bf = d.body_fat_pct;
  const fatTable = sex === 'M'
    ? [[8,10.5,14.8,18.6,23.1],[8,14.5,18.2,21.3,24.9],
       [8,17.4,20.6,23.4,26.6],[8,19.1,22.1,24.6,27.8],
       [8,19.7,22.6,25.2,28.4]]
    : [[14,16.5,19.4,22.7,27.1],[14,17.4,20.8,24.6,29.1],
       [14,19.8,23.8,27.6,31.9],[14,22.5,27.0,30.4,34.5],
       [14,23.2,27.9,31.3,35.4]];
  const row = Math.min(Math.floor((age - 20) / 10), 4);
  const [ , , , fair, poor] = fatTable[row];
  if (bf > poor) bucket.gut += band(2), radar.circulation = 6;
  else if (bf > fair) bucket.gut += band(1);

  /* Visceral fat area ------------------------------------------- */
  if (d.vfa >= 150)       { bucket.gut += 2; radar.circulation = 5; }
  else if (d.vfa >= 130)  bucket.gut += 1;
  else if (d.vfa >= 100)  bucket.gut += 0.5;

  /* SMM % -------------------------------------------------------- */
  const smmOK = sex === 'M' ? 40 : 30;
  if (d.smm_pct < smmOK)          { bucket.physical += 2; radar.musculoskeletal = 6; }
  else if (d.smm_pct > smmOK+10)  bucket.performance += 1;

  /* ECW/TBW ratio ----------------------------------------------- */
  if (d.ecw_tbw >= 0.420) bucket.stress += 2, radar.circulation = 5;
  else if (d.ecw_tbw >= 0.401) bucket.stress += 1;
  else if (d.ecw_tbw >= 0.391) bucket.stress += 0.5;

  /* Phase angle -------------------------------------------------- */
  const phaLow  = (sex === 'M'
    ? [5.4,5.2,5.0,4.7,4.3] : [4.8,4.6,4.4,4.0,3.6])
      [Math.min(Math.floor((age - 18)/10),4)];
  const phaGood = phaLow + 1.0;
  if (d.phase_angle < phaLow)       { bucket.cellular += 2; radar.energy = 5; }
  else if (d.phase_angle < phaGood) bucket.cellular += 1;

  return { radar, bucket };
}

/* ───── 3 ▸ UI schema for <DeviceForm> ───── */
export const inBodyUISchema = {
  fields: FORM,
  toPayload(raw: Record<string, FormDataEntryValue>) {
    const n = (k:string)=> Number(raw[k] ?? 0);
    return {
      hydration    : n('hydration'),
      smm_pct      : n('smm_pct'),
      body_fat_pct : n('body_fat_pct'),
      vfa          : n('vfa'),
      ecw_tbw      : n('ecw_tbw'),
      phase_angle  : n('phase_angle'),
    } as InBodyInput;
  },
} as const;