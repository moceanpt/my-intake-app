import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DocumentComparison from '@/components/ui/DocumentComparison';

export default function DocumentComparisonPage() {
  const router = useRouter();
  const { clientId, deviceType } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      setIsLoading(false);
    }
  }, [clientId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document comparison...</p>
        </div>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Client ID</h1>
          <p className="text-gray-600 mb-4">Please provide a valid client ID to view document comparison.</p>
          <button
            onClick={() => router.push('/staff/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DocumentComparison
        clientId={String(clientId)}
        deviceType={deviceType ? String(deviceType) : undefined}
        onClose={() => router.push('/staff/dashboard')}
      />
    </div>
  );
}
