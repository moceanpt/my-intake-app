/* eslint-disable @typescript-eslint/no-explicit-any */
import chipCatalog   from '@/data/chip_catalog.json'
import strainRows    from '@/data/strain_table.json'

export type Pillar = keyof typeof chipCatalog               // msk | org | …

/* ---------- 3-A  stress score (now %-based) ---------- */
export function calcStress(
  symptomChips: Record<Pillar, string[]>
): Record<Pillar, number> {
  const out: Record<Pillar, number> = {} as any;

  (Object.keys(chipCatalog) as Pillar[]).forEach((p) => {
    const total = Object.keys(chipCatalog[p]).length;
    const picked = (symptomChips[p] || []).length;
    out[p] = Math.round((picked / total) * 10) / 10; // convert to 0–10 scale
  });

  return out;
}

/* ---------- 3-B  support score (unchanged) ---------- */
export function calcSupport (lifestyle: Record<string,string>): Record<Pillar,number> {
  const out: Record<Pillar, number> = { msk:10, org:10, circ:10, ene:10, art:10, nerv:10 } as any
  strainRows.forEach((row:any) => {
    if (lifestyle[row.key] === row.value) {
      (row.pillars as Pillar[]).forEach((p) => {
        out[p] = Math.max(0, out[p] - row.pts)
      })
    }
  })
  return out
}

/* ---------- 3-C  gap helper (unchanged) -------------- */
export const gap = (stress: Record<Pillar,number>, support: Record<Pillar,number>) =>
  (Object.keys(stress) as Pillar[])
    .reduce((o,p) => ({ ...o, [p]: stress[p]-support[p] }), {} as Record<Pillar,number>)