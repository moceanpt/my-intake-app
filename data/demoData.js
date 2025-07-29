// Generate 10 dates for history
const dateBase = new Date('2024-01-01');
const dateList = Array.from({ length: 10 }, (_, i) => {
  const d = new Date(dateBase);
  d.setMonth(d.getMonth() + i);
  return d.toISOString().slice(0, 10);
});

// Sample ExBody (musculoskeletal) data
export const exbodyData = {
  loss_of_height_in: '0.6',
  misalignment_deviation: 12,
  imbalance_deviation: 8,
  musculoskeletal_index: 20,
  shoulder_inclination_deg: '2',
  shoulder_inclination_mm: '8',
  fhp_deg: '18',
  fhp_mm: '20',
  pcmt_lb: '3',
  pelvic_tilt_deg: '12',
  pelvic_tilt_mm: '15',
  knee_flexion_ext_deg: '7',
  knee_flexion_ext_mm: '10',
};

export const exbodyHistory = dateList.map((date, i) => ({
  date,
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

// Sample InBody data for comparison
export const inbodyData = {
  hydration: 60,
  smm_pct: 42,
  body_fat_pct: 18,
  ecw_tbw: 0.38,
  vfa: 90,
  phase_angle: 6.5,
  weight: 170,
  body_fat_mass: 30,
  smm_mass: 70,
  tbw: 100,
};

export const inbodyHistory = dateList.map((date, i) => ({
  date,
  hydration: 54.8 + 0.9 * i,
  smm_pct: 42.5 + 0.1 * i,
  body_fat_pct: 24.5 - 0.7 * i,
  ecw_tbw: 0.372 - 0.0002 * i,
  vfa: 88 - 0.7 * i,
  phase_angle: 6.3 + 0.05 * i,
  weight: 170 - 0.5 * i,
  body_fat_mass: 30 - 0.5 * i,
  smm_mass: 70 + 0.2 * i,
  tbw: 100 + 0.1 * i,
}));

// Sample AuraCom data
export const auracomData = {
  ava_score: 520,
  vigor: 65,
  stability: 35,
  activity_percent: 55,
  wood: 60,  // Low element, but overall balance is also low
  fire: 62,  // Low element, but overall balance is also low  
  earth: 62, // Low element, but overall balance is also low
  metal: 61, // Low element, but overall balance is also low
  water: 63, // Low element, but overall balance is also low
  overall_balance_score: 62, // Low overall balance (< 74 = red)
};

export const auracomHistory = dateList.map((date, i) => ({
  date,
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
}));

// Sample Circulation data (updated with new metrics)
export const circulationData = {
  // OmniFit PPG
  hrv_index: 12.5,      // Yellow (3 pts) - 10.0-12.9
  lf: 5.2,              // Yellow (3 pts) - 3.59-5.99
  
  // HeartMath
  mean_hr_bpm: 72,      // Green (4 pts) - 60-100
  mean_ibi_ms: 833,     // Green (4 pts) - 600-1000
  sdnn_ms: 52,          // Green (4 pts) - ≥50
  total_power: 1200,    // Green (4 pts) - ≥1000
  vlf_power: 300,       // Green (4 pts) - 100-500
  lf_power: 450,        // Green (4 pts) - 300-1170
  rr_intervals: 65,     // Green (4 pts) - ≥60
  normalized_coherence_pct: 55,  // Yellow (3 pts) - 50-59
};

export const circulationHistory = dateList.map((date, i) => ({
  date,
  hrv_index: 10.2 + 0.15 * i,
  stress: 40 - 0.5 * i,
  ans_health: 7.5 + 0.1 * i,
  ans_age: 2 + 0.1 * i,
  lf: 4.0 + 0.1 * i,
  hf: 5.0 + 0.05 * i,
  sdnn_ms: 45 + 0.3 * i,
  rmssd_ms: 34 + 0.2 * i,
  total_power: 750 + 5 * i,
  lf_power: 200 + 5 * i,
  hf_power: 200 + 5 * i,
  lf_hf_ratio: 1.0 + 0.01 * i,
  normalized_coherence_pct: 50 + 0.5 * i,
}));

// Sample Nervous System data (updated with new metrics)
export const nervousData = {
  // OmniFit EEG
  brain_score: 85,           // Green (4 pts) - ≥80
  mental_stress: 2.5,        // Green (4 pts) - <3
  intrinsic_eeg_pf: 9.2,     // Green (4 pts) - ≥9.0
  brain_workload: 17.5,      // Green (4 pts) - 15-19.5
  
  // HeartMath
  lf_hf_ratio: 1.1,          // Green (4 pts) - 0.8-1.25
  hf_power: 350,             // Green (4 pts) - 300-975
  rmssd_ms: 42,              // Green (4 pts) - ≥40
  normalized_coherence_pct: 65,  // Green (4 pts) - ≥60
  
  // OmniFit PPG
  stress: 25,                // Yellow (3 pts) - 20-39
  ans_health: 8.5,           // Yellow (3 pts) - 7.0-8.9
  ans_age: -8                // Yellow (3 pts) - -9 to -5
};

export const nervousHistory = dateList.map((date, i) => ({
  date,
  brain_score: 75 + i,
  mental_stress: 4 + 0.1 * i,
  intrinsic_eeg_pf: 8.2 + 0.05 * i,
  brain_workload: 16 + 0.2 * i,
}));

// Sample ROM (Articular Joint) data
export const romData = {
  neck_flexion: { left: 50, leftPain: false },
  neck_lateral_flexion: { left: 35, right: 38, leftPain: false, rightPain: false },
  shoulder_abduction: { left: 175, right: 178, leftPain: false, rightPain: false },
  shoulder_flexion: { left: 170, right: 175, leftPain: false, rightPain: false },
  shoulder_extension: { left: 50, right: 55, leftPain: false, rightPain: false },
  trunk_lateral_flexion: { left: 40, right: 42, leftPain: false, rightPain: false },
  hip_abduction: { left: 45, right: 48, leftPain: false, rightPain: false },
  hip_flexion: { left: 75, right: 78, leftPain: false, rightPain: false },
  hip_extension: { left: 25, right: 28, leftPain: false, rightPain: false },
};

export const romHistory = dateList.map((date, i) => ({
  date,
  neck_flexion: { left: 48 + 0.2 * i, leftPain: false },
  neck_lateral_flexion: { left: 33 + 0.1 * i, right: 36 + 0.1 * i, leftPain: false, rightPain: false },
  shoulder_abduction: { left: 173 + 0.1 * i, right: 176 + 0.1 * i, leftPain: false, rightPain: false },
  shoulder_flexion: { left: 168 + 0.1 * i, right: 173 + 0.1 * i, leftPain: false, rightPain: false },
  shoulder_extension: { left: 48 + 0.1 * i, right: 53 + 0.1 * i, leftPain: false, rightPain: false },
  trunk_lateral_flexion: { left: 38 + 0.1 * i, right: 40 + 0.1 * i, leftPain: false, rightPain: false },
  hip_abduction: { left: 43 + 0.1 * i, right: 46 + 0.1 * i, leftPain: false, rightPain: false },
  hip_flexion: { left: 73 + 0.1 * i, right: 76 + 0.1 * i, leftPain: false, rightPain: false },
  hip_extension: { left: 23 + 0.1 * i, right: 26 + 0.1 * i, leftPain: false, rightPain: false },
})); 