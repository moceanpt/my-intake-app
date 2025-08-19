/* ------------------------------------------------------------------
   pages/staff/result/[id].jsx
   Comprehensive MOCEAN Health Results Page
   ------------------------------------------------------------------ */
import React from 'react';
import Link from 'next/link';
import prisma from '../../../lib/prisma';
import { scoreObjective } from '@/lib/objective';
import { InBodyResultSection } from '@/components/objective/InBodyResultSection';
import { MusculoskeletalResultSection } from '@/components/objective/MusculoskeletalResultSection';
import { AuraComResultSection } from '@/components/objective/AuraComResultSection';
import CirculationResultSection from '@/components/objective/CirculationResultSection';
import NervousSystemResultSection from '@/components/objective/NervousSystemResultSection';
import ArticularJointResultSection from '@/components/objective/ArticularJointResultSection';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import SuspenseWrapper from '@/components/ui/SuspenseWrapper';

/* ---------- Helper Functions ------------------- */
// Helper function to create history data from assessment metrics
function createHistoryData(metrics, deviceTypes) {
  const devices = Array.isArray(deviceTypes) ? deviceTypes : [deviceTypes];
  
  // Filter metrics for the specified device types
  const deviceMetrics = metrics.filter(m => devices.includes(m.deviceType));
  
  // Group by date and combine metrics from the same day
  const groupedByDate = deviceMetrics.reduce((acc, metric) => {
    const date = metric.collectedAt.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!acc[date]) {
      acc[date] = { date, collectedAt: metric.collectedAt };
    }
    acc[date][metric.metricKey] = metric.value;
    return acc;
  }, {});
  
  // Convert to array and sort by date (newest first)
  return Object.values(groupedByDate).sort((a, b) => 
    new Date(b.collectedAt) - new Date(a.collectedAt)
  );
}

