/* ------------------------------------------------------------------
   lib/score.ts   – MOCEAN Health-Check scoring helpers
   ---------------------------------------------------------------
   1)  PILLAR_KEYS         – single source of truth for pillar IDs
   2)  deriveMaxChips()    – counts <multi> options per pillar
   3)  calcStrainCounts()  – raw # chips picked
   4)  toStrainPct()       – raw → percentage of max (0–100)
   5)  toRadar10()         – percentage → radar-friendly 0–10
------------------------------------------------------------------- */

/* ---------- LIFESTYLE  (unchanged code you had before) ---------- */
export function calcLifestyleScore(life: Record<string, any> = {}) {
  /* put back your real scoring here – this dummy keeps the app alive */
  // return { move: 40, rest: 70, hydrate: 55, nourish: 60, stress: 30, restore: 45 };
  return Object.fromEntries(
    Object.keys(life).map(k => [k, 0])
  ) as Record<string, number>;               // ← remove after you restore logic
}

export function normalizeScore(
  raw: Record<string, number>,
  max = 10
): Record<string, number> {
  const out: Record<string, number> = {};
  Object.keys(raw).forEach((k) => {
    out[k] = Math.min(max, Math.round((raw[k] / 100) * max));
  });
  return out;
}

import questionSchema from '@/components/questions/questionSchema';

/** 🔑  All pillars we score (MUST match the keys used in data.hc) */
export const PILLAR_KEYS = [
  'musculoskeletal',
  'organ_digest_hormone_detox',
  'circulation',
  'energy',
  'articular_joint',
  'nervous_system',
] as const;

/** Inferred union type, e.g. 'musculoskeletal' | 'circulation' | … */
export type Pillar = typeof PILLAR_KEYS[number];

/* ------------------------------------------------------------------ */
/*           1 ▸ auto-discover the maximum selectable chips            */
/* ------------------------------------------------------------------ */
function deriveMaxChips(): Record<Pillar, number> {
  const out = {} as Record<Pillar, number>;

  PILLAR_KEYS.forEach((p) => {
    const qs = (questionSchema.health as Record<string, any[]>)[p] ?? [];
    out[p] = qs.reduce((sum, q) => {
      return q.type === 'multi' && Array.isArray(q.options)
        ? sum + q.options.length
        : sum;
    }, 0);
  });

  return out;
}

/** ⚙️  single source of truth used by all helpers below */
const MAX_CHIPS: Record<Pillar, number> = deriveMaxChips();

/* — optional dev safeguard — */
if (
  process.env.NODE_ENV === 'development'
) {
  const schemaKeys = Object.keys(questionSchema.health);
  const missing = schemaKeys.filter((k) => !(PILLAR_KEYS as readonly string[]).includes(k));
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn('[score] Pillars present in schema but missing from PILLAR_KEYS:', missing);
  }
}

/* shallow copy utility -------------------------------------------------- */
const clone = <T extends object>(o: T): T =>
  JSON.parse(JSON.stringify(o));

/* ------------------------------------------------------------------
   STEP 1  – raw chip counts  (0 … n)
------------------------------------------------------------------- */
export function calcStrainCounts(
  hc: Record<Pillar, string[]> = {} as any
): Record<Pillar, number> {
  const out = {} as Record<Pillar, number>;
  (PILLAR_KEYS as readonly Pillar[]).forEach((p) => {
    out[p] = hc[p]?.length ?? 0;
  });
  return out;
}

/* ------------------------------------------------------------------
   STEP 2  – convert to percentage of max per pillar  (0–100)
------------------------------------------------------------------- */
export function toStrainPct(
  raw: Record<Pillar, number>
): Record<Pillar, number> {
  const pct = clone(raw);
  (PILLAR_KEYS as readonly Pillar[]).forEach((p) => {
    pct[p] =
      MAX_CHIPS[p] === 0 ? 0 : Math.round((raw[p] / MAX_CHIPS[p]) * 100);
  });
  return pct;
}

/* ------------------------------------------------------------------
   STEP 3  – map strain % to radar score (10 = perfect, 0 = poor)
------------------------------------------------------------------- */
export function toRadar10(
  strainPct: Record<Pillar, number>
): Record<Pillar, number> {
  const radar = clone(strainPct);
  (PILLAR_KEYS as readonly Pillar[]).forEach((p) => {
    radar[p] = Number((10 - strainPct[p] / 10).toFixed(1)); // e.g. 6.4
  });
  return radar;
}