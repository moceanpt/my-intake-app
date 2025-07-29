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
          {getMetrics(tableType).map((metric) => (
            <div key={metric.name} className="omnifit-table-row">
              <div className="omnifit-table-cell label">{metric.label}</div>
              <div className="omnifit-table-cell input">
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  className="omnifit-input"
                  value={getValue(metric.name)}
                  onChange={(e) => handleValueChange(metric.name, e.target.value)}
                />
              </div>
            </div>
          ))}
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