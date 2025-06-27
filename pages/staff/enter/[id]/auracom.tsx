/* pages/staff/enter/[id]/auracom.tsx
   ────────────────────────────────── */
   import { auraComUISchema }   from '@/lib/objective/auracom';  // 🟢 UI schema
   import DeviceForm            from '@/components/DeviceForm';
   
   /* ─ reuse the GSSP from the folder index page ─ */
   export { getServerSideProps } from '@/pages/staff/enter/[id]/index';
   
   type Props = { submissionId: string };
   
   export default function AuraComPage({ submissionId }: Props) {
     return (
       <DeviceForm
         title="AuraCom Metrics"
         device="auracom"
         submissionId={submissionId}
   
         /* 👇 pass the UI schema that contains `fields` */
         schema={auraComUISchema}
   
         /* (optional) additional per-field UI tweaks */
         ui={{
           zone1:       { widget: 'select', placeholder: 'Main aura colour' },
           zone2:       { widget: 'select', placeholder: 'Vital-line colour' },
           zone3:       { widget: 'select' },
           zone4:       { widget: 'select' },
           zone5:       { widget: 'select' },
           lineQuality: { widget: 'select' },
         }}
       />
     );
   }