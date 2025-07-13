/* lib/objective/exbody.ts
   -------------------------------------------------------------- */
   import { z } from 'zod';
   import type { MetricSchema } from '../metrics/types';

   /* ──────────────────────────────────────────────────────────────
      1. shared templates
      ──────────────────────────────────────────────────────────── */
   const pair   = z.object({ L: z.boolean().default(false), R: z.boolean().default(false) });
   const single = z.boolean().default(false);
   
   /* ──────────────────────────────────────────────────────────────
      2. zod schema
      ──────────────────────────────────────────────────────────── */
      export const exBodySchema = z.object({
        loss_of_height_in: z.string().optional(),
        misalignment_deviation: z.number().optional(),
        imbalance_deviation: z.number().optional(),
        musculoskeletal_index: z.number().optional(),
        shoulder_inclination_deg: z.string().optional(),
        shoulder_inclination_mm: z.string().optional(),
        fhp_deg: z.string().optional(),
        fhp_mm: z.string().optional(),
        pcmt_lb: z.string().optional(),
        pelvic_tilt_deg: z.string().optional(),
        pelvic_tilt_mm: z.string().optional(),
        knee_flexion_ext_deg: z.string().optional(),
        knee_flexion_ext_mm: z.string().optional(),
      });
      export type ExBodyInput = z.infer<typeof exBodySchema>;
   
   /* ──────────────────────────────────────────────────────────────
      3. UI schema
      ──────────────────────────────────────────────────────────── */
      export const exBodyUI = {
        slug : 'exbody',
        title: 'ExBody – Posture & Musculoskeletal Analysis',
      
        groups: [
          /* Overall Metrics ----------------------------------------- */
          {
            title  : 'Overall Assessment',
            section: 'overall',
            fields : [
              { name: 'loss_of_height_in', label: 'Loss of Height (inches)', widget: 'text' },
              { name: 'misalignment_deviation', label: 'Misalignment Deviation', widget: 'number' },
              { name: 'imbalance_deviation', label: 'Imbalance Deviation', widget: 'number' },
              { name: 'musculoskeletal_index', label: 'Musculoskeletal Index', widget: 'number' },
            ],
          },
      
          /* Shoulder Assessment ------------------------------------- */
          {
            title  : 'Shoulder Assessment',
            section: 'shoulder',
            fields : [
              { name: 'shoulder_inclination_deg', label: 'Shoulder Inclination (degrees)', widget: 'text' },
              { name: 'shoulder_inclination_mm', label: 'Shoulder Inclination (mm)', widget: 'text' },
            ],
          },
      
          /* Head & Neck Assessment ---------------------------------- */
          {
            title  : 'Head & Neck Assessment',
            section: 'head_neck',
            fields : [
              { name: 'fhp_deg', label: 'Forward Head Posture (degrees)', widget: 'text' },
              { name: 'fhp_mm', label: 'Forward Head Posture (mm)', widget: 'text' },
              { name: 'pcmt_lb', label: 'Postural Correction Muscle Tension (lb)', widget: 'text' },
            ],
          },
      
          /* Pelvic Assessment --------------------------------------- */
          {
            title  : 'Pelvic Assessment',
            section: 'pelvic',
            fields : [
              { name: 'pelvic_tilt_deg', label: 'Pelvic Tilt (degrees)', widget: 'text' },
              { name: 'pelvic_tilt_mm', label: 'Pelvic Tilt (mm)', widget: 'text' },
            ],
          },
      
          /* Knee Assessment ----------------------------------------- */
          {
            title  : 'Knee Assessment',
            section: 'knee',
            fields : [
              { name: 'knee_flexion_ext_deg', label: 'Knee Flexion/Extension (degrees)', widget: 'text' },
              { name: 'knee_flexion_ext_mm', label: 'Knee Flexion/Extension (mm)', widget: 'text' },
            ],
          },
        ],
      } as const;
   
   /* ──────────────────────────────────────────────────────────────
      4. payload passthrough
      ──────────────────────────────────────────────────────────── */
   export const toPayload = (raw: Record<string, any>): ExBodyInput =>
     exBodySchema.parse(raw);
   
   
   /* ──────────────────────────────────────────────────────────────
      5. Scorer
      ──────────────────────────────────────────────────────────── */
   // Color band logic for ExBody (consistent with other metrics)
   function exbodyColorBand(val: number) {
     if (val <= 10) return { color: 'dark-green', label: 'Optimal' };
     if (val <= 20) return { color: 'yellow', label: 'Mild' };
     if (val <= 40) return { color: 'orange', label: 'Moderate' };
     return { color: 'red', label: 'High Risk' };
   }

   // Total MSK-Health Score color band logic
   function mskHealthScoreColorBand(score: number) {
     if (score >= 80) return { color: 'dark-green', label: 'Optimal' };
     if (score >= 60) return { color: 'yellow', label: 'Moderate imbalance' };
     if (score >= 40) return { color: 'orange', label: 'High-risk imbalance' };
     return { color: 'red', label: 'Critical – immediate attention' };
   }

   export function scoreExBody({ data }: { data: ExBodyInput }) {
     let total_pts = 0;
     const result: any = { bands: {} };

     // 1. Loss of Height (in)
     const loss_of_height = parseFloat(data.loss_of_height_in as any) || 0;
     if (loss_of_height <= 0.5) total_pts += 0;
     else if (loss_of_height <= 1.0) total_pts += 2;
     else if (loss_of_height <= 2.0) total_pts += 5;
     else total_pts += 8;

     // 2. Misalignment Deviation (0–51)
     const misalignment_dev = Number(data.misalignment_deviation) || 0;
     result.bands.misalignment_deviation = exbodyColorBand(misalignment_dev);
     result.bands.misalignment_deviation.score = 100 - Math.min(misalignment_dev * 2, 100);
     total_pts += misalignment_dev; // direct addition

     // 3. Imbalance Deviation (0–51)
     const imbalance_dev = Number(data.imbalance_deviation) || 0;
     result.bands.imbalance_deviation = exbodyColorBand(imbalance_dev);
     result.bands.imbalance_deviation.score = 100 - Math.min(imbalance_dev * 2, 100);
     total_pts += imbalance_dev; // direct addition

     // 4. Musculoskeletal Index (sum of misalignment + imbalance deviation)
     const msk_index = misalignment_dev + imbalance_dev;
     result.bands.msk_index = exbodyColorBand(msk_index);
     result.bands.msk_index.score = 100 - Math.min(msk_index * 2, 100);
     total_pts += msk_index; // for legacy compatibility, but not double-counted in new logic

     // 5. Shoulder Inclination (deg or mm)
     const shoulder_incl_deg = Math.abs(Number(data.shoulder_inclination_deg)) || 0;
     const shoulder_incl_mm = Math.abs(Number(data.shoulder_inclination_mm)) || 0;
     let shoulder_pts = 0;
     if (shoulder_incl_deg > 0) {
       if (shoulder_incl_deg <= 1) shoulder_pts = 0;
       else if (shoulder_incl_deg <= 3) shoulder_pts = 2;
       else if (shoulder_incl_deg <= 5) shoulder_pts = 4;
       else shoulder_pts = 6;
     } else if (shoulder_incl_mm > 0) {
       if (shoulder_incl_mm <= 5) shoulder_pts = 0;
       else if (shoulder_incl_mm <= 10) shoulder_pts = 2;
       else if (shoulder_incl_mm <= 20) shoulder_pts = 4;
       else shoulder_pts = 6;
     }
     total_pts += shoulder_pts;

     // 6. Forward Head Posture (deg)
     const fhp_deg = Math.abs(Number(data.fhp_deg)) || 0;
     let fhp_pts = 0;
     if (fhp_deg <= 15) fhp_pts = 0;
     else if (fhp_deg <= 20) fhp_pts = 2;
     else if (fhp_deg <= 30) fhp_pts = 4;
     else fhp_pts = 6;
     total_pts += fhp_pts;

     //    FHP translation (mm): add +1 pt per 5 mm > 15 mm (cap 6)
     const fhp_mm = Math.abs(Number(data.fhp_mm)) || 0;
     if (fhp_mm > 15) {
       total_pts += Math.min(Math.floor((fhp_mm - 15) / 5) + 1, 6);
     }

     // 7. Postural-Correction Muscle Tension (lb)
     const pcmt_lb = Math.abs(Number(data.pcmt_lb)) || 0;
     if (pcmt_lb <= 2) total_pts += 0;
     else if (pcmt_lb <= 4) total_pts += 2;
     else if (pcmt_lb <= 6) total_pts += 4;
     else total_pts += 6;

     // 8. Pelvic Tilt (deg)
     const pelvic_tilt_deg = Math.abs(Number(data.pelvic_tilt_deg)) || 0;
     let pelvic_pts = 0;
     if (pelvic_tilt_deg >= -4 && pelvic_tilt_deg <= 10) pelvic_pts = 0;
     else if (pelvic_tilt_deg <= 15) pelvic_pts = 2;
     else if (pelvic_tilt_deg <= 20) pelvic_pts = 4;
     else pelvic_pts = 6;
     total_pts += pelvic_pts;

     //    Pelvic height diff (mm): add +1 pt per 5 mm > 10 mm (cap 6)
     const pelvic_tilt_mm = Math.abs(Number(data.pelvic_tilt_mm)) || 0;
     if (pelvic_tilt_mm > 10) {
       total_pts += Math.min(Math.floor((pelvic_tilt_mm - 10) / 5) + 1, 6);
     }

     // 9. Knee Flex/Hyperext (deg)
     const knee_flex_ext_deg = Math.abs(Number(data.knee_flexion_ext_deg)) || 0;
     let knee_pts = 0;
     if (knee_flex_ext_deg >= -5 && knee_flex_ext_deg <= 5) knee_pts = 0;
     else if (knee_flex_ext_deg <= 10) knee_pts = 2;
     else if (knee_flex_ext_deg <= 15) knee_pts = 4;
     else knee_pts = 6;
     total_pts += knee_pts;

     // Remove ant. tibial shear (mm) logic (not measured)

     // Cap total_pts at 78
     total_pts = Math.min(total_pts, 78);

     // Compute MSK_Health_Score
     const MSK_Health_Score = 100 - (total_pts * 100 / 78);

     // Add total MSK-Health Score with color banding
     result.bands.msk_health_score = mskHealthScoreColorBand(MSK_Health_Score);
     result.bands.msk_health_score.score = MSK_Health_Score;

     result.radar = { musculoskeletal_objective: MSK_Health_Score };
     result.bucket = { musculoskeletal_objective: MSK_Health_Score };
     return result;
   }
   
   /* ──────────────────────────────────────────────────────────────
      6. Registry export
      ──────────────────────────────────────────────────────────── */
      export const exBodyModule = {
        slug   : exBodyUI.slug,
        zod    : exBodySchema,
        ui     : exBodyUI,
        toPayload,
        scorer : scoreExBody,
      } as const;
      
      export default exBodyModule;

