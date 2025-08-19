import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DocumentComparisonIndex() {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentClients();
  }, []);

  const fetchRecentClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents/recent-clients');
      if (response.ok) {
        const data = await response.json();
        setRecentClients(data.clients || []);
      }
    } catch (error) {
      console.error('Error fetching recent clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = () => {
    if (clientId.trim()) {
      const url = deviceType 
        ? `/staff/documents/${clientId}?deviceType=${deviceType}`
        : `/staff/documents/${clientId}`;
      router.push(url);
    }
  };

  const deviceTypes = [
    { value: '', label: 'All Devices' },
    { value: 'exbody', label: 'ExBody Posture' },
    { value: 'exbody_rom', label: 'ExBody ROM' },
    { value: 'inbody', label: 'InBody Composition' },
    { value: 'omnifit_ppg', label: 'OmniFit PPG' },
    { value: 'omnifit_eeg', label: 'OmniFit EEG' },
    { value: 'auracom', label: 'AuraCom Energy' },
    { value: 'heartmath', label: 'HeartMath HRV' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
                        <h1 className="text-3xl font-bold text-gray-900">Document Viewer</h1>
          <p className="text-gray-600 mt-2">
            View scanned documents and extracted metrics across different evaluations
          </p>
            </div>
            <Link href="/staff/dashboard">
              <Button variant="outline">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Search Client Documents</h2>
              <p className="text-gray-600 mt-1">Enter a client ID to view their document history</p>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    id="clientId"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter client ID (e.g., 717fc431-e6ae-4bb5-8eb3-fc6680b9cad9)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Device Type (Optional)
                  </label>
                  <select
                    id="deviceType"
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {deviceTypes.map((device) => (
                      <option key={device.value} value={device.value}>
                        {device.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleCompare}
                  disabled={!clientId.trim()}
                  className="w-full"
                  variant="primary"
                >
                  📋 View Documents
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Recent Clients */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Recent Clients</h2>
              <p className="text-gray-600 mt-1">Quick access to recently accessed clients</p>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading recent clients...</p>
                </div>
              ) : recentClients.length > 0 ? (
                <div className="space-y-3">
                  {recentClients.map((client) => (
                    <div
                      key={client.clientId}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          Client {client.clientId.substring(0, 8)}...
                        </p>
                        <p className="text-sm text-gray-600">
                          {client.totalEvaluations} evaluations • {client.totalDocuments} documents
                        </p>
                        <p className="text-xs text-gray-500">
                          Last activity: {new Date(client.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => router.push(`/staff/documents/${client.clientId}`)}
                          variant="outline"
                          size="sm"
                        >
                          View All
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>No recent clients found</p>
                  <p className="text-sm">Start by searching for a client ID above</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">How to Use Document Viewer</h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Enter Client ID</h3>
                <p className="text-sm text-gray-600">
                  Enter the client ID to access their complete document history
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Select Evaluation</h3>
                <p className="text-sm text-gray-600">
                  Choose an evaluation to view its documents and data
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">View Documents</h3>
                <p className="text-sm text-gray-600">
                  View original scanned documents and extracted metrics individually
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
