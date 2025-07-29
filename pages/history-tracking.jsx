import React, { useState } from 'react';
import { scoreCirculation, scoreCirculationStories } from '@/lib/objective/circulation';
import { scoreNervous } from '@/lib/objective/nervous';
import { scoreExBodyROM, scoreArticularJointSystemStory } from '@/lib/objective/exbody';
import { scoreInBody, scoreOrganSystemStory } from '@/lib/objective/inbody';
import { scoreAuraCom, scoreEnergySystemStory } from '@/lib/objective/auracom';
import { scoreExBody } from '@/lib/objective/exbody';
import { scoreNervousSystemStory } from '@/lib/objective/omnifit';

// Generate sample history data for demonstration
const dateBase = new Date('2024-01-01');
const dateList = Array.from({ length: 10 }, (_, i) => {
  const d = new Date(dateBase);
  d.setMonth(d.getMonth() + i);
  return d.toISOString().slice(0, 10);
});

// Sample raw data history (what would be collected from devices)
const rawDataHistory = dateList.map((date, i) => ({
  date,
  // InBody data
  hydration: 55 + (i % 3),
  smm_pct: 43 + (i % 2),
  body_fat_pct: 24 - (i % 2),
  ecw_tbw: 0.37 + (i % 3) * 0.01,
  vfa: 82 - (i % 5),
  phase_angle: 6.7 + (i % 2) * 0.1,
  weight: 185 + (i % 4),
  body_fat_mass: 44 + (i % 3),
  smm_mass: 80 + (i % 2),
  tbw: 103 + (i % 3),
  
  // AuraCom data
  ava_score: 510 + i,
  vigor: 63 + (i % 3),
  stability: 33 + (i % 4),
  activity_percent: 52 + (i % 5),
  wood: 60 + (i % 2),
  fire: 62 + (i % 2),
  earth: 62 + (i % 2),
  metal: 61 + (i % 2),
  water: 63 + (i % 2),
  overall_balance_score: 62 + (i % 2),
  
  // Circulation data (OmniFit PPG + HeartMath)
  hrv_index: 10.2 + 0.15 * i,
  lf: 4.0 + 0.1 * i,
  mean_hr_bpm: 72 + (i % 3),
  mean_ibi_ms: 833 + (i % 10),
  sdnn_ms: 45 + 0.3 * i,
  total_power: 750 + 5 * i,
  vlf_power: 300 + (i % 20),
  lf_power: 200 + 5 * i,
  rr_intervals: 65 + (i % 5),
  normalized_coherence_pct: 50 + 0.5 * i,
  
  // Nervous system data (OmniFit EEG + HeartMath + OmniFit PPG)
  brain_score: 75 + (i % 3),
  mental_stress: 2.5 + (i % 2) * 0.5,
  intrinsic_eeg_pf: 8.2 + (i % 2) * 0.1,
  brain_workload: 16 + 0.2 * i,
  lf_hf_ratio: 1.0 + 0.01 * i,
  hf_power: 350 + (i % 30),
  rmssd_ms: 34 + 0.2 * i,
  stress: 25 + (i % 3),
  ans_health: 8.5 + (i % 2) * 0.1,
  ans_age: -8 + (i % 3),
  
  // ExBody ROM data
  neck_flexion: { left: 48 + 0.2 * i, leftPain: false },
  neck_lateral_flexion: { left: 33 + 0.1 * i, right: 36 + 0.1 * i, leftPain: false, rightPain: false },
  shoulder_abduction: { left: 173 + 0.1 * i, right: 176 + 0.1 * i, leftPain: false, rightPain: false },
  shoulder_flexion: { left: 168 + 0.1 * i, right: 173 + 0.1 * i, leftPain: false, rightPain: false },
  shoulder_extension: { left: 48 + 0.1 * i, right: 53 + 0.1 * i, leftPain: false, rightPain: false },
  trunk_lateral_flexion: { left: 38 + 0.1 * i, right: 40 + 0.1 * i, leftPain: false, rightPain: false },
  hip_abduction: { left: 43 + 0.1 * i, right: 46 + 0.1 * i, leftPain: false, rightPain: false },
  hip_flexion: { left: 73 + 0.1 * i, right: 76 + 0.1 * i, leftPain: false, rightPain: false },
  hip_extension: { left: 23 + 0.1 * i, right: 26 + 0.1 * i, leftPain: false, rightPain: false },
  
  // ExBody musculoskeletal data
  loss_of_height_in: (0.5 + 0.02 * i).toFixed(2),
  misalignment_deviation: 10 + i,
  imbalance_deviation: 8 + (i % 3),
  musculoskeletal_index: 18 + i,
  shoulder_inclination_deg: (1.5 + 0.1 * i).toFixed(1),
  shoulder_inclination_mm: (7 + i).toString(),
  fhp_deg: (15 + i).toString(),
  fhp_mm: (18 + i).toString(),
  pcmt_lb: (2.5 + 0.1 * i).toFixed(1),
  pelvic_tilt_deg: (10 + i).toString(),
  pelvic_tilt_mm: (13 + i).toString(),
  knee_flexion_ext_deg: (6 + i).toString(),
  knee_flexion_ext_mm: (9 + i).toString(),
}));

