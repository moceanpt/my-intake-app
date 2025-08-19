/* pages/staff/enter/[id]/index.jsx */

import Link from 'next/link';
import { useRouter } from 'next/router';
import prisma from '@/lib/prisma';
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { OBJECTIVE_SCHEMAS } from '@/lib/objective';
import { omnifitPPGMetricSchema, omnifitEEGMetricSchema } from '@/lib/objective/omnifit';
import { heartmathMetricSchema } from '@/lib/objective/heartmath';
import { auracomMetricSchema } from '@/lib/objective/auracom';
import MetricField from '@/components/ui/MetricField';
import MetricFieldWithCorrection from '@/components/ui/MetricFieldWithCorrection';
import CheckboxLR from '@/components/ui/CheckboxLR';
import SingleCheckbox from '@/components/ui/SingleCheckbox';
import ROMTable from '@/components/ui/ROMTable';
import ROMTableWithCorrection from '@/components/ui/ROMTableWithCorrection';
import ExBodyTable from '@/components/ui/ExBodyTable';
import ExBodyTableWithCorrection from '@/components/ui/ExBodyTableWithCorrection';
import InBodyTable from '@/components/ui/InBodyTable';
import InBodyTableWithCorrection from '@/components/ui/InBodyTableWithCorrection';
import OmniFitTable from '@/components/ui/OmniFitTable';
import OmniFitTableWithCorrection from '@/components/ui/OmniFitTableWithCorrection';
import AuraComTable from '@/components/ui/AuraComTable';
import AuraComTableWithCorrection from '@/components/ui/AuraComTableWithCorrection';
import HeartMathTable from '@/components/ui/HeartMathTable';
import HeartMathTableWithCorrection from '@/components/ui/HeartMathTableWithCorrection';
import Card from '@/components/ui/Card';
import DocumentViewer from '@/components/ui/DocumentViewer.jsx';

export async function getServerSideProps({ params }) {
  const sub = await prisma.intakeSubmission.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!sub) return { notFound: true };
  return { props: { submissionId: sub.id } };
}

