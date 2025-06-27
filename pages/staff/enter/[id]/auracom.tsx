/* ------------------------------------------------------------------
   pages/staff/enter/[id]/auracom.tsx
   ------------------------------------------------------------------ */
   import { auraComSchema }   from '@/lib/objective/auracom';
   import DeviceForm          from '@/components/DeviceForm';
   
   /*  ─ reuse GSSP from the folder index page ─  */
   export { getServerSideProps } from '@/pages/staff/enter/[id]/index';
   
   type Props = { submissionId: string };
   
   export default function AuraComPage({ submissionId }: Props) {
     return (
       <DeviceForm
         title="AuraCom Metrics"
         device="auracom"
         submissionId={submissionId}
         schema={auraComSchema}
   
         /* optional — override labels or widget type for dropdowns */
         ui={{
           zone1: { widget:'select',  placeholder:'Main aura colour' },
           zone2: { widget:'select',  placeholder:'Vital-line colour' },
           zone3: { widget:'select' },
           zone4: { widget:'select' },
           zone5: { widget:'select' },
           lineQuality: { widget:'select' },
           /* numbers auto-render as number inputs via <DeviceForm> */
         }}
       />
     );
   }