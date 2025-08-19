import React from 'react';

interface OmniFitField {
  name: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  tableType: string;
}

interface OmniFitTableProps {
  fields: OmniFitField[];
}

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

function getOmniFitInputColor(value: number | string, metricName: string) {
  if (!value || value === '') return '#ffffff'; // White for empty
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const reference = OMNIFIT_REFERENCE_RANGES[metricName];
  
  if (!reference) return '#ffffff';
  
  if (reference.direction === 'higher') {
    // Higher is better (HRV index, ANS health, brain score, intrinsic EEG) - EXACTLY matching REFERENCE_CHARTS.md
    if (metricName === 'hrv_index') {
      if (numValue >= 13.0) return '#10b981'; // Green (Very Good ≥13.0)
      else if (numValue >= 10.0) return '#10b981'; // Green (Good 10.0-12.9)
      else if (numValue >= 6.0) return '#fbbf24'; // Yellow (Normal 6.0-9.9) - EXACT reference
      else if (numValue >= 5.0) return '#f97316'; // Orange (Warning 5.0-5.9)
      else return '#ef4444'; // Red (Danger <5.0)
    } else if (metricName === 'ans_health') {
      if (numValue >= 9.0) return '#10b981'; // Green (Very Good ≥9.0)
      else if (numValue >= 7.0) return '#10b981'; // Green (Good 7.0-8.9)
      else if (numValue >= 5.0) return '#fbbf24'; // Yellow (Normal 5.0-6.9) - EXACT reference
      else if (numValue >= 3.0) return '#f97316'; // Orange (Warning 3.0-4.9)
      else return '#ef4444'; // Red (Danger <3.0)
    } else if (metricName === 'brain_score') {
      if (numValue >= 80) return '#10b981'; // Green (≥80) - EXACT reference
      else if (numValue >= 60) return '#fbbf24'; // Yellow (60-79)
      else if (numValue >= 40) return '#f97316'; // Orange (40-59)
      else return '#ef4444'; // Red (<40)
    } else if (metricName === 'intrinsic_eeg_pf') {
      if (numValue >= 9.0) return '#10b981'; // Green (≥9.0) - EXACT reference
      else if (numValue >= 8.0) return '#fbbf24'; // Yellow (8.0-8.9)
      else if (numValue >= 7.0) return '#f97316'; // Orange (7.0-7.9)
      else return '#ef4444'; // Red (<7.0)
    }
  } else if (reference.direction === 'lower') {
    // Lower is better (stress, mental stress) - EXACTLY matching REFERENCE_CHARTS.md
    if (metricName === 'stress') {
      if (numValue < 20) return '#10b981'; // Green (Very Low <20)
      else if (numValue < 40) return '#10b981'; // Green (Low 20-39) - EXACT reference
      else if (numValue < 60) return '#fbbf24'; // Yellow (Average 40-59) - EXACT reference
      else if (numValue < 80) return '#f97316'; // Orange (High 60-79)
      else return '#ef4444'; // Red (Very High ≥80)
    } else if (metricName === 'mental_stress') {
      if (numValue < 3) return '#10b981'; // Green (<3) - EXACT reference
      else if (numValue < 5) return '#fbbf24'; // Yellow (3-5)
      else if (numValue < 7) return '#f97316'; // Orange (5.1-7)
      else return '#ef4444'; // Red (≥7.1)
    }
  } else if (reference.direction === 'center') {
    // Center range is optimal - EXACTLY matching REFERENCE_CHARTS.md
    if (metricName === 'ans_age') {
      if (numValue >= -4 && numValue <= 4) return '#10b981'; // Green (Normal -4 to +4) - EXACT reference
      else if (numValue >= -9 && numValue <= 9) return '#fbbf24'; // Yellow (Good -9 to +9)
      else if (numValue >= -10 && numValue <= 10) return '#f97316'; // Orange (Warning -10 to +10)
      else return '#ef4444'; // Red (Danger ≥+10 or ≤-10)
    } else if (metricName === 'lf') {
      if (numValue >= 3.59 && numValue <= 5.99) return '#10b981'; // Green (Normal 3.59-5.99) - EXACT reference
      else if (numValue >= 2.0 && numValue <= 9.99) return '#fbbf24'; // Yellow (Low/High 2.0-9.99)
      else return '#ef4444'; // Red (Very Low/Very High <2.0 or >9.99)
    } else if (metricName === 'hf') {
      if (numValue >= 4.00 && numValue <= 5.99) return '#10b981'; // Green (Normal 4.00-5.99) - EXACT reference
      else if (numValue >= 2.0 && numValue <= 9.99) return '#fbbf24'; // Yellow (Low/High 2.0-9.99)
      else return '#ef4444'; // Red (Very Low/Very High <2.0 or >9.99)
    } else if (metricName === 'brain_workload') {
      if (numValue >= 15 && numValue <= 19.5) return '#10b981'; // Green (15-19.5) - EXACT reference
      else if (numValue >= 12 && numValue <= 24.9) return '#fbbf24'; // Yellow (12-14.9 or 19.6-24.9)
      else if (numValue >= 25 && numValue <= 29.9) return '#f97316'; // Orange (25-29.9)
      else return '#ef4444'; // Red (<12 or ≥30)
    }
  }
  
  return '#ffffff'; // Default white
}

const OmniFitTable: React.FC<OmniFitTableProps> = ({ fields }) => {
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

  const handleValueChange = (metricName: string, value: string) => {
    const numValue = value === '' ? '' : parseFloat(value);
    const currentValues = field.value || {};
    const newValues = { ...currentValues, [metricName]: numValue };
    field.onChange(newValues);
  };

  const getValue = (metricName: string) => {
    const currentValues = field.value || {};
    return currentValues[metricName] || '';
  };

  const getTableTitle = (tableType: string) => {
    switch (tableType) {
      case 'ppg':
        return 'Heart Rate Variability & Stress Metrics';
      case 'eeg':
        return 'Brain Function & Mental Stress Metrics';
      default:
        return tableType.charAt(0).toUpperCase() + tableType.slice(1);
    }
  };

  const getMetrics = (tableType: string) => {
    return tableType === 'ppg' ? ppgMetrics : eegMetrics;
  };

  return (
    <div className="omnifit-table-container">
      <div className="omnifit-section">
        <h4 className="omnifit-section-title">{getTableTitle(tableType)}</h4>
        <div className="omnifit-table">
          <div className="omnifit-table-header">
            <div className="omnifit-table-cell header">Metric</div>
            <div className="omnifit-table-cell header">Value</div>
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

export default OmniFitTable; 