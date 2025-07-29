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
   function bandColor(score: number) {
     if (score === 4) return { color: 'dark-green', label: 'Optimal' };
     if (score === 3) return { color: 'yellow', label: 'Mild' };
     if (score === 2) return { color: 'orange', label: 'Moderate' };
     return { color: 'red', label: 'High Risk' };
   }

   function mskHealthScoreColorBand(score: number) {
     if (score >= 80) return { color: 'dark-green', label: 'Optimal' };
     if (score >= 60) return { color: 'yellow', label: 'Moderate imbalance' };
     if (score >= 40) return { color: 'orange', label: 'High-risk imbalance' };
     return { color: 'red', label: 'Critical – immediate attention' };
   }

   export function scoreExBody({ data }: { data: ExBodyInput }) {
     const result: any = { bands: {}, storyBlocks: {} };
     let total_pts = 0;

     // Story Block 1: Head & Shoulder Balance (25 points)
     let headShoulder_pts = 0;
     const fhp_deg = Math.abs(Number(data.fhp_deg)) || 0;
     const fhp_mm = Math.abs(Number(data.fhp_mm)) || 0;
     const pcmt_lb = Math.abs(Number(data.pcmt_lb)) || 0;
     const shoulder_deg = Math.abs(Number(data.shoulder_inclination_deg)) || 0;
     const shoulder_mm = Math.abs(Number(data.shoulder_inclination_mm)) || 0;

     // Score Forward Head Posture (10 points)
     let fhp_score = 0;
     if (fhp_deg <= 15 && fhp_mm <= 5) fhp_score = 10;
     else if (fhp_deg <= 20 && fhp_mm <= 10) fhp_score = 7;
     else if (fhp_deg <= 30 && fhp_mm <= 20) fhp_score = 4;
     else fhp_score = 1;

     // Score Shoulder Inclination (10 points)
     let shoulder_score = 0;
     if (shoulder_deg <= 1 && shoulder_mm <= 5) shoulder_score = 10;
     else if (shoulder_deg <= 3 && shoulder_mm <= 10) shoulder_score = 7;
     else if (shoulder_deg <= 5 && shoulder_mm <= 20) shoulder_score = 4;
     else shoulder_score = 1;

     // Score Muscle Tension (5 points)
     let tension_score = 0;
     if (pcmt_lb <= 2) tension_score = 5;
     else if (pcmt_lb <= 4) tension_score = 3;
     else if (pcmt_lb <= 6) tension_score = 2;
     else tension_score = 1;

     headShoulder_pts = fhp_score + shoulder_score + tension_score;
     const headShoulder_percent = (headShoulder_pts * 100) / 25;

     // Generate story for Head & Shoulder Balance
     const headShoulder_story = generateHeadShoulderStory(fhp_deg, fhp_mm, shoulder_deg, shoulder_mm, headShoulder_percent);

     result.storyBlocks.headShoulderBalance = {
       score: headShoulder_percent,
       points: headShoulder_pts,
       maxPoints: 25,
       story: headShoulder_story,
       metrics: {
         fhp_deg: { value: fhp_deg, score: fhp_score },
         fhp_mm: { value: fhp_mm, score: fhp_score },
         pcmt_lb: { value: pcmt_lb, score: tension_score },
         shoulder_deg: { value: shoulder_deg, score: shoulder_score },
         shoulder_mm: { value: shoulder_mm, score: shoulder_score }
       }
     };

     // Story Block 2: Core Alignment (25 points)
     let coreAlignment_pts = 0;
     const pelvic_deg = Math.abs(Number(data.pelvic_tilt_deg)) || 0;
     const pelvic_mm = Math.abs(Number(data.pelvic_tilt_mm)) || 0;
     const loss_of_height = parseFloat(data.loss_of_height_in as any) || 0;

     // Score Pelvic Tilt (15 points)
     let pelvic_score = 0;
     if (pelvic_deg >= -4 && pelvic_deg <= 10 && pelvic_mm <= 5) pelvic_score = 15;
     else if (pelvic_deg <= 15 && pelvic_mm <= 10) pelvic_score = 10;
     else if (pelvic_deg <= 20 && pelvic_mm <= 20) pelvic_score = 6;
     else pelvic_score = 2;

     // Score Height Loss (10 points)
     let height_score = 0;
     if (loss_of_height <= 0.5) height_score = 10;
     else if (loss_of_height <= 1.0) height_score = 7;
     else if (loss_of_height <= 2.0) height_score = 4;
     else height_score = 1;

     coreAlignment_pts = pelvic_score + height_score;
     const coreAlignment_percent = (coreAlignment_pts * 100) / 25;

     // Generate story for Core Alignment
     const coreAlignment_story = generateCoreAlignmentStory(pelvic_deg, pelvic_mm, loss_of_height, coreAlignment_percent);

     result.storyBlocks.coreAlignment = {
       score: coreAlignment_percent,
       points: coreAlignment_pts,
       maxPoints: 25,
       story: coreAlignment_story,
       metrics: {
         pelvic_deg: { value: pelvic_deg, score: pelvic_score },
         pelvic_mm: { value: pelvic_mm, score: pelvic_score },
         loss_of_height: { value: loss_of_height, score: height_score }
       }
     };

     // Story Block 3: Lower-Limb Mechanics (25 points)
     let lowerLimb_pts = 0;
     const knee_deg = Math.abs(Number(data.knee_flexion_ext_deg)) || 0;
     const knee_mm = Math.abs(Number(data.knee_flexion_ext_mm)) || 0;

     // Score Knee Mechanics (25 points)
     let knee_score = 0;
     if (knee_deg >= -5 && knee_deg <= 5 && knee_mm <= 5) knee_score = 25;
     else if (knee_deg <= 10 && knee_mm <= 10) knee_score = 18;
     else if (knee_deg <= 15 && knee_mm <= 20) knee_score = 12;
     else knee_score = 4;

     lowerLimb_pts = knee_score;
     const lowerLimb_percent = (lowerLimb_pts * 100) / 25;

     // Generate story for Lower-Limb Mechanics
     const lowerLimb_story = generateLowerLimbStory(knee_deg, knee_mm, lowerLimb_percent);

     result.storyBlocks.lowerLimbMechanics = {
       score: lowerLimb_percent,
       points: lowerLimb_pts,
       maxPoints: 25,
       story: lowerLimb_story,
       metrics: {
         knee_deg: { value: knee_deg, score: knee_score },
         knee_mm: { value: knee_mm, score: knee_score }
       }
     };

     // Story Block 4: Global Symmetry & Load (25 points)
     let globalSymmetry_pts = 0;
     const misalignment_dev = Number(data.misalignment_deviation) || 0;
     const imbalance_dev = Number(data.imbalance_deviation) || 0;
     const msk_index = misalignment_dev + imbalance_dev;

     // Score Global Symmetry (25 points)
     let symmetry_score = 0;
     if (misalignment_dev <= 10 && imbalance_dev <= 10 && msk_index <= 20) symmetry_score = 25;
     else if (misalignment_dev <= 20 && imbalance_dev <= 20 && msk_index <= 40) symmetry_score = 18;
     else if (misalignment_dev <= 40 && imbalance_dev <= 40 && msk_index <= 60) symmetry_score = 12;
     else symmetry_score = 4;

     globalSymmetry_pts = symmetry_score;
     const globalSymmetry_percent = (globalSymmetry_pts * 100) / 25;

     // Generate story for Global Symmetry
     const globalSymmetry_story = generateGlobalSymmetryStory(misalignment_dev, imbalance_dev, msk_index, globalSymmetry_percent);

     result.storyBlocks.globalSymmetryLoad = {
       score: globalSymmetry_percent,
       points: globalSymmetry_pts,
       maxPoints: 25,
       story: globalSymmetry_story,
       metrics: {
         misalignment_deviation: { value: misalignment_dev, score: symmetry_score },
         imbalance_deviation: { value: imbalance_dev, score: symmetry_score },
         musculoskeletal_index: { value: msk_index, score: symmetry_score }
       }
     };

     // Calculate total score
     total_pts = headShoulder_pts + coreAlignment_pts + lowerLimb_pts + globalSymmetry_pts;
     const total_percent = (total_pts * 100) / 100;

     // Overall MSK Health Score
     result.bands.msk_health_score = { 
       ...mskHealthScoreColorBand(total_percent), 
       score: total_percent,
       storyBlocks: result.storyBlocks
     };
     result.radar = { musculoskeletal_objective: total_percent };
     result.bucket = { musculoskeletal_objective: total_percent };
     
     return result;
   }

     // Story generation functions
  function generateHeadShoulderStory(fhp_deg: number, fhp_mm: number, shoulder_deg: number, shoulder_mm: number, score: number): string {
    const status = score >= 80 ? '<span style="color: #10b981; font-weight: bold;">Optimal Zone</span>' : score >= 60 ? '<span style="color: #f59e0b; font-weight: bold;">Mild Strain</span>' : score >= 40 ? '<span style="color: #f97316; font-weight: bold;">Moderate Load</span>' : '<span style="color: #ef4444; font-weight: bold;">High Strain</span>';
    return `When your head drifts forward—even by a couple of centimetres—it acts like a bowling ball on a long lever. That extra pull makes your neck muscles work overtime and can tip one shoulder lower than the other, setting the stage for tension headaches and shoulder aches.\n\nYour Head & Shoulder Balance is in the ${status} range.`;
  }

  function generateCoreAlignmentStory(pelvic_deg: number, pelvic_mm: number, loss_of_height: number, score: number): string {
    const status = score >= 80 ? '<span style="color: #10b981; font-weight: bold;">Optimal Zone</span>' : score >= 60 ? '<span style="color: #f59e0b; font-weight: bold;">Mild Strain</span>' : score >= 40 ? '<span style="color: #f97316; font-weight: bold;">Moderate Load</span>' : '<span style="color: #ef4444; font-weight: bold;">High Strain</span>';
    return `Your pelvis is the foundation of your spine. If it tilts too far forward or backward, it changes the curve of your lower back and squeezes the discs between the vertebrae. Any measurable loss of standing height hints that those discs or joints are under pressure.\n\nYour Core Alignment is in the ${status} zone.`;
  }

  function generateLowerLimbStory(knee_deg: number, knee_mm: number, score: number): string {
    const status = score >= 80 ? '<span style="color: #10b981; font-weight: bold;">Optimal Zone</span>' : score >= 60 ? '<span style="color: #f59e0b; font-weight: bold;">Mild Strain</span>' : score >= 40 ? '<span style="color: #f97316; font-weight: bold;">Moderate Load</span>' : '<span style="color: #ef4444; font-weight: bold;">High Strain</span>';
    return `The angle of your knees and how far they shift front-to-back decide how forces travel up to the hips and down to the feet. Even small deviations can change the way you walk or squat and may lead to knee, hip, or ankle discomfort over time.\n\nYour Lower-Limb Mechanics is in the ${status} range.`;
  }

  function generateGlobalSymmetryStory(misalignment: number, imbalance: number, msk_index: number, score: number): string {
    const status = score >= 80 ? '<span style="color: #10b981; font-weight: bold;">Optimal Zone</span>' : score >= 60 ? '<span style="color: #f59e0b; font-weight: bold;">Mild Strain</span>' : score >= 40 ? '<span style="color: #f97316; font-weight: bold;">Moderate Load</span>' : '<span style="color: #ef4444; font-weight: bold;">High Strain</span>';
    return `This block looks at your whole-body balance score. It tells us whether weight and muscle effort are spreading evenly from head to toe or if one side or region is doing extra work, which can snowball into wear-and-tear elsewhere.\n\nYour Global Symmetry & Load is in the ${status} range.`;
  }
   
   /* ──────────────────────────────────────────────────────────────
      5. ROM Scorer
      ──────────────────────────────────────────────────────────── */
   export function scoreExBodyROM({ data }: { data: Record<string, any> }) {
     let total_pts = 0;
     const result: any = { bands: {} };

     // ROM reference ranges (same as in ROMTable.tsx)
     const ROM_REFERENCE_RANGES = {
       neck_flexion: { min: 45, max: null },
       neck_lateral_flexion: { min: 25, max: 45 },
       shoulder_abduction: { min: 170, max: 180 },
       shoulder_flexion: { min: 170, max: 180 },
       shoulder_extension: { min: 45, max: 60 },
       trunk_lateral_flexion: { min: 35, max: null },
       hip_abduction: { min: 40, max: null },
       hip_flexion: { min: 70, max: 80 },
       hip_extension: { min: 20, max: 30 }
     };

     // Function to get ROM tier and score (4-point scale: Green=4, Yellow=3, Orange=2, Red=1)
     function getROMScore(value: any, reference: { min: number; max: number | null }, hasPain: boolean): number {
       if (hasPain) return 1; // Red for pain regardless of ROM
       
       if (!value || value === 0) return 1; // Red for no data
       
       const numValue = typeof value === 'string' ? parseFloat(value) : value;
       
       if (reference.max) {
         // Range-based reference (e.g., 25-45°)
         const range = reference.max - reference.min;
         const percentage = Math.min(100, Math.max(0, ((numValue - reference.min) / range) * 100));
         
         if (percentage >= 90) return 4; // Green
         if (percentage >= 70) return 3; // Yellow
         return 2; // Orange
       } else {
         // Minimum-based reference (e.g., >45°)
         const percentage = Math.min(100, Math.max(0, (numValue / reference.min) * 100));
         
         if (percentage >= 90) return 4; // Green
         if (percentage >= 70) return 3; // Yellow
         return 2; // Orange
       }
     }

     // Score each ROM metric individually (17 total metrics)
     Object.entries(ROM_REFERENCE_RANGES).forEach(([metric, reference]) => {
       const leftValue = data[metric]?.left;
       const rightValue = data[metric]?.right;
       const leftPain = data[metric]?.leftPain || false;
       const rightPain = data[metric]?.rightPain || false;
       
       // Neck flexion only has left value
       const isNeckFlexion = metric === 'neck_flexion';
       
       let leftScore = getROMScore(leftValue, reference, leftPain);
       let rightScore = isNeckFlexion ? 0 : getROMScore(rightValue, reference, rightPain);
       
       // Store individual scores for each side
       if (isNeckFlexion) {
         // Neck flexion: only left side
         result.bands[`${metric}_left`] = { 
           ...bandColor(leftScore), 
           score: (leftScore * 100) / 4
         };
         total_pts += leftScore;
       } else {
         // All other movements: both left and right sides
         result.bands[`${metric}_left`] = { 
           ...bandColor(leftScore), 
           score: (leftScore * 100) / 4
         };
         result.bands[`${metric}_right`] = { 
           ...bandColor(rightScore), 
           score: (rightScore * 100) / 4
         };
         total_pts += leftScore + rightScore;
       }
       
       // Store combined metric score (average of left/right for display purposes)
       const combinedScore = isNeckFlexion ? leftScore : (leftScore + rightScore) / 2;
       result.bands[metric] = { 
         ...bandColor(Math.round(combinedScore)), 
         score: (combinedScore * 100) / 4,
         leftScore,
         rightScore: isNeckFlexion ? null : rightScore
       };
     });

     // Compute ROM Health Score as percentage of max points (68 total)
     const ROM_Health_Score = (total_pts * 100) / 68;
     result.bands.rom_health_score = { ...mskHealthScoreColorBand(ROM_Health_Score), score: ROM_Health_Score };
     result.radar = { articular_joint_objective: ROM_Health_Score };
     result.bucket = { articular_joint_objective: ROM_Health_Score };
     
     return result;
   }

   export function scoreArticularJointSystemStory(d: Record<string, any>) {
  // Calculate individual scores for each group
  const neckMobilityScore = calculateNeckMobilityScore(d);
  const upperBodyScore = calculateUpperBodyScore(d);
  const lowerBodyScore = calculateLowerBodyScore(d);
  
  // Calculate overall articular joint score (average of three groups)
  const overallScore = Math.round((neckMobilityScore.score + upperBodyScore.score + lowerBodyScore.score) / 3);
  
  return {
    overallScore,
    groups: [
      {
        name: 'Neck Mobility & Balance',
        score: neckMobilityScore.score,
        status: neckMobilityScore.status,
        statusColor: neckMobilityScore.statusColor,
        metrics: [
          { name: 'Neck Flexion', value: d.neck_flexion?.left || 0, unit: '°' },
          { name: 'Neck Lateral Flexion Left', value: d.neck_lateral_flexion?.left || 0, unit: '°' },
          { name: 'Neck Lateral Flexion Right', value: d.neck_lateral_flexion?.right || 0, unit: '°' }
        ],
        whyItMatters: `Free neck motion lets you check blind spots, hold head-up posture, and avoid tension headaches. Side-to-side symmetry keeps equal load on both shoulder girdles.\n\nYour Neck Mobility & Balance is in the <span style="color: ${neckMobilityScore.statusColor}; font-weight: bold;">${neckMobilityScore.status}</span> range.`
      },
      {
        name: 'Upper Body',
        score: upperBodyScore.score,
        status: upperBodyScore.status,
        statusColor: upperBodyScore.statusColor,
        metrics: [
          { name: 'Shoulder Abduction L', value: d.shoulder_abduction?.left || 0, unit: '°' },
          { name: 'Shoulder Abduction R', value: d.shoulder_abduction?.right || 0, unit: '°' },
          { name: 'Shoulder Flexion L', value: d.shoulder_flexion?.left || 0, unit: '°' },
          { name: 'Shoulder Flexion R', value: d.shoulder_flexion?.right || 0, unit: '°' },
          { name: 'Shoulder Extension L', value: d.shoulder_extension?.left || 0, unit: '°' },
          { name: 'Shoulder Extension R', value: d.shoulder_extension?.right || 0, unit: '°' },
          { name: 'Trunk Lateral Flexion L', value: d.trunk_lateral_flexion?.left || 0, unit: '°' },
          { name: 'Trunk Lateral Flexion R', value: d.trunk_lateral_flexion?.right || 0, unit: '°' }
        ],
        whyItMatters: `Shoulder and trunk range decide how comfortably you lift, push, and twist—everything from putting dishes away to backing out of a parking spot.\n\nYour upper body condition is in the <span style="color: ${upperBodyScore.statusColor}; font-weight: bold;">${upperBodyScore.status}</span> range.`
      },
      {
        name: 'Lower Body',
        score: lowerBodyScore.score,
        status: lowerBodyScore.status,
        statusColor: lowerBodyScore.statusColor,
        metrics: [
          { name: 'Hip Abduction L', value: d.hip_abduction?.left || 0, unit: '°' },
          { name: 'Hip Abduction R', value: d.hip_abduction?.right || 0, unit: '°' },
          { name: 'Hip Flexion L', value: d.hip_flexion?.left || 0, unit: '°' },
          { name: 'Hip Flexion R', value: d.hip_flexion?.right || 0, unit: '°' },
          { name: 'Hip Extension L', value: d.hip_extension?.left || 0, unit: '°' },
          { name: 'Hip Extension R', value: d.hip_extension?.right || 0, unit: '°' }
        ],
        whyItMatters: `Hips are the power hinges for walking, squatting, and protecting the lower back. Good flexion, extension, and side excursion keep stride length fluid and reduce lumbar strain.\n\nYour lower body condition is in the <span style="color: ${lowerBodyScore.statusColor}; font-weight: bold;">${lowerBodyScore.status}</span> range.`
      }
    ]
  };
}

