import React, { useState, useEffect } from 'react';

const DocumentViewer = ({ clientId, deviceType, onClose }) => {
  const [documentHistory, setDocumentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

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
      
      // Auto-select the first evaluation if available
      if (data.documentHistory.length > 0) {
        setSelectedEvaluation(data.documentHistory[0].evaluationId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDeviceDisplayName = (deviceType) => {
    const deviceNames = {
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

  const selectedEvaluationData = documentHistory.find(evaluation => 
    evaluation.evaluationId === selectedEvaluation
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Document Viewer</h2>
            <p className="text-gray-600">Client ID: {clientId}</p>
            {deviceType && (
              <p className="text-gray-600">Device: {getDeviceDisplayName(deviceType)}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
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
                      selectedEvaluation === evaluation.evaluationId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedEvaluation(evaluation.evaluationId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {formatDate(evaluation.evaluationDate)}
                      </span>
                      {selectedEvaluation === evaluation.evaluationId && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Documents: {evaluation.totalDocuments}</p>
                      <p>Metrics: {evaluation.totalMetrics}</p>
                      <p>Status: {evaluation.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Viewing Area */}
            <div className="lg:col-span-2 p-4 overflow-y-auto">
              {!selectedEvaluationData ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Select an evaluation to view documents</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">
                      {formatDate(selectedEvaluationData.evaluationDate)}
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p>Evaluation ID: {selectedEvaluationData.evaluationId}</p>
                      <p>Status: {selectedEvaluationData.status}</p>
                      <p>Documents: {selectedEvaluationData.totalDocuments}</p>
                      <p>Metrics: {selectedEvaluationData.totalMetrics}</p>
                    </div>
                  </div>

                  {selectedEvaluationData.documents.length > 0 ? (
                    <div className="space-y-6">
                      {selectedEvaluationData.documents.map((document) => (
                        <div key={document.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-100 p-3 border-b">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium">{document.fileName}</h5>
                                <p className="text-sm text-gray-600">
                                  {getDeviceDisplayName(document.deviceType)}
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
                          
                          {/* Document Image */}
                          <div className="p-4">
                            <img
                              src={document.fileUrl}
                              alt={document.fileName}
                              className="w-full h-auto rounded border"
                              style={{ maxHeight: '50vh', objectFit: 'contain' }}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
