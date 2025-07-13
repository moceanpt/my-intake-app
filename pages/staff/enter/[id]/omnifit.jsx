/* pages/staff/enter/[id]/omnifit.jsx
   ────────────────────────────────── */
   import { omnifitMetricSchema }   from '@/lib/objective/omnifit';  // 🟢 Use the new MetricSchema
   import DeviceForm            from '@/components/DeviceForm';
   
   /* ─ reuse the GSSP from the folder index page ─ */
   export { getServerSideProps } from '@/pages/staff/enter/[id]/index';
   
   export default function OmniFitPage({ submissionId }) {
     return (
       <DeviceForm
         schema={omnifitMetricSchema}
         submissionId={submissionId}
         onDone={() => window.history.back()}
       />
     );
   }