// Calculate scored metrics from raw data
const calculateScoredMetrics = (rawData) => {
  const scored = {};
  
  // Include all raw metrics that are displayed on result sheets
  // InBody/Organ System metrics
  scored.hydration = rawData.hydration;
  scored.smm_pct = rawData.smm_pct;
  scored.body_fat_pct = rawData.body_fat_pct;
  scored.ecw_tbw = rawData.ecw_tbw;
  scored.vfa = rawData.vfa;
  scored.phase_angle = rawData.phase_angle;
  scored.weight = rawData.weight;
  scored.body_fat_mass = rawData.body_fat_mass;
  scored.smm_mass = rawData.smm_mass;
  scored.tbw = rawData.tbw;
  
  // ExBody/Musculoskeletal System metrics
  scored.loss_of_height_in = rawData.loss_of_height_in;
  scored.misalignment_deviation = rawData.misalignment_deviation;
  scored.imbalance_deviation = rawData.imbalance_deviation;
  scored.musculoskeletal_index = rawData.musculoskeletal_index;
  scored.shoulder_inclination_deg = rawData.shoulder_inclination_deg;
  scored.shoulder_inclination_mm = rawData.shoulder_inclination_mm;
  scored.fhp_deg = rawData.fhp_deg;
  scored.fhp_mm = rawData.fhp_mm;
  scored.pcmt_lb = rawData.pcmt_lb;
  scored.pelvic_tilt_deg = rawData.pelvic_tilt_deg;
  scored.pelvic_tilt_mm = rawData.pelvic_tilt_mm;
  scored.knee_flexion_ext_deg = rawData.knee_flexion_ext_deg;
  scored.knee_flexion_ext_mm = rawData.knee_flexion_ext_mm;
  
  // AuraCom/Energy System metrics
  scored.ava_score = rawData.ava_score;
  scored.vigor = rawData.vigor;
  scored.stability = rawData.stability;
  scored.activity_percent = rawData.activity_percent;
  scored.wood = rawData.wood;
  scored.fire = rawData.fire;
  scored.earth = rawData.earth;
  scored.metal = rawData.metal;
  scored.water = rawData.water;
  scored.overall_balance_score = rawData.overall_balance_score;
  
  // Circulation System metrics
  scored.hrv_index = rawData.hrv_index;
  scored.lf = rawData.lf;
  scored.mean_hr_bpm = rawData.mean_hr_bpm;
  scored.mean_ibi_ms = rawData.mean_ibi_ms;
  scored.sdnn_ms = rawData.sdnn_ms;
  scored.total_power = rawData.total_power;
  scored.vlf_power = rawData.vlf_power;
  scored.lf_power = rawData.lf_power;
  scored.rr_intervals = rawData.rr_intervals;
  scored.normalized_coherence_pct = rawData.normalized_coherence_pct;
  
  // Nervous System metrics
  scored.brain_score = rawData.brain_score;
  scored.mental_stress = rawData.mental_stress;
  scored.intrinsic_eeg_pf = rawData.intrinsic_eeg_pf;
  scored.brain_workload = rawData.brain_workload;
  scored.lf_hf_ratio = rawData.lf_hf_ratio;
  scored.hf_power = rawData.hf_power;
  scored.rmssd_ms = rawData.rmssd_ms;
  scored.stress = rawData.stress;
  scored.ans_health = rawData.ans_health;
  scored.ans_age = rawData.ans_age;
  
  // ROM metrics (extract left/right values)
  if (rawData.neck_flexion) {
    scored.neck_flexion_left = rawData.neck_flexion.left;
  }
  if (rawData.neck_lateral_flexion) {
    scored.neck_lateral_flexion_left = rawData.neck_lateral_flexion.left;
    scored.neck_lateral_flexion_right = rawData.neck_lateral_flexion.right;
  }
  if (rawData.shoulder_abduction) {
    scored.shoulder_abduction_left = rawData.shoulder_abduction.left;
    scored.shoulder_abduction_right = rawData.shoulder_abduction.right;
  }
  if (rawData.shoulder_flexion) {
    scored.shoulder_flexion_left = rawData.shoulder_flexion.left;
    scored.shoulder_flexion_right = rawData.shoulder_flexion.right;
  }
  if (rawData.shoulder_extension) {
    scored.shoulder_extension_left = rawData.shoulder_extension.left;
    scored.shoulder_extension_right = rawData.shoulder_extension.right;
  }
  if (rawData.trunk_lateral_flexion) {
    scored.trunk_lateral_flexion_left = rawData.trunk_lateral_flexion.left;
    scored.trunk_lateral_flexion_right = rawData.trunk_lateral_flexion.right;
  }
  if (rawData.hip_abduction) {
    scored.hip_abduction_left = rawData.hip_abduction.left;
    scored.hip_abduction_right = rawData.hip_abduction.right;
  }
  if (rawData.hip_flexion) {
    scored.hip_flexion_left = rawData.hip_flexion.left;
    scored.hip_flexion_right = rawData.hip_flexion.right;
  }
  if (rawData.hip_extension) {
    scored.hip_extension_left = rawData.hip_extension.left;
    scored.hip_extension_right = rawData.hip_extension.right;
  }
  
  // Calculate overall scores for display
  const inbodyResult = scoreOrganSystemStory(rawData);
  scored.organ_score = inbodyResult.overallScore || 0;

  const exbodyResult = scoreExBody({ data: rawData });
  scored.musculoskeletal_score = exbodyResult.bands.musculoskeletal_index?.score || 0;

  const auracomResult = scoreEnergySystemStory(rawData);
  scored.energy_score = auracomResult.overallScore || 0;

  const circulationResult = scoreCirculationStories(rawData);
  scored.circulation_score = circulationResult.overallScore || 0;

  const nervousResult = scoreNervousSystemStory(rawData);
  scored.nervous_score = nervousResult.overallScore || 0;

  const articularJointResult = scoreArticularJointSystemStory(rawData);
  scored.articular_joint_score = articularJointResult.overallScore || 0;
  
  return scored;
};

