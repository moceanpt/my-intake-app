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

const HeartMathTable: React.FC<HeartMathTableProps> = ({ fields }) => {
  // Get the first field to access the value (all fields share the same data structure)
  const field = fields[0];

  // Basic HRV Metrics
  const basicMetrics = [
    { name: 'rr_intervals', label: 'R-R Intervals (count)' },
    { name: 'mean_hr_bpm', label: 'Mean Heart Rate (bpm)' },
    { name: 'mean_ibi_ms', label: 'Mean Inter-Beat Interval (ms)' },
    { name: 'sdnn_ms', label: 'SDNN (ms)' },
    { name: 'rmssd_ms', label: 'RMSSD (ms)' },
  ];

  // Power Spectrum & Coherence
  const spectrumMetrics = [
    { name: 'total_power', label: 'Total Power (ms²)' },
    { name: 'vlf_power', label: 'VLF Power (ms²)' },
    { name: 'lf_power', label: 'LF Power (ms²)' },
    { name: 'hf_power', label: 'HF Power (ms²)' },
    { name: 'lf_hf_ratio', label: 'LF/HF Ratio' },
    { name: 'normalized_coherence_pct', label: 'Normalized Coherence (%)' },
  ];

  const getValue = (metricName: string) => {
    const currentValues = field.value || {};
    return currentValues[metricName] || '';
  };

  const handleValueChange = (metricName: string, value: string) => {
    const currentValues = field.value || {};
    const newValues = { ...currentValues, [metricName]: value };
    field.onChange(newValues);
  };

  const renderMetrics = (metrics: Array<{ name: string; label: string }>, title: string) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '0.5rem',
        paddingBottom: '0.25rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {title}
      </h4>
      <div style={{
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        overflow: 'hidden',
        background: 'white',
        fontSize: '0.875rem',
        maxWidth: '600px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr',
          background: '#f9fafb',
          borderBottom: '1px solid #d1d5db'
        }}>
          <div style={{
            padding: '0.5rem',
            fontWeight: 600,
            color: '#374151',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Metric
          </div>
          <div style={{
            padding: '0.5rem',
            fontWeight: 600,
            color: '#374151',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Value
          </div>
        </div>
        {metrics.map((metric, index) => (
          <div key={metric.name} style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 1fr',
            borderBottom: index === metrics.length - 1 ? 'none' : '1px solid #e5e7eb'
          }}>
            <div style={{
              padding: '0.5rem',
              fontWeight: 500,
              color: '#4b5563',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              {metric.label}
            </div>
            <div style={{
              padding: '0.25rem 0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                style={{
                  width: '100%',
                  padding: '0.25rem 0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  textAlign: 'center',
                  minWidth: '60px'
                }}
                value={getValue(metric.name)}
                onChange={(e) => handleValueChange(metric.name, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: '1.5rem', maxWidth: '600px' }}>
      {/* Always render both sections to show all 11 metrics */}
      {renderMetrics(basicMetrics, 'Basic HRV Metrics')}
      {renderMetrics(spectrumMetrics, 'Power Spectrum & Coherence')}
    </div>
  );
};

export default HeartMathTable; 