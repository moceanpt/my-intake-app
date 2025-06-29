/* ------------------------------------------------------------------
   lib/objective/auracom.ts
   ------------------------------------------------------------------
   • Zod schema for staff data-entry
   • scoreAuraCom()  → { radar , bucket }   (same contract as others)
   • UI schema (auraComUISchema) consumed by <DeviceForm>
------------------------------------------------------------------- */

import { z }   from 'zod';
import { band } from './utils';

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
   2 ▸ Data-entry form blueprint (high-level; optional)
--------------------------------------------------------- */
export const FORM = [
  /* A – Overall Aura */
  { name:'zone1', section:'A. Overall Aura', label:'Zone 1 colour', widget:'select' },
  { name:'zone2', section:'A. Overall Aura', label:'Zone 2 colour', widget:'select' },
  { name:'zone3', section:'A. Overall Aura', label:'Zone 3 colour', widget:'select' },
  { name:'zone4', section:'A. Overall Aura', label:'Zone 4 colour', widget:'select' },
  { name:'zone5', section:'A. Overall Aura', label:'Zone 5 colour', widget:'select' },
  {
    name:'lineQuality',
    section:'A. Overall Aura',
    label:'Vital-line quality',
    widget:'select',
    options:[
      { value:'stable',    label:'Stable'     },
      { value:'disrupted', label:'Disrupted'  },
    ],
  },

  /* B – Energy Level */
  { name:'ava',  section:'B. Energy Level', label:'Ava – overall energy', step:1 },

  /* C – Energy Balance */
  { name:'vigor',     section:'C. Energy Balance', label:'Vigor %',     step:1 },
  { name:'stability', section:'C. Energy Balance', label:'Stability %', step:1 },

  /* D – Five-Element Balance */
  { name:'elemA', section:'D. Five-Element', label:'Element A', step:1 },
  { name:'elemB', section:'D. Five-Element', label:'Element B', step:1 },
  { name:'elemC', section:'D. Five-Element', label:'Element C', step:1 },
  { name:'elemD', section:'D. Five-Element', label:'Element D', step:1 },
  { name:'elemE', section:'D. Five-Element', label:'Element E', step:1 },
  { name:'overallEnergy', section:'D. Five-Element', label:'Overall Energy Level', step:1 },
] as const;

/* derive Zod enum from the palette IDs */
const Colour = z.enum(AURA_PALETTE.map(([id]) => id) as [string, ...string[]]);

/* dropdown helpers */
const colourOptions = AURA_PALETTE.map(([id, label]) => ({ value:id, label }));

/* ---------------------------------------------------------
   3 ▸ Zod schema (validation) – Activity % removed
--------------------------------------------------------- */
export const auraComSchema = z.object({
  zone1: Colour,  zone2: Colour,  zone3: Colour,
  zone4: Colour,  zone5: Colour,

  lineQuality: z.enum(['stable','disrupted']),

  ava       : z.number().positive(),
  vigor     : z.number().int().nonnegative(),
  stability : z.number().int().nonnegative(),

  elemA : z.number().int(),
  elemB : z.number().int(),
  elemC : z.number().int(),
  elemD : z.number().int(),
  elemE : z.number().int(),
});
export type AuraComInput = z.infer<typeof auraComSchema>;
export const auraComKeys = auraComSchema.keyof().Options;

/* ---------------------------------------------------------
   4 ▸ Scorer (unchanged except activity rules removed)
--------------------------------------------------------- */
export function scoreAuraCom(d: AuraComInput) {
  const radar: Record<string,number> = {
    musculoskeletal:10,
    organ_digest_hormone_detox:10,
    circulation:10,
    energy:10,
    articular_joint:10,
    nervous_system:10,
  };
  const bucket = {
    cellular:0, energy:0, gut:0, stress:0,
    circulation:0, brain:0, physical:0, performance:0,
  };

  /* Ava */
  if (d.ava >= 600) { bucket.energy += band(2); radar.energy = 4; }
  else if (d.ava < 450) { bucket.energy += band(2); radar.energy = 5; }

  /* Vigor / Stability */
  if (d.vigor > 65 || d.vigor < 60)       bucket.stress += 1;
  if (d.stability > 40 || d.stability < 35) bucket.brain += 1;

  /* Five-element spread */
  const elems  = [d.elemA,d.elemB,d.elemC,d.elemD,d.elemE];
  const spread = Math.max(...elems) - Math.min(...elems);
  if (spread > 15) bucket.gut += 2;
  else if (spread > 10) bucket.gut += 1;

  /* Colour red-flags */
  if (d.zone1 === 'red')   { bucket.stress += 2; radar.circulation = 6; }
  if (d.zone1 === 'green') bucket.gut    += 1;

  /* Vital-line */
  if (d.lineQuality === 'disrupted') {
    bucket.physical += 1;
    radar.musculoskeletal = 6;
  }

  return { radar, bucket };
}

/* ---------------------------------------------------------
   5 ▸ UI schema consumed by <DeviceForm>
--------------------------------------------------------- */
export const auraComUISchema = {
  /* meta used by DevicePicker / DeviceForm */
  title : 'AuraCom metrics',
  slug  : 'auracom',

  fields: [
    /* A. Overall Aura */
    ...(['zone1','zone2','zone3','zone4','zone5'] as const).map(name => ({
      name,
      section:'A. Overall Aura',
      label : name.toUpperCase().replace('ZONE','Zone '),
      widget:'select',
      options: colourOptions,
    })),

    {
      name:'lineQuality',
      section:'A. Overall Aura',
      label:'Vital-line quality',
      widget:'select',
      options:[
        { value:'stable',    label:'Stable'     },
        { value:'disrupted', label:'Disrupted'  },
      ],
    },

    /* B. Energy Level */
    { name:'ava', section:'B. Energy Level',
      label:'Ava – overall energy', step:1 },

    /* C. Energy Balance */
    { name:'vigor',     section:'C. Energy Balance',
      label:'Vigor %',     step:1 },
    { name:'stability', section:'C. Energy Balance',
      label:'Stability %', step:1 },

    /* D. Five-Element Balance */
    { name:'elemA', section:'D. Five-Element', label:'Element A', step:1 },
    { name:'elemB', section:'D. Five-Element', label:'Element B', step:1 },
    { name:'elemC', section:'D. Five-Element', label:'Element C', step:1 },
    { name:'elemD', section:'D. Five-Element', label:'Element D', step:1 },
    { name:'elemE', section:'D. Five-Element', label:'Element E', step:1 },
    { name:'overallEnergy', section:'D. Five-Element', label:'Overall Energy Level', step:1 },
  ],

  /* raw → typed payload */
  toPayload(raw: Record<string, FormDataEntryValue>) {
    const n = (k:string) => Number(raw[k] ?? 0);
    const s = (k:string) => String(raw[k] ?? '');

    return {
      zone1:s('zone1'), zone2:s('zone2'), zone3:s('zone3'),
      zone4:s('zone4'), zone5:s('zone5'),

      lineQuality : s('lineQuality') as 'stable'|'disrupted',

      ava:n('ava'), vigor:n('vigor'), stability:n('stability'),

      elemA:n('elemA'), elemB:n('elemB'), elemC:n('elemC'),
      elemD:n('elemD'), elemE:n('elemE'),
      overallEnergy: n('overallEnergy'),
    } as AuraComInput;
  },
} as const;