import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Card from './Card';

interface AIDocumentUploadProps {
  deviceType: 'inbody' | 'auracom' | 'heartmath' | 'exbody' | 'omnifit';
  onDataExtracted: (data: Record<string, any>) => void;
  onError: (error: string) => void;
}

export default function AIDocumentUpload({ 
  deviceType, 
  onDataExtracted, 
  onError 
}: AIDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
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

      const response = await fetch('/api/ai-extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract data');
      }

      const result = await response.json();
      
      if (result.success) {
        onDataExtracted(result.data);
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
  };

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold text-secondary-900">
          AI Document Analysis
        </h3>
        <p className="text-sm text-secondary-600">
          Upload a scanned document to automatically extract {deviceType} metrics
        </p>
      </Card.Header>
      <Card.Body>
        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-secondary-300 hover:border-secondary-400'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <div className="text-4xl">📄</div>
              {isDragActive ? (
                <p className="text-primary-600 font-medium">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-secondary-700 font-medium">
                    Drag & drop a document here, or click to select
                  </p>
                  <p className="text-sm text-secondary-500 mt-1">
                    Supports: PNG, JPG, PDF, TIFF
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* File Preview */}
          {uploadedFile && (
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📋</div>
                  <div>
                    <p className="font-medium text-secondary-900">{uploadedFile.name}</p>
                    <p className="text-sm text-secondary-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="text-secondary-400 hover:text-secondary-600"
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

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="text-blue-500 text-lg">ℹ️</div>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="space-y-1 text-blue-600">
                  <li>• Upload a scanned {deviceType} report</li>
                  <li>• AI analyzes the document and extracts relevant metrics</li>
                  <li>• Data is automatically populated into the form below</li>
                  <li>• Review and adjust values as needed before saving</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
} 