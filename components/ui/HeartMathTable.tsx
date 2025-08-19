import React from 'react';

interface HeartMathField {
  name: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  tableType: string;
}

interface HeartMathTableProps {
  fields: HeartMathField[];
}

// HeartMath reference ranges for color coding (based on REFERENCE_CHARTS.md)
const HEARTMATH_REFERENCE_RANGES = {
  // Basic HRV metrics - EXACTLY matching REFERENCE_CHARTS.md
  rr_intervals: { min: 0, max: null, optimal: 'Varies', direction: 'higher' },
  mean_hr_bpm: { min: 60, max: 100, optimal: '60-100', direction: 'center' },
  mean_ibi_ms: { min: 600, max: 1000, optimal: '600-1000', direction: 'center' },
  sdnn_ms: { min: 50, max: null, optimal: '≥50', direction: 'higher' }, // FIXED: Reference says ≥50 Green
  rmssd_ms: { min: 40, max: null, optimal: '≥40', direction: 'higher' }, // FIXED: Reference says ≥40 Green
  
  // Power Spectrum & Coherence metrics - EXACTLY matching REFERENCE_CHARTS.md
  total_power: { min: 1000, max: null, optimal: '≥1000', direction: 'higher' }, // FIXED: Reference says ≥1000 Green
  vlf_power: { min: 100, max: 500, optimal: '100-500', direction: 'center' },
  lf_power: { min: 300, max: 1170, optimal: '300-1170', direction: 'center' }, // FIXED: Reference says 300-1170 Green
  hf_power: { min: 300, max: 975, optimal: '300-975', direction: 'center' }, // FIXED: Reference says 300-975 Green
  lf_hf_ratio: { min: 0.5, max: 2.0, optimal: '0.5-2.0', direction: 'center' }, // FIXED: Reference says 0.5-2.0 Green
  normalized_coherence_pct: { min: 60, max: null, optimal: '≥60', direction: 'higher' } // FIXED: Reference says ≥60 Green
};

function getHeartMathInputColor(value: number | string, metricName: string) {
  if (!value || value === '') return '#ffffff'; // White for empty
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const reference = HEARTMATH_REFERENCE_RANGES[metricName];
  
  if (!reference) return '#ffffff';
  
  if (reference.direction === 'higher') {
    // Higher is better (SDNN, RMSSD, total power, coherence) - EXACTLY matching REFERENCE_CHARTS.md
    if (metricName === 'sdnn_ms') {
      if (numValue >= 50) return '#10b981'; // Green (≥50)
      else if (numValue >= 45) return '#fbbf24'; // Yellow (45-49)
      else if (numValue >= 30) return '#f97316'; // Orange (30-44)
      else return '#ef4444'; // Red (<30)
    } else if (metricName === 'rmssd_ms') {
      if (numValue >= 40) return '#10b981'; // Green (≥40)
      else if (numValue >= 35) return '#fbbf24'; // Yellow (35-39)
      else if (numValue >= 20) return '#f97316'; // Orange (20-34)
      else return '#ef4444'; // Red (<20)
    } else if (metricName === 'total_power') {
      if (numValue >= 1000) return '#10b981'; // Green (≥1000)
      else if (numValue >= 750) return '#fbbf24'; // Yellow (750-999)
      else if (numValue >= 500) return '#f97316'; // Orange (500-749)
      else return '#ef4444'; // Red (<500)
    } else if (metricName === 'normalized_coherence_pct') {
      if (numValue >= 60) return '#10b981'; // Green (≥60)
      else if (numValue >= 50) return '#fbbf24'; // Yellow (50-59)
      else if (numValue >= 30) return '#f97316'; // Orange (30-49)
      else return '#ef4444'; // Red (<30)
    } else {
      // RR intervals (any positive value is good)
      if (numValue > 0) return '#10b981'; // Green
      else return '#ef4444'; // Red
    }
  } else if (reference.direction === 'center') {
    // Center range is optimal - EXACTLY matching REFERENCE_CHARTS.md
    if (metricName === 'mean_hr_bpm') {
      if (numValue >= 60 && numValue <= 100) return '#10b981'; // Green (60-100)
      else if (numValue >= 50 && numValue <= 120) return '#fbbf24'; // Yellow (50-120)
      else if (numValue >= 40 && numValue <= 150) return '#f97316'; // Orange (40-150)
      else return '#ef4444'; // Red (<40 or >150)
    } else if (metricName === 'mean_ibi_ms') {
      if (numValue >= 600 && numValue <= 1000) return '#10b981'; // Green (600-1000)
      else if (numValue >= 500 && numValue <= 1500) return '#fbbf24'; // Yellow (500-1500)
      else if (numValue >= 400 && numValue <= 2000) return '#f97316'; // Orange (400-2000)
      else return '#ef4444'; // Red (<400 or >2000)
    } else if (metricName === 'vlf_power') {
      if (numValue >= 100 && numValue <= 500) return '#10b981'; // Green (100-500)
      else if (numValue >= 50 && numValue <= 1000) return '#fbbf24'; // Yellow (50-1000)
      else if (numValue >= 20 && numValue <= 2000) return '#f97316'; // Orange (20-2000)
      else return '#ef4444'; // Red (<20 or >2000)
    } else if (metricName === 'lf_power') {
      if (numValue >= 300 && numValue <= 1170) return '#10b981'; // Green (300-1170) - EXACT reference
      else if (numValue >= 200 && numValue <= 2000) return '#fbbf24'; // Yellow (200-2000)
      else if (numValue >= 100 && numValue <= 3000) return '#f97316'; // Orange (100-3000)
      else return '#ef4444'; // Red (<100 or >3000)
    } else if (metricName === 'hf_power') {
      if (numValue >= 300 && numValue <= 975) return '#10b981'; // Green (300-975) - EXACT reference
      else if (numValue >= 200 && numValue <= 2000) return '#fbbf24'; // Yellow (200-2000)
      else if (numValue >= 100 && numValue <= 3000) return '#f97316'; // Orange (100-3000)
      else return '#ef4444'; // Red (<100 or >3000)
    } else if (metricName === 'lf_hf_ratio') {
      if (numValue >= 0.5 && numValue <= 2.0) return '#10b981'; // Green (0.5-2.0) - EXACT reference
      else if (numValue >= 0.8 && numValue <= 2.5) return '#fbbf24'; // Yellow (0.8-2.5)
      else if (numValue >= 0.21 && numValue <= 4.0) return '#f97316'; // Orange (0.21-4.0)
      else return '#ef4444'; // Red (<0.20 or >4.0)
    }
  }
  
  return '#ffffff'; // Default white
}

