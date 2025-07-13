/* ------------------------------------------------------------------
   lib/score.ts – MOCEAN Health- & Lifestyle scoring helpers
------------------------------------------------------------------- */
import questionSchema from '@/components/questions/questionSchema';
import { generatePlan } from '@/lib/generatePlan';

/* ================================================================
 *  SECTION 0 · LIFESTYLE
 * ================================================================ */

/** Points table per answer (0 = worst, 10 = best) */
const LIFE_SCORING = {
  /* —— MOVE —— */
  intentional_move_days: { '0–1/wk': 0, '2–3/wk': 5, '4 +/wk': 10 },
  resistance_sessions  : { '0–1': 0, '2–3': 5, '4 +': 8 },
  daily_steps          : { '< 4 k': 0, '4–7 k': 3, '7–10 k': 7, '10 k +': 10 },
  sitting_hours        : { '8 h +': 0, '6–8 h': 3, '4–6 h': 7, '< 4 h': 10 },
  move_barrier         : { Pain: 0, 'Time / Motivation / Unsure': 5 },

  /* —— REST —— */
  sleep_hours         : { '< 5 h': 0, '5–7 h': 6, '7–9 h': 10, '9 h +': 6 },
  refreshed_am        : { Yes: 10, No: 3 },
  prebed_screen       : { Nightly: 0, 'Few / wk': 5, Rare: 10 },
  bedtime_variability : { Yes: 3, No: 10 },
  shift_pattern       : { Day: 10, 'Night / Rotating': 0 },

  /* —— HYDRATE —— */
  water_habit        : { '< 4': 0, '4–7': 5, '8–10': 10, '10 +': 10 },
  sugary_drinks      : { None: 10, '≤ 1 / wk': 7, '2–4 / wk': 3, Daily: 0 },
  alcohol            : { Never: 10, Occasional: 7, Regular: 3, Daily: 0 },
  thirsty_during_day : { Rarely: 10, Sometimes: 5, Often: 0 },
  start_with_water   : { Yes: 10, No: 0 },

  /* —— NOURISH —— */
  produce_servings : { '0–1': 0, '2–3': 6, '4 +': 10 },
  protein_meals    : { Rarely: 0, 'About half': 5, Most: 10 },
  sweet_treats     : { 'Daily +': 0, 'Few / wk': 5, 'Almost never': 10 },
  whole_grain      : { Rarely: 0, 'Some days': 5, 'Most days': 10 },
  healthy_fat      : { Rarely: 0, 'Some days': 5, 'Most days': 10 },
  cook_ratio       : { 'Home-cooked': 10, 'Half-&-half': 5, 'Mostly take-out': 0 },

  /* —— STRESS —— */
  stress_scale   : 'num',   // handled below (0-10 slider)
  stress_reset   : 'multi', // handled below
  social_support : { Yes: 10, No: 0 },
  work_life_balance   : { Good: 10, Adequate: 5, Poor: 0 },
  mindfulness_minutes : { '< 5': 0, '5–10': 5, '> 10': 10 },

  /* —— RESTORE —— */
  recovery_tools      : 'multi',
  leisure_screen_time : { '< 1 h': 10, '1–3 h': 5, '> 3 h': 0 },
  rest_days           : { '0': 0, '1': 5, '2': 8, '3 +': 10 },
  time_outdoors       : { '< 15 min': 0, '15–30': 5, '30–60': 8, '60 +': 10 },
  morning_sun         : { Yes: 10, No: 0 },
  bedroom_environment : { Optimal: 10, 'Needs work': 5, Poor: 0 },
  digital_shutdown    : { Never: 0, 'Some nights': 5, 'Most nights': 10 },
} as const;

/** Which pillar each field belongs to */
const PILLAR_FIELD: Record<string,
  'move'|'rest'|'hydrate'|'nourish'|'stress'|'restore'
> = {
  // move
  intentional_move_days:'move', resistance_sessions:'move', daily_steps:'move',
  sitting_hours:'move', move_barrier:'move',
  // rest
  sleep_hours:'rest', refreshed_am:'rest', prebed_screen:'rest',
  bedtime_variability:'rest', shift_pattern:'rest',
  // hydrate
  water_habit:'hydrate', sugary_drinks:'hydrate', alcohol:'hydrate',
  thirsty_during_day:'hydrate', start_with_water:'hydrate',
  // nourish
  produce_servings:'nourish', protein_meals:'nourish', sweet_treats:'nourish',
  whole_grain:'nourish', healthy_fat:'nourish', cook_ratio:'nourish',
  // stress
  stress_scale:'stress', stress_reset:'stress', social_support:'stress',
  work_life_balance:'stress', mindfulness_minutes:'stress',
  // restore
  recovery_tools:'restore', leisure_screen_time:'restore', rest_days:'restore',
  time_outdoors:'restore', morning_sun:'restore', bedroom_environment:'restore',
  digital_shutdown:'restore',
};

