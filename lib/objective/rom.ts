/* lib/objective/rom.ts
   -------------------------------------------------------------- */
import { z } from 'zod';
import type { MetricSchema } from '../metrics/types';

/* ──────────────────────────────────────────────────────────────
   1. Zod Schema for ROM Measurements
   ──────────────────────────────────────────────────────────── */
export const romSchema = z.object({
  // Neck measurements
  neck_flexion: z.number().optional(),
  neck_lateral_flexion_left: z.number().optional(),
  neck_lateral_flexion_right: z.number().optional(),
  
  // Shoulder measurements (bilateral)
  shoulder_abduction_left: z.number().optional(),
  shoulder_abduction_right: z.number().optional(),
  shoulder_flexion_left: z.number().optional(),
  shoulder_flexion_right: z.number().optional(),
  shoulder_extension_left: z.number().optional(),
  shoulder_extension_right: z.number().optional(),
  
  // Trunk measurements (bilateral)
  trunk_lateral_flexion_left: z.number().optional(),
  trunk_lateral_flexion_right: z.number().optional(),
  
  // Hip measurements (bilateral)
  hip_abduction_left: z.number().optional(),
  hip_abduction_right: z.number().optional(),
  hip_flexion_left: z.number().optional(),
  hip_flexion_right: z.number().optional(),
  hip_extension_left: z.number().optional(),
  hip_extension_right: z.number().optional(),
});

export type ROMInput = z.infer<typeof romSchema>;

/* ──────────────────────────────────────────────────────────────
   2. Scoring Function
   ──────────────────────────────────────────────────────────── */
