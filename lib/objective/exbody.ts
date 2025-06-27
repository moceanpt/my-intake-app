/* ------------------------------------------------------------------
   pages/staff/enter/[id]/exbody.tsx
------------------------------------------------------------------- */
import { exBodySchema }  from '@/lib/objective/exbody';
import DeviceForm        from '@/components/DeviceForm';

/* re-use the same GSSP that [id]/index exports */
export { getServerSideProps } from '@/pages/staff/enter/[id]/index';

type Props = { submissionId: string };

export default function ExBodyPage({ submissionId }: Props) {
  return (
    <DeviceForm
      title="ExBody Metrics"
      device="exbody"
      submissionId={submissionId}
      schema={exBodySchema}
      /* ui={…}  ← add overrides if you need special widgets */
    />
  );
}