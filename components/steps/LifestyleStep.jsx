/* components/steps/LifestyleStep.jsx
   ---------------------------------- */
   import { Fragment } from 'react';
   import Chip from '../ui/Chip';

  
   
   /* tiny helper for single-choice dropdowns ----------------------- */
   const SelectField = ({ value, onChange, opts }) => (
     <select
       className="border rounded p-1 text-sm w-full max-w-xs"
       value={value}
       onChange={(e) => onChange(e.target.value)}
     >
       {opts.map(([val, lbl]) => (
         <option key={val} value={val}>{lbl}</option>
       ))}
     </select>
   );
   
   /* ─────────────────────────────────────────────────────────────── */
   export default function LifestyleStep({ data, setVal, toggle }) {
     const lf   = data.life;
     const pick = (k, v)    => setVal(['life', k], v);
     const flip = (k, chip) => toggle(['life', k], chip);
     const input = (k) => ({
       value: lf[k] ?? '',
       onChange: (e) => pick(k, e.target.value),
     });
   
     /* chip lists --------------------------------------------------- */
     const moveTypes   = ['Strength / weights', 'Cardio / HIIT', 'Yoga / Pilates',
                          'Mobility / Stretch', 'Sports / Outdoor play', 'Easy walking'];
     const unwindOpts  = ['Stretch / breathwork', 'Quiet time / prayer / meditation',
                          'Friends & family', 'Nature / walks', 'Screen time'];
     const dietChips   = ['Plant-based', 'Gluten-free', 'Low-carb / Keto', 'Intermittent fasting'];
     const stressReset = ['Breathwork / meditation', 'Journaling / prayer', 'Exercise',
                          'Time in nature', 'Creative outlet (music, art)', 'Still figuring this out'];
     const recoveryChips = ['Sauna', 'Cold plunge', 'Massage / bodywork', 'Foam rolling',
                            'Wearable tech (HRV, WHOOP, Apple Watch)', 'None yet — curious to learn'];
   
     /* ------------------------------------------------------------- */
     return (
       <section className="space-y-8">
         <h2 className="text-lg font-medium">Daily Rhythm &amp; Fuel</h2>
   
         {/* 1 ─ Move -------------------------------------------------- */}
         <div className="space-y-5">
           <h3 className="font-semibold">1&nbsp;·&nbsp;Move</h3>
   
           {/* ─── How often ─── */}
           <div>
             <p className="text-sm mb-1">How often do you get intentional movement?</p>
             <SelectField
               value={lf.moveDays}
               onChange={(v) => pick('moveDays', v)}
               opts={[
                 ['0-1', '0–1 day/wk'],
                 ['2-3', '2–3 days'],
                 ['4+',  '4 days +'],
               ]}
             />
           </div>
   
           {/* ─── Length ─── */}
           <div>
             <p className="text-sm mb-1">Typical session length</p>
             <SelectField
               value={lf.moveLen}
               onChange={(v) => pick('moveLen', v)}
               opts={[
                 ['<20',  '< 20 min'],
                 ['20-40','20–40 min'],
                 ['40-60','40–60 min'],
                 ['>60',  '> 60 min'],
               ]}
             />
           </div>
   
           {/* ─── Favourite ways (chips) ─── */}
           <div>
             <p className="text-sm mb-1">
               Favorite ways to move <span className="text-xs text-gray-500">(check any)</span>
             </p>
             <div className="flex flex-wrap gap-2">
               {moveTypes.map((c) => (
                 <Chip key={c} label={c}
                   active={lf.moveTypes.includes(c)}
                   onClick={() => flip('moveTypes', c)}
                 />
               ))}
             </div>
   
             {lf.moveTypes.includes('Other') && (
               <input
                 {...input('otherMove')}
                 className="border rounded w-full p-1 text-sm mt-2"
                 placeholder="Other movement type"
               />
             )}
           </div>
         </div>
   
         {/* 2 ─ Work & Rest ------------------------------------------ */}
         <div className="space-y-5">
           <h3 className="font-semibold">2&nbsp;·&nbsp;Work &amp; Rest</h3>
   
           <div>
             <p className="text-sm mb-1">Work rhythm</p>
             <SelectField
               value={lf.work}
               onChange={(v) => pick('work', v)}
               opts={[
                 ['desk',  'Mostly seated'],
                 ['mix',   'Mix sitting & moving'],
                 ['active','On my feet / active'],
                 ['shift', 'Rotating / night shifts'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Typical night’s sleep</p>
             <SelectField
               value={lf.sleep}
               onChange={(v) => pick('sleep', v)}
               opts={[
                 ['<5', '< 5 h'],
                 ['5-7','5–7 h'],
                 ['7-9','7–9 h'],
                 ['>9','> 9 h'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Bedtime screen use (within 60 min)</p>
             <SelectField
               value={lf.screen}
               onChange={(v) => pick('screen', v)}
               opts={[
                 ['nightly','Nearly every night'],
                 ['some',   'A few nights/wk'],
                 ['rare',   'Rarely / never'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">
               How do you usually unwind? <span className="text-xs">(check any)</span>
             </p>
             <div className="flex flex-wrap gap-2">
               {unwindOpts.map((c) => (
                 <Chip key={c} label={c}
                   active={lf.unwind.includes(c)}
                   onClick={() => flip('unwind', c)}
                 />
               ))}
             </div>
   
             {lf.unwind.includes('Other') && (
               <input
                 {...input('otherUnwind')}
                 className="border rounded w-full p-1 text-sm mt-2"
                 placeholder="Other way you unwind"
               />
             )}
           </div>
         </div>
   
         {/* 3 ─ Hydration & Boosters --------------------------------- */}
         <div className="space-y-5">
           <h3 className="font-semibold">3&nbsp;·&nbsp;Hydration &amp; Boosters</h3>
   
           <div>
             <p className="text-sm mb-1">Plain-water habit (8 oz glasses / day)</p>
             <input
               {...input('water')}
               className="border rounded w-24 p-1 text-sm"
               placeholder="e.g., 6"
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Coffee / tea per day</p>
             <SelectField
               value={lf.caf}
               onChange={(v) => pick('caf', v)}
               opts={[
                 ['0','0'],
                 ['1','1'],
                 ['2-3','2–3'],
                 ['4+','4 +'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Energy drinks / soda</p>
             <SelectField
               value={lf.soda}
               onChange={(v) => pick('soda', v)}
               opts={[
                 ['none','None'],
                 ['1',   '≤ 1 can/wk'],
                 ['2-4', '2–4/wk'],
                 ['daily','Daily'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Alcohol</p>
             <SelectField
               value={lf.alc}
               onChange={(v) => pick('alc', v)}
               opts={[
                 ['never','Never'],
                 ['occas','Occasionally (≤ 3/wk)'],
                 ['regular','Regular (4–7/wk)'],
                 ['daily','Daily'],
               ]}
             />
           </div>
         </div>
   
         {/* 4 ─ Nourishment ----------------------------------------- */}
         <div className="space-y-5">
           <h3 className="font-semibold">4&nbsp;·&nbsp;Nourishment</h3>
   
           <div>
             <p className="text-sm mb-1">Meals &amp; snacks on a typical day</p>
             <SelectField
               value={lf.meals}
               onChange={(v) => pick('meals', v)}
               opts={[
                 ['1-2','1–2 larger meals'],
                 ['3',  '3 balanced meals'],
                 ['4-5','4–5 mini-meals / grazing'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Fruits &amp; veggies actually eaten</p>
             <SelectField
               value={lf.produce}
               onChange={(v) => pick('produce', v)}
               opts={[
                 ['0-1','0–1'],
                 ['2-3','2–3'],
                 ['4+','4 +'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Protein with most meals?</p>
             <SelectField
               value={lf.protein}
               onChange={(v) => pick('protein', v)}
               opts={[
                 ['rare','Rarely'],
                 ['some','Sometimes'],
                 ['most','Almost every meal'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Sugary drinks / desserts</p>
             <SelectField
               value={lf.sugar}
               onChange={(v) => pick('sugar', v)}
               opts={[
                 ['never','Almost never'],
                 ['few',  'Few times/wk'],
                 ['daily','Daily or more'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Eat-out vs. cook-in ratio</p>
             <SelectField
               value={lf.cookRatio}
               onChange={(v) => pick('cookRatio', v)}
               opts={[
                 ['cook','Mostly home-cooked'],
                 ['half','About half & half'],
                 ['out', 'Mostly take-out / restaurant'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">
               Evening eating — last meal usually finished by
             </p>
             <input
               {...input('lastMeal')}
               className="border rounded w-20 p-1 text-sm"
               placeholder="e.g., 8:30"
             />
             <span className="text-sm">&nbsp;pm</span>
           </div>
   
           <div>
             <p className="text-sm mb-1">
               Do you follow any particular approach? <span className="text-xs">(check any)</span>
             </p>
             <div className="flex flex-wrap gap-2">
               {dietChips.map((c) => (
                 <Chip key={c} label={c}
                   active={lf.dietApproach.includes(c)}
                   onClick={() => flip('dietApproach', c)}
                 />
               ))}
             </div>
   
             {lf.dietApproach.includes('Other') && (
               <input
                 {...input('otherApproach')}
                 className="border rounded w-full p-1 text-sm mt-2"
                 placeholder="Other approach"
               />
             )}
           </div>
   
           <div>
             <p className="text-sm mb-1">When stressed, I tend to…</p>
             <SelectField
               value={lf.stressEat}
               onChange={(v) => pick('stressEat', v)}
               opts={[
                 ['lose','Lose appetite'],
                 ['snack','Snack / comfort-eat'],
                 ['same','Stay about the same'],
               ]}
             />
           </div>
   
           <div>
             <p className="text-sm mb-1">Supplements you take regularly</p>
             <textarea
               {...input('supp')}
               rows={2}
               className="w-full rounded border p-2 text-sm"
             />
           </div>
         </div>
   
         {/* 5 ─ Stress & Mind-Body ----------------------------------- */}
         <div className="space-y-5">
           <h3 className="font-semibold">5&nbsp;·&nbsp;Stress &amp; Mind-Body Habits</h3>
   
           <p className="text-sm mb-1">
             When stress shows up, what helps you reset? <span className="text-xs">(check all)</span>
           </p>
           <div className="flex flex-wrap gap-2">
             {stressReset.map((c) => (
               <Chip key={c} label={c}
                 active={lf.stressReset.includes(c)}
                 onClick={() => flip('stressReset', c)}
               />
             ))}
           </div>
   
           
         </div>
   
         {/* 6 ─ Recovery & Self-Care --------------------------------- */}
         <div className="space-y-5">
           <h3 className="font-semibold">6&nbsp;·&nbsp;Recovery &amp; Self-Care</h3>
   
           <p className="text-sm mb-1">
             Which recovery tools do you already use? <span className="text-xs">(check any)</span>
           </p>
           <div className="flex flex-wrap gap-2">
             {recoveryChips.map((c) => (
               <Chip key={c} label={c}
                 active={lf.recovery.includes(c)}
                 onClick={() => flip('recovery', c)}
               />
             ))}
           </div>
         </div>
   
         <p className="text-sm text-gray-500 pt-4">
           Thank you! Your answers help us tailor a plan that fits your real life and moves you toward lasting balance.
         </p>
       </section>
     );
   }