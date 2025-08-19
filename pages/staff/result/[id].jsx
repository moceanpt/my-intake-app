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
    // InBody data - map extracted field names to expected scoring function field names
    inbodyData: (() => {
      const deviceData = getDeviceData('inbody') || {};
      
      // Calculate SMM percentage from SMM mass and Weight
      const smm_pct = (() => {
        const smm = deviceData.smm_lb || metricsMap.smm_lb;
        const weight = deviceData.weight_lb || metricsMap.weight_lb || metricsMap.weight;
        console.log('🔍 DEBUG: SMM calculation - smm:', smm, 'weight:', weight);
        if (smm && weight && weight > 0 && !isNaN(smm) && !isNaN(weight)) {
          const result = (smm / weight) * 100;
          console.log('🔍 DEBUG: SMM calculation result:', result);
          // Round to 1 decimal place for display
          return isNaN(result) ? null : Math.round(result * 10) / 10;
        }
        console.log('🔍 DEBUG: SMM calculation failed - missing or invalid data');
        return null;
      })();
      
      // Calculate hydration percentage from TBW and Weight
      const hydration = (() => {
        const tbw = deviceData.tbw_lb || metricsMap.tbw_lb || metricsMap.tbw;
        const weight = deviceData.weight_lb || metricsMap.weight_lb || metricsMap.weight;
        console.log('🔍 DEBUG: Hydration calculation - tbw:', tbw, 'weight:', weight);
        if (tbw && weight && weight > 0 && !isNaN(tbw) && !isNaN(weight)) {
          const result = (tbw / weight) * 100;
          console.log('🔍 DEBUG: Hydration calculation result:', result);
          // Round to 1 decimal place for display
          return isNaN(result) ? null : Math.round(result * 10) / 10;
        }
        console.log('🔍 DEBUG: Hydration calculation failed - missing or invalid data');
        return null;
      })();
      
      return {
        // Map extracted field names to expected scoring function field names
        vfa: deviceData.vfa_cm2 || metricsMap.vfa_cm2 || metricsMap.vfa || null,
        phase_angle: deviceData.phase_angle_deg || metricsMap.phase_angle_deg || metricsMap.phase_angle || null,
        rmssd: deviceData.rmssd || metricsMap.rmssd || null,
        ecw_tbw: deviceData.ecw_tbw || metricsMap.ecw_tbw || null,
        // Include calculated fields
        smm_pct,
        hydration,
        body_fat_pct: deviceData.pbf_pct || metricsMap.pbf_pct || metricsMap.body_fat_pct || null,
        weight: deviceData.weight_lb || metricsMap.weight_lb || metricsMap.weight || null,
        tbw: deviceData.tbw_lb || metricsMap.tbw_lb || metricsMap.tbw || null,
        // Add missing fields that the scoring function expects
        smm: deviceData.smm_lb || metricsMap.smm_lb || null,
        body_fat_lb: deviceData.body_fat_lb || metricsMap.body_fat_lb || null,
        // Ensure all required fields are present with fallbacks
        vfa_cm2: deviceData.vfa_cm2 || metricsMap.vfa_cm2 || metricsMap.vfa || null,
        phase_angle_deg: deviceData.phase_angle_deg || metricsMap.phase_angle_deg || metricsMap.phase_angle || null,
        pbf_pct: deviceData.pbf_pct || metricsMap.pbf_pct || metricsMap.body_fat_pct || null,
        tbw_lb: deviceData.tbw_lb || metricsMap.tbw_lb || metricsMap.tbw || null,
        weight_lb: deviceData.weight_lb || metricsMap.weight_lb || metricsMap.weight || null,
        smm_lb: deviceData.smm_lb || metricsMap.smm_lb || null,
      };
    })(),
    
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
    
    // OmniFit data (PPG and EEG combined) - map extracted field names correctly
    omnifitData: (() => {
      const deviceData = getDeviceData('omnifit_ppg') || getDeviceData('omnifit_eeg') || getDeviceData('omnifit') || {};
      
      console.log('🔍 DEBUG: OmniFit metricsMap keys:', Object.keys(metricsMap).filter(k => k.includes('brain') || k.includes('mental') || k.includes('eeg') || k.includes('omnifit')));
      console.log('🔍 DEBUG: OmniFit metricsMap values:', {
        brain_score: metricsMap.brain_score,
        mental_stress: metricsMap.mental_stress,
        intrinsic_eeg_pf: metricsMap.intrinsic_eeg_pf,
        brain_workload: metricsMap.brain_workload
      });
      
      return {
        // PPG metrics - map from extracted data structure
        hrv_index: deviceData.hrv_index || metricsMap.hrv_index || null,
        stress: deviceData.stress || metricsMap.stress || null,
        ans_health: deviceData.ans_health || metricsMap.ans_health || null,
        ans_age: deviceData.ans_age || metricsMap.ans_age || null,
        lf: deviceData.lf || metricsMap.lf || null,
        hf: deviceData.hf || metricsMap.hf || null,
        // EEG metrics - map from extracted data structure
        brain_score: deviceData.brain_score || metricsMap.brain_score || null,
        mental_stress: deviceData.mental_stress || metricsMap.mental_stress || null,
        intrinsic_eeg_pf: deviceData.intrinsic_eeg_pf || metricsMap.intrinsic_eeg_pf || null,
        brain_workload: deviceData.brain_workload || metricsMap.brain_workload || null,
        // Additional metrics needed by NervousSystemResultSection
        normalized_coherence: deviceData.normalized_coherence_pct || metricsMap.normalized_coherence_pct || null,
        hf_power: deviceData.hf_power || metricsMap.hf_power || null,
        rmssd_ms: deviceData.rmssd_ms || deviceData.rmssd || metricsMap.rmssd_ms || metricsMap.rmssd || null,
        lf_hf_ratio: deviceData.lf_hf_ratio || metricsMap.lf_hf_ratio || null,
        // Additional metrics that might be in the extracted data
        mental_stress_level: deviceData.mental_stress_level || metricsMap.mental_stress_level || null,
        brain_workload_index: deviceData.brain_workload_index || metricsMap.brain_workload_index || null,
        intrinsic_eeg_performance_factor: deviceData.intrinsic_eeg_performance_factor || metricsMap.intrinsic_eeg_performance_factor || null,
        overall_brain_function_score: deviceData.overall_brain_function_score || metricsMap.overall_brain_function_score || null,
      };
    })(),
    
    // HeartMath data - map extracted field names correctly
    heartmathData: (() => {
      const deviceData = getDeviceData('heartmath') || {};
      
      return {
        // Map extracted field names to expected scoring function field names
        rr_intervals: deviceData.rr_intervals || metricsMap.rr_intervals || null,
        mean_hr_bpm: deviceData.mean_hr_bpm || metricsMap.mean_hr_bpm || null,
        mean_ibi_ms: deviceData.mean_ibi_ms || metricsMap.mean_ibi_ms || null,
        sdnn: deviceData.sdnn_ms || deviceData.sdnn || metricsMap.sdnn_ms || metricsMap.sdnn || null,
        rmssd: deviceData.rmssd_ms || deviceData.rmssd || metricsMap.rmssd_ms || metricsMap.rmssd || null, // Note: rmssd might be in InBody too
        lf_hf_ratio: deviceData.lf_hf_ratio || metricsMap.lf_hf_ratio || null,
        total_power: deviceData.total_power || metricsMap.total_power || null,
        lf_power: deviceData.lf_power || metricsMap.lf_power || null,
        hf_power: deviceData.hf_power || metricsMap.hf_power || null,
        vlf_power: deviceData.vlf_power || metricsMap.vlf_power || null,
        normalized_coherence_pct: deviceData.normalized_coherence_pct || metricsMap.normalized_coherence_pct || null,
      };
    })(),
    
    // Circulation data - combined OmniFit + HeartMath for CirculationResultSection
    circulationData: (() => {
      const omnifitData = getDeviceData('omnifit_ppg') || getDeviceData('omnifit_eeg') || getDeviceData('omnifit') || {};
      const heartmathData = getDeviceData('heartmath') || {};
      
      return {
        // OmniFit PPG metrics (from circulationSchema)
        hrv_index: omnifitData.hrv_index || metricsMap.hrv_index || null,
        stress: omnifitData.stress || metricsMap.stress || null,
        ans_health: omnifitData.ans_health || metricsMap.ans_health || null,
        ans_age: omnifitData.ans_age || metricsMap.ans_age || null,
        lf: omnifitData.lf || metricsMap.lf || null,
        hf: omnifitData.hf || metricsMap.hf || null,
        
        // HeartMath metrics (from circulationSchema)
        sdnn_ms: heartmathData.sdnn_ms || metricsMap.sdnn_ms || null,
        rmssd_ms: heartmathData.rmssd_ms || metricsMap.rmssd_ms || null,
        total_power: heartmathData.total_power || metricsMap.total_power || null,
        lf_power: heartmathData.lf_power || metricsMap.lf_power || null,
        hf_power: heartmathData.hf_power || metricsMap.hf_power || null,
        lf_hf_ratio: heartmathData.lf_hf_ratio || metricsMap.lf_hf_ratio || null,
        normalized_coherence_pct: heartmathData.normalized_coherence_pct || metricsMap.normalized_coherence_pct || null,
        
        // Additional fields needed by CirculationResultSection display
        rr_intervals: heartmathData.rr_intervals || metricsMap.rr_intervals || null,
        mean_hr_bpm: heartmathData.mean_hr_bpm || metricsMap.mean_hr_bpm || null,
        mean_ibi_ms: heartmathData.mean_ibi_ms || metricsMap.mean_ibi_ms || null,
        vlf_power: heartmathData.vlf_power || metricsMap.vlf_power || null,
      };
    })(),
    
    // AuraCom data - map extracted field names correctly
    auracomData: getDeviceData('auracom') || {
      // Map extracted field names to expected scoring function field names
      ava_score: metricsMap.ava_score || null,
      vigor: metricsMap.vigor || null,
      stability: metricsMap.stability || null,
      activity_percent: metricsMap.activity_percent || null,
      wood: metricsMap.wood || null,
      fire: metricsMap.fire || null,
      earth: metricsMap.earth || null,
      metal: metricsMap.metal || null,
      water: metricsMap.water || null,
      overall_balance_score: metricsMap.overall_balance_score || null,
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
      
      // Debug: Log the combined metrics being sent to scoring functions
      console.log('🔍 DEBUG: Combined metrics sent to scoreObjective:', allMetrics);
      console.log('🔍 DEBUG: InBody data:', objectiveData.inbodyData);
      console.log('🔍 DEBUG: ExBody data:', objectiveData.exbodyData);
      console.log('🔍 DEBUG: ROM data:', objectiveData.romData);
      console.log('🔍 DEBUG: AuraCom data:', objectiveData.auracomData);
      console.log('🔍 DEBUG: OmniFit data:', objectiveData.omnifitData);
      console.log('🔍 DEBUG: HeartMath data:', objectiveData.heartmathData);
      
      // Validate that required fields are present for each scoring function
      console.log('🔍 DEBUG: InBody validation - hydration:', allMetrics.hydration, 'smm_pct:', allMetrics.smm_pct, 'body_fat_pct:', allMetrics.body_fat_pct);
      console.log('🔍 DEBUG: AuraCom validation - vigor:', allMetrics.vigor, 'stability:', allMetrics.stability);
      console.log('🔍 DEBUG: HeartMath validation - sdnn:', allMetrics.sdnn, 'rmssd:', allMetrics.rmssd);
      
      try {
        const scores = scoreObjective(allMetrics);
        console.log('🔍 DEBUG: Scoring function returned:', scores);
        return scores;
      } catch (scoringError) {
        console.error('❌ ERROR: Scoring function failed:', scoringError);
        console.error('❌ ERROR: Data that caused failure:', allMetrics);
        return null;
      }
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

      {/* Data Verification Section - Debug Info */}
      {hasObjectiveData && objectiveData && (
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '8px', 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          border: '1px solid #e2e8f0',
          fontSize: '0.875rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>🔍 Data Verification</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>InBody:</strong> {objectiveData.inbodyData ? `${Object.keys(objectiveData.inbodyData).filter(k => objectiveData.inbodyData[k] !== null).length} fields` : 'No data'}
            </div>
            <div>
              <strong>ExBody:</strong> {objectiveData.exbodyData ? `${Object.keys(objectiveData.exbodyData).filter(k => objectiveData.exbodyData[k] !== null).length} fields` : 'No data'}
            </div>
            <div>
              <strong>ROM:</strong> {objectiveData.romData ? `${Object.keys(objectiveData.romData).filter(k => objectiveData.romData[k] !== null).length} fields` : 'No data'}
            </div>
            <div>
              <strong>AuraCom:</strong> {objectiveData.auracomData ? `${Object.keys(objectiveData.auracomData).filter(k => objectiveData.auracomData[k] !== null).length} fields` : 'No data'}
            </div>
            <div>
              <strong>OmniFit:</strong> {objectiveData.omnifitData ? `${Object.keys(objectiveData.omnifitData).filter(k => objectiveData.omnifitData[k] !== null).length} fields` : 'No data'}
            </div>
            <div>
              <strong>HeartMath:</strong> {objectiveData.heartmathData ? `${Object.keys(objectiveData.heartmathData).filter(k => objectiveData.heartmathData[k] !== null).length} fields` : 'No data'}
            </div>
          </div>
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', color: '#3b82f6' }}>View Raw Data</summary>
            <pre style={{ 
              background: 'white', 
              padding: '0.5rem', 
              borderRadius: '4px', 
              overflow: 'auto', 
              fontSize: '0.75rem',
              marginTop: '0.5rem'
            }}>
              {JSON.stringify(objectiveData, null, 2)}
            </pre>
          </details>
        </div>
      )}

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
              <CirculationResultSection data={objectiveData.circulationData} history={objectiveData.heartmathHistory} />
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
          
          {/* Debug: Show what data is being passed to each component */}
          <div style={{ 
            background: '#f0f9ff', 
            borderRadius: '8px', 
            padding: '1rem', 
            marginBottom: '1.5rem', 
            border: '1px solid #0ea5e9',
            fontSize: '0.875rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>🔍 Component Data Debug</h4>
            <details>
              <summary style={{ cursor: 'pointer', color: '#0ea5e9' }}>View Data Passed to Components</summary>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>OmniFit Data (Nervous System):</strong>
                <pre style={{ background: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                  {JSON.stringify(objectiveData.omnifitData, null, 2)}
                </pre>
                <strong>HeartMath Data (Circulation):</strong>
                <pre style={{ background: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                  {JSON.stringify(objectiveData.heartmathData, null, 2)}
                </pre>
                <strong>AuraCom Data (Energy):</strong>
                <pre style={{ background: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                  {JSON.stringify(objectiveData.auracomData, null, 2)}
                </pre>
              </div>
            </details>
          </div>
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
