/* pages/api/score.ts
   ------------------ */
   import prisma              from '@/lib/prisma';     // generated client
   import { calcStress,
            calcSupport }     from '@/lib/score';
   import tracks              from '@/data/opt_track_map.json';
   
   export default async function handler(req, res) {
     if (req.method !== 'POST')
       return res.status(405).json({ error:'POST only' });
   
     const { submissionId } = req.body;
     if (!submissionId) return res.status(400).json({ error:'missing id' });
   
     /* 1 ─ pull the raw intake we saved earlier ------------------ */
     const sub = await prisma.intakeSubmission.findUnique({
       where: { id: submissionId },
     });
     if (!sub) return res.status(404).json({ error:'not found' });
   
     /* 2 ─ compute scores --------------------------------------- */
     const stress   = calcStress(sub.hc);     // pillar → 0-10
     const support  = calcSupport(sub.life);  // pillar → 0-10
     const gap      = Object.fromEntries(
       Object.keys(stress).map(p => [p, stress[p] - support[p]])
     );
   
     /* pick top-2 focus tracks */
     const focus    = Object.entries(gap)
                       .sort((a,b)=>b[1]-a[1])
                       .slice(0,2)
                       .map(([p]) => tracks[p as keyof typeof tracks].primary);
   
     /* 3 ─ store the scores (but no PDF for now) ---------------- */
     await prisma.intakeSubmission.update({
       where:{ id: submissionId },
       data :{
         stressScores:  stress,
         supportScores: support,
         // pdfUrl: null  (leave empty for now)
       },
     });
   
     /* 4 ─ respond with everything the <ResultSheet> needs ------ */
     res.json({ stress, support, focus });
   }