const DEVICES = [
  { id: 'exbody', name: 'ExBody' },
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

export default function ChooseDevice({ submissionId }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [fileLoading, setFileLoading] = useState(false);
  const [hasMetricsData, setHasMetricsData] = useState(false);
  const [dataSourceTracking, setDataSourceTracking] = useState({});
  const [showDocumentComparison, setShowDocumentComparison] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState('');
  
  const methods = useForm({
    defaultValues: {
      // ExBody Posture & Musculoskeletal Analysis - Mock values showing different color states
      loss_of_height_in: '1.2', // Red (high deviation)
      misalignment_deviation: '15', // Yellow (moderate deviation)
      imbalance_deviation: '8', // Green (low deviation)
      musculoskeletal_index: '25', // Orange (moderate-high deviation)
      shoulder_inclination_deg: '0.5', // Green (optimal)
      shoulder_inclination_mm: '3', // Green (optimal)
      fhp_deg: '25', // Orange (moderate deviation)
      fhp_mm: '8', // Orange (moderate deviation)
      pcmt_lb: '1.5', // Green (optimal)
      pelvic_tilt_deg: '8', // Orange (moderate deviation)
      pelvic_tilt_mm: '15', // Orange (moderate deviation)
      knee_flexion_ext_deg: '3', // Green (optimal range)
      knee_flexion_ext_mm: '2', // Green (optimal)

      // ExBody ROM (Articular Joint System) - Mock values showing different color states
      neck_flexion: { left: '35', leftPain: false }, // Orange (limited ROM)
      neck_lateral_flexion: { left: '40', right: '42', leftPain: false, rightPain: true }, // Green values, pain on right
      shoulder_abduction: { left: '160', right: '175', leftPain: false, rightPain: false }, // Yellow left, Green right
      shoulder_flexion: { left: '140', right: '170', leftPain: true, rightPain: false }, // Orange left, Green right
      shoulder_extension: { left: '50', right: '45', leftPain: false, rightPain: false }, // Green both
      trunk_lateral_flexion: { left: '25', right: '30', leftPain: false, rightPain: false }, // Orange left, Yellow right
      hip_abduction: { left: '35', right: '45', leftPain: false, rightPain: false }, // Orange left, Green right
      hip_flexion: { left: '75', right: '70', leftPain: false, rightPain: false }, // Green both
      hip_extension: { left: '15', right: '25', leftPain: false, rightPain: false }, // Orange left, Green right

      // InBody Body Composition - Mock values showing different color states
      tbw_lb: '120.5', // Green (positive value)
      weight_lb: '180.2', // Green (positive value)
      smm_lb: '85.3', // Green (positive value)
      body_fat_lb: '45.8', // Yellow (moderate body fat)
      pbf_pct: '25.4', // Yellow (moderate percentage)
      ecw_tbw: '0.395', // Orange (moderate deviation)
      vfa_cm2: '85', // Green (optimal)
      phase_angle_deg: '7.2', // Green (optimal)

      // OmniFit PPG (Heart Rate Variability & Stress) - Mock values showing different color states
      omnifit_ppg_table: {
        hrv_index: '11.5', // Green (Good)
        stress: '45', // Yellow (Average)
        ans_health: '8.2', // Green (Good)
        ans_age: '3', // Yellow (Normal range)
        lf: '4.8', // Green (Normal)
        hf: '5.2' // Green (Normal)
      },

      // OmniFit EEG (Brain Function & Mental Stress) - Mock values showing different color states
      omnifit_eeg_table: {
        brain_score: '75', // Yellow (Mild deviation)
        mental_stress: '4.2', // Yellow (Mild stress)
        intrinsic_eeg_pf: '8.8', // Yellow (Mild deviation)
        brain_workload: '22.5' // Yellow (Mild deviation)
      },

      // AuraCom Energy System - Mock values showing different color states
      auracom_table: {
        ava_score: '550', // Green (Balanced)
        vigor: '65', // Orange (Moderate imbalance)
        stability: '45', // Green (Balanced)
        activity_percent: '70', // Orange (Moderate imbalance)
        wood: '105', // Green (Balanced)
        fire: '88', // Yellow (Mild imbalance)
        earth: '95', // Green (Balanced)
        metal: '112', // Yellow (Mild imbalance)
        water: '92', // Yellow (Mild imbalance)
        overall_balance_score: '98' // Green (Balanced)
      },

      // HeartMath HRV & Coherence - Mock values showing different color states
      heartmath_table: {
        rr_intervals: '450', // Green (positive value)
        mean_hr_bpm: '72', // Green (optimal range)
        mean_ibi_ms: '833', // Green (optimal range)
        sdnn_ms: '42', // Yellow (mild limitation)
        rmssd_ms: '35', // Yellow (mild limitation)
        total_power: '850', // Yellow (mild limitation)
        vlf_power: '120', // Green (optimal)
        lf_power: '280', // Orange (moderate deviation)
        hf_power: '320', // Green (optimal)
        lf_hf_ratio: '0.88', // Green (optimal)
        normalized_coherence_pct: '45' // Yellow (mild limitation)
      }
    }
  });
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Monitor form changes to detect if any metrics have been entered
  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      // Check if any metric fields have values
      const hasData = Object.values(value).some(val => {
        if (val && typeof val === 'object') {
          // Handle nested objects (like ROM data)
          return Object.values(val).some(v => v !== '' && v !== null && v !== undefined);
        }
        return val !== '' && val !== null && val !== undefined;
      });
      setHasMetricsData(hasData);
    });
    
    return () => subscription.unsubscribe();
  }, [methods]);

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
    console.log('Starting fetchAllFiles...');
    for (const device of DEVICES) {
      try {
        const res = await fetch(`/api/uploaded-files?submissionId=${submissionId}&device=${device.id}`);
        console.log(`API response for ${device.id}:`, res.status, res.ok);
        if (res.ok) {
          const data = await res.json();
          console.log(`Data for ${device.id}:`, data);
          if (data.fileUrl) {
            files[device.id] = {
              fileUrl: data.fileUrl,
              extractedData: data.extractedData || {}
            };
            // Auto-fill form with extracted data
            if (data.extractedData) {
              console.log(`Processing extracted data for ${device.id}:`, data.extractedData);
              // Special handling for ROM data
              if (device.id === 'exbody_rom') {
                const romMappings = {
                  'neck_flexion': { left: 'neck_flexion_left', right: null },
                  'neck_lateral_flexion': { left: 'neck_lateral_flexion_left', right: 'neck_lateral_flexion_right' },
                  'shoulder_abduction': { left: 'shoulder_abduction_left', right: 'shoulder_abduction_right' },
                  'shoulder_flexion': { left: 'shoulder_flexion_left', right: 'shoulder_flexion_right' },
                  'shoulder_extension': { left: 'shoulder_extension_left', right: 'shoulder_extension_right' },
                  'trunk_lateral_flexion': { left: 'trunk_lateral_flexion_left', right: 'trunk_lateral_flexion_right' },
                  'hip_abduction': { left: 'hip_abduction_left', right: 'hip_abduction_right' },
                  'hip_flexion': { left: 'hip_flexion_left', right: 'hip_flexion_right' },
                  'hip_extension': { left: 'hip_extension_left', right: 'hip_extension_right' }
                };

                Object.entries(romMappings).forEach(([romField, mapping]) => {
                  const leftValue = data.extractedData[mapping.left];
                  const rightValue = mapping.right ? data.extractedData[mapping.right] : null;
                  
                  if (leftValue !== null && leftValue !== undefined) {
                    methods.setValue(romField, {
                      left: leftValue,
                      right: rightValue !== null && rightValue !== undefined ? rightValue : '',
                      leftPain: false,
                      rightPain: false
                    });
                  }
                });
              } else if (device.id === 'omnifit_ppg') {
                // Special handling for OmniFit PPG table data
                const tableData = {};
                if (data.extractedData && typeof data.extractedData === 'object') {
                  Object.entries(data.extractedData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                      tableData[key] = value;
                    }
                  });
                }
                if (Object.keys(tableData).length > 0) {
                  console.log(`Setting omnifit_ppg_table with data:`, tableData);
                  methods.setValue('omnifit_ppg_table', tableData);
                  console.log(`After setting, omnifit_ppg_table value:`, methods.getValues('omnifit_ppg_table'));
                }
              } else if (device.id === 'omnifit_eeg') {
                // Special handling for OmniFit EEG table data
                const tableData = {};
                if (data.extractedData && typeof data.extractedData === 'object') {
                  Object.entries(data.extractedData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                      tableData[key] = value;
                    }
                  });
                }
                if (Object.keys(tableData).length > 0) {
                  console.log(`Setting omnifit_eeg_table with data:`, tableData);
                  methods.setValue('omnifit_eeg_table', tableData);
                  console.log(`After setting, omnifit_eeg_table value:`, methods.getValues('omnifit_eeg_table'));
                }
              } else if (device.id === 'auracom') {
                // Special handling for AuraCom table data
                const tableData = {};
                if (data.extractedData && typeof data.extractedData === 'object') {
                  Object.entries(data.extractedData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                      tableData[key] = value;
                    }
                  });
                }
                if (Object.keys(tableData).length > 0) {
                  methods.setValue('auracom_table', tableData);
                }
              } else if (device.id === 'heartmath') {
                // Special handling for HeartMath table data
                const tableData = {};
                if (data.extractedData && typeof data.extractedData === 'object') {
                  Object.entries(data.extractedData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                      tableData[key] = value;
                    }
                  });
                }
                if (Object.keys(tableData).length > 0) {
                  // Map the extracted data to the correct HeartMath field structure
                  const basicData = {};
                  const spectrumData = {};
                  
                  // Basic HRV metrics
                  if (tableData.rr_intervals !== undefined) basicData.rr_intervals = tableData.rr_intervals;
                  if (tableData.mean_hr_bpm !== undefined) basicData.mean_hr_bpm = tableData.mean_hr_bpm;
                  if (tableData.mean_ibi_ms !== undefined) basicData.mean_ibi_ms = tableData.mean_ibi_ms;
                  if (tableData.sdnn_ms !== undefined) basicData.sdnn_ms = tableData.sdnn_ms;
                  if (tableData.rmssd_ms !== undefined) basicData.rmssd_ms = tableData.rmssd_ms;
                  
                  // Power Spectrum & Coherence metrics
                  if (tableData.total_power !== undefined) spectrumData.total_power = tableData.total_power;
                  if (tableData.vlf_power !== undefined) spectrumData.vlf_power = tableData.vlf_power;
                  if (tableData.lf_power !== undefined) spectrumData.lf_power = tableData.lf_power;
                  if (tableData.hf_power !== undefined) spectrumData.hf_power = tableData.hf_power;
                  if (tableData.lf_hf_ratio !== undefined) spectrumData.lf_hf_ratio = tableData.lf_hf_ratio;
                  if (tableData.normalized_coherence_pct !== undefined) spectrumData.normalized_coherence_pct = tableData.normalized_coherence_pct;
                  
                  // Set the values for both HeartMath table sections
                  if (Object.keys(basicData).length > 0) {
                    methods.setValue('heartmath_basic', basicData);
                  }
                  if (Object.keys(spectrumData).length > 0) {
                    methods.setValue('heartmath_spectrum', spectrumData);
                  }
                }
              } else {
                // Regular field mapping for other devices
                Object.entries(data.extractedData).forEach(([key, value]) => {
                  if (value !== null && value !== undefined) {
                    methods.setValue(key, value);
                  }
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching ${device.id} file:`, err);
      }
    }
    console.log('Finished fetchAllFiles, setting files:', files);
    setUploadedFiles(files);
    setFileLoading(false);
  }

  useEffect(() => {
    fetchAllFiles();
    // eslint-disable-next-line
  }, [submissionId]);

  // Debug: Log form values when they change
  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (name === 'omnifit_ppg_table' || name === 'omnifit_eeg_table') {
        console.log(`${name} field changed:`, value);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  // Function to track data source changes
  const updateDataSourceTracking = (fieldName, source) => {
    setDataSourceTracking(prev => ({
      ...prev,
      [fieldName]: {
        source,
        timestamp: new Date().toISOString(),
        originalValue: source === 'ai' ? uploadedFiles[fieldName]?.extractedData?.[fieldName] : null
      }
    }));
  };

  const saveAll = async (values) => {
    setSaving(true);
    try {
      for (const device of DEVICES) {
        let schema = OBJECTIVE_SCHEMAS[device.id];
        if (device.id === 'omnifit_ppg') schema = omnifitPPGMetricSchema;
        if (device.id === 'omnifit_eeg') schema = omnifitEEGMetricSchema;
        if (device.id === 'heartmath') schema = heartmathMetricSchema;
        if (device.id === 'auracom') schema = auracomMetricSchema;
        if (schema) {
          const deviceFields = flattenFields(schema);
          const deviceValues = {};
          deviceFields.forEach(field => {
            if (values[field.name] !== undefined) {
              // Special handling for ROM table data
              if (field.widget === 'rom-table' && values[field.name]) {
                // Each ROM field (e.g., neck_flexion) contains an object { left, right, leftPain, rightPain }
                const rom = values[field.name] || {};
                if (rom.left !== null && rom.left !== undefined && rom.left !== '') {
                  deviceValues[`${field.name}_left`] = rom.left;
                }
                if (rom.right !== null && rom.right !== undefined && rom.right !== '') {
                  deviceValues[`${field.name}_right`] = rom.right;
                }
                if (rom.leftPain) {
                  deviceValues[`${field.name}_left_pain`] = true;
                }
                if (rom.rightPain) {
                  deviceValues[`${field.name}_right_pain`] = true;
                }
              } else if (field.widget === 'omnifit-table' && values[field.name]) {
                // Flatten the table data back to individual fields
                Object.entries(values[field.name]).forEach(([key, value]) => {
                  deviceValues[key] = value;
                });
              } else if (field.widget === 'auracom-table' && values[field.name]) {
                // Flatten the table data back to individual fields
                Object.entries(values[field.name]).forEach(([key, value]) => {
                  deviceValues[key] = value;
                });
              } else if (field.widget === 'heartmath-table' && values[field.name]) {
                // Flatten the HeartMath table data back to individual fields
                Object.entries(values[field.name]).forEach(([key, value]) => {
                  if (value !== null && value !== undefined && value !== '') {
                    deviceValues[key] = value;
                  }
                });
              } else {
                deviceValues[field.name] = values[field.name];
              }
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
      // Return success status instead of showing alert
      setSaving(false);
      return { success: true };
    } catch (error) {
      setSaving(false);
      console.error('Error saving metrics:', error);
      throw error; // Re-throw to be handled by caller
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-4">
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

      {/* Document Comparison & Data Source Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-800">
            📊 Data Source & Manual Correction Summary
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                console.log('View Documents button clicked!');
                setSelectedDeviceType('');
                setShowDocumentComparison(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              📋 View Documents
            </button>
            <span className="text-sm text-blue-600">
              {Object.keys(dataSourceTracking).length} fields tracked
            </span>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* AI Extracted Data Summary */}
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600">🤖</span>
              <span className="font-medium text-green-800">AI Extracted</span>
            </div>
            <div className="text-sm text-green-700">
              {Object.values(dataSourceTracking).filter(track => track.source === 'ai').length} fields
            </div>
          </div>
          
          {/* Manually Corrected Data Summary */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-600">✏️</span>
              <span className="font-medium text-yellow-800">Manually Corrected</span>
            </div>
            <div className="text-sm text-yellow-700">
              {Object.values(dataSourceTracking).filter(track => track.source === 'manual').length} fields
            </div>
          </div>
          
          {/* Data Quality Indicator */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600">📋</span>
              <span className="font-medium text-blue-800">Data Quality</span>
            </div>
            <div className="text-sm text-blue-700">
              {(() => {
                const totalFields = Object.keys(dataSourceTracking).length;
                const aiFields = Object.values(dataSourceTracking).filter(track => track.source === 'ai').length;
                if (totalFields === 0) return 'No data';
                const percentage = Math.round((aiFields / totalFields) * 100);
                return `${percentage}% AI accuracy`;
              })()}
            </div>
          </div>
        </div>
        
        {/* Manual Correction Details */}
        {Object.values(dataSourceTracking).filter(track => track.source === 'manual').length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800 mb-2">Manual Corrections Made:</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              {Object.entries(dataSourceTracking)
                .filter(([_, track]) => track.source === 'manual')
                .map(([fieldName, track]) => (
                  <div key={fieldName} className="flex items-center justify-between">
                    <span>{fieldName}</span>
                    <span className="text-xs">
                      {track.timestamp ? new Date(track.timestamp).toISOString() : 'Unknown time'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Show all metrics and scanned images after upload */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(saveAll)} className="space-y-8">
          {DEVICES.map((device) => {
            let schema = OBJECTIVE_SCHEMAS[device.id];
            if (device.id === 'omnifit_ppg') schema = omnifitPPGMetricSchema;
            if (device.id === 'omnifit_eeg') schema = omnifitEEGMetricSchema;
            if (device.id === 'heartmath') schema = heartmathMetricSchema;
            if (device.id === 'auracom') schema = auracomMetricSchema;
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Device View button clicked for:', device.id);
                          setSelectedDeviceType(device.id);
                          setShowDocumentComparison(true);
                        }}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        📋 View
                      </button>
                      {fileData && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          ✓ Data Extracted
                        </span>
                      )}
                    </div>
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
                            {/* Check if this section has special table fields */}
                            {(() => {
                              const romFields = fields.filter(f => f.widget === 'rom-table');
                              const exbodyFields = fields.filter(f => f.widget === 'exbody-table');
                              const inbodyFields = fields.filter(f => f.widget === 'inbody-table');
                              const omnifitFields = fields.filter(f => f.widget === 'omnifit-table');
                              const auracomFields = fields.filter(f => f.widget === 'auracom-table');
                              const heartmathFields = fields.filter(f => f.widget === 'heartmath-table');
                              const regularFields = fields.filter(f => f.widget !== 'rom-table' && f.widget !== 'exbody-table' && f.widget !== 'inbody-table' && f.widget !== 'omnifit-table' && f.widget !== 'auracom-table' && f.widget !== 'heartmath-table');
                              
                              return (
                                <>
                                  {/* Render regular fields first */}
                                  {regularFields.map((f) => {
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
                                    // Check if we have AI-extracted data for this field
                                    const aiExtractedValue = uploadedFiles[device.id]?.extractedData?.[f.name];
                                    const hasAIValue = aiExtractedValue !== undefined && aiExtractedValue !== null;
                                    
                                    if (hasAIValue) {
                                      // Use enhanced field with manual correction capability
                                      return (
                                        <MetricFieldWithCorrection
                                          key={f.name}
                                          name={f.name}
                                          label={f.label}
                                          step={f.step}
                                          register={methods.register}
                                          aiExtractedValue={aiExtractedValue}
                                          referenceRange={f.reference || 'N/A'}
                                          unit={f.unit || ''}
                                        />
                                      );
                                    } else {
                                      // Use regular field for non-AI data
                                      return (
                                        <MetricField
                                          key={f.name}
                                          name={f.name}
                                          label={f.label}
                                          step={f.step}
                                          register={methods.register}
                                        />
                                      );
                                    }
                                  })}
                                  
                                  {/* Render ROM table if there are ROM fields */}
                                  {romFields.length > 0 && (
                                    <div className="rom-fields-section">
                                      {/* Check if we have AI-extracted ROM data */}
                                      {(() => {
                                        const hasAIRomData = romFields.some(f => 
                                          uploadedFiles[device.id]?.extractedData?.[f.name]
                                        );
                                        
                                        if (hasAIRomData) {
                                          // Use enhanced ROM table with manual correction
                                          return (
                                            <ROMTableWithCorrection 
                                              fields={romFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || { left: '', right: '', leftPain: false, rightPain: false },
                                                onChange: (value) => methods.setValue(f.name, value),
                                                romType: f.romType,
                                                reference: f.reference || 'N/A',
                                                aiExtractedValue: uploadedFiles[device.id]?.extractedData?.[f.name]
                                              }))}
                                            />
                                          );
                                        } else {
                                          // Use regular ROM table
                                          return (
                                            <ROMTable 
                                              fields={romFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || { left: '', right: '', leftPain: false, rightPain: false },
                                                onChange: (value) => methods.setValue(f.name, value),
                                                romType: f.romType,
                                                reference: f.reference || 'N/A'
                                              }))}
                                            />
                                          );
                                        }
                                      })()}
                                    </div>
                                  )}
                                  
                                  {/* Render ExBody table if there are ExBody fields */}
                                  {exbodyFields.length > 0 && (
                                    <div className="exbody-fields-section">
                                      {/* Check if we have AI-extracted ExBody data */}
                                      {(() => {
                                        const hasAIExBodyData = exbodyFields.some(f => 
                                          uploadedFiles[device.id]?.extractedData?.[f.name]
                                        );
                                        
                                        if (hasAIExBodyData) {
                                          // Use enhanced ExBody table with manual correction
                                          return (
                                            <ExBodyTableWithCorrection 
                                              fields={exbodyFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || '',
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType,
                                                reference: f.reference || 'N/A'
                                              }))}
                                              aiExtractedData={uploadedFiles[device.id]?.extractedData || {}}
                                            />
                                          );
                                        } else {
                                          // Use regular ExBody table
                                          return (
                                            <ExBodyTable 
                                              fields={exbodyFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || '',
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType
                                              }))}
                                            />
                                          );
                                        }
                                      })()}
                                    </div>
                                  )}
                                  
                                  {/* Render InBody table if there are InBody fields */}
                                  {inbodyFields.length > 0 && (
                                    <div className="inbody-fields-section">
                                      {/* Check if we have AI-extracted InBody data */}
                                      {(() => {
                                        const hasAIInBodyData = inbodyFields.some(f => 
                                          uploadedFiles[device.id]?.extractedData?.[f.name]
                                        );
                                        
                                        if (hasAIInBodyData) {
                                          // Use enhanced InBody table with manual correction
                                          return (
                                            <InBodyTableWithCorrection 
                                              fields={inbodyFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || '',
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType,
                                                reference: f.reference || 'N/A'
                                              }))}
                                              aiExtractedData={uploadedFiles[device.id]?.extractedData || {}}
                                            />
                                          );
                                        } else {
                                          // Use regular InBody table
                                          return (
                                            <InBodyTable 
                                              fields={inbodyFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || '',
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType
                                              }))}
                                            />
                                          );
                                        }
                                      })()}
                                    </div>
                                  )}
                                  
                                  {/* Render OmniFit table if there are OmniFit fields */}
                                  {omnifitFields.length > 0 && (
                                    <div className="omnifit-fields-section">
                                      {console.log(`OmniFit field value for ${omnifitFields[0].name}:`, methods.watch(omnifitFields[0].name))}
                                      {console.log(`All form values:`, methods.getValues())}
                                      {/* Check if we have AI-extracted OmniFit data */}
                                      {(() => {
                                        // For OmniFit, check if the table field has data (it's a single field containing an object)
                                        const tableFieldName = omnifitFields[0].name; // e.g., 'omnifit_ppg_table'
                                        const tableData = methods.watch(tableFieldName);
                                        const hasAIOmniFitData = tableData && typeof tableData === 'object' && Object.keys(tableData).length > 0;
                                        
                                        if (hasAIOmniFitData) {
                                          // Use enhanced OmniFit table with manual correction
                                          return (
                                            <OmniFitTableWithCorrection 
                                              fields={omnifitFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || {},
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType,
                                                reference: f.reference || 'N/A'
                                              }))}
                                              aiExtractedData={tableData || {}}
                                            />
                                          );
                                        } else {
                                          // Use regular OmniFit table
                                          return (
                                            <OmniFitTable 
                                              fields={omnifitFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || {},
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType
                                              }))}
                                            />
                                          );
                                        }
                                      })()}
                                    </div>
                                  )}

                                  {/* Render Auracom table if there are Auracom fields */}
                                  {auracomFields.length > 0 && (
                                    <div className="auracom-fields-section">
                                      {/* Check if we have AI-extracted AuraCom data */}
                                      {(() => {
                                        // For AuraCom, check if the table field has data (it's a single field containing an object)
                                        const tableFieldName = auracomFields[0].name; // e.g., 'auracom_table'
                                        const tableData = methods.watch(tableFieldName);
                                        const hasAIAuraComData = tableData && typeof tableData === 'object' && Object.keys(tableData).length > 0;
                                        
                                        if (hasAIAuraComData) {
                                          // Use enhanced AuraCom table with manual correction
                                          return (
                                            <AuraComTableWithCorrection 
                                              fields={auracomFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || {},
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType,
                                                reference: f.reference || 'N/A'
                                              }))}
                                              aiExtractedData={tableData || {}}
                                            />
                                          );
                                        } else {
                                          // Use regular AuraCom table
                                          return (
                                            <AuraComTable 
                                              fields={auracomFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || {},
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType
                                              }))}
                                            />
                                          );
                                        }
                                      })()}
                                    </div>
                                  )}

                                  {/* Render HeartMath table if there are HeartMath fields */}
                                  {heartmathFields.length > 0 && (
                                    <div className="heartmath-fields-section">
                                      {/* Check if we have AI-extracted HeartMath data */}
                                      {(() => {
                                        // For HeartMath, check if any of the table fields have data (heartmath_basic or heartmath_spectrum)
                                        const hasAIHeartMathData = heartmathFields.some(f => {
                                          const tableData = methods.watch(f.name);
                                          return tableData && typeof tableData === 'object' && Object.keys(tableData).length > 0;
                                        });
                                        
                                        if (hasAIHeartMathData) {
                                          // Use enhanced HeartMath table with manual correction
                                          return (
                                            <HeartMathTableWithCorrection 
                                              fields={heartmathFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || {},
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType,
                                                reference: f.reference || 'N/A'
                                              }))}
                                              aiExtractedData={(() => {
                                                // Combine all HeartMath table data
                                                const allData = {};
                                                heartmathFields.forEach(f => {
                                                  const tableData = methods.watch(f.name);
                                                  if (tableData && typeof tableData === 'object') {
                                                    Object.assign(allData, tableData);
                                                  }
                                                });
                                                return allData;
                                              })()}
                                            />
                                          );
                                        } else {
                                          // Use regular HeartMath table
                                          return (
                                            <HeartMathTable 
                                              fields={heartmathFields.map(f => ({
                                                name: f.name,
                                                label: f.label,
                                                value: methods.watch(f.name) || {},
                                                onChange: (value) => methods.setValue(f.name, value),
                                                tableType: f.tableType
                                              }))}
                                            />
                                          );
                                        }
                                      })()}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Scanned Image Preview */}
                    {fileData && fileData.fileUrl && (
                      <div className="w-[900px] max-w-full flex-shrink-0 border-l pl-4 flex flex-col items-center">
                        <div className="font-semibold mb-2">Scanned Result</div>
                        <img
                          src={fileData.fileUrl}
                          alt="Scanned result preview"
                          className="w-full h-auto rounded-lg shadow"
                          style={{ 
                            maxHeight: '95vh', 
                            maxWidth: '100%',
                            objectFit: 'contain',
                            minWidth: '800px'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
          <div className="flex justify-between items-center gap-4 pt-6 border-t">
            <div className="flex flex-col">
              <button
                type="button"
                className={`btn ${hasMetricsData ? 'btn-primary' : 'btn-secondary'}`}
                title="Save metrics and view comprehensive health assessment"
                onClick={async () => {
                  setAnalyzing(true);
                  try {
                    // Save the form data first
                    await methods.handleSubmit(saveAll)();
                    // Then navigate to the result page
                    window.location.href = `/staff/result/${submissionId}`;
                  } catch (error) {
                    console.error('Error saving metrics:', error);
                    setAnalyzing(false);
                    alert('Error saving metrics. Please try again.');
                  }
                }}
                disabled={analyzing}
              >
                {analyzing ? '🔄 Saving & Analyzing...' : '📊 Analyze Result'}
                {hasMetricsData && !analyzing && <span className="ml-2 text-xs">(Data Available)</span>}
              </button>
              <span className="text-sm text-gray-500 mt-1">
                {hasMetricsData 
                  ? "Save metrics and view comprehensive health assessment"
                  : "Save metrics and view comprehensive health assessment"
                }
              </span>
            </div>
            <div className="flex gap-4">
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
      <Link
        href="/staff/dashboard"
        className="inline-block text-sm text-gray-500 mt-4"
      >
        ← Back to dashboard
      </Link>

      {/* Document Viewer Modal */}
      {showDocumentComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Document Viewer Test</h2>
              <button
                onClick={() => setShowDocumentComparison(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <p className="text-gray-600 mb-4">Client ID: {submissionId}</p>
              <p className="text-gray-600 mb-4">Device Type: {selectedDeviceType || 'All'}</p>
              <p className="text-green-600 font-medium">✅ Modal is working! The button click is successful.</p>
              <p className="text-gray-600 mt-4">This is a test modal. The DocumentViewer component should be working now.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}