/* pages/staff/enter/[id]/all-metrics.jsx */

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FormProvider, useForm, Controller, SubmitHandler } from 'react-hook-form';
import prisma from '@/lib/prisma';
import { OBJECTIVE_SCHEMAS } from '@/lib/objective';
import { omnifitPPGMetricSchema, omnifitEEGMetricSchema } from '@/lib/objective/omnifit';
import MetricField from '@/components/ui/MetricField';
import CheckboxLR from '@/components/ui/CheckboxLR';
import SingleCheckbox from '@/components/ui/SingleCheckbox';
import Card from '@/components/ui/Card';
import AIDocumentUpload from '@/components/ui/AIDocumentUpload';

export async function getServerSideProps({ params }) {
  const sub = await prisma.intakeSubmission.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!sub) return { notFound: true };
  return { props: { submissionId: sub.id } };
}

const DEVICES = [
  { id: 'exbody', name: 'ExBody Posture' },
  { id: 'exbody_rom', name: 'ExBody ROM' },
  { id: 'inbody', name: 'InBody' },
  { id: 'omnifit_ppg', name: 'OmniFit PPG' },
  { id: 'omnifit_eeg', name: 'OmniFit EEG' },
  { id: 'auracom', name: 'Auracom' },
  { id: 'heartmath', name: 'HeartMath' },
];

// Helper functions from DeviceForm
function flattenFields(schema) {
  if (Array.isArray(schema.fields)) return schema.fields;
  if (schema.ui) return flattenFields(schema.ui);
  if (Array.isArray(schema.groups))
    return schema.groups.flatMap((g) =>
      g.fields.map((f) => ({ ...f, section: g.section }))
    );
  return [];
}

function groupBySection(fields) {
  return fields.reduce((acc, f) => {
    const key = f.section ?? 'root';
    (acc[key] ??= []).push(f);
    return acc;
  }, {});
}

