import React, { useState } from 'react';

// OmniFit reference ranges for color coding (based on REFERENCE_CHARTS.md)
const OMNIFIT_REFERENCE_RANGES = {
  // PPG metrics - EXACTLY matching REFERENCE_CHARTS.md
  hrv_index: { min: 6.0, max: 9.9, optimal: '6.0-9.9', direction: 'higher' }, // FIXED: Reference says 6.0-9.9 Normal
  stress: { min: 0, max: 39, optimal: '<40', direction: 'lower' }, // FIXED: Reference says <40 Low
  ans_health: { min: 5.0, max: 6.9, optimal: '5.0-6.9', direction: 'higher' }, // FIXED: Reference says 5.0-6.9 Normal
  ans_age: { min: -4, max: 4, optimal: '-4 to +4', direction: 'center' }, // FIXED: Reference says -4 to +4 Normal
  lf: { min: 3.59, max: 5.99, optimal: '3.59-5.99', direction: 'center' }, // FIXED: Reference says 3.59-5.99 Normal
  hf: { min: 4.00, max: 5.99, optimal: '4.00-5.99', direction: 'center' }, // FIXED: Reference says 4.00-5.99 Normal
  
  // EEG metrics - EXACTLY matching REFERENCE_CHARTS.md
  brain_score: { min: 80, max: 100, optimal: '≥80', direction: 'higher' }, // FIXED: Reference says ≥80 Green
  mental_stress: { min: 0, max: 2.9, optimal: '<3', direction: 'lower' }, // FIXED: Reference says <3 Green
  intrinsic_eeg_pf: { min: 9.0, max: null, optimal: '≥9.0', direction: 'higher' }, // FIXED: Reference says ≥9.0 Green
  brain_workload: { min: 15, max: 19.5, optimal: '15-19.5', direction: 'center' } // FIXED: Reference says 15-19.5 Green
};

function getOmniFitInputColor(value, metricName) {
  if (!value || value === '') return '#ffffff'; // White for empty
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const reference = OMNIFIT_REFERENCE_RANGES[metricName];
  
  if (!reference) return '#ffffff';
  
  if (reference.direction === 'higher') {
    // Higher is better (HRV index, ANS health, brain score, intrinsic EEG)
    if (metricName === 'hrv_index') {
      if (numValue >= 13.0) return '#10b981'; // Green (Very Good)
      else if (numValue >= 10.0) return '#10b981'; // Green (Good)
      else if (numValue >= 6.0) return '#fbbf24'; // Yellow (Normal)
      else if (numValue >= 5.0) return '#f97316'; // Orange (Warning)
      else return '#ef4444'; // Red (Danger)
    } else if (metricName === 'ans_health') {
      if (numValue >= 9.0) return '#10b981'; // Green (Very Good)
      else if (numValue >= 7.0) return '#10b981'; // Green (Good)
      else if (numValue >= 5.0) return '#fbbf24'; // Yellow (Normal)
      else if (numValue >= 3.0) return '#f97316'; // Orange (Warning)
      else return '#ef4444'; // Red (Danger)
    } else if (metricName === 'brain_score') {
      if (numValue >= 80) return '#10b981'; // Green
      else if (numValue >= 60) return '#fbbf24'; // Yellow
      else if (numValue >= 40) return '#f97316'; // Orange
      else return '#ef4444'; // Red
    } else if (metricName === 'intrinsic_eeg_pf') {
      if (numValue >= 9.0) return '#10b981'; // Green
      else if (numValue >= 8.0) return '#fbbf24'; // Yellow
      else if (numValue >= 7.0) return '#f97316'; // Orange
      else return '#ef4444'; // Red
    }
  } else if (reference.direction === 'lower') {
    // Lower is better (stress, mental stress)
    if (metricName === 'stress') {
      if (numValue < 20) return '#10b981'; // Green (Very Low)
      else if (numValue < 40) return '#10b981'; // Green (Low)
      else if (numValue < 60) return '#fbbf24'; // Yellow (Average)
      else if (numValue < 80) return '#f97316'; // Orange (High)
      else return '#ef4444'; // Red (Very High)
    } else if (metricName === 'mental_stress') {
      if (numValue < 3) return '#10b981'; // Green
      else if (numValue < 5) return '#fbbf24'; // Yellow
      else if (numValue < 7) return '#f97316'; // Orange
      else return '#ef4444'; // Red
    }
  } else if (reference.direction === 'center') {
    // Center range is optimal (ANS age, LF, HF, brain workload)
    if (metricName === 'ans_age') {
      if (numValue >= -4 && numValue <= 4) return '#10b981'; // Green (Normal)
      else if (numValue >= -9 && numValue <= 9) return '#fbbf24'; // Yellow (Good)
      else if (numValue >= -10 && numValue <= 10) return '#f97316'; // Orange (Warning)
      else return '#ef4444'; // Red (Danger)
    } else if (metricName === 'lf') {
      if (numValue >= 3.59 && numValue <= 5.99) return '#10b981'; // Green (Normal)
      else if (numValue >= 2.0 && numValue <= 9.99) return '#fbbf24'; // Yellow (Low/High)
      else return '#ef4444'; // Red (Very Low/Very High)
    } else if (metricName === 'hf') {
      if (numValue >= 4.00 && numValue <= 5.99) return '#10b981'; // Green (Normal)
      else if (numValue >= 2.0 && numValue <= 9.99) return '#fbbf24'; // Yellow (Low/High)
      else return '#ef4444'; // Red (Very Low/Very High)
    } else if (metricName === 'brain_workload') {
      if (numValue >= 15 && numValue <= 19.5) return '#10b981'; // Green
      else if (numValue >= 12 && numValue <= 24.9) return '#fbbf24'; // Yellow
      else if (numValue >= 25 && numValue <= 29.9) return '#f97316'; // Orange
      else return '#ef4444'; // Red
    }
  }
  
  return '#ffffff'; // Default white
}