/* ───── 7 ▸ New MetricSchema for DeviceForm ───── */
export const exBodyKeys = [
  'loss_of_height_in',
  'misalignment_deviation', 
  'imbalance_deviation',
  'musculoskeletal_index',
  'shoulder_inclination_deg',
  'shoulder_inclination_mm',
  'fhp_deg',
  'fhp_mm',
  'pcmt_lb',
  'pelvic_tilt_deg',
  'pelvic_tilt_mm',
  'knee_flexion_ext_deg',
  'knee_flexion_ext_mm'
] as const;

export const exbodyMetricSchema: MetricSchema = {
  slug: 'exbody',
  title: 'ExBody Posture & Musculoskeletal Analysis',
  fields: [
    { name: 'loss_of_height_in', label: 'Loss of Height (inches)', widget: 'number', step: 0.1 },
    { name: 'misalignment_deviation', label: 'Misalignment Deviation', widget: 'number', step: 0.1 },
    { name: 'imbalance_deviation', label: 'Imbalance Deviation', widget: 'number', step: 0.1 },
    { name: 'musculoskeletal_index', label: 'Musculoskeletal Index', widget: 'number', step: 0.1 },
    { name: 'shoulder_inclination_deg', label: 'Shoulder Inclination (degrees)', widget: 'number', step: 0.1 },
    { name: 'shoulder_inclination_mm', label: 'Shoulder Inclination (mm)', widget: 'number', step: 0.1 },
    { name: 'fhp_deg', label: 'Forward Head Posture (degrees)', widget: 'number', step: 0.1 },
    { name: 'fhp_mm', label: 'Forward Head Posture (mm)', widget: 'number', step: 0.1 },
    { name: 'pcmt_lb', label: 'Postural Correction Muscle Tension (lb)', widget: 'number', step: 0.1 },
    { name: 'pelvic_tilt_deg', label: 'Pelvic Tilt (degrees)', widget: 'number', step: 0.1 },
    { name: 'pelvic_tilt_mm', label: 'Pelvic Tilt (mm)', widget: 'number', step: 0.1 },
    { name: 'knee_flexion_ext_deg', label: 'Knee Flexion/Extension (degrees)', widget: 'number', step: 0.1 },
    { name: 'knee_flexion_ext_mm', label: 'Knee Flexion/Extension (mm)', widget: 'number', step: 0.1 },
  ]
};