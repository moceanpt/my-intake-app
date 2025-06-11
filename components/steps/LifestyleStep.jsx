/* components/steps/LifestyleStep.jsx
   ---------------------------------- */
   import { Fragment } from 'react';
   import Chip from '../ui/Chip';
   
   /* tiny styled radio-row helper (still handy for 2-4 choices) */
   const RadioRow = ({ value, set, name, opts }) => (
     <div className="space-y-2">
       {opts.map(([val, lbl]) => (
         <label key={val} className="flex items-center gap-2 text-sm">
           <input
             type="radio"
             name={name}
             checked={value === val}
             onChange={() => set(val)}
           />
           {lbl}
         </label>
       ))}
     </div>
   );
   
   export default function LifestyleStep({ data, setVal, toggle }) {
     const lf = data.life;
   
     /* shortcuts ------------------------------------------------ */
     const pick = (k, v) => setVal(['life', k], v);
     const multi = (k, chip) => toggle(['life', k], chip);
     const txt = (k) => ({
       value: lf[k] ?? '',
       onChange: (e) => pick(k, e.target.value),
     });
   
     /* chip lists ---------------------------------------------- */
     const moveChips   = ['Strength / weights', 'Cardio / HIIT', 'Yoga / Pilates',
                          'Mobility / stretch', 'Sports / outdoor play',
                          'Easy walking'];
     const unwindChips = ['Stretch / breathwork',
                          'Quiet time / prayer / meditation',
                          'Friends & family',
                          'Nature / walks', 'Screen time'];
     const dietChips   = ['Plant-based', 'Gluten-free',
                          'Low-carb / Keto', 'Intermittent fasting'];
     const suppChips   = [
       'Multivitamin / Mineral', 'Vitamin D or D+K', 'Omega-3 / Fish oil',
       'Magnesium', 'Probiotic / digestive enzymes',
       'Greens powder / antioxidant blend', 'Protein powder',
       'Creatine / performance booster', 'Adaptogens / Stress support',
       'Joint support', 'None right now'
     ];
     const stressReset = [
       'Breathwork / meditation', 'Journaling / prayer', 'Exercise',
       'Time in nature', 'Creative outlet (music, art)', 'Still figuring this out'
     ];
     const recoveryChips = [
       'Sauna', 'Infrared heat', 'Cold plunge', 'Massage / soft-tissue work',
       'Foam rolling', 'Wearable tech (HRV, WHOOP, Apple Watch)',
       'None yet—curious to learn'
     ];
   
     /* UI ------------------------------------------------------- */
     return (
       <section className="space-y-8">
         <h2 className="text-lg font-medium">Daily Rhythm&nbsp;&amp;&nbsp;Fuel</h2>
   
         {/* ───────────────────────── 1 · MOVE ───────────────────────── */}
         <div className="space-y-4">
           <h3 className="font-semibold">1 Move</h3>
   
           <p className="text-sm">How often do you get intentional movement?</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.moveDays}
             onChange={(e) => pick('moveDays', e.target.value)}
           >
             <option value="0-1">0–1 day/wk</option>
             <option value="2-3">2–3 days</option>
             <option value="4+">4 days +</option>
           </select>
   
           <p className="text-sm mt-3">Typical session length</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.moveLen}
             onChange={(e) => pick('moveLen', e.target.value)}
           >
             <option value="<20">&lt; 20 min</option>
             <option value="20-40">20–40 min</option>
             <option value="40-60">40–60 min</option>
             <option value=">60">&gt; 60 min</option>
           </select>
   
           <p className="text-sm mt-3">
             Favourite ways to move <span className="text-xs text-gray-500">(check any)</span>
           </p>
           <div className="flex flex-wrap gap-2">
             {moveChips.map((c) => (
               <Chip key={c} label={c}
                 active={lf.moveTypes.includes(c)}
                 onClick={() => multi('moveTypes', c)}
               />
             ))}
           </div>
           {lf.moveTypes.includes('Other') && (
             <input
               {...txt('otherMove')}
               className="border rounded w-full p-1 text-sm mt-2"
               placeholder="Other movement type"
             />
           )}
   
           <p className="text-sm mt-3">Average steps per day</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.steps}
             onChange={(e) => pick('steps', e.target.value)}
           >
             <option value="<4k">&lt; 4&nbsp;k</option>
             <option value="4-7k">4–7&nbsp;k</option>
             <option value="7-10k">7–10&nbsp;k</option>
             <option value="10k+">10&nbsp;k +</option>
           </select>
   
           <p className="text-sm mt-3">Biggest barrier to moving more</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.moveBarrier}
             onChange={(e) => pick('moveBarrier', e.target.value)}
           >
             <option value="time">Time</option>
             <option value="pain">Pain</option>
             <option value="motivation">Motivation</option>
             <option value="unsure">Unsure where to start</option>
           </select>
         </div>
   
         {/* ─────────────────────── 2 · WORK & REST ───────────────────── */}
         <div className="space-y-4">
           <h3 className="font-semibold">2 Work&nbsp;&amp;&nbsp;Rest</h3>
   
           <p className="text-sm">Work rhythm</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.work}
             onChange={(e) => pick('work', e.target.value)}
           >
             <option value="desk">Mostly seated</option>
             <option value="mix">Mix sitting &amp; moving</option>
             <option value="active">On feet / active</option>
           </select>
   
           <p className="text-sm mt-3">Shift pattern</p>
           <RadioRow
             value={lf.shiftPattern}
             set={(v) => pick('shiftPattern', v)}
             name="shiftPattern"
             opts={[
               ['day', 'Day'],
               ['night', 'Night'],
               ['rotating', 'Rotating'],
             ]}
           />
   
           <p className="text-sm mt-3">Typical night’s sleep</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.sleep}
             onChange={(e) => pick('sleep', e.target.value)}
           >
             <option value="<5">&lt; 5&nbsp;h</option>
             <option value="5-7">5–7&nbsp;h</option>
             <option value="7-9">7–9&nbsp;h</option>
             <option value=">9">&gt; 9&nbsp;h</option>
           </select>
   
           <p className="text-sm mt-3">How refreshed do you feel on waking?</p>
           <RadioRow
             value={lf.refreshed}
             set={(v) => pick('refreshed', v)}
             name="refreshed"
             opts={[
               ['yes', 'Yes'],
               ['no', 'No'],
             ]}
           />
   
           <p className="text-sm mt-3">Screen use within 60&nbsp;min of sleep</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.screenBed}
             onChange={(e) => pick('screenBed', e.target.value)}
           >
             <option value="nightly">Nearly every night</option>
             <option value="few">Few nights/wk</option>
             <option value="rare">Rarely / never</option>
           </select>
   
           <p className="text-sm mt-3">Micro-screen breaks while working (per hour)</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.microBreaks}
             onChange={(e) => pick('microBreaks', e.target.value)}
           >
             <option value="0-1">0–1</option>
             <option value="2-3">2–3</option>
             <option value="4+">4 +</option>
           </select>
   
           <p className="text-sm mt-3">
             How do you usually unwind? <span className="text-xs">(check any)</span>
           </p>
           <div className="flex flex-wrap gap-2">
             {unwindChips.map((c) => (
               <Chip key={c} label={c}
                 active={lf.unwind.includes(c)}
                 onClick={() => multi('unwind', c)}
               />
             ))}
           </div>
           {lf.unwind.includes('Other') && (
             <input
               {...txt('otherUnwind')}
               className="border rounded w-full p-1 text-sm mt-2"
               placeholder="Other way you unwind"
             />
           )}
         </div>
   
         {/* ──────────────── 3 · HYDRATION & BOOSTERS ──────────────── */}
         <div className="space-y-4">
           <h3 className="font-semibold">3 Hydration&nbsp;&amp;&nbsp;Boosters</h3>
   
           <p className="text-sm">Plain-water habit (8-oz glasses/day)</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.water}
             onChange={(e) => pick('water', e.target.value)}
           >
             <option value="<4">&lt; 4</option>
             <option value="4-7">4–7</option>
             <option value="8-10">8–10</option>
             <option value="10+">10 +</option>
           </select>
   
           <p className="text-sm mt-3">Coffee / tea per day</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.caf}
             onChange={(e) => pick('caf', e.target.value)}
           >
             <option value="0">0</option>
             <option value="1">1</option>
             <option value="2-3">2–3</option>
             <option value="4+">4 +</option>
           </select>
   
           <p className="text-sm mt-3">Sugary / energy drinks or soda</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.soda}
             onChange={(e) => pick('soda', e.target.value)}
           >
             <option value="none">None</option>
             <option value="1c">≤ 1 can/wk</option>
             <option value="2-4">2–4/wk</option>
             <option value="daily">Daily</option>
           </select>
   
           <p className="text-sm mt-3">Alcohol</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.alc}
             onChange={(e) => pick('alc', e.target.value)}
           >
             <option value="never">Never</option>
             <option value="occas">Occasionally (≤ 3/wk)</option>
             <option value="regular">Regular (4–7/wk)</option>
             <option value="daily">Daily</option>
           </select>
   
           <p className="text-sm mt-3">Electrolyte drinks / tablets ≥ 3× wk</p>
           <RadioRow
             value={lf.electro}
             set={(v) => pick('electro', v)}
             name="electro"
             opts={[
               ['yes', 'Yes'],
               ['no',  'No'],
             ]}
           />
         </div>
   
         {/* ───────────────────── 4 · NOURISHMENT ───────────────────── */}
         <div className="space-y-4">
           <h3 className="font-semibold">4 Nourishment</h3>
   
           <p className="text-sm">Meals &amp; snacks on a typical day</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.meals}
             onChange={(e) => pick('meals', e.target.value)}
           >
             <option value="1-2">1–2 larger meals</option>
             <option value="3">3 balanced meals</option>
             <option value="4-5">4–5 mini-meals / grazing</option>
           </select>
   
           <p className="text-sm mt-3">Fruits &amp; veggies eaten</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.produce}
             onChange={(e) => pick('produce', e.target.value)}
           >
             <option value="0-1">0–1</option>
             <option value="2-3">2–3</option>
             <option value="4+">4 +</option>
           </select>
   
           <p className="text-sm mt-3">Protein with most meals?</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.protein}
             onChange={(e) => pick('protein', e.target.value)}
           >
             <option value="rare">Rarely</option>
             <option value="half">Half meals</option>
             <option value="most">Most meals</option>
           </select>
   
           <p className="text-sm mt-3">Sugary drinks / desserts</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.sugar}
             onChange={(e) => pick('sugar', e.target.value)}
           >
             <option value="never">Almost never</option>
             <option value="few">Few times/wk</option>
             <option value="daily">Daily or more</option>
           </select>
   
           <p className="text-sm mt-3">Eat-out vs. cook-in</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.cookRatio}
             onChange={(e) => pick('cookRatio', e.target.value)}
           >
             <option value="cook">Mostly home-cooked</option>
             <option value="half">About half &amp; half</option>
             <option value="out">Mostly take-out / restaurant</option>
           </select>
   
           <p className="text-sm mt-3">Last meal after 9&nbsp;pm?</p>
           <RadioRow
             value={lf.lateMeal}
             set={(v) => pick('lateMeal', v)}
             name="lateMeal"
             opts={[
               ['yes', 'Yes'],
               ['no',  'No'],
             ]}
           />
   
           <p className="text-sm mt-3">
             Do you follow any particular approach? <span className="text-xs">(check any)</span>
           </p>
           <div className="flex flex-wrap gap-2">
             {dietChips.map((c) => (
               <Chip key={c} label={c}
                 active={lf.dietApproach.includes(c)}
                 onClick={() => multi('dietApproach', c)}
               />
             ))}
           </div>
           {lf.dietApproach.includes('Other') && (
             <input
               {...txt('otherApproach')}
               className="border rounded w-full p-1 text-sm mt-2"
               placeholder="Other approach"
             />
           )}
   
           <p className="text-sm mt-3">When stressed, I tend to…</p>
           <select
             className="border rounded w-full max-w-xs"
             value={lf.stressEat}
             onChange={(e) => pick('stressEat', e.target.value)}
           >
             <option value="lose">Lose appetite</option>
             <option value="snack">Snack / comfort-eat</option>
             <option value="same">Stay about the same</option>
           </select>
   
           <p className="text-sm mt-3">
             Supplements you take regularly <span className="text-xs">(check all)</span>
           </p>
           <div className="flex flex-wrap gap-2">
             {suppChips.map((c) => (
               <Chip key={c} label={c}
                 active={lf.supplements.includes(c)}
                 onClick={() => multi('supplements', c)}
               />
             ))}
           </div>
         </div>
   
         {/* ───────────── 5 · STRESS & MIND-BODY HABITS ───────────── */}
         <div className="space-y-4">
           <h3 className="font-semibold">5 Stress &amp; Mind-Body Habits</h3>
   
           <p className="text-sm">
             When stress shows up, what helps you reset? <span className="text-xs">(check all)</span>
           </p>
           <div className="flex flex-wrap gap-2">
             {stressReset.map((c) => (
               <Chip key={c} label={c}
                 active={lf.stressReset.includes(c)}
                 onClick={() => multi('stressReset', c)}
               />
             ))}
           </div>
   
           <p className="text-sm mt-3">
             Perceived stress most days (0 = none · 10 = max)
           </p>
           <input
             {...txt('stressScore')}
             className="border rounded w-24 p-1 text-sm"
             placeholder="0-10"
           />
         </div>
   
         {/* ─────────────── 6 · RECOVERY & SELF-CARE ─────────────── */}
         <div className="space-y-4">
           <h3 className="font-semibold">6 Recovery &amp; Self-Care</h3>
   
           <p className="text-sm">
             Tools you already use <span className="text-xs">(check any)</span>
           </p>
           <div className="flex flex-wrap gap-2">
             {recoveryChips.map((c) => (
               <Chip key={c} label={c}
                 active={lf.recovery.includes(c)}
                 onClick={() => multi('recovery', c)}
               />
             ))}
           </div>
         </div>
   
         <p className="text-sm text-gray-500 pt-4">
           Thank you! Your answers help us tailor a plan that fits your real life
           and moves you toward lasting balance.
         </p>
       </section>
     );
   }