const OmniFitTableWithCorrection = ({ fields, aiExtractedData = {} }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const hasAIExtractedData = Object.keys(aiExtractedData).length > 0;

  const field = fields[0]; // We only have one field for the table
  const tableType = field.tableType;

  // PPG metrics
  const ppgMetrics = [
    { name: 'hrv_index', label: 'Heart Rate Variability Index' },
    { name: 'stress', label: 'Stress Level (0-100)' },
    { name: 'ans_health', label: 'ANS Health Score' },
    { name: 'ans_age', label: 'ANS Age (years)' },
    { name: 'lf', label: 'Low Frequency Power (ms²)' },
    { name: 'hf', label: 'High Frequency Power (ms²)' },
  ];

  // EEG metrics
  const eegMetrics = [
    { name: 'brain_score', label: 'Brain Function Score (0-100)' },
    { name: 'mental_stress', label: 'Mental Stress Level (0-100)' },
    { name: 'intrinsic_eeg_pf', label: 'Intrinsic EEG Performance Factor' },
    { name: 'brain_workload', label: 'Brain Workload Index' },
  ];

  const handleValueChange = (metricName, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    const currentValues = field.value || {};
    const newValues = { ...currentValues, [metricName]: numValue };
    field.onChange(newValues);
  };

  const getValue = (metricName) => {
    const currentValues = field.value || {};
    return currentValues[metricName] || '';
  };

  const getTableTitle = (tableType) => {
    switch (tableType) {
      case 'ppg':
        return 'Heart Rate Variability & Stress Metrics';
      case 'eeg':
        return 'Brain Function & Mental Stress Metrics';
      default:
        return tableType.charAt(0).toUpperCase() + tableType.slice(1);
    }
  };

  const getMetrics = (tableType) => {
    return tableType === 'ppg' ? ppgMetrics : eegMetrics;
  };

  return (
    <div className="omnifit-table-container">
      {/* Edit Button - only show if AI data exists */}
      {hasAIExtractedData && (
        <div style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={toggleEditMode}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isEditing ? '#2563eb' : '#f3f4f6',
              color: isEditing ? '#ffffff' : '#374151'
            }}
          >
            {isEditing ? 'Done Editing' : 'Edit OmniFit Values'}
          </button>
        </div>
      )}

      <div className="omnifit-section">
        <h4 className="omnifit-section-title">{getTableTitle(tableType)}</h4>
        <div className="omnifit-table">
          <div className="omnifit-table-header">
            <div className="omnifit-table-cell header">METRIC</div>
            <div className="omnifit-table-cell header">VALUE</div>
          </div>
          {getMetrics(tableType).map((metric) => {
            const inputColor = getOmniFitInputColor(getValue(metric.name), metric.name);
            return (
              <div key={metric.name} className="omnifit-table-row">
                <div className="omnifit-table-cell label">{metric.label}</div>
                <div className="omnifit-table-cell input">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="omnifit-input"
                    style={{ 
                      backgroundColor: inputColor,
                      color: inputColor !== '#ffffff' ? '#ffffff' : '#000000',
                      fontWeight: inputColor !== '#ffffff' ? '600' : '400'
                    }}
                    value={getValue(metric.name)}
                    onChange={(e) => handleValueChange(metric.name, e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        .omnifit-table-container {
          margin-bottom: 1.5rem;
          max-width: 600px;
        }
        
        .omnifit-section {
          margin-bottom: 1.5rem;
        }
        
        .omnifit-section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .omnifit-table {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
          background: white;
          font-size: 0.875rem;
        }
        
        .omnifit-table-header {
          display: grid;
          grid-template-columns: 3fr 1fr;
          background: #f9fafb;
          border-bottom: 1px solid #d1d5db;
        }
        
        .omnifit-table-row {
          display: grid;
          grid-template-columns: 3fr 1fr;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .omnifit-table-row:last-child {
          border-bottom: none;
        }
        
        .omnifit-table-cell {
          padding: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .omnifit-table-cell.header {
          font-weight: 600;
          color: #374151;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .omnifit-table-cell.label {
          font-weight: 500;
          color: #4b5563;
          font-size: 0.75rem;
        }
        
        .omnifit-table-cell.input {
          padding: 0.25rem 0.5rem;
        }
        
        .omnifit-input {
          width: 100%;
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          text-align: center;
          min-width: 60px;
          transition: background-color 0.2s ease;
        }
        
        .omnifit-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .omnifit-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .omnifit-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default OmniFitTableWithCorrection;