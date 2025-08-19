import React, { useState } from 'react';
import AIDocumentUpload from '@/components/ui/AIDocumentUpload';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AIDemo() {
  const [selectedDevice, setSelectedDevice] = useState('exbody');
  const [extractedData, setExtractedData] = useState(null);

  const devices = [
    { id: 'exbody', name: 'Exbody', description: 'Posture & musculoskeletal analysis' },
    { id: 'inbody', name: 'InBody', description: 'Body composition analysis' },
    { id: 'omnifit', name: 'OmniFit', description: 'Stress check results (PPG & EEG)' },
    { id: 'auracom', name: 'Auracom', description: 'Bio-field analysis' },
    { id: 'heartmath', name: 'HeartMath', description: 'Heart rate variability assessment' }
  ];

  const handleDataExtracted = (data) => {
    setExtractedData(data);
  };

  const handleError = (error) => {
    console.error('AI extraction error:', error);
    alert(`Error: ${error}`);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-secondary-900">
            AI Document Upload Demo
          </h1>
          <p className="text-secondary-600">
            Test the AI-powered document analysis for automated metric extraction
          </p>
        </div>

        {/* Device Selection */}
        <div className="mb-8">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-secondary-900">
                Select Device Type
              </h2>
              <p className="text-secondary-600">
                Choose the type of assessment report you want to analyze
              </p>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device.id)}
                    className="p-4 rounded-lg border-2 transition-all"
                    style={{
                      borderColor: selectedDevice === device.id 
                        ? 'var(--color-primary-500)' 
                        : 'var(--color-secondary-200)',
                      backgroundColor: selectedDevice === device.id 
                        ? 'var(--color-primary-50)' 
                        : 'transparent',
                      color: selectedDevice === device.id 
                        ? 'var(--color-primary-700)' 
                        : 'var(--color-secondary-900)'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDevice !== device.id) {
                        e.target.style.borderColor = 'var(--color-secondary-300)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDevice !== device.id) {
                        e.target.style.borderColor = 'var(--color-secondary-200)';
                      }
                    }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {device.id === 'inbody' && '⚖️'}
                        {device.id === 'auracom' && '🌈'}
                        {device.id === 'heartmath' && '❤️'}
                        {device.id === 'exbody' && '🧍'}
                        {device.id === 'omnifit' && '🧠'}
                      </div>
                      <h3 className="font-semibold">{device.name}</h3>
                      <p className="text-sm opacity-75">{device.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* AI Upload Component */}
        <div className="mb-8">
          <AIDocumentUpload
            deviceType={selectedDevice}
            onDataExtracted={handleDataExtracted}
            onError={handleError}
          />
        </div>

        {/* Extracted Data Display */}
        {extractedData && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-secondary-900">
                Extracted Data
              </h2>
              <p className="text-secondary-600">
                Raw JSON data returned by the AI analysis
              </p>
            </Card.Header>
            <Card.Body>
              <div 
                className="p-4 rounded-lg overflow-x-auto"
                style={{ 
                  backgroundColor: 'var(--color-secondary-900)',
                  color: '#4ade80' // green-400 equivalent
                }}
              >
                <pre className="text-sm">
                  {JSON.stringify(extractedData, null, 2)}
                </pre>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <Card.Header>
                          <h2 className="text-xl font-semibold text-secondary-900">
                How to Use
              </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-secondary-900">1. Select Device Type</h3>
                <p className="text-secondary-600">
                  Choose the type of assessment report you want to analyze (InBody, Auracom, HeartMath, Exbody, or OmniFit).
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-secondary-900">2. Upload Document</h3>
                <p className="text-secondary-600">
                  Drag and drop or click to upload a scanned report (PNG, JPG, PDF, TIFF).
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-secondary-900">3. AI Analysis</h3>
                <p className="text-secondary-600">
                  The AI will analyze the document and extract relevant metrics using GPT-4 Vision.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-secondary-900">4. Review Results</h3>
                <p className="text-secondary-600">
                  Review the extracted data and use it to populate forms in the main application.
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <a href="/staff/dashboard">
            <Button variant="secondary">
              ← Back to Dashboard
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

 