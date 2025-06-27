/* pages/staff/enter/[id]/inbody.tsx
   --------------------------------------------------------------
   Ultra-thin page — just wire the generic <DeviceForm> to the
   InBody field schema.  No form markup lives here any more.
---------------------------------------------------------------- */
import DeviceForm           from '@/components/DeviceForm';
import { inBodySchema }     from '@/lib/metrics/inbodySchema';

/* ── reuse the same GSSP that [id]/index.tsx already exports ── */
export { getServerSideProps } from '@/pages/staff/enter/[id]/index';

export default function InBodyPage({ submissionId }: { submissionId: string }) {
  return (
    <DeviceForm
      schema={inBodySchema}
      submissionId={submissionId}
      onDone={() => history.back()}        // or router.push(…)
    />
  );
}