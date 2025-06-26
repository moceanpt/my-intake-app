import { prisma } from '@/lib/prisma';
import ResultView from '@/components/ResultView';

export async function getServerSideProps({ params, query }) {
  const stage = query.stage === 'final' ? 'final' : 'preview';
  const plan  = await prisma.planResult.findUnique({
    where:{ submissionId_stage:{ submissionId: params.id, stage } },
  });
  if (!plan) return { notFound:true };
  return { props:{ plan: plan.resultJson } };
}

export default function PrintPlan({ plan }) {
  return (
    <div className="p-0 m-0 print-bg white">
      <ResultView data={plan} readOnly />
      <style jsx global>{`
        @media print {
          body { margin:0; }
        }
      `}</style>
    </div>
  );
}