/* components/steps/HistoryStep.jsx
   ───────────────────────────────────────────── */
   import { useMemo } from 'react';

   /* ------------------------------------------------------------------ */
   /* 1 · SECTION BLUEPRINT – change text here, not in the JSX below     */
   /* ------------------------------------------------------------------ */
   const SECTIONS = [
     {
       id: 'heart',
       title: 'Do you currently have, or have you ever had, a heart or blood-vessel condition?',
       
       items: [
         ['heart',  'Heart disease / stent'],
         ['bp',     'High blood pressure'],
         ['clots',  'History of clots / stroke'],
         ['pacer',  'Pacemaker / ICD / heart-valve implant'],
       ],
     },
     {
       id: 'metabolic',
       title: 'Do you have, or have you ever had, a metabolic or hormone condition?',
       items: [
         ['diab1',     'Diabetes – type 1'],
         ['diab2',     'Diabetes – type 2'],
         ['prediab',   'Pre-diabetes'],
         ['hypo',      'Hypothyroidism / Hashimoto’s'],
         ['hyper',     'Hyperthyroidism / Graves’'],
         ['pcos',      'Endometriosis and/or PCOS'],
         ['hormone',   'Low testosterone / HRT / menopause support'],
         ['steroid',   'Long-term corticosteroid use (> 3 mo)'],
         ['metaOther', 'Other endocrine / hormone issue', /* ← free-text */ true],
       ],
     },
     {
       id: 'immune',
       title: 'Have you ever been diagnosed with an immune or auto-immune condition?',
       items: [
         ['ra',   'Rheumatoid arthritis'],
         ['sle',  'Systemic lupus'],
         ['psa',  'Psoriasis / psoriatic arthritis'],
         ['axspa','Ankylosing spondylitis / axial SpA'],
         ['ibd',  'Inflammatory bowel (Crohn’s / UC)'],
         ['celiac','Celiac disease'],
         ['ms',   'Multiple sclerosis'],
         ['sj',   'Sjögren’s syndrome'],
         ['immOther','Other auto-immune', true],
       ],
     },
     { id:'cancer',  title:'Have you ever been diagnosed with cancer?',  items:[['cancer','Type & year',true]] },
          
     {
       id:'surgery',
       title:'Have you had any major surgeries or implanted hardware?',
      items:[
         ['majorSx','Major surgery — Year',true],
         ['joint',  'Joint replacement / metal hardware'],
         ['spinal', 'Spinal fusion or disc implant'],
         ['device', 'Other implanted device — Type & year',true],
       ],
     },
     {
       id:'neuro',
       title: 'Do you have any neurological conditions or history?',
       
       items:[
         ['seizure','Seizure disorder'],
         ['neuroPathy', 'Neuropathy / nerve damage'],
         ['tbi',    'Concussion / TBI history'],
       ],
     },
     {
       id:'respRenal',
       title: 'Do you have any respiratory, kidney or liver conditions?',
       
       items:[
         ['asthma','Asthma / COPD'],
         ['ckd',   'Chronic kidney disease'],
         ['liver', 'Liver disease / hepatitis'],
       ],
     },
     {
       id:'blood',
       title:'Do you have any bleeding or clotting disorders?',
       
       items:[
         ['bleed',  'Bleeding / clotting disorder'],
         ['thinner','Currently on blood thinners'],
       ],
     },
     {
       id:'boneSkin',
       title: 'Do you have any bone density or skin sensitivity issues?',
      
       items:[
         ['osteo','Osteoporosis / osteopenia — Year',true],
         ['photoNerve','Photosensitive migraines / seizures'],
         ['photoSkin','Photosensitive skin condition'],
       ],
     },
     {
       id:'preg',
       title: 'Are you currently pregnant or post-partum?',
      
       items:[
         ['preg','Currently pregnant'],
         ['pp',  'Post-partum (< 6 months)'],
       ],
     },
   ];
   
   /* ------------------------------------------------------------------ */
   /* 2 · COMPONENT                                                      */
   /* ------------------------------------------------------------------ */
   export default function HistoryStep({ data, setVal }) {
     /* shorthand into the part of state this page owns */
     const hx = data.history;
   
     /* -------------------------------------------------- helpers ----- */
     const set = (k, v) => setVal(['history', k], v);
   
     /** yes / no radio    hx[<section id>] === true / false / undefined */
     const YesNo = ({ sid }) => (
       <div className="flex gap-6 mt-1 mb-2 text-sm">
         {['No', 'Yes'].map((lbl, i) => (
           <label key={lbl} className="flex items-center gap-1">
             <input
               type="radio"
               name={`hx-${sid}`}
               checked={hx[sid] === !!i}
               onChange={() => set(sid, !!i)}
             />
             {lbl}
           </label>
         ))}
       </div>
     );
   
     /** row with a checkbox (and optional free-text field) */
     const CheckRow = ({ k, label, free }) => (
       <>
         <label className="flex items-center gap-2 text-sm mb-1">
           <input
             type="checkbox"
             checked={!!hx[k]}
             onChange={() => set(k, !hx[k])}
           />
           {label}
         </label>
         {free && hx[k] && (
           <input
             className="border rounded w-full mb-2 p-1 text-sm"
             placeholder="Details / year"
             value={typeof hx[k] === 'string' ? hx[k] : ''}
             onChange={e => set(k, e.target.value)}
           />
         )}
       </>
     );
   
     /* build the UI once – useMemo so JSX isn’t rebuilt on every keystroke */
     const sections = useMemo(() => (
       SECTIONS.map(sec => (
         <div key={sec.id} className="mb-6">
           <h3 className="font-semibold">{sec.title}</h3>

           <p className="text-sm">{sec.question}</p>
   
           {/* yes / no choice */}
           <YesNo sid={sec.id} />
   
           {/* checklist appears only when “Yes” */}
           {hx[sec.id] && (
            <>
              {/* hint line */}
              <p className="text-xs text-gray-500 italic mb-1">
                (check all that apply)
              </p>

              {/* actual checklist */}
              <div className="pl-4 border-l space-y-1">
                {sec.items.map(([k, label, free]) => (
                  <CheckRow key={k} k={k} label={label} free={free} />
                ))}
              </div>
            </>
          )}
         </div>
       ))
     // eslint-disable-next-line react-hooks/exhaustive-deps
     ), [hx]);   //  ← rebuild only when history slice changes
   
     /* -------------------------------------------------- render ------ */
     return (
       <section className="space-y-6">
         <h2 className="text-lg font-medium">
           Health Background&nbsp;
                    </h2>
   
         {sections}
   
         {/* optional free-text notes */}
         <div className="mt-4">
           <label className="block text-sm mb-1">
             Anything else your MOCEAN team should know?{' '}
             <span className="text-xs">(optional)</span>
           </label>
           <textarea
             rows={2}
             className="border rounded w-full p-1 text-sm"
             value={hx.notes ?? ''}
             onChange={e => set('notes', e.target.value)}
           />
         </div>
       </section>
     );
   }