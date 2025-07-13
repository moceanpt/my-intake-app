/* pages/staff/enter/[id]/index.jsx */

import Link from 'next/link';
import { useRouter } from 'next/router';
import prisma from '@/lib/prisma';
import { useState, useEffect } from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { OBJECTIVE_SCHEMAS } from '@/lib/objective';
import { omnifitPPGMetricSchema, omnifitEEGMetricSchema } from '@/lib/objective/omnifit';
import MetricField from '@/components/ui/MetricField';
import CheckboxLR from '@/components/ui/CheckboxLR';
import SingleCheckbox from '@/components/ui/SingleCheckbox';
import Card from '@/components/ui/Card';

export async function getServerSideProps({ params }) {
  const sub = await prisma.intakeSubmission.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!sub) return { notFound: true };
  return { props: { submissionId: sub.id } };
}

const DEVICES = [
  { id: 'inbody', name: 'InBody' },
  { id: 'exbody', name: 'ExBody' },
  { id: 'auracom', name: 'Auracom' },
  { id: 'omnifit_ppg', name: 'OmniFit PPG' },
  { id: 'omnifit_eeg', name: 'OmniFit EEG' },
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

export default function ChooseDevice({ submissionId }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [fileLoading, setFileLoading] = useState(false);
  const methods = useForm();
  const [saving, setSaving] = useState(false);

  async function handleFullPdfUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('submissionId', submissionId);
      const res = await fetch('/api/ai-extract-multipage', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setUploadSuccess(true);
      // After upload, fetch all files
      await fetchAllFiles();
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

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
    setUploadedFiles(files);
    setFileLoading(false);
  }

  useEffect(() => {
    fetchAllFiles();
    // eslint-disable-next-line
  }, [submissionId]);

  const saveAll = async (values) => {
    setSaving(true);
    try {
      for (const device of DEVICES) {
        let schema = OBJECTIVE_SCHEMAS[device.id];
        if (device.id === 'omnifit_ppg') schema = omnifitPPGMetricSchema;
        if (device.id === 'omnifit_eeg') schema = omnifitEEGMetricSchema;
        if (schema) {
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
      // Optionally redirect or show success
      setSaving(false);
      alert('All metrics saved!');
    } catch (error) {
      setSaving(false);
      alert('Error saving metrics. Please try again.');
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">
        Enter and Review All Device Metrics
      </h1>

      {/* Upload full PDF */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <label className="block font-semibold mb-2">Upload Client's Result Sheet (PDF with all devices)</label>
        <input type="file" accept="application/pdf" onChange={handleFullPdfUpload} disabled={uploading} />
        {uploading && <div className="text-blue-600 mt-2">Uploading and processing...</div>}
        {uploadSuccess && <div className="text-green-600 mt-2">Upload and extraction complete!</div>}
        {uploadError && <div className="text-red-600 mt-2">{uploadError}</div>}
      </div>

      {/* Show all metrics and scanned images after upload */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(saveAll)} className="space-y-8">
          {DEVICES.map((device) => {
            let schema = OBJECTIVE_SCHEMAS[device.id];
            if (device.id === 'omnifit_ppg') schema = omnifitPPGMetricSchema;
            if (device.id === 'omnifit_eeg') schema = omnifitEEGMetricSchema;
            if (!schema) return null;

            const grouped = groupBySection(flattenFields(schema));
            const fileData = uploadedFiles[device.id];

            return (
              <Card key={device.id}>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-secondary-900">
                      {schema.title}
                    </h2>
                    {fileData && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        ✓ Data Extracted
                      </span>
                    )}
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="flex flex-row gap-8 items-start">
                    {/* Metric Entry Fields */}
                    <div className="flex-1 min-w-[300px] space-y-6">
                      {Object.entries(grouped).map(([section, fields]) => (
                        <div key={section} className="border-t pt-4">
                          {section !== 'root' && (
                            <h3 className="text-lg font-medium text-secondary-800 mb-3">
                              {(schema.groups?.find((g) => g.section === section)?.title) ?? section}
                            </h3>
                          )}
                          <div className="space-y-4">
                            {fields.map((f) => {
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
                    {/* Scanned Image Preview */}
                    {fileData && fileData.fileUrl && (
                      <div className="w-[520px] max-w-full flex-shrink-0 border-l pl-4 flex flex-col items-center">
                        <div className="font-semibold mb-2">Scanned Result</div>
                        <img
                          src={fileData.fileUrl}
                          alt="Scanned result preview"
                          className="w-full h-auto rounded-lg shadow"
                          style={{ maxHeight: '90vh' }}
                        />
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save All Metrics'}
            </button>
          </div>
        </form>
      </FormProvider>
      <Link
        href="/staff/dashboard"
        className="inline-block text-sm text-gray-500 mt-4"
      >
        ← Back to dashboard
      </Link>
    </main>
  );
}