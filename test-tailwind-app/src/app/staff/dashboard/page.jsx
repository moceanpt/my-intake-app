/* ------------------------------------------------------------------
   pages/staff/dashboard.jsx - Redesigned with Design System
------------------------------------------------------------------- */
import Link from 'next/link';
import prisma from '@/lib/prisma';   // ✅ default export
import Card from '@/components/ui/Card';

/* ---------- 1.  Small helpers ----------------------------------- */
const planIcon = (planResults = [], status) => {  // ① accept status
    const stages = planResults.map(p => p.stage);
    if (stages.includes('final'))        return '🟢';   // final ready
    if (status === 'metrics_entered')    return '🔵';   // metrics saved
    if (stages.includes('preview'))      return '🟡';   // preview only
    return '⚫';                                      // no plan yet
  };

const getStatusColor = (status) => {
  switch (status) {
    case 'intake_submitted': return 'text-warning-600 bg-warning-50';
    case 'intake_reviewed': return 'text-primary-600 bg-primary-50';
    case 'assessments_pending': return 'text-secondary-600 bg-secondary-50';
    case 'metrics_entered': return 'text-success-600 bg-success-50';
    case 'plan_generated': return 'text-success-600 bg-success-50';
    case 'plan_sent': return 'text-success-600 bg-success-50';
    default: return 'text-secondary-600 bg-secondary-50';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'intake_submitted': return 'Intake Submitted';
    case 'intake_reviewed': return 'Intake Reviewed';
    case 'assessments_pending': return 'Assessments Pending';
    case 'metrics_entered': return 'Metrics Entered';
    case 'plan_generated': return 'Plan Generated';
    case 'plan_sent': return 'Plan Sent';
    default: return status;
  }
};

const nextLink = ({ id, status }) => {
  switch (status) {
    case 'intake_submitted':
      return (
        <Link 
          className="btn btn-primary btn-sm" 
          href={`/staff/review/${id}`}
        >
          Review Intake →
        </Link>
      );

    case 'intake_reviewed':
    case 'assessments_pending':
      return (
        <Link 
          className="btn btn-primary btn-sm" 
          href={`/staff/enter/${id}`}
        >
          Enter Metrics →
        </Link>
      );

    case 'metrics_entered':
    case 'plan_generated':
    case 'plan_sent':
      return (
        <Link 
          className="btn btn-secondary btn-sm" 
          href={`/staff/plan/${id}?stage=final`}
        >
          View Plan →
        </Link>
      );

    default:
      return null;
  }
};

/* ---------- 2.  Page component ---------------------------------- */
export default async function Dashboard() {
  const subs = await prisma.intakeSubmission.findMany({
    orderBy: { submittedAt: 'desc' },
    select: {
      id: true,
      clientId: true,
      status: true,
      planResults: { select: { stage: true } },
    },
  });

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Therapist Dashboard
          </h1>
          <p className="text-secondary-600">
            Manage client intakes and health assessments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {subs.length}
              </div>
              <div className="text-sm text-secondary-600">Total Submissions</div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {subs.filter(s => s.status === 'intake_submitted').length}
              </div>
              <div className="text-sm text-secondary-600">Pending Review</div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {subs.filter(s => s.status === 'plan_sent').length}
              </div>
              <div className="text-sm text-secondary-600">Plans Sent</div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-secondary-600">
                {subs.filter(s => s.planResults.some(p => p.stage === 'final')).length}
              </div>
              <div className="text-sm text-secondary-600">Final Plans</div>
            </Card.Body>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-secondary-900">
              Client Submissions
            </h2>
            <p className="text-secondary-600 mt-1">
              Recent intake submissions and their current status
            </p>
          </Card.Header>
          <Card.Body>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-semibold text-secondary-700">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-700">Client</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-700">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-secondary-700">Plan</th>
                    <th className="text-right py-3 px-4 font-semibold text-secondary-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((s, index) => (
                    <tr 
                      key={s.id} 
                      className={`border-b border-secondary-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-sm text-secondary-600">
                        {s.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-secondary-900">
                          {s.clientId || 'Anonymous'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`
                          inline-flex px-2 py-1 text-xs font-medium rounded-full
                          ${getStatusColor(s.status)}
                        `}>
                          {getStatusLabel(s.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xl" title={planIcon(s.planResults, s.status)}>
                          {planIcon(s.planResults, s.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {nextLink(s)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {subs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-secondary-400 text-lg mb-2">No submissions yet</div>
                <p className="text-secondary-500">Client intakes will appear here once submitted</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}