/* ---------- 1. SSR: Load client data ------------------- */
export async function getServerSideProps({ params }) {
  const submissionId = params.id;
  
  // Fetch submission data
  const submission = await prisma.intakeSubmission.findUnique({
    where: { id: submissionId },
    include: { 
      planResults: { 
        where: { stage: 'preview' },
        orderBy: { generatedAt: 'desc' },
        take: 1
      }
    },
  });
  
  if (!submission) return { notFound: true };

  // Fetch all objective metrics for this submission with history
  const assessmentMetrics = await prisma.assessmentMetric.findMany({
    where: { submissionId: submissionId },
    orderBy: { collectedAt: 'desc' }
  });

  // Prepare subjective data for MOCEAN display
  const subjectiveData = {
    radarSubjective: submission.planResults[0]?.resultJson?.radar || {},
    lifestyle: submission.planResults[0]?.resultJson?.lifestyle || {},
    symptomChips: submission.symptomChips || {},
    sliderValues: submission.sliderValues || {},
    discomfort: submission.rawDiscomfort || {},
    history: submission.rawHistory || {},
  };

  // Convert assessment metrics array to organized data structure
  const metricsMap = assessmentMetrics.reduce((acc, metric) => {
    acc[metric.metricKey] = metric.value;
    return acc;
  }, {});

  // Group metrics by device type for better organization
  const metricsByDevice = assessmentMetrics.reduce((acc, metric) => {
    const deviceType = metric.deviceType || 'unknown';
    if (!acc[deviceType]) acc[deviceType] = {};
    acc[deviceType][metric.metricKey] = metric.value;
    return acc;
  }, {});

  // Helper function to get device data or null if empty
  const getDeviceData = (deviceType) => {
    const data = metricsByDevice[deviceType];
    return data && Object.keys(data).length > 0 ? data : null;
  };

  // Prepare organized objective data from all stored metrics
  const objectiveData = assessmentMetrics.length > 0 ? {
    // InBody data
    inbodyData: getDeviceData('inbody') || {
      vfa: metricsMap.vfa || null,
      phase_angle: metricsMap.phase_angle || null,
      rmssd: metricsMap.rmssd || null,
      ecw_tbw: metricsMap.ecw_tbw || null,
      smm_pct: metricsMap.smm_pct || null,
      hydration: metricsMap.hydration || null,
      body_fat_pct: metricsMap.body_fat_pct || null,
      weight: metricsMap.weight || null,
      tbw: metricsMap.tbw || null,
    },
    
    // ExBody data
    exbodyData: getDeviceData('exbody') || {
      loss_of_height_in: metricsMap.loss_of_height_in || null,
      misalignment_deviation: metricsMap.misalignment_deviation || null,
      imbalance_deviation: metricsMap.imbalance_deviation || null,
      musculoskeletal_index: metricsMap.musculoskeletal_index || null,
      shoulder_inclination_deg: metricsMap.shoulder_inclination_deg || null,
      shoulder_inclination_mm: metricsMap.shoulder_inclination_mm || null,
      fhp_deg: metricsMap.fhp_deg || null,
      fhp_mm: metricsMap.fhp_mm || null,
      pcmt_lb: metricsMap.pcmt_lb || null,
      pelvic_tilt_deg: metricsMap.pelvic_tilt_deg || null,
      pelvic_tilt_mm: metricsMap.pelvic_tilt_mm || null,
      knee_flexion_ext_deg: metricsMap.knee_flexion_ext_deg || null,
      knee_flexion_ext_mm: metricsMap.knee_flexion_ext_mm || null,
    },
    
    // ROM data - transform left/right fields to nested object format expected by scoring function
    romData: (() => {
      const romDeviceData = getDeviceData('exbody_rom') || getDeviceData('rom') || {};
      // Fallback to flat metricsMap when grouped device data is empty
      const src = Object.keys(romDeviceData).length > 0 ? romDeviceData : metricsMap;
      
      // Transform to nested object format expected by scoreArticularJointSystemStory
      const transformedRomData = {
        // Neck measurements
        neck_flexion: {
          left: src.neck_flexion_left || src.neck_flexion || null,
          right: src.neck_flexion_right || null,
          leftPain: src.neck_flexion_left_pain || false,
          rightPain: src.neck_flexion_right_pain || false
        },
        neck_lateral_flexion: {
          left: src.neck_lateral_flexion_left || null,
          right: src.neck_lateral_flexion_right || null,
          leftPain: src.neck_lateral_flexion_left_pain || false,
          rightPain: src.neck_lateral_flexion_right_pain || false
        },
        
        // Shoulder measurements
        shoulder_abduction: {
          left: src.shoulder_abduction_left || null,
          right: src.shoulder_abduction_right || null,
          leftPain: src.shoulder_abduction_left_pain || false,
          rightPain: src.shoulder_abduction_right_pain || false
        },
        shoulder_flexion: {
          left: src.shoulder_flexion_left || null,
          right: src.shoulder_flexion_right || null,
          leftPain: src.shoulder_flexion_left_pain || false,
          rightPain: src.shoulder_flexion_right_pain || false
        },
        shoulder_extension: {
          left: src.shoulder_extension_left || null,
          right: src.shoulder_extension_right || null,
          leftPain: src.shoulder_extension_left_pain || false,
          rightPain: src.shoulder_extension_right_pain || false
        },
        
        // Trunk measurements
        trunk_lateral_flexion: {
          left: src.trunk_lateral_flexion_left || null,
          right: src.trunk_lateral_flexion_right || null,
          leftPain: src.trunk_lateral_flexion_left_pain || false,
          rightPain: src.trunk_lateral_flexion_right_pain || false
        },
        
        // Hip measurements
        hip_abduction: {
          left: src.hip_abduction_left || null,
          right: src.hip_abduction_right || null,
          leftPain: src.hip_abduction_left_pain || false,
          rightPain: src.hip_abduction_right_pain || false
        },
        hip_flexion: {
          left: src.hip_flexion_left || null,
          right: src.hip_flexion_right || null,
          leftPain: src.hip_flexion_left_pain || false,
          rightPain: src.hip_flexion_right_pain || false
        },
        hip_extension: {
          left: src.hip_extension_left || null,
          right: src.hip_extension_right || null,
          leftPain: src.hip_extension_left_pain || false,
          rightPain: src.hip_extension_right_pain || false
        }
      };
      
      // Only return if we have any ROM data
      const hasRomData = Object.values(transformedRomData).some((group) => {
        return group && (group.left !== null || group.right !== null);
      });
      return hasRomData ? transformedRomData : null;
    })(),
    
    // OmniFit data (PPG and EEG combined)
    omnifitData: getDeviceData('omnifit_ppg') || getDeviceData('omnifit_eeg') || getDeviceData('omnifit') || {
      // PPG metrics
      hrv_index: metricsMap.hrv_index || null,
      stress: metricsMap.stress || null,
      ans_health: metricsMap.ans_health || null,
      ans_age: metricsMap.ans_age || null,
      lf: metricsMap.lf || null,
      hf: metricsMap.hf || null,
      // EEG metrics
      brain_score: metricsMap.brain_score || null,
      mental_stress: metricsMap.mental_stress || null,
      intrinsic_eeg_pf: metricsMap.intrinsic_eeg_pf || null,
      brain_workload: metricsMap.brain_workload || null,
    },
    
    // HeartMath data
    heartmathData: getDeviceData('heartmath') || {
      sdnn: metricsMap.sdnn || null,
      rmssd: metricsMap.rmssd || null, // Note: rmssd might be in InBody too
      lf_hf_ratio: metricsMap.lf_hf_ratio || null,
      total_power: metricsMap.total_power || null,
      lf_power: metricsMap.lf_power || null,
      hf_power: metricsMap.hf_power || null,
      coherence: metricsMap.coherence || null,
    },
    
    // Auracom data
    auracomData: getDeviceData('auracom') || {
      energy_score: metricsMap.energy_score || null,
      vigor: metricsMap.vigor || null,
      stability: metricsMap.stability || null,
      activity_percent: metricsMap.activity_percent || null,
      elemental_balance: metricsMap.elemental_balance || null,
    },
    
    // History tracking - group metrics by collection date
    inbodyHistory: createHistoryData(assessmentMetrics, 'inbody'),
    exbodyHistory: createHistoryData(assessmentMetrics, 'exbody'),
    romHistory: createHistoryData(assessmentMetrics, ['exbody_rom', 'rom']),
    omnifitHistory: createHistoryData(assessmentMetrics, ['omnifit_ppg', 'omnifit_eeg', 'omnifit']),
    heartmathHistory: createHistoryData(assessmentMetrics, 'heartmath'),
    auracomHistory: createHistoryData(assessmentMetrics, 'auracom'),
  } : null;

  return {
    props: {
      submissionId,
      clientId: submission.clientId,
      submittedAt: submission.submittedAt.toISOString(),
      subjectiveData: JSON.parse(JSON.stringify(subjectiveData)),
      objectiveData: JSON.parse(JSON.stringify(objectiveData)),
      hasObjectiveData: assessmentMetrics.length > 0,
    },
  };
}

