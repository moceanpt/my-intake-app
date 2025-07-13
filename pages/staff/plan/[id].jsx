/* ------------------------------------------------------------------
   pages/staff/plan/[id].jsx
   ------------------------------------------------------------------ */
   import ResultView from '@/components/ResultView';
   import prisma     from '@/lib/prisma';     // ← default export
   import { useRouter } from 'next/router';
   import Card from '@/components/ui/Card';
   import Button from '@/components/ui/Button';
   
   /* ---------- 1. SSR: fetch plan row (preview | final) -------------- */
   export async function getServerSideProps({ params, query }) {
     const stage = query.stage === 'preview' ? 'preview' : 'final';
   
     const planRow = await prisma.planResult.findUnique({
       where: { submissionId_stage: { submissionId: params.id, stage } },
     });
   
     if (!planRow) return { notFound: true };
   
     return {
       props: {
         id   : params.id,
         stage,
         plan : JSON.parse(JSON.stringify(planRow.resultJson)),
         pdfUrl: planRow.pdfUrl ?? null,
       },
     };
   }
   
   /* ---------- 2. Page component ------------------------------------ */
   export default function PlanPage({ id, stage, plan, pdfUrl }) {
     const router = useRouter();
   
     /* helper: create PDF then reload to show stored url */
     const genPdf = async () => {
       const res  = await fetch(`/api/pdf?id=${id}&stage=final`);
       const blob = await res.blob();
       window.open(URL.createObjectURL(blob), '_blank');
       router.replace(router.asPath);
     };
   
     /* ----- fall-back for legacy records that still have `radar` ----- */
     const normalisedPlan = {
       ...plan,
       radarSubjective: plan.radarSubjective ?? plan.radar ?? {},
     };
   
     return (
       <main className="max-w-3xl mx-auto p-6 space-y-6">
         {/* header row ------------------------------------------------ */}
         <div className="flex items-center justify-between">
           <h1 className="text-2xl font-bold" style={{ color: 'var(--color-secondary-900)' }}>Plan&nbsp;({stage})</h1>
   
           {stage === 'final' && (
             pdfUrl ? (
               <a href={pdfUrl} target="_blank">
                 <Button variant="secondary">
                   Download&nbsp;PDF
                 </Button>
               </a>
             ) : (
               <Button variant="secondary" onClick={genPdf}>
                 Generate&nbsp;PDF
               </Button>
             )
           )}
         </div>
   
         {/* plan content ---------------------------------------------- */}
         <Card>
           <Card.Body>
             <ResultView readOnly data={normalisedPlan} />
           </Card.Body>
         </Card>
       </main>
     );
   }