const HeartMathTable: React.FC<HeartMathTableProps> = ({ fields }) => {
  const field = fields[0]; // We only have one field for the table
  const tableType = field.tableType;

  // Basic HRV metrics
  const basicMetrics = [
    { name: 'rr_intervals', label: 'R-R Intervals (count)' },
    { name: 'mean_hr_bpm', label: 'Mean Heart Rate (bpm)' },
    { name: 'mean_ibi_ms', label: 'Mean Inter-Beat Interval (ms)' },
    { name: 'sdnn_ms', label: 'SDNN (ms)' },
    { name: 'rmssd_ms', label: 'RMSSD (ms)' },
  ];

  // Power Spectrum & Coherence metrics
  const spectrumMetrics = [
    { name: 'total_power', label: 'Total Power (ms²)' },
    { name: 'vlf_power', label: 'VLF Power (ms²)' },
    { name: 'lf_power', label: 'LF Power (ms²)' },
    { name: 'hf_power', label: 'HF Power (ms²)' },
    { name: 'lf_hf_ratio', label: 'LF/HF Ratio' },
    { name: 'normalized_coherence_pct', label: 'Normalized Coherence (%)' },
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
      case 'basic':
        return 'Basic HRV Metrics';
      case 'spectrum':
        return 'Power Spectrum & Coherence';
      default:
        return tableType.charAt(0).toUpperCase() + tableType.slice(1);
    }
  };

  const getMetrics = (tableType: string) => {
    return tableType === 'basic' ? basicMetrics : spectrumMetrics;
  };

  return (
    <div className="heartmath-table-container">
      <div className="heartmath-section">
        <h4 className="heartmath-section-title">{getTableTitle(tableType)}</h4>
        <div className="heartmath-table">
          <div className="heartmath-table-header">
            <div className="heartmath-table-cell header">Metric</div>
            <div className="heartmath-table-cell header">Value</div>
          </div>
          {getMetrics(tableType).map((metric) => {
            const inputColor = getHeartMathInputColor(getValue(metric.name), metric.name);
            return (
              <div key={metric.name} className="heartmath-table-row">
                <div className="heartmath-table-cell label">{metric.label}</div>
                <div className="heartmath-table-cell input">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="heartmath-input"
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
        .heartmath-table-container {
          margin-bottom: 1.5rem;
          max-width: 600px;
        }
        
        .heartmath-section {
          margin-bottom: 1.5rem;
        }
        
        .heartmath-section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .heartmath-table {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
          background: white;
          font-size: 0.875rem;
        }
        
        .heartmath-table-header {
          display: grid;
          grid-template-columns: 3fr 1fr;
          background: #f9fafb;
          border-bottom: 1px solid #d1d5db;
        }
        
        .heartmath-table-row {
          display: grid;
          grid-template-columns: 3fr 1fr;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .heartmath-table-row:last-child {
          border-bottom: none;
        }
        
        .heartmath-table-cell {
          padding: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .heartmath-table-cell.header {
          font-weight: 600;
          color: #374151;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .heartmath-table-cell.label {
          font-weight: 500;
          color: #4b5563;
          font-size: 0.75rem;
        }
        
        .heartmath-table-cell.input {
          padding: 0.25rem 0.5rem;
        }
        
        .heartmath-input {
          width: 100%;
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          text-align: center;
          min-width: 60px;
          transition: background-color 0.2s ease;
        }
        
        .heartmath-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .heartmath-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default HeartMathTable; 