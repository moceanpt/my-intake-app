/* components/ResultView.jsx
   ------------------------------------------------------------ */
   import SymptomResultSheet   from '@/components/ui/SymptomResultSheet';
   import LifestyleResultSheet from '@/components/ui/LifestyleResultSheet';
   
   export default function ResultView({ data = {}, onBack }) {
     /* ---- destructure the NEW payload keys -------------------- */
     const {
      radarSubjective = data.radar ?? {},            // client sliders + chips
       radarObjective    = {},            // device metrics
       lifestyle         = {},            // lifestyle spokes 0-10
       optimisation,                      // UK spelling in generatePlan
       optimization,                      // <- keep this line only if you used US spelling
       services          = [],
       goals             = [],
       frequency,
       note,
       color,
      } = data;
   
     /* normalise spelling so UI code below can just use `focus` */
     const focus = optimisation ?? optimization ?? [];
   
     return (
       <main className="p-6 max-w-xl mx-auto space-y-10">
   
         {/* ── Health radars (subjective + objective) ── */}
         {Object.keys(radarSubjective).length > 0 && (
           <SymptomResultSheet
             radars={[
               { data: radarSubjective, label: 'Subjective (client)' },
               { data: radarObjective , label: 'Objective (device)' }
             ]}
           />
         )}
   
         {/* ── Lifestyle radar ── */}
         {Object.values(lifestyle).some(v => v > 0) && (
           <LifestyleResultSheet score={lifestyle} />
         )}
   
        
         {/* ── Focus areas ── */}
         {focus.length > 0 && (
           <section>
             <h3 className="font-semibold mb-1">Top Focus Areas</h3>
             <ul className="list-disc pl-5 text-sm">
               {focus.map(f => <li key={f}>{f}</li>)}
             </ul>
           </section>
         )}
   
         {/* ── Recommended services ── */}
         {services.length > 0 && (
           <section>
             <h3 className="font-semibold mb-1">Recommended Services</h3>
             <ul className="list-disc pl-5 text-sm">
               {services.map(s => <li key={s}>{s}</li>)}
             </ul>
           </section>
         )}
   
         {/* ── Goals & tips ── */}
         {goals.length > 0 && (
           <section>
             <h3 className="font-semibold mb-1">Goals & Tips</h3>
             {goals.map(({ goal, tips }) => (
               <div key={goal} className="mb-3">
                 <p className="font-medium">{goal}</p>
                 <ul className="list-disc pl-5 text-sm">
                   {tips.map(t => <li key={t}>{t}</li>)}
                 </ul>
               </div>
             ))}
           </section>
         )}
   
         {/* ── Signature frequency ── */}
         {frequency && (
           <p className="text-sm">
             Signature frequency: <b>{frequency} Hz</b>{' '}
             {note && <>({note}) </>}
             {color && (
               <span
                 style={{ backgroundColor: color.toLowerCase() }}
                 className="inline-block w-3 h-3 rounded-full align-middle ml-1"
               />
             )}
           </p>
         )}
   
         {/* ── Back button (optional) ── */}
         {typeof onBack === 'function' && (
           <div className="text-center">
             <button
               type="button"
               onClick={onBack}
               className="mt-6 inline-block rounded bg-gray-200 px-4 py-2 text-sm
                          hover:bg-gray-300 transition-colors"
             >
               ← Back&nbsp;to&nbsp;Health&nbsp;Check
             </button>
           </div>
         )}
       </main>
     );
   }