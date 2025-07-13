/* components/steps/LifestyleStep.jsx
   – mini-wizard: one pillar (≈ 5–7 Qs) per slide – */

   import { useState, useMemo } from 'react';
   import Card from '@/components/ui/Card';
   import ChipSingle            from '../ui/ChipSingle';
   import questionSchema        from '../questions/questionSchema';
   
   /* 1 ▸ pillar order + friendly names */
   const PILLAR_KEYS = [
     'move',
    'rest',
    'hydrate',
    'nourish',
    'stress',
    'restore',
   ];
   
   const PILLAR_LABEL = {
    move:    'Move',
    rest:    'Work & Rest',
    hydrate: 'Hydration & Boosters',
    nourish:'Nourishment',
    stress:  'Stress & Mind-Body',
    restore:'Recovery & Self-Care',
   };
   
   /* ────────────────────────────────────────────────────────────── */
   export default function LifestyleStep({ data, setVal, toggle, onComplete }) {
     const lf               = data.life;                  // shortcut to form state
     const [pillarIndex, setPillarIndex] = useState(0);   // which pillar slide?
   
     /* ----- derive a SAFE pillar + question list ---------------- */
     const pillarKeys = useMemo(
       () => PILLAR_KEYS.filter((k) => Array.isArray(questionSchema.lifestyle[k])),
       []
     );
   
     const safeIndex  = Math.min(pillarIndex, pillarKeys.length - 1);
     const key        = pillarKeys[safeIndex];
     const questions  = questionSchema.lifestyle[key] ?? [];
   
     /* guard-rail: if something is really wrong, bail early */
     if (questions.length === 0) {
       return (
         <Card>
           <Card.Body>
             <p className="text-red-600">⚠️ Lifestyle questions for “{key}” not found.</p>
           </Card.Body>
         </Card>
       );
     }
   
     /* ----- state updaters (unchanged) -------------------------- */
     const pick = (field, value) => toggle(['life', field], value);
     const set  = (field, value) => setVal(['life', field], value);
   

   
     /* ----- UI -------------------------------------------------- */
     return (
       <Card>
         <Card.Header>
           <div className="flex items-center justify-between">
             <h2 className="text-2xl font-semibold text-secondary-900 mb-1">Lifestyle Profile</h2>
             <span className="text-secondary-500 text-sm">({PILLAR_LABEL[key]} {safeIndex + 1}/{pillarKeys.length})</span>
           </div>
           {/* mini progress bar */}
           <div className="h-2 bg-secondary-200 rounded mt-2">
             <div
               className="h-2 bg-primary-600 rounded transition-all"
               style={{ width: `${((safeIndex + 1) / pillarKeys.length) * 100}%` }}
             />
           </div>
         </Card.Header>
         <Card.Body>
           <div className="space-y-6">
             {questions.map((q) => (
               <div
                 key={q.id}
                 className="pt-4 mt-4 border-t first:border-none first:pt-0 first:mt-0"
               >
                 <p className="text-sm font-medium mb-2">{q.prompt}</p>

                 {/* multi-choice chips */}
                 {q.type === 'multi' && (
                   <div className="flex flex-wrap gap-2">
                     {q.options.map((opt) => (
                       <button
                         key={opt}
                         type="button"
                         onClick={() => pick(q.id, opt)}
                         className={[
                           'chip',
                           lf[q.id]?.includes(opt) ? 'selected' : '',
                         ].join(' ')}
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                 )}

                 {/* single-select → ChipSingle pills */}
                 {q.type === 'single' && (
                   <ChipSingle
                     options={q.options}
                     value={lf[q.id] ?? ''}
                     onChange={(opt) => set(q.id, opt)}
                   />
                 )}

                 {/* numeric input */}
                 {q.type === 'input' && (
                   <input
                     type="number"
                     min="0"
                     max="10"
                     className="form-input w-24 text-sm"
                     value={lf[q.id] ?? ''}
                     onChange={(e) => set(q.id, e.target.value)}
                   />
                 )}
               </div>
             ))}
           </div>

           {/* pillar navigation */}
           <div className="flex justify-between mt-8">
             {/* « Prev » (only when not on the first pillar) */}
             {safeIndex > 0 && (
               <button
                 className="btn btn-secondary w-24"
                 onClick={() => setPillarIndex((i) => i - 1)}
               >
                 ‹ Prev
               </button>
             )}

             {/* Next / Continue logic */}
             {safeIndex < pillarKeys.length - 1 ? (
               <button
                 className="btn btn-primary w-24 ml-auto"
                 onClick={() => setPillarIndex((i) => i + 1)}
               >
                 Next ›
               </button>
             ) : onComplete ? (
               <button
                 className="btn btn-success w-32 ml-auto"
                 onClick={onComplete}
               >
                 Continue ›
               </button>
             ) : (
               <p className="text-sm text-secondary-500 ml-auto">
                 All lifestyle pillars done – use the <b>Next</b> button below.
               </p>
             )}
           </div>
         </Card.Body>
       </Card>
     );
   }