/* ------------------------------------------------------------------
   pages/staff/enter/[id]/heartmath.tsx
------------------------------------------------------------------- */
import React                     from 'react';
import DeviceForm                from '@/components/DeviceForm';
import { FORM as heartMathUI }   from '@/lib/objective/heartmath';

/* reuse the same GSSP the folder index already exports */
export { getServerSideProps } from '@/pages/staff/enter/[id]/index';

type Props = { submissionId: string };

export default function HeartMathPage({ submissionId }: Props) {
  return (
    <DeviceForm
      title="HeartMath Metrics"
      device="heartmath"          // saved in DB
      submissionId={submissionId}
      schema={heartMathUI}        // the FORM array from /lib/objective/heartmath.ts
    />
  );
}