export function scoreROM(data: ROMInput) {
  // Reference ranges for ROM measurements (degrees)
  const referenceRanges = {
    neck_flexion: { optimal: 45, min: 35 },
    neck_lateral_flexion: { optimal: 22, min: 15 },
    shoulder_abduction: { optimal: 170, min: 140 },
    shoulder_flexion: { optimal: 170, min: 140 },
    shoulder_extension: { optimal: 45, min: 30 },
    trunk_lateral_flexion: { optimal: 35, min: 25 },
    hip_abduction: { optimal: 40, min: 30 },
    hip_flexion: { optimal: 70, min: 60 },
    hip_extension: { optimal: 20, min: 15 },
  };

  const measurements = [
    { key: 'neck_flexion', value: data.neck_flexion, label: 'Neck Flexion' },
    { key: 'neck_lateral_flexion_left', value: data.neck_lateral_flexion_left, label: 'Neck Lateral Flexion (Left)', baseKey: 'neck_lateral_flexion' },
    { key: 'neck_lateral_flexion_right', value: data.neck_lateral_flexion_right, label: 'Neck Lateral Flexion (Right)', baseKey: 'neck_lateral_flexion' },
    { key: 'shoulder_abduction_left', value: data.shoulder_abduction_left, label: 'Shoulder Abduction (Left)', baseKey: 'shoulder_abduction' },
    { key: 'shoulder_abduction_right', value: data.shoulder_abduction_right, label: 'Shoulder Abduction (Right)', baseKey: 'shoulder_abduction' },
    { key: 'shoulder_flexion_left', value: data.shoulder_flexion_left, label: 'Shoulder Flexion (Left)', baseKey: 'shoulder_flexion' },
    { key: 'shoulder_flexion_right', value: data.shoulder_flexion_right, label: 'Shoulder Flexion (Right)', baseKey: 'shoulder_flexion' },
    { key: 'shoulder_extension_left', value: data.shoulder_extension_left, label: 'Shoulder Extension (Left)', baseKey: 'shoulder_extension' },
    { key: 'shoulder_extension_right', value: data.shoulder_extension_right, label: 'Shoulder Extension (Right)', baseKey: 'shoulder_extension' },
    { key: 'trunk_lateral_flexion_left', value: data.trunk_lateral_flexion_left, label: 'Trunk Lateral Flexion (Left)', baseKey: 'trunk_lateral_flexion' },
    { key: 'trunk_lateral_flexion_right', value: data.trunk_lateral_flexion_right, label: 'Trunk Lateral Flexion (Right)', baseKey: 'trunk_lateral_flexion' },
    { key: 'hip_abduction_left', value: data.hip_abduction_left, label: 'Hip Abduction (Left)', baseKey: 'hip_abduction' },
    { key: 'hip_abduction_right', value: data.hip_abduction_right, label: 'Hip Abduction (Right)', baseKey: 'hip_abduction' },
    { key: 'hip_flexion_left', value: data.hip_flexion_left, label: 'Hip Flexion (Left)', baseKey: 'hip_flexion' },
    { key: 'hip_flexion_right', value: data.hip_flexion_right, label: 'Hip Flexion (Right)', baseKey: 'hip_flexion' },
    { key: 'hip_extension_left', value: data.hip_extension_left, label: 'Hip Extension (Left)', baseKey: 'hip_extension' },
    { key: 'hip_extension_right', value: data.hip_extension_right, label: 'Hip Extension (Right)', baseKey: 'hip_extension' },
  ];

  let totalPoints = 0;
  let maxPossiblePoints = 0;
  const results = [];

  measurements.forEach(measurement => {
    if (measurement.value !== undefined && measurement.value !== null) {
      const rangeKey = measurement.baseKey || measurement.key.replace(/_left|_right/, '');
      const range = referenceRanges[rangeKey];
      
      if (range) {
        maxPossiblePoints += 6; // Max points per measurement
        let points = 0;
        let status = 'optimal';
        
        const percentage = (measurement.value / range.optimal) * 100;
        
        if (percentage >= 90) {
          points = 0; // Green - optimal
          status = 'optimal';
        } else if (percentage >= 75) {
          points = 2; // Yellow - mild limitation
          status = 'mild';
        } else if (percentage >= 60) {
          points = 4; // Orange - moderate limitation
          status = 'moderate';
        } else {
          points = 6; // Red - severe limitation
          status = 'severe';
        }
        
        totalPoints += points;
        
        results.push({
          key: measurement.key,
          label: measurement.label,
          value: measurement.value,
          points,
          status,
          percentage: percentage.toFixed(1),
          normalRange: `${range.min}-${range.optimal}°`,
        });
      }
    }
  });

  const score = maxPossiblePoints > 0 ? Math.round(100 - (totalPoints * 100) / maxPossiblePoints) : 0;
  
  let overallStatus = 'optimal';
  if (score >= 85) overallStatus = 'optimal';
  else if (score >= 70) overallStatus = 'mild';
  else if (score >= 55) overallStatus = 'moderate';
  else overallStatus = 'severe';

  return {
    score,
    overallStatus,
    totalPoints,
    maxPossiblePoints,
    measurements: results,
    summary: {
      optimal: results.filter(r => r.status === 'optimal').length,
      mild: results.filter(r => r.status === 'mild').length,
      moderate: results.filter(r => r.status === 'moderate').length,
      severe: results.filter(r => r.status === 'severe').length,
    }
  };
}

/* ──────────────────────────────────────────────────────────────
   3. UI Schema for DeviceForm
   ──────────────────────────────────────────────────────────── */