// Generate scored history data
const scoredHistory = rawDataHistory.map(rawData => ({
  date: rawData.date,
  ...calculateScoredMetrics(rawData)
}));

// Enhanced TrendSparkline component for history tracking
const TrendSparkline = ({ values, dates, title, unit = '' }) => {
  if (!values || values.length === 0) return null;
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  let padTop = range * 0.1;
  let padBottom = range * 0.1;
  
  const paddedMin = min - padBottom;
  const paddedMax = max + padTop;
  const norm = v => 60 - ((v - paddedMin) / (paddedMax - paddedMin)) * 40;
  const points = values.map((v, i) => `${i * 40},${norm(v)}`).join(' ');
  
  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={40 * (values.length - 1) + 8} height={80} style={{ verticalAlign: 'middle' }}>
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            points={points}
          />
          {values.map((v, i) => (
            <g key={i}>
              <text x={i * 40} y={norm(v) - 8} textAnchor="middle" fontSize="10" fill="#222">
                {v}{unit}
              </text>
              <circle cx={i * 40} cy={norm(v)} r={3} fill="#2563eb" stroke="#fff" strokeWidth={1} />
            </g>
          ))}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 10, color: '#888', marginTop: 4 }}>
          {dates && dates.length > 0 && dates.map((d, i) => (
            <span key={i} style={{ minWidth: 40, textAlign: 'center' }}>{d.slice(5, 10)}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// History tracking page component
const HistoryTracking = () => {
  const [selectedSystem, setSelectedSystem] = useState('inbody');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const systems = {
    inbody: {
      name: 'Musculoskeletal System',
      history: scoredHistory,
      metrics: [
        { key: 'exbody_score', label: 'Total MSK Score', unit: '%' },
        { key: 'loss_of_height_in', label: 'Loss of Height (inches)', unit: ' in' },
        { key: 'misalignment_deviation', label: 'Misalignment Deviation', unit: '' },
        { key: 'imbalance_deviation', label: 'Imbalance Deviation', unit: '' },
        { key: 'musculoskeletal_index', label: 'Musculoskeletal Index', unit: '' },
        { key: 'shoulder_inclination_deg', label: 'Shoulder Inclination (degrees)', unit: '°' },
        { key: 'shoulder_inclination_mm', label: 'Shoulder Inclination (mm)', unit: ' mm' },
        { key: 'fhp_deg', label: 'Forward Head Posture (degrees)', unit: '°' },
        { key: 'fhp_mm', label: 'Forward Head Posture (mm)', unit: ' mm' },
        { key: 'pcmt_lb', label: 'Postural Correction Muscle Tension (lb)', unit: ' lb' },
        { key: 'pelvic_tilt_deg', label: 'Pelvic Tilt (degrees)', unit: '°' },
        { key: 'pelvic_tilt_mm', label: 'Pelvic Tilt (mm)', unit: ' mm' },
        { key: 'knee_flexion_ext_deg', label: 'Knee Flexion/Extension (degrees)', unit: '°' },
        { key: 'knee_flexion_ext_mm', label: 'Knee Flexion/Extension (mm)', unit: ' mm' },
      ]
    },
    organ: {
      name: 'Organ System',
      history: scoredHistory,
      metrics: [
        { key: 'organ_score', label: 'Total Organ Score', unit: '%' },
        { key: 'hydration', label: 'Hydration %', unit: '%' },
        { key: 'smm_pct', label: 'SMM %', unit: '%' },
        { key: 'body_fat_pct', label: 'Body Fat %', unit: '%' },
        { key: 'ecw_tbw', label: 'ECW/TBW Ratio', unit: '' },
        { key: 'vfa', label: 'Visceral Fat Area (cm²)', unit: ' cm²' },
        { key: 'phase_angle', label: 'Phase Angle (°)', unit: '°' },
        { key: 'weight', label: 'Weight (lb)', unit: ' lb' },
        { key: 'body_fat_mass', label: 'Body Fat Mass (lb)', unit: ' lb' },
        { key: 'smm_mass', label: 'SMM Mass (lb)', unit: ' lb' },
        { key: 'tbw', label: 'Total Body Water (lb)', unit: ' lb' },
      ]
    },
    circulation: {
      name: 'Circulatory System',
      history: scoredHistory,
      metrics: [
        { key: 'circulation_score', label: 'Total Circulation Score', unit: '%' },
        { key: 'hrv_index', label: 'HRV Index', unit: '' },
        { key: 'lf', label: 'LF Power (log ms²)', unit: '' },
        { key: 'mean_hr_bpm', label: 'Mean Heart Rate (bpm)', unit: ' bpm' },
        { key: 'mean_ibi_ms', label: 'Mean Inter-Beat Interval (ms)', unit: ' ms' },
        { key: 'sdnn_ms', label: 'SDNN (ms)', unit: ' ms' },
        { key: 'total_power', label: 'Total Power (ms²)', unit: ' ms²' },
        { key: 'vlf_power', label: 'VLF Power (ms²)', unit: ' ms²' },
        { key: 'lf_power', label: 'LF Power (ms²)', unit: ' ms²' },
        { key: 'rr_intervals', label: 'R-R Intervals (count)', unit: '' },
        { key: 'normalized_coherence_pct', label: 'Normalized Coherence (%)', unit: '%' },
      ]
    },
    auracom: {
      name: 'Energy System',
      history: scoredHistory,
      metrics: [
        { key: 'energy_score', label: 'Total Energy Score', unit: '%' },
        { key: 'ava_score', label: 'Energy Level', unit: '' },
        { key: 'vigor', label: 'Vigor Level', unit: '' },
        { key: 'stability', label: 'Stability Level', unit: '' },
        { key: 'activity_percent', label: 'Activity Level', unit: '%' },
        { key: 'overall_balance_score', label: 'Overall Energy Balance', unit: '' },
        { key: 'wood', label: 'Detoxification System', unit: '' },
        { key: 'fire', label: 'Circulation System', unit: '' },
        { key: 'earth', label: 'Digestive System', unit: '' },
        { key: 'metal', label: 'Immune System', unit: '' },
        { key: 'water', label: 'Filtration System', unit: '' },
      ]
    },
    rom: {
      name: 'Articular Joint System',
      history: scoredHistory,
      metrics: [
        { key: 'articular_joint_score', label: 'Total ROM Score', unit: '%' },
        { key: 'neck_flexion_left', label: 'Neck Flexion Left', unit: '°' },
        { key: 'neck_lateral_flexion_left', label: 'Neck Lateral Flexion Left', unit: '°' },
        { key: 'neck_lateral_flexion_right', label: 'Neck Lateral Flexion Right', unit: '°' },
        { key: 'shoulder_abduction_left', label: 'Shoulder Abduction Left', unit: '°' },
        { key: 'shoulder_abduction_right', label: 'Shoulder Abduction Right', unit: '°' },
        { key: 'shoulder_flexion_left', label: 'Shoulder Flexion Left', unit: '°' },
        { key: 'shoulder_flexion_right', label: 'Shoulder Flexion Right', unit: '°' },
        { key: 'shoulder_extension_left', label: 'Shoulder Extension Left', unit: '°' },
        { key: 'shoulder_extension_right', label: 'Shoulder Extension Right', unit: '°' },
        { key: 'trunk_lateral_flexion_left', label: 'Trunk Lateral Flexion Left', unit: '°' },
        { key: 'trunk_lateral_flexion_right', label: 'Trunk Lateral Flexion Right', unit: '°' },
        { key: 'hip_abduction_left', label: 'Hip Abduction Left', unit: '°' },
        { key: 'hip_abduction_right', label: 'Hip Abduction Right', unit: '°' },
        { key: 'hip_flexion_left', label: 'Hip Flexion Left', unit: '°' },
        { key: 'hip_flexion_right', label: 'Hip Flexion Right', unit: '°' },
        { key: 'hip_extension_left', label: 'Hip Extension Left', unit: '°' },
        { key: 'hip_extension_right', label: 'Hip Extension Right', unit: '°' },
      ]
    },
    nervous: {
      name: 'Nervous System',
      history: scoredHistory,
      metrics: [
        { key: 'nervous_score', label: 'Total Nervous Score', unit: '%' },
        { key: 'brain_score', label: 'Overall Brain Function Score', unit: '' },
        { key: 'mental_stress', label: 'Mental Stress Level', unit: '' },
        { key: 'intrinsic_eeg_pf', label: 'Intrinsic EEG Performance Factor', unit: ' Hz' },
        { key: 'brain_workload', label: 'Brain Workload Index', unit: ' Hz' },
        { key: 'lf_hf_ratio', label: 'LF/HF Ratio', unit: '' },
        { key: 'hf_power', label: 'HF Power (ms²)', unit: ' ms²' },
        { key: 'rmssd_ms', label: 'RMSSD (ms)', unit: ' ms' },
        { key: 'normalized_coherence_pct', label: 'Normalized Coherence (%)', unit: '%' },
        { key: 'stress', label: 'Stress Level', unit: '' },
        { key: 'ans_health', label: 'ANS Health Score', unit: '' },
        { key: 'ans_age', label: 'ANS Age (years)', unit: ' years' },
      ]
    }
  };

  const currentSystem = systems[selectedSystem];
  const dates = currentSystem.history.map(h => h.date);

  const getMetricValues = (metricKey) => {
    if (metricKey === 'all') {
      return currentSystem.metrics.map(metric => ({
        ...metric,
        values: currentSystem.history.map(h => h[metric.key] || 0)
      }));
    } else {
      const metric = currentSystem.metrics.find(m => m.key === metricKey);
      if (!metric) return [];
      
      const values = currentSystem.history.map(h => h[metricKey] || 0);
      return [{ ...metric, values }];
    }
  };

  const metricsToShow = getMetricValues(selectedMetric);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Health Metrics History
        </h1>
        <p style={{ fontSize: '1rem', color: '#6b7280' }}>
          Track your health metrics over time to monitor progress and trends
        </p>
      </div>

      {/* System Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Select Health System:
        </label>
        <select
          value={selectedSystem}
          onChange={(e) => {
            setSelectedSystem(e.target.value);
            setSelectedMetric('all');
          }}
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '0.875rem',
            minWidth: '200px'
          }}
        >
          {Object.entries(systems).map(([key, system]) => (
            <option key={key} value={key}>{system.name}</option>
          ))}
        </select>
      </div>

      {/* Metric Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Select Metric:
        </label>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '0.875rem',
            minWidth: '200px'
          }}
        >
          <option value="all">All Metrics</option>
          {currentSystem.metrics.map(metric => (
            <option key={metric.key} value={metric.key}>{metric.label}</option>
          ))}
        </select>
      </div>

      {/* Trends Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {metricsToShow.map((metric) => (
          <TrendSparkline
            key={metric.key}
            values={metric.values}
            dates={dates}
            title={metric.label}
            unit={metric.unit}
          />
        ))}
      </div>

      {/* Summary Statistics */}
      <div style={{ marginTop: '3rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          Summary Statistics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {metricsToShow.map((metric) => {
            const values = metric.values.filter(v => v !== undefined && v !== null);
            if (values.length === 0) return null;
            
            const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
            const min = Math.min(...values);
            const max = Math.max(...values);
            const trend = values.length > 1 ? 
              (values[values.length - 1] - values[0]) / (values.length - 1) : 0;
            
            return (
              <div key={metric.key} style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  <div>Avg: {avg.toFixed(1)}{metric.unit}</div>
                  <div>Range: {min.toFixed(1)} - {max.toFixed(1)}{metric.unit}</div>
                  <div>Trend: {trend > 0 ? '+' : ''}{trend.toFixed(2)}{metric.unit}/month</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryTracking; 