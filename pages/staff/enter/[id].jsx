/Users/moceanpt/my-intake-app/pages/staff/enter/[id].jsx

import { useRouter } from "next/router";
import AssessmentEntryStep from "@/components/steps/AssessmentEntryStep";
import prisma from "@/lib/prisma";                  // ← default import

export async function getServerSideProps({ params }) {
  const sub = await prisma.intakeSubmission.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!sub) return { notFound: true };
  return { props: { submissionId: sub.id } };
}

export default function EnterMetrics({ submissionId }) {
  const router = useRouter();

  return (
    <main className="max-w-lg w-full mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Enter Assessment Metrics</h1>

      <AssessmentEntryStep
        submissionId={submissionId}
        onSuccess={() => router.push("/staff/dashboard")}
      />
    </main>
  );
}