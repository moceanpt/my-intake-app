/* ------------------------------------------------------------------
   pages/api/preview.ts
   Generates (or overwrites) the PREVIEW plan for an intake
------------------------------------------------------------------- */
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma               from '@/lib/prisma';
import { buildPreview }     from '@/lib/planFactory';

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
  const preview = buildPreview({
    hc       : sub.symptomChips,
    hcSlider : (sub as any).sliderValues || {},
    life     : sub.lifestyleOptIn ? sub.lifestyleAnswers : {}   // empty if they skipped
  });

  /* 3 ▸ upsert into PlanResult(preview) */
  await prisma.planResult.upsert({
    where : { submissionId_stage: { submissionId, stage: 'preview' } },
    update: { resultJson: preview, generatedAt: new Date() },
    create: {
      submissionId,
      stage      : 'preview',
      resultJson : preview
    }
  });

  return res.status(200).json({ ok: true });
}