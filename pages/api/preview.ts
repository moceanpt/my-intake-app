/* ------------------------------------------------------------------
   pages/api/preview.ts
   Generates (or overwrites) the PREVIEW plan for an intake
------------------------------------------------------------------- */
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma               from '@/lib/prisma';
import { buildPreview }     from '@/lib/planFactory';
import { PILLAR_KEYS } from '@/lib/score';

export default async function handler(
  req : NextApiRequest,
  res : NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'POST only' });

  const { submissionId } = req.body ?? {};
  if (!submissionId)
    return res.status(400).json({ error: 'missing submissionId' });

  /* 1 ▸ pull the stored intake (only the needed columns) */
  const sub = await prisma.intakeSubmission.findUnique({
    where:  { id: submissionId },
    select: {
      symptomChips     : true,          // hc
      sliderValues     : true,          // hcSlider (JSON)
      lifestyleAnswers : true,          // life (JSON)
      lifestyleOptIn   : true           // boolean
    }
  });

  if (!sub)
    return res.status(404).json({ error: 'submission not found' });

  /* 2 ▸ build preview plan (subjective-only) */
  const rawHc = (typeof sub.symptomChips === 'object' && sub.symptomChips !== null)
    ? sub.symptomChips
    : {};
  const hc = PILLAR_KEYS.reduce((acc, key) => {
    acc[key] = Array.isArray(rawHc[key]) ? rawHc[key] : [];
    return acc;
  }, {} as Record<typeof PILLAR_KEYS[number], string[]>);
  const life = (typeof sub.lifestyleAnswers === 'object' && sub.lifestyleAnswers !== null)
    ? sub.lifestyleAnswers
    : {};
  const preview = buildPreview({
    hc,
    hcSlider : (sub as any).sliderValues || {},
    life     : sub.lifestyleOptIn ? life : {},   // empty if they skipped
  });

  /* 3 ▸ upsert into PlanResult(preview) */
  await prisma.planResult.upsert({
    where : { submissionId_stage: { submissionId, stage: 'preview' } },
    update: { resultJson: JSON.stringify(preview), generatedAt: new Date() },
    create: {
      submissionId,
      stage      : 'preview',
      resultJson : JSON.stringify(preview)
    }
  });

  return res.status(200).json({ ok: true });
}