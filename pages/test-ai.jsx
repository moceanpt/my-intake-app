import React, { useState } from 'react';
import AIDocumentUpload from '@/components/ui/AIDocumentUpload';

export default function TestAI() {
  const [selectedDevice, setSelectedDevice] = useState('exbody');

  const handleDataExtracted = (data) => {
    console.log('Extracted data:', data);
    alert(`Data extracted successfully! Check console for details.\n\n${JSON.stringify(data, null, 2)}`);
  };

  const handleError = (error) => {
    console.error('AI extraction error:', error);
    alert(`Error: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Document Upload Test</h1>
        
        {/* Device Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Device Type:</h2>
          <div className="flex gap-4 flex-wrap">
            {['exbody', 'inbody', 'omnifit', 'auracom', 'heartmath'].map((device) => (
              <button
                key={device}
                onClick={() => setSelectedDevice(device)}
                className={`px-4 py-2 rounded ${
                  selectedDevice === device 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-300'
                }`}
              >
                {device.charAt(0).toUpperCase() + device.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* AI Upload Component */}
        <AIDocumentUpload
          deviceType={selectedDevice}
          onDataExtracted={handleDataExtracted}
          onError={handleError}
        />

        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Select a device type above</li>
            <li>Upload a scanned document (PNG, JPG, PDF)</li>
            <li>Click "Extract Data with AI"</li>
            <li>Review the extracted data</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 