/* components/steps/LifestyleStep.jsx
   – mini-wizard: one pillar (≈ 5–7 Qs) per slide – */

   import { useState, useMemo } from 'react';
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
     move:              'Move',
     work_rest:         'Work & Rest',
     hydration:         'Hydration & Boosters',
     nourishment:       'Nourishment',
     stress_mind_body:  'Stress & Mind-Body',
     recovery_selfcare: 'Recovery & Self-Care',
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
         <section className="p-4 text-red-600">
           <p>⚠️ Lifestyle questions for “{key}” not found.</p>
         </section>
       );
     }
   
     /* ----- state updaters (unchanged) -------------------------- */
     const pick = (field, value) => toggle(['life', field], value);
     const set  = (field, value) => setVal(['life', field], value);
   
     /* ----- tiny <select> factory ------------------------------- */
     const Select = ({ opts, value, onChange }) => (
       <select
         className="border rounded w-full max-w-xs text-sm"
         value={value}
         onChange={(e) => onChange(e.target.value)}
       >
         <option value="">— select —</option>
         {opts.map((opt) =>
           typeof opt === 'string' ? (
             <option key={opt} value={opt}>{opt}</option>
           ) : (
             <option key={opt[0]} value={opt[0]}>{opt[1]}</option>
           )
         )}
       </select>
     );
   
     /* ----- UI -------------------------------------------------- */
     return (
       <section className="space-y-6">
         {/* mini progress bar */}
         <div className="h-2 bg-gray-200 rounded">
           <div
             className="h-2 bg-blue-600 rounded transition-all"
             style={{ width: `${((safeIndex + 1) / pillarKeys.length) * 100}%` }}
           />
         </div>
   
         <h2 className="text-lg font-medium">
           6 · Lifestyle Profile&nbsp;
           <span className="text-gray-500 text-sm">
             ({PILLAR_LABEL[key]} {safeIndex + 1}/{pillarKeys.length})
           </span>
         </h2>
   
         {/* current pillar card */}
         <div className="border rounded p-4 space-y-4">
           {questions.map((q) => (
             <div key={q.id}>
               <p className="text-sm font-medium mb-1">{q.prompt}</p>
   
               {/* multi-choice chips */}
               {q.type === 'multi' && (
                 <div className="flex flex-wrap gap-2">
                   {q.options.map((opt) => (
                     <button
                       key={opt}
                       type="button"
                       onClick={() => pick(q.id, opt)}
                       className={[
                         'px-3 py-1 rounded-full text-sm border transition',
                         lf[q.id]?.includes(opt)
                           ? 'bg-blue-600 text-white border-blue-600'
                           : '',
                       ].join(' ')}
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
               )}
   
               {/* single-select */}
               {q.type === 'single' && (
                 <Select
                   opts={q.options}
                   value={lf[q.id] ?? ''}
                   onChange={(v) => set(q.id, v)}
                 />
               )}
   
               {/* numeric input (e.g. stress scale) */}
               {q.type === 'input' && (
                 <input
                   type="number"
                   min="0"
                   max="10"
                   className="border rounded w-20 text-sm p-1"
                   value={lf[q.id] ?? ''}
                   onChange={(e) => set(q.id, e.target.value)}
                 />
               )}
             </div>
           ))}
         </div>
   
        {/* ── pillar navigation ───────────────────────────────────────────── */}
        <div className="flex justify-between mt-4">
          {/* « Prev » (only when not on the first pillar) */}
          {safeIndex > 0 && (
            <button
              className="w-24 px-3 py-2 bg-gray-200 rounded"
              onClick={() => setPillarIndex((i) => i - 1)}
            >
              ‹ Prev
            </button>
          )}

          {/* Next / Continue logic */}
          {safeIndex < pillarKeys.length - 1 ? (
            /* normal in-card “Next ›” */
            <button
              className="w-24 px-3 py-2 bg-blue-600 text-white rounded"
              onClick={() => setPillarIndex((i) => i + 1)}
            >
              Next ›
            </button>
          ) : onComplete ? (
            /* final pillar – surface “Continue ›” that bubbles up */
            <button
              className="w-32 px-3 py-2 bg-green-600 text-white rounded"
              onClick={onComplete}
            >
              Continue ›
            </button>
          ) : (
            /* fallback message if no onComplete handler was supplied */
            <p className="text-sm text-gray-500">
              All lifestyle pillars done – use the <b>Next</b> button below.
            </p>
          )}
        </div>
        </section>
    );
}