export const romUI = {
  slug: 'rom',
  title: 'Range of Motion Assessment',
  
  groups: [
    {
      title: 'Neck Measurements',
      section: 'neck',
      fields: [
        { name: 'neck_flexion', label: 'Neck Flexion (°)', widget: 'number' },
        { name: 'neck_lateral_flexion_left', label: 'Neck Lateral Flexion - Left (°)', widget: 'number' },
        { name: 'neck_lateral_flexion_right', label: 'Neck Lateral Flexion - Right (°)', widget: 'number' },
      ],
    },
    {
      title: 'Shoulder Measurements',
      section: 'shoulder',
      fields: [
        { name: 'shoulder_abduction_left', label: 'Shoulder Abduction - Left (°)', widget: 'number' },
        { name: 'shoulder_abduction_right', label: 'Shoulder Abduction - Right (°)', widget: 'number' },
        { name: 'shoulder_flexion_left', label: 'Shoulder Flexion - Left (°)', widget: 'number' },
        { name: 'shoulder_flexion_right', label: 'Shoulder Flexion - Right (°)', widget: 'number' },
        { name: 'shoulder_extension_left', label: 'Shoulder Extension - Left (°)', widget: 'number' },
        { name: 'shoulder_extension_right', label: 'Shoulder Extension - Right (°)', widget: 'number' },
      ],
    },
    {
      title: 'Trunk Measurements',
      section: 'trunk',
      fields: [
        { name: 'trunk_lateral_flexion_left', label: 'Trunk Lateral Flexion - Left (°)', widget: 'number' },
        { name: 'trunk_lateral_flexion_right', label: 'Trunk Lateral Flexion - Right (°)', widget: 'number' },
      ],
    },
    {
      title: 'Hip Measurements',
      section: 'hip',
      fields: [
        { name: 'hip_abduction_left', label: 'Hip Abduction - Left (°)', widget: 'number' },
        { name: 'hip_abduction_right', label: 'Hip Abduction - Right (°)', widget: 'number' },
        { name: 'hip_flexion_left', label: 'Hip Flexion - Left (°)', widget: 'number' },
        { name: 'hip_flexion_right', label: 'Hip Flexion - Right (°)', widget: 'number' },
        { name: 'hip_extension_left', label: 'Hip Extension - Left (°)', widget: 'number' },
        { name: 'hip_extension_right', label: 'Hip Extension - Right (°)', widget: 'number' },
      ],
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   4. MetricSchema for DeviceForm
   ──────────────────────────────────────────────────────────── */
export const romMetricSchema: MetricSchema = {
  slug: 'rom',
  title: 'Range of Motion Assessment',
  fields: [
    // Neck
    { name: 'neck_flexion', label: 'Neck Flexion (°)', widget: 'number', step: 0.1 },
    { name: 'neck_lateral_flexion_left', label: 'Neck Lateral Flexion - Left (°)', widget: 'number', step: 0.1 },
    { name: 'neck_lateral_flexion_right', label: 'Neck Lateral Flexion - Right (°)', widget: 'number', step: 0.1 },
    
    // Shoulder
    { name: 'shoulder_abduction_left', label: 'Shoulder Abduction - Left (°)', widget: 'number', step: 0.1 },
    { name: 'shoulder_abduction_right', label: 'Shoulder Abduction - Right (°)', widget: 'number', step: 0.1 },
    { name: 'shoulder_flexion_left', label: 'Shoulder Flexion - Left (°)', widget: 'number', step: 0.1 },
    { name: 'shoulder_flexion_right', label: 'Shoulder Flexion - Right (°)', widget: 'number', step: 0.1 },
    { name: 'shoulder_extension_left', label: 'Shoulder Extension - Left (°)', widget: 'number', step: 0.1 },
    { name: 'shoulder_extension_right', label: 'Shoulder Extension - Right (°)', widget: 'number', step: 0.1 },
    
    // Trunk
    { name: 'trunk_lateral_flexion_left', label: 'Trunk Lateral Flexion - Left (°)', widget: 'number', step: 0.1 },
    { name: 'trunk_lateral_flexion_right', label: 'Trunk Lateral Flexion - Right (°)', widget: 'number', step: 0.1 },
    
    // Hip
    { name: 'hip_abduction_left', label: 'Hip Abduction - Left (°)', widget: 'number', step: 0.1 },
    { name: 'hip_abduction_right', label: 'Hip Abduction - Right (°)', widget: 'number', step: 0.1 },
    { name: 'hip_flexion_left', label: 'Hip Flexion - Left (°)', widget: 'number', step: 0.1 },
    { name: 'hip_flexion_right', label: 'Hip Flexion - Right (°)', widget: 'number', step: 0.1 },
    { name: 'hip_extension_left', label: 'Hip Extension - Left (°)', widget: 'number', step: 0.1 },
    { name: 'hip_extension_right', label: 'Hip Extension - Right (°)', widget: 'number', step: 0.1 },
  ]
};

export default {
  schema: romSchema,
  scoreROM,
  ui: romUI,
  metricSchema: romMetricSchema,
};
