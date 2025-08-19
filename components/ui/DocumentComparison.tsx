import React, { useState, useEffect } from 'react';

interface Document {
  id: number;
  fileName: string;
  fileUrl: string;
  deviceType: string;
  uploadedAt: string;
  fileSize: number;
  contentType: string;
  extractedData?: any;
  hasMetrics: boolean;
}

interface Evaluation {
  evaluationId: string;
  evaluationDate: string;
  status: string;
  documents: Document[];
  metrics: any[];
  totalDocuments: number;
  totalMetrics: number;
}

interface DocumentComparisonProps {
  clientId: string;
  deviceType?: string;
  onClose?: () => void;
}

const DocumentComparison: React.FC<DocumentComparisonProps> = ({ 
  clientId, 
  deviceType, 
  onClose 
}) => {
  const [documentHistory, setDocumentHistory] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvaluations, setSelectedEvaluations] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay'>('side-by-side');

  useEffect(() => {
    fetchDocumentHistory();
  }, [clientId, deviceType]);

  const fetchDocumentHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        clientId,
        limit: '10',
        ...(deviceType && { deviceType })
      });
      
      const response = await fetch(`/api/documents/history?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document history');
      }
      
      const data = await response.json();
      setDocumentHistory(data.documentHistory);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceDisplayName = (deviceType: string) => {
    const deviceNames: { [key: string]: string } = {
      'exbody': 'ExBody Posture',
      'exbody_rom': 'ExBody ROM',
      'inbody': 'InBody Composition',
      'omnifit_ppg': 'OmniFit PPG',
      'omnifit_eeg': 'OmniFit EEG',
      'auracom': 'AuraCom Energy',
      'heartmath': 'HeartMath HRV'
    };
    return deviceNames[deviceType] || deviceType;
  };

  const handleEvaluationSelect = (evaluationId: string) => {
    setSelectedEvaluations(prev => {
      if (prev.includes(evaluationId)) {
        return prev.filter(id => id !== evaluationId);
      } else {
        // Limit to 2 evaluations for comparison
        if (prev.length >= 2) {
          return [prev[1], evaluationId];
        }
        return [...prev, evaluationId];
      }
    });
  };

  const selectedEvaluationsData = documentHistory.filter(evaluation => 
    selectedEvaluations.includes(evaluation.evaluationId)
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading document history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Documents</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Document Comparison</h2>
            <p className="text-gray-600">Client ID: {clientId}</p>
            {deviceType && (
              <p className="text-gray-600">Device: {getDeviceDisplayName(deviceType)}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <select
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value as 'side-by-side' | 'overlay')}
              className="border rounded px-3 py-1"
            >
              <option value="side-by-side">Side by Side</option>
              <option value="overlay">Overlay</option>
            </select>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Evaluation Selection Panel */}
            <div className="lg:col-span-1 border-r overflow-y-auto p-4">
              <h3 className="text-lg font-semibold mb-4">Evaluation History</h3>
              <div className="space-y-3">
                {documentHistory.map((evaluation) => (
                  <div
                    key={evaluation.evaluationId}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedEvaluations.includes(evaluation.evaluationId)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleEvaluationSelect(evaluation.evaluationId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {formatDate(evaluation.evaluationDate)}
                      </span>
                      {selectedEvaluations.includes(evaluation.evaluationId) && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Documents: {evaluation.totalDocuments}</p>
                      <p>Metrics: {evaluation.totalMetrics}</p>
                      <p>Status: {evaluation.status}</p>
                    </div>
                    {evaluation.documents.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Documents:</p>
                        <div className="space-y-1">
                          {evaluation.documents.map((doc) => (
                            <div key={doc.id} className="text-xs text-gray-600 flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                              {getDeviceDisplayName(doc.deviceType)}
                              {doc.hasMetrics && (
                                <span className="text-blue-600">(with metrics)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Document Comparison Area */}
            <div className="lg:col-span-2 p-4 overflow-y-auto">
              {selectedEvaluationsData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Select evaluations to compare documents</p>
                  </div>
                </div>
              ) : (
                <div className={`grid gap-4 ${
                  comparisonMode === 'side-by-side' && selectedEvaluationsData.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-1'
                }`}>
                  {selectedEvaluationsData.map((evaluation) => (
                    <div key={evaluation.evaluationId} className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">
                          {formatDate(evaluation.evaluationDate)}
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>Evaluation ID: {evaluation.evaluationId}</p>
                          <p>Status: {evaluation.status}</p>
                          <p>Documents: {evaluation.totalDocuments}</p>
                        </div>
                      </div>

                      {evaluation.documents.length > 0 ? (
                        <div className="space-y-4">
                          {evaluation.documents.map((document) => (
                            <div key={document.id} className="border rounded-lg overflow-hidden">
                              <div className="bg-gray-100 p-3 border-b">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="font-medium">{document.fileName}</h5>
                                    <p className="text-sm text-gray-600">
                                      {getDeviceDisplayName(document.deviceType)} • {formatFileSize(document.fileSize)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Uploaded: {formatDate(document.uploadedAt)}
                                    </p>
                                  </div>
                                  {document.hasMetrics && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                      Has Metrics
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="p-4">
                                <img
                                  src={document.fileUrl}
                                  alt={document.fileName}
                                  className="w-full h-auto rounded border"
                                  style={{ maxHeight: '60vh', objectFit: 'contain' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No documents found for this evaluation</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentComparison;
