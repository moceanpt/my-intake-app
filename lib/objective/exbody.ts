/* lib/objective/exbody.ts
   -------------------------------------------------------------- */
   import { z } from 'zod';

   /* ──────────────────────────────────────────────────────────────
      1. shared templates
      ──────────────────────────────────────────────────────────── */
   const pair   = z.object({ L: z.boolean().default(false), R: z.boolean().default(false) });
   const single = z.boolean().default(false);
   
   /* ──────────────────────────────────────────────────────────────
      2. zod schema
      ──────────────────────────────────────────────────────────── */
      export const exBodySchema = z.object({
        shoulder: z.object({
          __optimal   : z.boolean().default(true),
          dropped     : pair,
          winging     : pair,
          rounded     : pair,
          pain_flex   : pair,
          pain_ext    : pair,
        }),
        elbow: z.object({
          __optimal   : z.boolean().default(true),
          pronation   : pair,
          supination  : pair,
          pain_flex   : pair,
        }).partial().default({}),
        spine: z.object({
          __optimal   : z.boolean().default(true),
          lossLordosis: single,
          flatBack    : single,
          kyphosis    : single,
          lordosis    : single,
          pain_flex   : single,
          pain_rot    : single,
        }),
        hip: z.object({
          __optimal : z.boolean().default(true),
          pelvicTilt: pair,
          pain_flex : pair,
          pain_ext  : pair,
        }),
        knee: z.object({
          __optimal : z.boolean().default(true),
          valgus    : pair,
          varus     : pair,
          hyperExt  : pair,
          pain_flex : pair,
        }),
        feet: z.object({
          __optimal : z.boolean().default(true),
          pronation : pair,
          supination: pair,
          pain_dpf  : pair,
          pain_inv  : pair,
        }),
      });
      export type ExBodyInput = z.infer<typeof exBodySchema>;
   
   /* ──────────────────────────────────────────────────────────────
      3. UI schema
      ──────────────────────────────────────────────────────────── */
      export const exBodyUI = {
        slug : 'exbodyArticular',
        title: 'ExBody – Articular-Joint',
      
        groups: [
          /* Shoulder ------------------------------------------------ */
          {
            title  : 'Shoulder',
            section: 'shoulder',
            fields : [
              { name: 'shoulder.dropped',   label: 'Dropped Shoulder',       widget: 'checkbox-LR' },
              { name: 'shoulder.winging',   label: 'Scapular Winging',       widget: 'checkbox-LR' },
              { name: 'shoulder.rounded',   label: 'Rounded Shoulder',       widget: 'checkbox-LR' },
              { name: 'shoulder.pain_flex', label: '(Pain) FLEX / ABD / ER', widget: 'checkbox-LR' },
              { name: 'shoulder.pain_ext',  label: '(Pain) EXT / ADD / IR',  widget: 'checkbox-LR' },
            ],
          },
      
          /* Elbow / Wrist (optional) -------------------------------- */
          {
            title  : 'Elbow / Wrist (optional)',
            section: 'elbow',
            fields : [
              { name: 'elbow.pronation',  label: 'Excessive Pronation',  widget: 'checkbox-LR' },
              { name: 'elbow.supination', label: 'Excessive Supination', widget: 'checkbox-LR' },
              { name: 'elbow.pain_flex',  label: '(Pain) Flexion / EXT', widget: 'checkbox-LR' },
            ],
          },
      
          /* Spine --------------------------------------------------- */
          {
            title  : 'Spine',
            section: 'spine',
            fields : [
              { name: 'spine.lossLordosis', label: 'Loss of C-Lordosis',   widget: 'checkbox-single' },
              { name: 'spine.flatBack',     label: 'Flat Back',            widget: 'checkbox-single' },
              { name: 'spine.kyphosis',     label: 'Excessive T-Kyphosis', widget: 'checkbox-single' },
              { name: 'spine.lordosis',     label: 'Excessive L-Lordosis', widget: 'checkbox-single' },
              { name: 'spine.pain_flex',    label: '(Pain) FLEX / EXT',    widget: 'checkbox-single' },
              { name: 'spine.pain_rot',     label: '(Pain) Rotation / SB', widget: 'checkbox-single' },
            ],
          },
      
          /* Pelvis / Hip ------------------------------------------- */
          {
            title  : 'Pelvis / Hip',
            section: 'hip',
            fields : [
              { name: 'hip.pelvicTilt', label: 'Pelvic Tilt (Ant)',       widget: 'checkbox-LR' },
              { name: 'hip.pain_flex',  label: '(Pain) FLEX / ABD / ER',  widget: 'checkbox-LR' },
              { name: 'hip.pain_ext',   label: '(Pain) EXT / ADD / IR',   widget: 'checkbox-LR' },
            ],
          },
      
          /* Knee ---------------------------------------------------- */
          {
            title  : 'Knee',
            section: 'knee',
            fields : [
              { name: 'knee.valgus',    label: 'Valgus',            widget: 'checkbox-LR' },
              { name: 'knee.varus',     label: 'Varus',             widget: 'checkbox-LR' },
              { name: 'knee.hyperExt',  label: 'Hyper Extension',   widget: 'checkbox-LR' },
              { name: 'knee.pain_flex', label: '(Pain) FLEX / EXT', widget: 'checkbox-LR' },
            ],
          },
      
          /* Feet ---------------------------------------------------- */
          {
            title  : 'Feet',
            section: 'feet',
            fields : [
              { name: 'feet.pronation',  label: 'Over Pronation',   widget: 'checkbox-LR' },
              { name: 'feet.supination', label: 'Over Supination',  widget: 'checkbox-LR' },
              { name: 'feet.pain_dpf',   label: '(Pain) DF / PF',   widget: 'checkbox-LR' },
              { name: 'feet.pain_inv',   label: '(Pain) Inv / Ev',  widget: 'checkbox-LR' },
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
   export function scoreExBody({ data }: { data: ExBodyInput }) {
     const pot = { shoulder: 2, spine: 2, hip: 2, knee: 2, feet: 2 };
   
     /* observation penalty (-0.5 region) */
     const nonNeutral = (v: unknown) => v !== 'NONE' && v !== false;
     (Object.keys(pot) as (keyof typeof pot)[]).forEach(r => {
       const region = (data as any)[r] as Record<string, any>;
       if (Object.values(region).some(nonNeutral)) pot[r] -= 0.5;
     });
   
     /* spine pain (-2) */
     if (data.spine.pain_flex || data.spine.pain_rot) pot.spine -= 2;
   
     /* limb pain L/R (-1 per side) */
     const limbRegions: (keyof typeof pot)[] = ['shoulder', 'hip', 'knee', 'feet'];
     limbRegions.forEach(r => {
       const region = (data as any)[r] as Record<string, lrEnum>;
       Object.entries(region).forEach(([k, v]) => {
         if (k.startsWith('pain') && (v === 'L' || v === 'R')) pot[r] -= 1;
       });
     });
   
     /* elbow pain subtracts 1 from shoulder */
     if (data.elbow?.pain_flex && data.elbow.pain_flex !== 'NONE') pot.shoulder -= 1;
   
     /* clamp & summarise */
     (Object.keys(pot) as (keyof typeof pot)[]).forEach(r => (pot[r] = Math.max(pot[r], 0)));
     const total = Object.values(pot).reduce((s, n) => s + n, 0);
   
     return {
       spokes : { articular: total * 10 },
       buckets: { ArticularJoint: 10 - total },
     };
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