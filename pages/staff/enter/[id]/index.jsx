/* pages/staff/enter/[id]/index.jsx */

import Link from 'next/link';
import { useRouter } from 'next/router';
import prisma from '@/lib/prisma';

export async function getServerSideProps({ params }) {
  const sub = await prisma.intakeSubmission.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!sub) return { notFound: true };
  return { props: { submissionId: sub.id } };
}

const DEVICES = [
  { id: 'inbody',   name: 'InBody'   },
  { id: 'exbody',   name: 'ExBody'   },
  { id: 'auracom',  name: 'Auracom'  },
  { id: 'omnifit',  name: 'OmniFit'  },
  { id: 'heartmath',name: 'HeartMath'},
];

export default function ChooseDevice({ submissionId }) {
  const router = useRouter();
  return (
    <main className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">
        Select device to enter metrics
      </h1>

      {DEVICES.map(d => (
        <Link
          key={d.id}
          href={`${router.asPath}/${d.id}`}
          className="block px-4 py-3 rounded bg-blue-600 text-white mb-2"
        >
          {d.name}
        </Link>
      ))}

      <Link
        href="/staff/dashboard"
        className="inline-block text-sm text-gray-500 mt-4"
      >
        ← Back to dashboard
      </Link>
    </main>
  );
}