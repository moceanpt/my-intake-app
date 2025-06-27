/* ------------------------------------------------------------------
   pages/staff/review/[id].jsx
   ------------------------------------------------------------------ */
   import prisma        from '@/lib/prisma';       // default export
   import ResultView    from '@/components/ResultView';
   import Link          from 'next/link';
   import { chipToLabel } from '@/lib/chipUtils';
   import { HISTORY_SECTIONS, HISTORY_LABEL } from '@/lib/historySchema';

   /* ---------- 1. SSR: load intake + preview plan ------------------- */
   export async function getServerSideProps({ params }) {
     const sub = await prisma.intakeSubmission.findUnique({
       where  : { id: params.id },
       include: { planResults: { where: { stage: 'preview' } } },
     });
   
     if (!sub) return { notFound: true };
   
     const previewRow = sub.planResults[0]?.resultJson ?? null;
   
     return {
       props: {
         submission: {
           id          : sub.id,
           clientId    : sub.clientId,
           reasons     : sub.rawReasons       ?? [],
           symptomChips: sub.symptomChips     ?? {},
           discomfort  : sub.rawDiscomfort   ?? {},
           history     : sub.rawHistory      ?? {},
           preview     : previewRow
             ? JSON.parse(JSON.stringify(previewRow))
             : null,
         },
       },
     };
   }
   
   /* ---------- 2. Page component ----------------------------------- */
   export default function ReviewIntake({ submission }) {
     const { id, reasons, symptomChips, preview, discomfort, history } = submission;
   
     /* ---- normalise older preview payloads (single `radar`) -------- */
     const previewData = preview
    ? {
        ...preview,
        radarSubjective : preview.radarSubjective ?? preview.radar ?? {},
        discomfort,
        history,
        }
    : null;

    /* ---- PREVIEW ONLY · hide fields that are “final-plan” items ---- */
    if (previewData) {
    delete previewData.radarObjective;   // no device radar yet
    delete previewData.optimisation;     // no focus buckets yet
    delete previewData.services;         // no service list yet
    }
   
       return (
        <main className="max-w-3xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold mb-4">Intake Review</h1>
      
          {/* 1 ─ Reasons & goals */}
          <section className="border p-4 rounded">
            <h2 className="font-semibold">Reasons&nbsp;&amp;&nbsp;Goals</h2>
            {reasons.length ? (
              <ul className="list-disc pl-6">
                {reasons.map((r,i)=><li key={i}>{r}</li>)}
              </ul>
            ) : <p className="text-gray-500">— none selected —</p>}
          </section>
      
          {/* 2 ─ Current discomfort */}
          {Object.keys(discomfort).length > 0 && (
            <section className="border p-4 rounded">
              <h2 className="font-semibold">Current&nbsp;Discomfort</h2>
              <ul className="list-disc pl-6 text-sm">
                {Object.entries(discomfort).map(([k,v]) =>
                  v ? <li key={k}><b>{k}</b>: {String(v)}</li> : null)}
              </ul>
            </section>
          )}
      
          {/* 3 ─ Health background / history */}
          {HISTORY_SECTIONS.some(sec =>
            sec.items.some(([k]) => history[k])        // show the card only if
            ) && (                                       // at least one flag is true
            <section className="border p-4 rounded space-y-4">
                <h2 className="font-semibold">Health&nbsp;Background</h2>

                {HISTORY_SECTIONS.map(sec => {
                const hits = sec.items.filter(([k]) => history[k]);
                if (hits.length === 0) return null;    // skip empty section

                return (
                    <div key={sec.id}>
                    <p className="font-medium">{sec.title}</p>
                    <ul className="list-disc pl-5 text-sm">
                        {hits.map(([k]) => (
                        <li key={k}>{HISTORY_LABEL[k]}</li>
                        ))}
                    </ul>
                    </div>
                );
                })}
            </section>
            )}
      
          {/* 4 ─ Health snapshot (radars, focus, services, lifestyle…) */}
          {previewData && (
            <section className="border p-4 rounded">
              <h2 className="font-semibold">Health&nbsp;Snapshot</h2>
              <ResultView readOnly data={previewData} />
            </section>
          )}
      
          {/* 5 ─ Selected symptoms (kept exactly the same) */}
          <section className="border p-4 rounded">
            <h2 className="font-semibold mb-2">Selected Symptoms</h2>
            {[
              [['musculoskeletal','Muscle'],
               ['organ_digest_hormone_detox','Organ / Digestion'],
               ['circulation','Circulation']],
              [['energy','Energy'],
               ['articular_joint','Joints'],
               ['nervous_system','Nervous']],
            ].map((row,i)=>(
              <div key={i} className="grid sm:grid-cols-3 gap-4 mb-4">
                {row.map(([key,label])=>{
                  const chips = symptomChips[key] ?? [];
                  return (
                    <div key={key}>
                      <p className="text-sm font-semibold mb-1">{label}</p>
                      {chips.length
                        ? chips.map(c=>(
                            <span key={c} className="badge block mb-1">
                              {chipToLabel(c)}
                            </span>))
                        : <p className="text-xs text-gray-400 italic">—</p>}
                    </div>
                  );
                })}
              </div>
            ))}
          </section>
   
         {/* ── Continue to Metrics entry ── */}
         <Link href={`/staff/enter/${id}`} className="btn btn-primary inline-block mt-4">
           Looks&nbsp;good&nbsp;— Enter&nbsp;Metrics&nbsp;→
         </Link>

        {/* ── Back to Dashboard ── */}
        <Link
            href="/staff/dashboard"
            className="btn btn-secondary inline-block mt-4"
        >
            ←&nbsp;Back&nbsp;to&nbsp;Dashboard
        </Link>
            </main>
            );
     }