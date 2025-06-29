/* --------------------------------------------------------------
   pages/staff/enter/[id]/inbody.tsx
   -------------------------------------------------------------- */
   import React          from 'react';
   import DeviceForm     from '@/components/DeviceForm';
   import { inBodyUISchema } from '@/lib/objective/inbody';
   
   /* Re-export GSSP from the folder index */
   export { getServerSideProps } from '@/pages/staff/enter/[id]/index';
   
   type Props = { submissionId: string };
   
   export default function InBodyPage({ submissionId }: Props) {
     return (
       <DeviceForm
         schema={inBodyUISchema}        // 👈 real schema object
         submissionId={submissionId}
         onDone={() =>
           // after save go back to the metrics hub
           window.history.back()
         }
       />
     );
   }