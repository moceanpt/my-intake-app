/* components/steps/HistoryStep.jsx
   ───────────────────────────────────────────── */
   import { useMemo } from 'react';
   import Card from '@/components/ui/Card';

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
         ['hypo',      'Hypothyroidism / Hashimoto\'s'],
         ['hyper',     'Hyperthyroidism / Graves\''],
         ['pcos',      'Endometriosis and/or PCOS'],
         ['hormone',   'Low testosterone / HRT / menopause support'],
         ['steroid',   'Long-term corticosteroid use (> 3 mo)'],
         ['metaOther', 'Other endocrine / hormone issue'],
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
         ['ibd',  'Inflammatory bowel (Crohn\'s / UC)'],
         ['celiac','Celiac disease'],
         ['ms',   'Multiple sclerosis'],
         ['sj',   'Sjögren\'s syndrome'],
         ['immOther','Other auto-immune'],
       ],
     },
     { id:'cancer',  title:'Have you ever been diagnosed with cancer?' },
          
     {
       id:'surgery',
       title:'Have you had any major surgeries or implanted hardware?',
      items:[
         ['majorSx','Major surgery'],
         ['joint',  'Joint replacement / metal hardware'],
         ['spinal', 'Spinal fusion or disc implant'],
         ['device', 'Other'],
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
         ['osteo','Osteoporosis / osteopenia'],
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
           <label key={lbl} className="flex items-center gap-2">
             <input
               type="radio"
               name={`hx-${sid}`}
               checked={hx[sid] === !!i}
               onChange={() => set(sid, !!i)}
               className="form-input"
             />
             {lbl}
           </label>
         ))}
       </div>
     );
   
     /** row with a checkbox (and optional free-text field) */
     const CheckRow = ({ k, label, free }) => (
       <div className="flex flex-col gap-1 mb-1">
         <label className="flex items-center gap-2 text-sm">
           <input
             type="checkbox"
             checked={!!hx[k]}
             onChange={() => set(k, !hx[k])}
             className="form-input"
           />
           {label}
         </label>
         {free && hx[k] && (
           <input
             className="form-input w-full"
             placeholder="Details / year"
             value={typeof hx[k] === 'string' ? hx[k] : ''}
             onChange={e => set(k, e.target.value)}
           />
         )}
       </div>
     );
   
     /* build the UI once – useMemo so JSX isn't rebuilt on every keystroke */
     const sections = useMemo(() => (
       SECTIONS.map(sec => (
         <Card key={sec.id} className="mb-6">
           <Card.Header>
             <h3 className="text-xl font-semibold text-secondary-900">{sec.title}</h3>
           </Card.Header>
           <Card.Body>
             <YesNo sid={sec.id} />
             {hx[sec.id] && (
               <>
                 <p className="text-xs text-secondary-500 italic mb-1">(check all that apply)</p>
                 <div className="pl-4 border-l space-y-1">
                   {(sec.items || []).map(([k, label]) => (
                     <CheckRow key={k} k={k} label={label} />
                   ))}
                 </div>
               </>
             )}
           </Card.Body>
         </Card>
       ))
     // eslint-disable-next-line react-hooks/exhaustive-deps
     ), [hx]);   //  ← rebuild only when history slice changes
   
     /* -------------------------------------------------- render ------ */
     return (
       <div className="space-y-6">
         <Card>
           <Card.Header>
             <h2 className="text-2xl font-semibold text-secondary-900">Health Background</h2>
           </Card.Header>
           <Card.Body>
             <div className="space-y-6">{sections}</div>
             <div className="mt-6">
               <label className="form-label">
                 Anything else your MOCEAN team should know? <span className="text-xs">(optional)</span>
               </label>
               <textarea
                 rows={2}
                 className="form-input w-full"
                 value={hx.notes ?? ''}
                 onChange={e => set('notes', e.target.value)}
               />
             </div>
           </Card.Body>
         </Card>
       </div>
     );
   }