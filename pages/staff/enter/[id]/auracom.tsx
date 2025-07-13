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
         submissionId={submissionId}
   
         /* 👇 pass the UI schema that contains `fields` */
         schema={auraComUISchema}
       />
     );
   }