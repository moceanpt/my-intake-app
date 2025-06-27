/* ------------------------------------------------------------------
   pages/staff/dashboard.jsx
------------------------------------------------------------------- */
import Link   from 'next/link';
import prisma from '@/lib/prisma';   // ✅ default export

/* ---------- 1.  Server-side data --------------------------------- */
export async function getServerSideProps() {
  const subs = await prisma.intakeSubmission.findMany({
    orderBy: { submittedAt: 'desc' },
    select : {
      id          : true,
      clientId    : true,
      status      : true,
      planResults : { select: { stage: true } },   // preview / final
    },
  });

  return { props: { subs: JSON.parse(JSON.stringify(subs)) } };
}

/* ---------- 2.  Small helpers ----------------------------------- */
const planIcon = (planResults = [], status) => {  // ① accept status
    const stages = planResults.map(p => p.stage);
    if (stages.includes('final'))        return '🟢';   // final ready
    if (status === 'metrics_entered')    return '🔵';   // metrics saved
    if (stages.includes('preview'))      return '🟡';   // preview only
    return '⚫';                                      // no plan yet
  };

const nextLink = ({ id, status }) => {
  switch (status) {
    case 'intake_submitted':
      return (
        <Link className="link" href={`/staff/review/${id}`}>
          Review Intake →
        </Link>
      );

    case 'intake_reviewed':
    case 'assessments_pending':
      return (
        <Link className="link" href={`/staff/enter/${id}`}>
          Enter Metrics →
        </Link>
      );

    case 'metrics_entered':
    case 'plan_generated':
    case 'plan_sent':
      return (
        <Link className="link" href={`/staff/plan/${id}?stage=final`}>
          View Plan →
        </Link>
      );

    default:
      return null;
  }
};

/* ---------- 3.  Page component ---------------------------------- */
export default function Dashboard({ subs }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Therapist&nbsp;Dashboard</h1>

      <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Status</th>
            <th>Plan</th>
            <th /> {/* actions */}
          </tr>
        </thead>

        <tbody>
          {subs.map(s => (
            <tr key={s.id}>
              <td className="whitespace-nowrap">{s.id.slice(0, 8)}</td>
              <td>{s.clientId || '—'}</td>
              <td className="whitespace-nowrap">{s.status}</td>
              <td className="text-xl">{planIcon(s.planResults)}</td>
              <td>{nextLink(s)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}