/* ---------- 2. Main Component ----------------------------------- */
export default function ClientResultPage({ 
  submissionId, 
  clientId, 
  submittedAt,
  subjectiveData, 
  objectiveData,
  hasObjectiveData 
}) {
  
  // Calculate objective scores if data exists
  const objectiveScores = React.useMemo(() => {
    if (!hasObjectiveData || !objectiveData) return null;
    
    try {
      // Combine all objective metrics into a single object
      const allMetrics = {
        ...(objectiveData.inbodyData || {}),
        ...(objectiveData.exbodyData || {}),
        ...(objectiveData.romData || {}),
        ...(objectiveData.auracomData || {}),
        ...(objectiveData.omnifitData || {}),
        ...(objectiveData.heartmathData || {}),
      };
      
      return scoreObjective(allMetrics);
    } catch (error) {
      console.error('Error calculating objective scores:', error);
      return null;
    }
  }, [hasObjectiveData, objectiveData]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      {/* Navigation */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            MOCEAN Health Results
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            <p><strong>Client:</strong> {clientId || 'Anonymous'}</p>
            <p><strong>Assessment Date:</strong> {formatDate(submittedAt)}</p>
            <p><strong>Submission ID:</strong> {submissionId.slice(0, 8)}...</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link 
            href={`/staff/enter/${submissionId}`}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            ← Back to Entry
          </Link>
          <Link 
            href="/staff/dashboard"
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Objective Results Sections */}
      {hasObjectiveData && objectiveData && (
        <>
          <ErrorBoundary>
            <SuspenseWrapper loadingText="Loading musculoskeletal data...">
              <MusculoskeletalResultSection data={objectiveData.exbodyData} history={objectiveData.exbodyHistory} />
            </SuspenseWrapper>
          </ErrorBoundary>
          
          <ErrorBoundary>
            <SuspenseWrapper loadingText="Loading organ system data...">
              <InBodyResultSection data={objectiveData.inbodyData} history={objectiveData.inbodyHistory} sex="M" age={35} />
            </SuspenseWrapper>
          </ErrorBoundary>
          
          <ErrorBoundary>
            <SuspenseWrapper loadingText="Loading circulation data...">
              <CirculationResultSection data={objectiveData.heartmathData} history={objectiveData.heartmathHistory} />
            </SuspenseWrapper>
          </ErrorBoundary>
          
          <ErrorBoundary>
            <SuspenseWrapper loadingText="Loading energy system data...">
              <AuraComResultSection data={objectiveData.auracomData} history={objectiveData.auracomHistory} />
            </SuspenseWrapper>
          </ErrorBoundary>
          
          <ErrorBoundary>
            <SuspenseWrapper loadingText="Loading joint system data...">
              <ArticularJointResultSection data={objectiveData.romData} history={objectiveData.romHistory} />
            </SuspenseWrapper>
          </ErrorBoundary>
          
          <ErrorBoundary>
            <SuspenseWrapper loadingText="Loading nervous system data...">
              <NervousSystemResultSection data={objectiveData.omnifitData} history={objectiveData.omnifitHistory} />
            </SuspenseWrapper>
          </ErrorBoundary>
        </>
      )}

      {/* No Objective Data Message */}
      {!hasObjectiveData && (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '1.5rem', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: '0 0 1rem 0' }}>
            No Objective Metrics Available
          </h3>
          <p style={{ color: '#6b7280', margin: '0 0 1.5rem 0' }}>
            No objective health metrics have been entered for this assessment yet.
          </p>
          <Link 
            href={`/staff/enter/${submissionId}`}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Enter Objective Metrics
          </Link>
        </div>
      )}
    </div>
  );
}
