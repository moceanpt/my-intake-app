 // pages/api/score.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import {
  calcLifestyleScore,
  normalizeScore              // ← still used for lifestyle 0-10
} from '@/lib/score';

import {
  calcStrainCounts,
  toStrainPct,
  toRadar10,                // ← the new helpers you added
  PILLAR_KEYS               // inferred union of pillar names
} from '@/lib/score';

import tracks from '@/data/opt_track_map.json';

/* map long pillar → 3-letter track in tracks.json */
const PILLAR_TO_CODE: Record<string, keyof typeof tracks> = {
  musculoskeletal:           'msk',
  organ_digest_hormone_detox:'org',
  circulation:               'circ',
  energy:                    'ene',
  sleep:                     'ene',
  mood:                      'ene',
  articular_joint:           'art',
  nervous_system:            'nerv',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only' });
  }

  /* ----------------------------------------------------------- */
  /* 1 ▸ pull hc / life from body or database (same as before)   */
  /* ----------------------------------------------------------- */
  let { hc, life, submissionId } = req.body;

  if (!hc || !life) {
    if (!submissionId) {
      return res.status(400).json({ error: 'missing intake data' });
    }
    const sub = await prisma.intakeSubmission.findUnique({
      where: { id: submissionId },
    });
    if (!sub) return res.status(404).json({ error: 'not found' });
    hc = sub.hc as any;
    life = sub.life as any;
  }

  /* ----------------------------------------------------------- */
  /* 2 ▸ LIFESTYLE  ⟶ 0-10 radar (unchanged)                    */
  /* ----------------------------------------------------------- */
  const rawLifestyle   = calcLifestyleScore(life);  // 0 – 100 %
  const lifestyleRadar = normalizeScore(rawLifestyle); // 0 – 10

  /* ----------------------------------------------------------- */
  /* 3 ▸ HEALTH-CHECK                                           */
  /*     raw → % strain → 0-10 radar                            */
  /* ----------------------------------------------------------- */
  const rawCounts    = calcStrainCounts(hc);     // how many chips
  const strainPct    = toStrainPct(rawCounts);   // 0 – 100 %
  const healthRadar  = toRadar10(strainPct);     // 10 good → 0 bad

  /* ----------------------------------------------------------- */
  /* 4 ▸ Pick top-2 focus tracks                                */
  /*     (highest strain percentage = biggest opportunity)      */
  /* ----------------------------------------------------------- */
  const focus = (Object.entries(strainPct) as [string, number][])
    .sort((a, b) => b[1] - a[1])        // highest % first
    .slice(0, 2)
    .map(([pillar]) => {
      const code = PILLAR_TO_CODE[pillar] ?? '';
      return tracks[code]?.primary ?? `Focus on ${pillar}`;
    });

  /* ----------------------------------------------------------- */
  /* 5 ▸ respond                                                */
  /* ----------------------------------------------------------- */
  return res.status(200).json({
    health:    healthRadar,     // 0-10 scores for the radar
    lifestyle: lifestyleRadar,  // 0-10 lifestyle radar
    focus,                      // 2 personalised track titles
  });
}