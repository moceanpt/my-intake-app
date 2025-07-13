/* ------------------------------------------------------------------
   pages/staff/review/[id].jsx
   ------------------------------------------------------------------ */
   import prisma        from '../../../lib/prisma';       // default export
   import ResultView    from '../../../components/ResultView';
   import Link          from 'next/link';
   import { chipToLabel } from '../../../lib/chipUtils';
   import { HISTORY_SECTIONS, HISTORY_LABEL } from '../../../lib/historySchema';
   import Card from '@/components/ui/Card';
   import Button from '@/components/ui/Button';

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

    /* ---- PREVIEW ONLY · hide fields that are "final-plan" items ---- */
    if (previewData) {
    delete previewData.radarObjective;   // no device radar yet
    delete previewData.optimisation;     // no focus buckets yet
    delete previewData.services;         // no service list yet
    }
   
       return (
        <main className="max-w-3xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-secondary-900)' }}>Intake Review</h1>
      
          {/* 1 ─ Reasons & goals */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold" style={{ color: 'var(--color-secondary-900)' }}>Reasons&nbsp;&amp;&nbsp;Goals</h2>
            </Card.Header>
            <Card.Body>
              {reasons.length ? (
                <ul className="list-disc pl-6">
                  {reasons.map((r,i)=><li key={i}>{r}</li>)}
                </ul>
              ) : <p style={{ color: 'var(--color-secondary-500)' }}>— none selected —</p>}
            </Card.Body>
          </Card>
      
          {/* 2 ─ Current discomfort */}
          {Object.keys(discomfort).length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="font-semibold" style={{ color: 'var(--color-secondary-900)' }}>Current&nbsp;Discomfort</h2>
              </Card.Header>
              <Card.Body>
                <ul className="list-disc pl-6 text-sm">
                  {Object.entries(discomfort).map(([k,v]) =>
                    v ? <li key={k}><b>{k}</b>: {String(v)}</li> : null)}
                </ul>
              </Card.Body>
            </Card>
          )}
      
          {/* 3 ─ Health background / history */}
          {HISTORY_SECTIONS.some(sec =>
            sec.items.some(([k]) => history[k])        // show the card only if
            ) && (                                       // at least one flag is true
            <Card>
              <Card.Header>
                <h2 className="font-semibold" style={{ color: 'var(--color-secondary-900)' }}>Health&nbsp;Background</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {HISTORY_SECTIONS.map(sec => {
                    const hits = sec.items.filter(([k]) => history[k]);
                    if (hits.length === 0) return null;    // skip empty section

                    return (
                      <div key={sec.id}>
                        <p className="font-medium" style={{ color: 'var(--color-secondary-900)' }}>{sec.title}</p>
                        <ul className="list-disc pl-5 text-sm">
                          {hits.map(([k]) => (
                            <li key={k}>{HISTORY_LABEL[k]}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
            )}
      
          {/* 4 ─ Health snapshot (radars, focus, services, lifestyle…) */}
          {previewData && (
            <Card>
              <Card.Header>
                <h2 className="font-semibold" style={{ color: 'var(--color-secondary-900)' }}>Health&nbsp;Snapshot</h2>
              </Card.Header>
              <Card.Body>
                <ResultView readOnly data={previewData} />
              </Card.Body>
            </Card>
          )}
      
          {/* 5 ─ Selected symptoms (kept exactly the same) */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold mb-2" style={{ color: 'var(--color-secondary-900)' }}>Selected Symptoms</h2>
            </Card.Header>
            <Card.Body>
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
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-secondary-900)' }}>{label}</p>
                        {chips.length
                          ? chips.map(c=>(
                              <span key={c} className="badge block mb-1">
                                {chipToLabel(c)}
                              </span>))
                          : <p className="text-xs italic" style={{ color: 'var(--color-secondary-400)' }}>—</p>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </Card.Body>
          </Card>
   
         {/* ── Continue to Metrics entry ── */}
         <div className="flex gap-4">
           <Link href={`/staff/enter/${id}`}>
             <Button variant="primary">
               Looks&nbsp;good&nbsp;— Enter&nbsp;Metrics&nbsp;→
             </Button>
           </Link>

           {/* ── Back to Dashboard ── */}
           <Link href="/staff/dashboard">
             <Button variant="secondary">
               ←&nbsp;Back&nbsp;to&nbsp;Dashboard
             </Button>
           </Link>
         </div>
        </main>
        );
     }