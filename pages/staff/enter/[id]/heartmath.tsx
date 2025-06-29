/* pages/staff/enter/[id]/heartmath.tsx */
import React from 'react';
import { useRouter } from 'next/router';
import DeviceForm   from '@/components/DeviceForm';
import { heartMathUI } from '@/lib/objective/heartmath';

export { getServerSideProps } from '@/pages/staff/enter/[id]/index';

export default function HeartMathPage({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  return (
    <DeviceForm
      schema={heartMathUI}
      submissionId={submissionId}
      onDone={() => router.push(`/staff/plan/${submissionId}?stage=final`)}
    />
  );
}