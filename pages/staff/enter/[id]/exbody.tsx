/* --------------------------------------------------------------
   pages/staff/enter/[id]/exbody.tsx
   -------------------------------------------------------------- */
   import { useRouter } from 'next/router';
   import exBodyModule from '@/lib/objective/exbody';
   import DeviceForm   from '@/components/DeviceForm';
   
   export default function ExBodyMetricsPage() {
     const router = useRouter();
     const { id }  = router.query as { id: string };
   
     /** Submit handler – swap in your real /api/metrics call */
     const save = async (payload: any) => {
       await fetch('/api/metrics', {
         method : 'POST',
         headers: { 'Content-Type': 'application/json' },
         body   : JSON.stringify({
           submissionId: id,
           device      : exBodyModule.slug,
           data        : payload,
         }),
       });
       router.push(`/staff/plan/${id}?stage=final`);
     };
   
     return <DeviceForm schema={exBodyModule} onSubmit={save} />;
   }