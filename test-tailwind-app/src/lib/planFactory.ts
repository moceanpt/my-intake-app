/* -------------------------------------------------------
   lib/planFactory.ts   ⟨only ~30 lines⟩
   ------------------------------------------------------- */
   import { generatePlan } from '@/lib/generatePlan';
   import type { Pillar }  from './score';
   
   /* ---------- PREVIEW  (subjective-only) ---------------- */
   export function buildPreview({
     hc,
     hcSlider,
     life            // can be {} if lifeOptIn === false
   }: {
     hc        : Record<Pillar,string[]>;
     hcSlider  : Record<Pillar,{ main:number }>;
     life      : Record<string,any>;
   }) {
     return generatePlan({
       hc,
       hcSlider,
       life,
       /* no objective metrics yet */
     });
   }
   
   /* ---------- FINAL  (subjective + objective) ---------- */
   export function buildFinal({
     hc, hcSlider, life, metrics
   }: {
     hc        : Record<Pillar,string[]>;
     hcSlider  : Record<Pillar,{ main:number }>;
     life      : Record<string,any>;
     metrics   : Record<string,number>;
   }) {
     return generatePlan({
       hc,
       hcSlider,
       life,
       metrics,
     });
   }