function calculateNeckMobilityScore(d: Record<string, any>) {
  let totalScore = 0;
  let maxScore = 0;
  
  // ROM reference ranges
  const ROM_REFERENCE_RANGES = {
    neck_flexion: { min: 45, max: null },
    neck_lateral_flexion: { min: 25, max: 45 }
  };
  
  // Score neck flexion (single value)
  const neckFlexion = d.neck_flexion?.left || 0;
  const neckFlexionScore = getROMScore(neckFlexion, ROM_REFERENCE_RANGES.neck_flexion, d.neck_flexion?.leftPain || false);
  totalScore += neckFlexionScore;
  maxScore += 4;
  
  // Score neck lateral flexion (left and right)
  const neckLatFlexL = d.neck_lateral_flexion?.left || 0;
  const neckLatFlexR = d.neck_lateral_flexion?.right || 0;
  const neckLatFlexLScore = getROMScore(neckLatFlexL, ROM_REFERENCE_RANGES.neck_lateral_flexion, d.neck_lateral_flexion?.leftPain || false);
  const neckLatFlexRScore = getROMScore(neckLatFlexR, ROM_REFERENCE_RANGES.neck_lateral_flexion, d.neck_lateral_flexion?.rightPain || false);
  totalScore += neckLatFlexLScore + neckLatFlexRScore;
  maxScore += 8;
  
  const percentage = (totalScore / maxScore) * 100;
  const status = percentage >= 80 ? 'Optimal Zone' : percentage >= 60 ? 'Mild Strain' : percentage >= 40 ? 'Moderate Load' : 'High Strain';
  const statusColor = percentage >= 80 ? '#059669' : percentage >= 60 ? '#d97706' : percentage >= 40 ? '#ea580c' : '#dc2626';
  
  return { score: Math.round(percentage), status, statusColor };
}