/** simple helper for multi-select fields */
function scoreMulti(list: string[] = [], positiveOnly = true) {
  if (list.length === 0) return positiveOnly ? 10 : 0;
  const neg = list.filter(x => x !== 'Healthy tools' && x !== 'Any tool').length;
  return Math.max(0, 10 - neg * 2);
}

/** returns %-per-pillar object, e.g. { move: 75, rest: 60, … } */
export function calcLifestyleScore(life: Record<string, any> = {}) {
  const sums   = { move:0, rest:0, hydrate:0, nourish:0, stress:0, restore:0 };
  const counts = { ...sums };

  for (const [field,val] of Object.entries(life)) {
    const pillar = PILLAR_FIELD[field];
    if (!pillar) continue;

    const rule = (LIFE_SCORING as any)[field];
    let pts: number;

    if (rule === 'multi') {
      pts = scoreMulti(val as string[]);
    } else if (rule === 'num') {
      pts = Math.max(0, 10 - Number(val || 0));  // invert slider 0-10 → 10-0
    } else {
      pts = rule?.[val as string] ?? 5;           // unseen option → neutral 5
    }
    sums[pillar]   += pts;
    counts[pillar] += 10;                         // every question worth 10
  }

  // percentage per pillar
  (Object.keys(sums) as (keyof typeof sums)[]).forEach(k => {
    sums[k] = counts[k] ? Math.round((sums[k] / counts[k]) * 100) : 0;
  });
  return sums;
}

/** % ➜ 0-10 whole numbers */
export function normalizeScore(raw: Record<string,number>, max = 10) {
  const out: Record<string,number> = {};
  for (const [k,v] of Object.entries(raw))
    out[k] = Math.round((v / 100) * max);
  return out;
}

/* ================================================================
 *  SECTION 1 · MOCEAN 6-pillar Health Check
 * ================================================================ */
export const PILLAR_KEYS = [
  'musculoskeletal','organ_digest_hormone_detox','circulation',
  'energy','articular_joint','nervous_system',
] as const;
export type Pillar = typeof PILLAR_KEYS[number];

/** count maximum selectable chips per pillar (runs once at boot) */
const MAX_CHIPS: Record<Pillar,number> = (() => {
  const out = {} as Record<Pillar,number>;
  for (const p of PILLAR_KEYS) {
    const qs = (questionSchema.health as Record<string,any[]>)[p] ?? [];
    out[p] = qs.reduce(
      (sum,q)=>
        (q.type === 'multi' || q.type === undefined) && Array.isArray(q.options)
          ? sum + q.options.length : sum, 0);
  }
  return out;
})();

/** Slider (5 pts) + Chip-absence (5 pts) → 0-10 rounded */
export function pillarScore(
  sliderVal: number,          // 0–10 from the range input
  chipsPicked: number,        // how many symptom chips are ticked
  maxChips: number            // pillar-specific maximum
): number {
  if (!maxChips) return Math.round(sliderVal);   // safety fallback

  // ⚖️  5 points come from the slider
  const sliderPts = (sliderVal / 10) * 5;

  // ⚖️  5 points come from NOT having chips selected
  const chipPts   = ((maxChips - chipsPicked) / maxChips) * 5;

  return Math.round(
    Math.max(0, Math.min(10, sliderPts + chipPts))
  );
}

/** Build full 6-spoke subjective radar (whole ints) */
export function buildSubjectiveRadar(
  hc: Record<Pillar,string[]> = {} as any,
  sliders: Record<Pillar,{ main:number }> = {},
){
  const out = {} as Record<Pillar,number>;
  for (const p of PILLAR_KEYS){
    const s = sliders[p]?.main ?? 10;
    const c = hc[p]?.length ?? 0;
    out[p] = pillarScore(s,c,MAX_CHIPS[p]);
  }
  return out;
}

/* ================================================================
 *  SECTION 2 · helpers to call generatePlan()
 * ================================================================ */
export function buildPreview(sub:{
  hc:Record<Pillar,string[]>;
  hcSlider:Record<Pillar,{ main:number }>;
  life:Record<string,any>;
}){
  return generatePlan({ hc:sub.hc, hcSlider:sub.hcSlider, life:sub.life,
                        metrics:{}, ratio:0 });
}

export function buildFinal(sub:{
  hc:Record<Pillar,string[]>;
  hcSlider:Record<Pillar,{ main:number }>;
  life:Record<string,any>;
  metrics:Record<string,number>;
}){
  return generatePlan({ hc:sub.hc, hcSlider:sub.hcSlider, life:sub.life,
                        metrics:sub.metrics, ratio:0.7 });
}

/* Dev-time safeguard */
if (process.env.NODE_ENV === 'development'){
  const missing = Object.keys(questionSchema.health)
    .filter(k=>!(PILLAR_KEYS as readonly string[]).includes(k));
  if (missing.length)
    console.warn('[score] Pillars present in schema but missing in PILLAR_KEYS:',missing);
}