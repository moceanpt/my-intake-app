/* --------------------------------------------------------------
   pages/staff/enter/[id]/exbody.tsx
   -------------------------------------------------------------- */
   import { useRouter } from 'next/router';
   import { exbodyMetricSchema } from '@/lib/objective/exbody';
   import DeviceForm   from '@/components/DeviceForm';
   
   export default function ExBodyMetricsPage() {
     const router = useRouter();
     const { id }  = router.query as { id: string };
   
     return <DeviceForm schema={exbodyMetricSchema} submissionId={id} />;
   }