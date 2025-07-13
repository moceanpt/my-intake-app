import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Card from './Card';

interface AIDocumentUploadProps {
  deviceType: 'inbody' | 'auracom' | 'heartmath' | 'exbody' | 'omnifit' | 'omnifit_eeg';
  submissionId?: string;
  onDataExtracted: (data: Record<string, any>, fileUrl?: string) => void;
  onError: (error: string) => void;
}

// Device-specific information for better UX
const DEVICE_INFO = {
  inbody: {
    title: 'InBody Body Composition Analysis',
    description: 'Drag & drop your InBody report to extract body composition metrics',
    metrics: [
      'Total Body Water (lb)',
      'Weight (lb)', 
      'Skeletal Muscle Mass (lb)',
      'Body Fat Mass (lb)',
      'Percent Body Fat (%)',
      'ECW/TBW Ratio',
      'Visceral Fat Area (cm²)',
      'Whole-Body Phase Angle (°)'
    ],
    icon: '⚖️'
  },
  auracom: {
    title: 'Auracom Bio-Field Analysis',
    description: 'Drag & drop your Auracom report to extract bio-field metrics',
    metrics: [
      'Ava Score',
      'Vigor',
      'Stability', 
      'Activity Percent',
      'Five Elements (Wood, Fire, Earth, Metal, Water)',
      'Overall Balance Score'
    ],
    icon: '🌈'
  },
  heartmath: {
    title: 'HeartMath HRV Assessment',
    description: 'Drag & drop your HeartMath report to extract heart rate variability metrics',
    metrics: [
      'RR Intervals',
      'Mean Heart Rate (bpm)',
      'Mean Inter-beat Interval (ms)',
      'SDNN (ms)',
      'RMSSD (ms)',
      'Power Spectra (Total, VLF, LF, HF)',
      'LF/HF Ratio',
      'Normalized Coherence (%)'
    ],
    icon: '❤️'
  },
  exbody: {
    title: 'Exbody Posture & Musculoskeletal Analysis',
    description: 'Drag & drop your Exbody report to extract posture and musculoskeletal metrics',
    metrics: [
      'Loss of Height (inches)',
      'Misalignment Deviation Score',
      'Imbalance Deviation Score',
      'Musculoskeletal Index',
      'Forward Head Posture (degrees)',
      'PCMT Load (pounds)',
      'Pelvic Tilt (degrees)'
    ],
    icon: '🧍'
  },
  omnifit: {
    title: 'OmniFit Stress Check Results',
    description: 'Drag & drop your OmniFit report to extract PPG & EEG stress metrics',
    metrics: [
      'HRV Index',
      'Stress Score (0-100)',
      'ANS Health Score',
      'ANS Age (years)',
      'LF & HF Power',
      'Brain Score',
      'Brain Wave Analysis (Gamma, Beta, Alpha, Theta)',
      'Mental Stress & Brain Workload',
      'Left-Right Brain Activity (%)'
    ],
    icon: '🧠'
  },
  omnifit_eeg: {
    title: 'OmniFit EEG Analysis',
    description: 'Drag & drop your OmniFit EEG report to extract EEG metrics',
    metrics: [
      'EEG Metrics',
      'Brain Wave Analysis (Gamma, Beta, Alpha, Theta)',
      'Mental Stress & Brain Workload',
      'Left-Right Brain Activity (%)'
    ],
    icon: '🧠'
  }
};

