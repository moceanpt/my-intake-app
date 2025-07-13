// pages/api/score.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma                     from '@/lib/prisma';
import { generatePlan }           from '@/lib/generatePlan';

/**
 * POST /api/score
 *
 * Body may contain
 * ──────────────────────────────────────────────────────────────
 * {
 *   hc:          Record<string,string[]>   // health-check chips
 *   life:        Record<string,any>        // lifestyle answers
 *   snapshot?:   Record<string,number>     // quick-slider page
 *   metrics?:    Record<string,number>     // OCR metrics
 *   frequency?:  number                    // binaural Hz
 *   submissionId?: string                  // load saved intake
 * }
 *
 * Response: PlanResult  (see generatePlan.ts)
 * ──────────────────────────────────────────────────────────────
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* ── POST only ─────────────────────────────────────────────── */
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    /* ── pull payload or load from DB ────────────────────────── */
    let {
      hc,
      life,
      snapshot   = {},
      metrics    = {},
      frequency,
      submissionId,
    } = req.body ?? {};

    /* Load saved submission if hc / life not provided */
    if ((!hc || !life) && submissionId) {
      const saved = await prisma.intakeSubmission.findUnique({
        where: { id: submissionId },
      });
      if (!saved)
        return res.status(404).json({ error: 'submission not found' });

      hc   = saved.symptomChips as any;
      life = saved.lifestyleAnswers as any;
      // (snapshot / metrics could also be stored & retrieved here)
    }

    if (!hc || !life) {
      return res
        .status(400)
        .json({ error: 'missing hc / life and no submissionId supplied' });
    }

    /* ── generate the blended radar + full plan ──────────────── */
    const plan = generatePlan({
      hc,
      life,
      snapshot,
      metrics,
      frequency,
    });

    /* ── send it back ────────────────────────────────────────── */
    return res.status(200).json(plan);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/score] fatal:', err);
    return res.status(500).json({ error: 'internal error' });
  }
}