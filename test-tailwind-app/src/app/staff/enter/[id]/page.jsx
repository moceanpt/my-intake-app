import prisma from '@/lib/prisma';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default async function EnterMetrics({ params }) {
  const { id } = params;
  
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

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Enter Metrics
              </h1>
              <p className="text-secondary-600">
                Client ID: {submission.clientId || 'Anonymous'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </Link>
              <Link 
                href={`/staff/plan/${id}?stage=final`}
                className="btn btn-primary"
              >
                Generate Plan →
              </Link>
            </div>
          </div>
        </div>

        {/* Device Selection Tabs */}
        <Card className="mb-6">
          <Card.Header>
            <h2 className="text-xl font-semibold text-secondary-900">
              Select Assessment Device
            </h2>
            <p className="text-secondary-600 mt-1">
              Choose the device used for objective measurements
            </p>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 border-2 border-primary-300 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary-700">InBody</div>
                  <div className="text-sm text-primary-600">Body Composition</div>
                </div>
              </button>
              <button className="p-4 border-2 border-secondary-200 bg-white rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="text-center">
                  <div className="text-lg font-semibold text-secondary-700">AuraCom</div>
                  <div className="text-sm text-secondary-600">Aura Analysis</div>
                </div>
              </button>
              <button className="p-4 border-2 border-secondary-200 bg-white rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="text-center">
                  <div className="text-lg font-semibold text-secondary-700">ExBody</div>
                  <div className="text-sm text-secondary-600">Exercise Assessment</div>
                </div>
              </button>
              <button className="p-4 border-2 border-secondary-200 bg-white rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="text-center">
                  <div className="text-lg font-semibold text-secondary-700">HeartMath</div>
                  <div className="text-sm text-secondary-600">HRV Analysis</div>
                </div>
              </button>
            </div>
          </Card.Body>
        </Card>

        {/* InBody Metrics Entry Form */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-secondary-900">
              InBody Metrics
            </h2>
            <p className="text-secondary-600 mt-1">
              Body composition and cellular health measurements
            </p>
          </Card.Header>
          <Card.Body>
            <div className="space-y-6">
              {/* Body Composition */}
              <div>
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Body Composition</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Weight (kg)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 70.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Hydration (%)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 65.2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Muscle Mass (kg)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 45.2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Body Fat (kg)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 18.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Body Fat Percentage (%)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 25.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Visceral Fat Area (cm²)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 85.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      ECW/TBW Ratio
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 0.38"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Phase Angle (°)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 6.2"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Additional Notes
                </label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter any additional observations or notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
                <button className="btn btn-secondary">
                  Save Draft
                </button>
                <button className="btn btn-primary">
                  Save & Generate Plan
                </button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* AuraCom Metrics (Hidden by default) */}
        <Card className="hidden">
          <Card.Header>
            <h2 className="text-xl font-semibold text-secondary-900">
              AuraCom Metrics
            </h2>
            <p className="text-secondary-600 mt-1">
              Aura analysis and energy field measurements
            </p>
          </Card.Header>
          <Card.Body>
            <div className="text-center py-8 text-secondary-500">
              AuraCom metrics form will be implemented here
            </div>
          </Card.Body>
        </Card>

        {/* ExBody Metrics (Hidden by default) */}
        <Card className="hidden">
          <Card.Header>
            <h2 className="text-xl font-semibold text-secondary-900">
              ExBody Metrics
            </h2>
            <p className="text-secondary-600 mt-1">
              Exercise assessment and performance metrics
            </p>
          </Card.Header>
          <Card.Body>
            <div className="text-center py-8 text-secondary-500">
              ExBody metrics form will be implemented here
            </div>
          </Card.Body>
        </Card>

        {/* HeartMath Metrics (Hidden by default) */}
        <Card className="hidden">
          <Card.Header>
            <h2 className="text-xl font-semibold text-secondary-900">
              HeartMath Metrics
            </h2>
            <p className="text-secondary-600 mt-1">
              Heart rate variability and coherence analysis
            </p>
          </Card.Header>
          <Card.Body>
            <div className="text-center py-8 text-secondary-500">
              HeartMath metrics form will be implemented here
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
} 