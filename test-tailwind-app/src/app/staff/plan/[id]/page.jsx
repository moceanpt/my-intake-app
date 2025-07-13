import prisma from '@/lib/prisma';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default async function ViewPlan({ params, searchParams }) {
  const { id } = params;
  const { stage = 'final' } = searchParams;
  
  const submission = await prisma.intakeSubmission.findUnique({
    where: { id },
    include: {
      planResults: true,
    },
  });

  if (!submission) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Card>
          <Card.Body className="text-center">
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">Submission Not Found</h1>
            <p className="text-secondary-600 mb-6">The requested intake submission could not be found.</p>
            <Link href="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const currentPlan = submission.planResults.find(p => p.stage === stage) || {};
  const planData = currentPlan.rawJson ? JSON.parse(currentPlan.rawJson) : {};

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Client Plan
              </h1>
              <p className="text-secondary-600">
                Client ID: {submission.clientId || 'Anonymous'} | Stage: {stage}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </Link>
              <button className="btn btn-primary">
                Send to Client
              </button>
            </div>
          </div>
        </div>

        {/* Plan Stage Selector */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex gap-2">
              <Link 
                href={`/staff/plan/${id}?stage=preview`}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  stage === 'preview' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                Preview
              </Link>
              <Link 
                href={`/staff/plan/${id}?stage=final`}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  stage === 'final' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                Final
              </Link>
            </div>
          </Card.Body>
        </Card>

        {/* Plan Content */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-secondary-900">
              {stage === 'final' ? 'Final Plan' : 'Preview Plan'}
            </h2>
            <p className="text-secondary-600 mt-1">
              Generated on {currentPlan.createdAt ? new Date(currentPlan.createdAt).toLocaleDateString() : 'Not generated yet'}
            </p>
          </Card.Header>
          <Card.Body>
            {Object.keys(planData).length > 0 ? (
              <div className="space-y-6">
                {/* Plan Summary */}
                {planData.summary && (
                  <div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-3">Summary</h3>
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <p className="text-primary-900">{planData.summary}</p>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {planData.recommendations && (
                  <div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-3">Recommendations</h3>
                    <div className="space-y-3">
                      {Array.isArray(planData.recommendations) ? (
                        planData.recommendations.map((rec, index) => (
                          <div key={index} className="bg-secondary-50 p-4 rounded-lg">
                            <p className="text-secondary-900">{rec}</p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-secondary-50 p-4 rounded-lg">
                          <p className="text-secondary-900">{planData.recommendations}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Raw Plan Data */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-3">Plan Data</h3>
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <pre className="text-sm text-secondary-700 whitespace-pre-wrap overflow-auto">
                      {JSON.stringify(planData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-secondary-400 text-lg mb-2">No plan data available</div>
                <p className="text-secondary-500 mb-6">
                  {stage === 'final' 
                    ? 'The final plan has not been generated yet.' 
                    : 'The preview plan has not been generated yet.'
                  }
                </p>
                <button className="btn btn-primary">
                  Generate {stage === 'final' ? 'Final' : 'Preview'} Plan
                </button>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
} 