function calculateUpperBodyScore(d: Record<string, any>) {
  let totalScore = 0;
  let maxScore = 0;
  
  // ROM reference ranges
  const ROM_REFERENCE_RANGES = {
    shoulder_abduction: { min: 170, max: 180 },
    shoulder_flexion: { min: 170, max: 180 },
    shoulder_extension: { min: 45, max: 60 },
    trunk_lateral_flexion: { min: 35, max: null }
  };
  
  // Score shoulder abduction (left and right)
  const shoulderAbdL = d.shoulder_abduction?.left || 0;
  const shoulderAbdR = d.shoulder_abduction?.right || 0;
  const shoulderAbdLScore = getROMScore(shoulderAbdL, ROM_REFERENCE_RANGES.shoulder_abduction, d.shoulder_abduction?.leftPain || false);
  const shoulderAbdRScore = getROMScore(shoulderAbdR, ROM_REFERENCE_RANGES.shoulder_abduction, d.shoulder_abduction?.rightPain || false);
  totalScore += shoulderAbdLScore + shoulderAbdRScore;
  maxScore += 8;
  
  // Score shoulder flexion (left and right)
  const shoulderFlexL = d.shoulder_flexion?.left || 0;
  const shoulderFlexR = d.shoulder_flexion?.right || 0;
  const shoulderFlexLScore = getROMScore(shoulderFlexL, ROM_REFERENCE_RANGES.shoulder_flexion, d.shoulder_flexion?.leftPain || false);
  const shoulderFlexRScore = getROMScore(shoulderFlexR, ROM_REFERENCE_RANGES.shoulder_flexion, d.shoulder_flexion?.rightPain || false);
  totalScore += shoulderFlexLScore + shoulderFlexRScore;
  maxScore += 8;
  
  // Score shoulder extension (left and right)
  const shoulderExtL = d.shoulder_extension?.left || 0;
  const shoulderExtR = d.shoulder_extension?.right || 0;
  const shoulderExtLScore = getROMScore(shoulderExtL, ROM_REFERENCE_RANGES.shoulder_extension, d.shoulder_extension?.leftPain || false);
  const shoulderExtRScore = getROMScore(shoulderExtR, ROM_REFERENCE_RANGES.shoulder_extension, d.shoulder_extension?.rightPain || false);
  totalScore += shoulderExtLScore + shoulderExtRScore;
  maxScore += 8;
  
  // Score trunk lateral flexion (left and right)
  const trunkLatFlexL = d.trunk_lateral_flexion?.left || 0;
  const trunkLatFlexR = d.trunk_lateral_flexion?.right || 0;
  const trunkLatFlexLScore = getROMScore(trunkLatFlexL, ROM_REFERENCE_RANGES.trunk_lateral_flexion, d.trunk_lateral_flexion?.leftPain || false);
  const trunkLatFlexRScore = getROMScore(trunkLatFlexR, ROM_REFERENCE_RANGES.trunk_lateral_flexion, d.trunk_lateral_flexion?.rightPain || false);
  totalScore += trunkLatFlexLScore + trunkLatFlexRScore;
  maxScore += 8;
  
  const percentage = (totalScore / maxScore) * 100;
  const status = percentage >= 80 ? 'Optimal Zone' : percentage >= 60 ? 'Mild Strain' : percentage >= 40 ? 'Moderate Load' : 'High Strain';
  const statusColor = percentage >= 80 ? '#059669' : percentage >= 60 ? '#d97706' : percentage >= 40 ? '#ea580c' : '#dc2626';
  
  return { score: Math.round(percentage), status, statusColor };
}