export default function AllMetrics({ submissionId }) {
  const router = useRouter();
  const methods = useForm();
  const [showAIUpload, setShowAIUpload] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [fileLoading, setFileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all uploaded files on mount
  useEffect(() => {
    let ignore = false;
    async function fetchAllFiles() {
      setFileLoading(true);
      const files = {};
      
      for (const device of DEVICES) {
        try {
          const res = await fetch(`/api/uploaded-files?submissionId=${submissionId}&device=${device.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.fileUrl) {
              files[device.id] = {
                fileUrl: data.fileUrl,
                extractedData: data.extractedData || {}
              };
              
              // Auto-fill form with extracted data
              if (data.extractedData) {
                Object.entries(data.extractedData).forEach(([key, value]) => {
                  if (value !== null && value !== undefined) {
                    methods.setValue(key, value);
                  }
                });
              }
            }
          }
        } catch (err) {
          console.error(`Error fetching ${device.id} file:`, err);
        }
      }
      
      if (!ignore) {
        setUploadedFiles(files);
        setFileLoading(false);
      }
    }
    
    fetchAllFiles();
    return () => { ignore = true; };
  }, [submissionId]);

  // AI data extraction handlers
  const handleDataExtracted = (data, fileUrl, deviceType) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        methods.setValue(key, value);
      }
    });
    
    // Update uploaded files state
    setUploadedFiles(prev => ({
      ...prev,
      [deviceType]: { fileUrl, extractedData: data }
    }));
    
    setShowAIUpload(false);
    setAiError(null);
  };

  const handleAIError = (error) => {
    setAiError(error);
  };

  // Save all metrics
  const saveAll = async (values) => {
    setSaving(true);
    try {
      // Save each device's metrics
      for (const device of DEVICES) {
        let schema = OBJECTIVE_SCHEMAS[device.id];
        if (device.id === 'omnifit_ppg') schema = omnifitPPGMetricSchema;
        if (device.id === 'omnifit_eeg') schema = omnifitEEGMetricSchema;
        if (schema) {
          // Filter values for this device
          const deviceFields = flattenFields(schema);
          const deviceValues = {};
          
          deviceFields.forEach(field => {
            if (values[field.name] !== undefined) {
              deviceValues[field.name] = values[field.name];
            }
          });
          
          if (Object.keys(deviceValues).length > 0) {
            await fetch('/api/metrics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                submissionId, 
                device: device.id, 
                values: deviceValues 
              }),
            });
          }
        }
      }
      
      // Redirect to review page
      router.push(`/staff/review/${submissionId}`);
    } catch (error) {
      console.error('Error saving metrics:', error);
      alert('Error saving metrics. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            All Device Metrics
          </h1>
          <p className="text-secondary-600">
            Enter and review all device metrics in one place
          </p>
          
          {/* AI Upload Toggle */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowAIUpload(!showAIUpload)}
              className="btn btn-outline btn-primary"
            >
              {showAIUpload ? 'Hide' : 'Show'} AI Document Upload
            </button>
          </div>
        </div>

        {/* AI Document Upload Section */}
        {showAIUpload && (
          <div className="mb-6">
            <AIDocumentUpload
              deviceType="inbody" // Default, but will handle all types
              submissionId={submissionId}
              onDataExtracted={handleDataExtracted}
              onError={handleAIError}
            />
          </div>
        )}

        {/* AI Error Display */}
        {aiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="text-red-500">⚠️</div>
              <div className="text-red-700">
                <p className="font-medium">AI Extraction Error:</p>
                <p className="text-sm">{aiError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Files Summary */}
        {Object.keys(uploadedFiles).length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Uploaded Files:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {Object.entries(uploadedFiles).map(([deviceId, fileData]) => (
                <div key={deviceId} className="text-blue-700">
                  <span className="font-medium">{DEVICES.find(d => d.id === deviceId)?.name}:</span>
                  <span className="ml-1">✓ Extracted</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(saveAll)} className="space-y-8">
            {DEVICES.map((device) => {
              let schema = OBJECTIVE_SCHEMAS[device.id];
              if (device.id === 'omnifit_ppg') schema = omnifitPPGMetricSchema;
              if (device.id === 'omnifit_eeg') schema = omnifitEEGMetricSchema;
              if (!schema) return null;

              const grouped = groupBySection(flattenFields(schema));
              const hasUploadedFile = uploadedFiles[device.id];

              return (
                <Card key={device.id}>
                  <Card.Header>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-secondary-900">
                        {schema.title}
                      </h2>
                      {hasUploadedFile && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          ✓ Data Extracted
                        </span>
                      )}
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-6">
                      {Object.entries(grouped).map(([section, fields]) => (
                        <div key={section} className="border-t pt-4">
                          <h3 className="text-lg font-medium text-secondary-800 mb-3">
                            {(schema.groups?.find((g) => g.section === section)?.title) ?? section}
                          </h3>
                          <div className="space-y-4">
                            {fields.map((f) => {
                              /* L/R checkbox pair */
                              if (f.widget === 'checkbox-LR') {
                                return (
                                  <div
                                    key={f.name}
                                    className="grid grid-cols-[minmax(12rem,1fr)_auto_auto] gap-x-4 items-center"
                                  >
                                    <label className="form-label">{f.label}</label>
                                    <Controller
                                      control={methods.control}
                                      name={f.name}
                                      defaultValue={{ L: false, R: false }}
                                      render={({ field }) => (
                                        <CheckboxLR value={field.value} onChange={field.onChange} />
                                      )}
                                    />
                                  </div>
                                );
                              }

                              /* single checkbox */
                              if (f.widget === 'checkbox-single') {
                                return (
                                  <div
                                    key={f.name}
                                    className="grid grid-cols-[minmax(12rem,1fr)_auto] gap-x-4 items-center"
                                  >
                                    <label className="form-label">{f.label}</label>
                                    <Controller
                                      control={methods.control}
                                      name={f.name}
                                      defaultValue={false}
                                      render={({ field }) => (
                                        <SingleCheckbox value={field.value} onChange={field.onChange} />
                                      )}
                                    />
                                  </div>
                                );
                              }

                              /* dropdown (select) */
                              if (f.widget === 'select') {
                                return (
                                  <div key={f.name} className="form-field">
                                    <label className="form-label">{f.label}</label>
                                    <select
                                      className="form-input"
                                      defaultValue=""
                                      {...methods.register(f.name, { required: true })}
                                    >
                                      <option value="" disabled>
                                        — choose —
                                      </option>
                                      {(f.options ?? []).map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              }

                              /* numeric / fallback */
                              return (
                                <MetricField
                                  key={f.name}
                                  name={f.name}
                                  label={f.label}
                                  step={f.step}
                                  register={methods.register}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            <div className="flex justify-between gap-4 pt-6 border-t">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => router.push(`/staff/enter/${submissionId}`)}
              >
                ← Back to Device Selection
              </button>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  className="btn btn-outline btn-primary"
                  onClick={() => router.push(`/staff/review/${submissionId}`)}
                >
                  Review Plan
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save All Metrics'}
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
} 