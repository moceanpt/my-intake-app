/* components/ui/SymptomResultSheet.jsx
   ------------------------------------ */
   import { Radar } from 'react-chartjs-2';
   import {
     Chart as ChartJS,
     RadialLinearScale,
     PointElement,
     LineElement,
     Filler,
     Tooltip,
     Legend,
   } from 'chart.js';
   
   ChartJS.register(
     RadialLinearScale,
     PointElement,
     LineElement,
     Filler,
     Tooltip,
     Legend
   );
   
   /* ── friendly labels (update here only) ───────────────────────── */
   const PILLAR_LABEL = {
     musculoskeletal:            'Musculoskeletal',
     organ_digest_hormone_detox: 'Organ · Digestion',
     circulation:                'Circulation',
     energy:                     'Energy · Emotion',
     articular_joint:            'Articular Joints',
     nervous_system:             'Nervous System',
   };
   
   /* Helper: classify the 0-10 radar score into a colour-coded tier  */
   function tier(score10) {
     const strainPct = (10 - score10) * 10; // 0 good → 100 bad
     if (strainPct >= 50) return '🔴 High strain';
     if (strainPct >= 25) return '🟠 Moderate';
     if (strainPct >= 10) return '🟡 Mild';
     return '🟢 Optimal';
   }
   
   export default function SymptomResultSheet({ health = {} }) {
     if (!health || Object.keys(health).length === 0) return null;
   
     /* keep pillar order consistent with the label table */
     const keys     = Object.keys(PILLAR_LABEL).filter(k => k in health);
     const labels   = keys.map(k => PILLAR_LABEL[k]);
     const scores10 = keys.map(k => health[k]);           // 0 – 10
   
     /* Radar-chart dataset */
     const data = {
       labels,
       datasets: [
         {
           label: 'Health score (10 good)',
           data: scores10,
           backgroundColor: 'rgba(54,162,235,0.15)',
           borderColor:   'rgba(54,162,235,1)',
           borderWidth: 1,
           pointRadius: 3,
         },
       ],
     };
   
     const options = {
       maintainAspectRatio: false,
       scales: {
         r: {
           min: 0,
           max: 10,
           ticks: { stepSize: 2 },
           grid: { color: '#e2e8f0' },
           pointLabels: { font: { size: 11 } },
         },
       },
       plugins: { legend: { display: false } },
     };
   
     return (
       <section className="space-y-6">
         <h2 className="text-lg font-semibold">MOCEAN Health Snapshot</h2>
   
         {/* 400 × 400 on desktop, 300 × 300 on mobile */}
         <div className="mx-auto w-full h-[400px] max-w-[400px] sm:h-[300px] sm:max-w-[300px]">
           <Radar data={data} options={options} />
         </div>
   
         <table className="w-full text-sm border">
           <thead className="bg-gray-100">
             <tr>
               <th className="p-1 text-left">Pillar</th>
               <th className="p-1 text-center">Score (0–10)</th>
               <th className="p-1 text-center">Tier</th>
             </tr>
           </thead>
           <tbody>
             {keys.map(k => (
               <tr key={k} className="even:bg-gray-50">
                 <td className="p-1">{PILLAR_LABEL[k]}</td>
                 <td className="p-1 text-center">{health[k]}</td>
                 <td className="p-1 text-center">{tier(health[k])}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </section>
     );
   }