function calculateLowerBodyScore(d: Record<string, any>) {
  let totalScore = 0;
  let maxScore = 0;
  
  // ROM reference ranges
  const ROM_REFERENCE_RANGES = {
    hip_abduction: { min: 40, max: null },
    hip_flexion: { min: 70, max: 80 },
    hip_extension: { min: 20, max: 30 }
  };
  
  // Score hip abduction (left and right)
  const hipAbdL = d.hip_abduction?.left || 0;
  const hipAbdR = d.hip_abduction?.right || 0;
  const hipAbdLScore = getROMScore(hipAbdL, ROM_REFERENCE_RANGES.hip_abduction, d.hip_abduction?.leftPain || false);
  const hipAbdRScore = getROMScore(hipAbdR, ROM_REFERENCE_RANGES.hip_abduction, d.hip_abduction?.rightPain || false);
  totalScore += hipAbdLScore + hipAbdRScore;
  maxScore += 8;
  
  // Score hip flexion (left and right)
  const hipFlexL = d.hip_flexion?.left || 0;
  const hipFlexR = d.hip_flexion?.right || 0;
  const hipFlexLScore = getROMScore(hipFlexL, ROM_REFERENCE_RANGES.hip_flexion, d.hip_flexion?.leftPain || false);
  const hipFlexRScore = getROMScore(hipFlexR, ROM_REFERENCE_RANGES.hip_flexion, d.hip_flexion?.rightPain || false);
  totalScore += hipFlexLScore + hipFlexRScore;
  maxScore += 8;
  
  // Score hip extension (left and right)
  const hipExtL = d.hip_extension?.left || 0;
  const hipExtR = d.hip_extension?.right || 0;
  const hipExtLScore = getROMScore(hipExtL, ROM_REFERENCE_RANGES.hip_extension, d.hip_extension?.leftPain || false);
  const hipExtRScore = getROMScore(hipExtR, ROM_REFERENCE_RANGES.hip_extension, d.hip_extension?.rightPain || false);
  totalScore += hipExtLScore + hipExtRScore;
  maxScore += 8;
  
  const percentage = (totalScore / maxScore) * 100;
  const status = percentage >= 80 ? 'Optimal Zone' : percentage >= 60 ? 'Mild Strain' : percentage >= 40 ? 'Moderate Load' : 'High Strain';
  const statusColor = percentage >= 80 ? '#059669' : percentage >= 60 ? '#d97706' : percentage >= 40 ? '#ea580c' : '#dc2626';
  
  return { score: Math.round(percentage), status, statusColor };
}

