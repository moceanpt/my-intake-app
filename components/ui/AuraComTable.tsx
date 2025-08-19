import React from 'react';

interface AuraComField {
  name: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  tableType: string;
}

interface AuraComTableProps {
  fields: AuraComField[];
}

// AuraCom reference ranges for color coding (based on REFERENCE_CHARTS.md)
const AURACOM_REFERENCE_RANGES = {
  // Overall Assessment metrics
  ava_score: { min: 500, max: 600, optimal: '500-600', direction: 'center' },
  vigor: { min: 0, max: 100, optimal: 'Balanced', direction: 'center' },
  stability: { min: 0, max: 100, optimal: 'Balanced', direction: 'center' },
  activity_percent: { min: 0, max: 100, optimal: 'Balanced', direction: 'center' },
  
  // Five-Element Balance metrics
  wood: { min: 96, max: 110, optimal: '96-110', direction: 'center' },
  fire: { min: 96, max: 110, optimal: '96-110', direction: 'center' },
  earth: { min: 96, max: 110, optimal: '96-110', direction: 'center' },
  metal: { min: 96, max: 110, optimal: '96-110', direction: 'center' },
  water: { min: 96, max: 110, optimal: '96-110', direction: 'center' },
  overall_balance_score: { min: 96, max: 110, optimal: '96-110', direction: 'center' }
};

function getAuraComInputColor(value: number | string, metricName: string) {
  if (!value || value === '') return '#ffffff'; // White for empty
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const reference = AURACOM_REFERENCE_RANGES[metricName];
  
  if (!reference) return '#ffffff';
  
  if (reference.direction === 'center') {
    // Center range is optimal (balanced energy)
    if (metricName === 'ava_score') {
      if (numValue >= 500 && numValue <= 600) return '#10b981'; // Green (Balanced)
      else if (numValue >= 450 && numValue <= 650) return '#fbbf24'; // Yellow (Mild imbalance)
      else if (numValue >= 400 && numValue <= 700) return '#f97316'; // Orange (Moderate imbalance)
      else return '#ef4444'; // Red (Severe imbalance)
    } else if (metricName === 'vigor' || metricName === 'stability') {
      // Vigor and Stability are balanced when in middle range (40-60)
      if (numValue >= 40 && numValue <= 60) return '#10b981'; // Green (Balanced)
      else if (numValue >= 30 && numValue <= 70) return '#fbbf24'; // Yellow (Mild imbalance)
      else if (numValue >= 20 && numValue <= 80) return '#f97316'; // Orange (Moderate imbalance)
      else return '#ef4444'; // Red (Severe imbalance)
    } else if (metricName === 'activity_percent') {
      // Activity level is balanced when in middle range (40-60)
      if (numValue >= 40 && numValue <= 60) return '#10b981'; // Green (Balanced)
      else if (numValue >= 30 && numValue <= 70) return '#fbbf24'; // Yellow (Mild imbalance)
      else if (numValue >= 20 && numValue <= 80) return '#f97316'; // Orange (Moderate imbalance)
      else return '#ef4444'; // Red (Severe imbalance)
    } else {
      // Five-element balance metrics (96-110 is optimal)
      if (numValue >= 96 && numValue <= 110) return '#10b981'; // Green (Balanced)
      else if (numValue >= 86 && numValue <= 120) return '#fbbf24'; // Yellow (Mild imbalance)
      else if (numValue >= 75 && numValue <= 130) return '#f97316'; // Orange (Moderate imbalance)
      else return '#ef4444'; // Red (Severe imbalance)
    }
  }
  
  return '#ffffff'; // Default white
}

const AuraComTable: React.FC<AuraComTableProps> = ({ fields }) => {
  // Get the first field to access the value (both fields share the same data structure)
  const field = fields[0];

  // Overall Assessment metrics
  const overallMetrics = [
    { name: 'ava_score', label: 'Aura Vitality Assessment Score' },
    { name: 'vigor', label: 'Vigor Level (0-100)' },
    { name: 'stability', label: 'Stability Score (0-100)' },
    { name: 'activity_percent', label: 'Activity Level (%)' },
  ];

  // Five-Element Balance metrics
  const elementMetrics = [
    { name: 'wood', label: 'Wood Element Balance (0-100)' },
    { name: 'fire', label: 'Fire Element Balance (0-100)' },
    { name: 'earth', label: 'Earth Element Balance (0-100)' },
    { name: 'metal', label: 'Metal Element Balance (0-100)' },
    { name: 'water', label: 'Water Element Balance (0-100)' },
    { name: 'overall_balance_score', label: 'Overall Elemental Balance Score (0-100)' },
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
        {metrics.map((metric, index) => {
          const inputColor = getAuraComInputColor(getValue(metric.name), metric.name);
          return (
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
                    minWidth: '60px',
                    backgroundColor: inputColor,
                    color: inputColor !== '#ffffff' ? '#ffffff' : '#000000',
                    fontWeight: inputColor !== '#ffffff' ? '600' : '400',
                    transition: 'background-color 0.2s ease'
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
  );

  return (
    <div style={{ marginBottom: '1.5rem', maxWidth: '600px' }}>
      {/* Always render both sections to show all 10 metrics */}
      {renderMetrics(overallMetrics, 'Overall Assessment')}
      {renderMetrics(elementMetrics, 'Five-Element Balance')}
    </div>
  );
};

export default AuraComTable; 