/* components/steps/HealthCheckStep.jsx
   ------------------------------------ */
   import { Fragment } from 'react';
   import Chip from '../ui/Chip';

   export default function HealthCheckStep({ data, setVal, toggle }) {
     const hc      = data.hc;        // the chip arrays
     const notes   = data.hcNotes;   // per-section note strings
     const section = data.hcOpen;    // YES/NO “expand” flags
   
     /* — helpers — */
     const pick   = (cat, chip) => toggle(['hc', cat], chip);
     const open   = (cat) => (v) => setVal(['hcOpen', cat], v);
     const setNote = (cat) => (e) => setVal(['hcNotes', cat], e.target.value);
   
     
   
     /* wrapper with YES/NO toggle + chip grid + optional note */
     const Section = ({ cat, q, chips }) => {
       const isAny = hc[cat].length > 0;
   
       return (
         <div className="border rounded p-4 space-y-4">
           {/* YES / NO */}
           <label className="flex items-center gap-3">
             <input
               type="checkbox"
               checked={section[cat]}
               onChange={(e) => {
                 /* flip open flag */
                 open(cat)(e.target.checked);
                 /* clear chips + note if turned off */
                 if (!e.target.checked) {
                   setVal(['hc', cat], []);          // clear chips
                   setVal(['hcNotes', cat], '');      // clear note
                 }
               }}
             />
             <span className="font-medium">{q}</span>
           </label>
   
           {/* chips + note */}
           {section[cat] && (
             <Fragment>
               <div className="flex flex-wrap gap-2">
                 {chips.map((c) => (
                   <Chip
                     key={c}
                     label={c}
                     active={hc[cat].includes(c)}
                     onClick={() => pick(cat, c)}
                   />
                 ))}
               </div>
   
               {isAny && (
                 <textarea
                   rows={2}
                   className="w-full rounded border p-2 text-sm"
                   placeholder="Add note (optional)"
                   value={notes[cat]}
                   onChange={setNote(cat)}
                 />
               )}
             </Fragment>
           )}
         </div>
       );
     };
   
     /* ---------------------------------------------------- */
     return (
       <section className="space-y-6">
         <h2 className="text-lg font-medium mb-2">5. MOCEAN Health Check</h2>
   
         {/* 1 ― Digestive & Detox */}
         <Section
           cat="digestive"
           q="Do you regularly (3 + days / wk) feel bloated, gassy, get heartburn, or have bathroom issues?"
           chips={[
             'Bloating / Gas',
             'Heartburn / Reflux',
             'Constipation or Diarrhea',
             'Food sensitivities (incl. sugar-carb cravings)',
             'Greasy stools or Nausea',
             'Fatigue right after meals',
             'Liver / skin changes',
             'Chemical or alcohol sensitivity',
             'Frequent antibiotics / chronic sinus-yeast',
             'Metabolic flags',
           ]}
         />
   
         {/* 2 ― Sleep & Recovery */}
         <Section
           cat="sleep"
           q="Do you wake up unrefreshed or find your sleep broken on most nights?"
           chips={[
             'Trouble falling asleep / Busy mind',
             'Wake up during the night (1–4 am)',
             'Snoring / possible sleep-apnea',
             'Night sweats / Hot flashes',
             'Need caffeine in the morning',
             'Morning headaches / daytime drowsiness',
           ]}
         />
   
         {/* 3 ― Circulatory, Lymph & Skin */}
         <Section
           cat="circ"
           q="Do you notice cold hands or feet, swelling, or recurring skin flare-ups?"
           chips={[
             'Cold / Numb hands-feet',
             'Varicose veins or leg cramps',
             'Swelling / Puffiness',
             'Skin issues',
             'Slow healing or easy bruising',
             'Inflammatory / Auto-immune joint pain',
             'Hair thinning / Goitre',
             'High CRP (lab)',
           ]}
         />
   
         {/* 4 ― Cognitive & Emotional */}
         <Section
           cat="cog"
           q="Do you struggle with brain-fog, mood swings, anxiety, or staying focused?"
           chips={[
             'Brain-fog / Memory lapses',
             'Trouble focusing / Easily distracted',
             'Anxiety, low mood, or irritability',
             'Stress body signs',
             'Heavy screen time / High caffeine',
             'Concussion / Head injury history',
           ]}
         />
   
         {/* 5 ― Energy & Physical Vitality */}
         <Section
           cat="energy"
           q="Do you feel persistently tired or find it hard to keep your energy up?"
           chips={[
             'Persistent fatigue / Energy crashes',
             'Muscle weakness / Poor tolerance',
             'Overheating easily',
             'CFS / Fibro / Post-infection',
             'Low morning drive / Low libido',
             'Body-composition change',
             'Cold intolerance',
             'Family history of neuro-degenerative disease',
           ]}
         />
       </section>
     );
   }