// Helper function to get ROM score (4-point scale: Green=4, Yellow=3, Orange=2, Red=1)
function getROMScore(value: any, reference: { min: number; max: number | null }, hasPain: boolean): number {
  if (hasPain) return 1; // Red for pain regardless of ROM
  
  if (!value || value === 0) return 1; // Red for no data
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (reference.max) {
    // Range-based reference (e.g., 25-45°)
    const range = reference.max - reference.min;
    const percentage = Math.min(100, Math.max(0, ((numValue - reference.min) / range) * 100));
    
    if (percentage >= 90) return 4; // Green
    if (percentage >= 70) return 3; // Yellow
    return 2; // Orange
  } else {
    // Minimum-based reference (e.g., >45°)
    const percentage = Math.min(100, Math.max(0, (numValue / reference.min) * 100));
    
    if (percentage >= 90) return 4; // Green
    if (percentage >= 70) return 3; // Yellow
    return 2; // Orange
  }
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

// Main ExBody Posture & Musculoskeletal Analysis schema
export const exbodyMetricSchema: MetricSchema = {
  slug: 'exbody',
  title: 'ExBody Posture & Musculoskeletal Analysis',
  fields: [
    /* Musculoskeletal Deviation Chart */
    { name: 'loss_of_height_in', label: 'Loss of Height (inches)', widget: 'exbody-table' as const, tableType: 'deviation' },
    { name: 'misalignment_deviation', label: 'Misalignment Deviation', widget: 'exbody-table' as const, tableType: 'deviation' },
    { name: 'imbalance_deviation', label: 'Imbalance Deviation', widget: 'exbody-table' as const, tableType: 'deviation' },
    { name: 'musculoskeletal_index', label: 'Musculoskeletal Index', widget: 'exbody-table' as const, tableType: 'deviation' },

    /* Musculoskeletal Alignment Analysis */
    { name: 'shoulder_inclination_deg', label: 'Shoulder Inclination (degrees)', widget: 'exbody-table' as const, tableType: 'alignment' },
    { name: 'shoulder_inclination_mm', label: 'Shoulder Inclination (mm)', widget: 'exbody-table' as const, tableType: 'alignment' },
    { name: 'fhp_deg', label: 'Forward Head Posture (degrees)', widget: 'exbody-table' as const, tableType: 'alignment' },
    { name: 'fhp_mm', label: 'Forward Head Posture (mm)', widget: 'exbody-table' as const, tableType: 'alignment' },
    { name: 'pcmt_lb', label: 'Postural Correction Muscle Tension (lb)', widget: 'exbody-table' as const, tableType: 'alignment' },
    { name: 'pelvic_tilt_deg', label: 'Pelvic Tilt (degrees)', widget: 'exbody-table' as const, tableType: 'alignment' },
    { name: 'pelvic_tilt_mm', label: 'Pelvic Tilt (mm)', widget: 'exbody-table' as const, tableType: 'alignment' },
    { name: 'knee_flexion_ext_deg', label: 'Knee Flexion/Extension (degrees)', widget: 'exbody-table' as const, tableType: 'alignment' },
    { name: 'knee_flexion_ext_mm', label: 'Knee Flexion/Extension (mm)', widget: 'exbody-table' as const, tableType: 'alignment' },
  ]
};

// ExBody ROM (Articular Joint System) schema
export const exbodyROMMetricSchema: MetricSchema = {
  slug: 'exbody_rom',
  title: 'ExBody ROM (Articular Joint System)',
  fields: [
    /* Neck ROM Table */
    { name: 'neck_flexion', label: 'Neck Flexion', widget: 'rom-table' as const, romType: 'neck' },
    { name: 'neck_lateral_flexion', label: 'Neck Lateral Flexion', widget: 'rom-table' as const, romType: 'neck' },

    /* Shoulder ROM Table */
    { name: 'shoulder_abduction', label: 'Shoulder Abduction', widget: 'rom-table' as const, romType: 'shoulder' },
    { name: 'shoulder_flexion', label: 'Shoulder Flexion', widget: 'rom-table' as const, romType: 'shoulder' },
    { name: 'shoulder_extension', label: 'Shoulder Extension', widget: 'rom-table' as const, romType: 'shoulder' },

    /* Trunk ROM Table */
    { name: 'trunk_lateral_flexion', label: 'Trunk Lateral Flexion', widget: 'rom-table' as const, romType: 'trunk' },

    /* Hip ROM Table */
    { name: 'hip_abduction', label: 'Hip Abduction', widget: 'rom-table' as const, romType: 'hip' },
    { name: 'hip_flexion', label: 'Hip Flexion', widget: 'rom-table' as const, romType: 'hip' },
    { name: 'hip_extension', label: 'Hip Extension', widget: 'rom-table' as const, romType: 'hip' },
  ]
};