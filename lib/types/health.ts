// Health System Data Types
export type DeviceType = 'inbody' | 'exbody' | 'auracom' | 'heartmath' | 'omnifit' | 'circulation' | 'nervous';

export type HealthSystem = 
  | 'musculoskeletal_objective'
  | 'organ_digest_hormone_detox'
  | 'energy'
  | 'circulation'
  | 'articular_joint'
  | 'nervous_system';

export type RiskLevel = 'safe' | 'caution' | 'review';
export type StatusLevel = 'optimal' | 'mild' | 'moderate' | 'severe';

// Base interfaces
export interface MetricValue {
  value: number;
  unit?: string;
  timestamp?: Date;
}

export interface HistoryDataPoint {
  date: string;
  value: number;
  unit?: string;
  deviceType?: DeviceType;
}

// Health System Data Interface
export interface HealthSystemData {
  data: Record<string, number>;
  history: HistoryDataPoint[];
  metadata?: {
    collectedAt: Date;
    patientId?: string;
    deviceVersion?: string;
    deviceType: DeviceType;
  };
}

// Scoring Results
export interface ScoringResult {
  score: number;
  status: StatusLevel;
  color: string;
  description: string;
}

// Health System Component Props
export interface HealthSystemProps {
  data: HealthSystemData;
  history: HistoryDataPoint[];
  sex?: 'M' | 'F';
  age?: number;
  className?: string;
}

// Radar Chart Data
export interface RadarData {
  musculoskeletal_objective: number;
  organ_digest_hormone_detox: number;
  energy: number;
  circulation: number;
  articular_joint: number;
  nervous_system: number;
}

// Bucket Data
export interface BucketData {
  cellular: number;
  energy: number;
  gut: number;
  stress: number;
  circulation: number;
  brain: number;
  physical: number;
  performance: number;
}

// Complete Health Assessment
export interface HealthAssessment {
  radar: RadarData;
  bucket: BucketData;
  systems: Record<HealthSystem, ScoringResult>;
  overallScore: number;
  riskLevel: RiskLevel;
  recommendations: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: AppError | null;
  data: any | null;
}

// Form Data Types
export interface IntakeFormData {
  symptomChips: string[];
  sliderValues: Record<string, number>;
  lifestyleAnswers: Record<string, any>;
  stressScores: Record<string, number>;
  supportScores: Record<string, number>;
}

// File Upload Types
export interface UploadedFile {
  id: string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  deviceType?: DeviceType;
  uploadedAt: Date;
  extractedData?: any;
} 