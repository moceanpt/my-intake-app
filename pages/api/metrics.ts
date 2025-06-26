import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildFinal }   from '@/lib/planFactory';

/* ---------- zod body schema ---------- */
const Body = z.object({
  submissionId: z.string().uuid(),
  vfa:        z.number().min(0).max(300),
  phaseAngle: z.number().min(1).max(10),
  rmssd:      z.number().min(10).max(250),
  ecwTbw:     z.number().min(0.3).max(0.5),
  smmPct:     z.number().min(20).max(60),
});

/* ---------- helper ---------- */
const getUnit = (k: string) =>
  ({ vfa: "cm²", phase_angle: "°", rmssd: "ms", ecw_tbw: "", smm_pct: "%" } as const)[k] ?? "";

/* ---------- handler ---------- */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  /* 1. validate body */
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(422).json(parsed.error);
  const { submissionId, ...m } = parsed.data;

  /* 2. upsert five metrics */
  const map: Record<string, number> = {
    vfa:        m.vfa,
    phase_angle:m.phaseAngle,
    rmssd:      m.rmssd,
    ecw_tbw:    m.ecwTbw,
    smm_pct:    m.smmPct,
  };

  await prisma.$transaction(
    Object.entries(map).map(([metricKey, value]) =>
      prisma.assessmentMetric.upsert({
        where: { submissionId_metricKey: { submissionId, metricKey } },
        update: { value },
        create: {
          submissionId,
          metricKey,
          value,
          unit: getUnit(metricKey),
          deviceType: "Manual",
        },
      })
    )
  );

  /* 3. mark submission as metrics_entered */
  await prisma.intakeSubmission.update({
    where: { id: submissionId },
    data:  { status: "metrics_entered" },
  });

  /* 4. build FINAL plan (subjective + objective) */
  const sub = await prisma.intakeSubmission.findUnique({
    where:  { id: submissionId },
    include:{ AssessmentMetric: true },
  });
  if (!sub) return res.status(404).json({ error: "Submission not found" });

  /* turn array of AssessmentMetric into { key:value } map */
  const objMetrics = Object.fromEntries(
    sub.AssessmentMetric.map((m) => [m.metricKey, m.value])
  );

  const finalPlan = buildFinal({
    hc:      sub.symptomChips as any,     // adapt if your field names differ
    life:    sub.lifestyleAnswers as any,
    metrics: objMetrics,
  });

  /* 5. upsert PlanResult(final) */
  await prisma.planResult.upsert({
    where: { submissionId_stage: { submissionId, stage: "final" } },
    update:{ resultJson: finalPlan },
    create:{ submissionId, stage: "final", resultJson: finalPlan },
  });

  /* 6. respond */
  res.json({ ok: true });
}