export default function AIDocumentUpload({ 
  deviceType, 
  submissionId,
  onDataExtracted, 
  onError 
}: AIDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<Record<string, any> | null>(null);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [showManualCorrection, setShowManualCorrection] = useState(false);
  const [manualData, setManualData] = useState<Record<string, any>>({});

  const deviceInfo = DEVICE_INFO[deviceType];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      setExtractedData(null); // Clear previous results
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const extractData = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('deviceType', deviceType);
      
      // Add submissionId if provided
      if (submissionId) {
        formData.append('submissionId', submissionId);
      }

      const response = await fetch('/api/ai-extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract data');
      }

      const result = await response.json();
      
      if (result.success) {
        setExtractedData(result.data);
        setExtractionResult(result);
        
        // Check if we have null values that need manual correction
        const hasNullValues = Object.values(result.data).some(value => value === null);
        if (hasNullValues) {
          setManualData(result.data);
          setShowManualCorrection(true);
        } else {
          onDataExtracted(result.data, result.fileUrl);
        }
      } else {
        onError(result.error || 'Failed to extract data from document');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setExtractedData(null);
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{deviceInfo.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              {deviceInfo.title}
            </h3>
            <p className="text-sm text-secondary-600">
              {deviceInfo.description}
            </p>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              ${isDragActive 
                ? 'border-primary-500 bg-primary-50 scale-105 shadow-lg' 
                : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-25 hover:scale-[1.02]'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="text-6xl">
                {isDragActive ? '📁' : '📄'}
              </div>
              {isDragActive ? (
                <div className="space-y-2">
                  <p className="text-primary-700 font-semibold text-lg">Drop your {deviceType} report here!</p>
                  <p className="text-primary-600 text-sm">Release to upload and analyze</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-secondary-800 font-semibold text-lg">
                    Drag & Drop Your {deviceInfo.title}
                  </p>
                  <p className="text-secondary-600">
                    Simply drag your {deviceType} report from your computer and drop it here
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-secondary-500">
                    <span className="text-sm">or</span>
                    <button 
                      type="button"
                      className="text-primary-600 hover:text-primary-700 font-medium underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        fileInput?.click();
                      }}
                    >
                      click to browse files
                    </button>
                  </div>
                  <div className="bg-secondary-100 rounded-lg p-3 mt-4">
                    <p className="text-xs text-secondary-600 font-medium mb-1">Supported formats:</p>
                    <div className="flex justify-center space-x-4 text-xs text-secondary-500">
                      <span>📷 PNG, JPG</span>
                      <span>📄 PDF</span>
                      <span>🖼️ TIFF</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Preview */}
          {uploadedFile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <p className="font-semibold text-green-800">{uploadedFile.name}</p>
                    <p className="text-sm text-green-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="text-green-400 hover:text-green-600 p-1 rounded-full hover:bg-green-100 transition-colors"
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {uploadedFile && (
              <button
                onClick={extractData}
                disabled={isProcessing}
                className="btn btn-primary flex-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Document...
                  </>
                ) : (
                  'Extract Data with AI'
                )}
              </button>
            )}
          </div>

          {/* Extracted Data Preview */}
          {extractedData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="text-green-500 text-lg">✅</div>
                <div className="flex-1">
                  <p className="font-medium text-green-700 mb-2">Data Successfully Extracted!</p>
                  <div className="text-sm text-green-600">
                    <p className="mb-2">The following metrics have been populated into the form:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(extractedData).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span>{value !== null ? value : 'Not found'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manual Correction Interface */}
          {showManualCorrection && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="text-yellow-500 text-lg">⚠️</div>
                <div className="flex-1">
                  <p className="font-medium text-yellow-700 mb-3">Manual Correction Needed</p>
                  <p className="text-sm text-yellow-600 mb-4">
                    Some values couldn't be extracted automatically. Please review and correct the missing values:
                  </p>
                  
                  <div className="space-y-3">
                    {Object.entries(manualData).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-3">
                        <label className="text-sm font-medium text-yellow-700 min-w-[120px]">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={value === null ? '' : value}
                          onChange={(e) => {
                            const newValue = e.target.value === '' ? null : parseFloat(e.target.value);
                            setManualData(prev => ({ ...prev, [key]: newValue }));
                          }}
                          className="flex-1 px-3 py-1 text-sm border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Enter value..."
                        />
                        {value === null && (
                          <span className="text-xs text-yellow-500">Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        onDataExtracted(manualData, extractionResult?.fileUrl);
                        setShowManualCorrection(false);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      Use Corrected Data
                    </button>
                    <button
                      onClick={() => {
                        setShowManualCorrection(false);
                        onDataExtracted(extractedData!, extractionResult?.fileUrl);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Use Original Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="text-blue-500 text-lg">ℹ️</div>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-2">Metrics that will be extracted:</p>
                <ul className="space-y-1 text-blue-600">
                  {deviceInfo.metrics.map((metric, index) => (
                    <li key={index}>• {metric}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-blue-500">
                  Simply drag & drop your {deviceType} report here, and AI will analyze it to automatically populate the form below. 
                  Review and adjust values as needed before saving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
} 