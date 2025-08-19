import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildFinal }   from '@/lib/planFactory';
import { PILLAR_KEYS } from '@/lib/score';

/* ---------- Dynamic body schema for any device ---------- */
const Body = z.object({
  submissionId: z.string().uuid(),
  device: z.string(),
  values: z.record(z.union([z.number(), z.string(), z.boolean()])),
});

/* ---------- helper for units ---------- */
const getUnit = (k: string) => {
  const units = {
    // InBody
    vfa: "cm²", phase_angle: "°", rmssd: "ms", ecw_tbw: "", smm_pct: "%",
    hydration: "%", body_fat_pct: "%", weight: "kg", tbw: "L",
    
    // ExBody
    loss_of_height_in: "in", misalignment_deviation: "", imbalance_deviation: "",
    musculoskeletal_index: "", shoulder_inclination_deg: "°", shoulder_inclination_mm: "mm",
    fhp_deg: "°", fhp_mm: "mm", pcmt_lb: "lb", pelvic_tilt_deg: "°", pelvic_tilt_mm: "mm",
    knee_flexion_ext_deg: "°", knee_flexion_ext_mm: "mm",
    
    // ROM
    neck_flexion: "°", neck_lateral_flexion_left: "°", neck_lateral_flexion_right: "°",
    shoulder_abduction_left: "°", shoulder_abduction_right: "°", 
    shoulder_flexion_left: "°", shoulder_flexion_right: "°",
    shoulder_extension_left: "°", shoulder_extension_right: "°",
    trunk_lateral_flexion_left: "°", trunk_lateral_flexion_right: "°",
    hip_abduction_left: "°", hip_abduction_right: "°",
    hip_flexion_left: "°", hip_flexion_right: "°",
    hip_extension_left: "°", hip_extension_right: "°",
    
    // OmniFit
    hrv_index: "", stress: "", ans_health: "", ans_age: "yrs", lf: "log ms²", hf: "log ms²",
    brain_score: "", mental_stress: "", intrinsic_eeg_pf: "Hz", brain_workload: "Hz",
    
    // HeartMath
    sdnn: "ms", lf_hf_ratio: "", total_power: "ms²", lf_power: "ms²", hf_power: "ms²", coherence: "%",
    
    // Auracom
    energy_score: "", vigor: "", stability: "", activity_percent: "%", elemental_balance: "",
  };
  return units[k] || "";
};

/* ---------- handler ---------- */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  /* 1. validate body */
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(422).json(parsed.error);
  const { submissionId, device, values } = parsed.data;

  try {
    /* 2. upsert all metrics for this device */
    const upsertPromises = Object.entries(values).map(([metricKey, value]) => {
      // Convert value to number if possible, otherwise store as string
      const numericValue = typeof value === 'number' ? value : 
                          typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : 
                          null;
      
      if (numericValue !== null) {
        return prisma.assessmentMetric.upsert({
          where: { submissionId_metricKey: { submissionId, metricKey } },
          update: { 
            value: numericValue,
            deviceType: device,
            collectedAt: new Date(),
          },
          create: {
            submissionId,
            metricKey,
            value: numericValue,
            unit: getUnit(metricKey),
            deviceType: device,
            collectedAt: new Date(),
          },
        });
      }
      return null;
    }).filter(Boolean);

    await prisma.$transaction(upsertPromises);

    /* 3. Check if we have metrics from multiple devices to determine status */
    const allMetrics = await prisma.assessmentMetric.findMany({
      where: { submissionId },
      distinct: ['deviceType'],
      select: { deviceType: true },
    });

    // Only mark as metrics_entered if we have substantial data
    if (allMetrics.length > 0) {
      await prisma.intakeSubmission.update({
        where: { id: submissionId },
        data: { status: "metrics_entered" },
      });
    }

    /* 4. build FINAL plan if we have comprehensive data */
    const sub = await prisma.intakeSubmission.findUnique({
      where: { id: submissionId },
      include: { AssessmentMetric: true },
    });
    
    if (!sub) return res.status(404).json({ error: "Submission not found" });

    /* turn array of AssessmentMetric into { key:value } map */
    const objMetrics = Object.fromEntries(
      sub.AssessmentMetric.map((m) => [m.metricKey, m.value])
    );

    // Only build final plan if we have enough objective data
    if (Object.keys(objMetrics).length >= 3) {
      const finalPlan = buildFinal({
        hc: sub.symptomChips as any,
        hcSlider: sub.sliderValues as any || {},
        life: sub.lifestyleAnswers as any,
        metrics: objMetrics,
      });

      /* 5. upsert PlanResult(final) */
      await prisma.planResult.upsert({
        where: { submissionId_stage: { submissionId, stage: "final" } },
        update: { resultJson: finalPlan },
        create: { submissionId, stage: "final", resultJson: finalPlan },
      });
    }

    /* 6. respond */
    res.json({ 
      ok: true, 
      message: `Successfully saved ${Object.keys(values).length} metrics for ${device}`,
      metricsCount: Object.keys(objMetrics).length 
    });

  } catch (error) {
    console.error('Error saving metrics:', error);
    res.status(500).json({ 
      error: 'Failed to save metrics', 
      details: error.message 
    });
  }
}