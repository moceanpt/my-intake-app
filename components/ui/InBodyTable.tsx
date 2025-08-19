import React from 'react';

interface InBodyField {
  name: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  tableType: string;
}

interface InBodyTableProps {
  fields: InBodyField[];
}

// InBody reference ranges for color coding (based on REFERENCE_CHARTS.md)
const INBODY_REFERENCE_RANGES = {
  // Body Composition Core
  tbw_lb: { min: 0, max: null, optimal: 'Varies by weight', direction: 'higher' },
  weight_lb: { min: 0, max: null, optimal: 'Varies', direction: 'higher' },
  smm_lb: { min: 0, max: null, optimal: 'Varies by weight', direction: 'higher' },
  body_fat_lb: { min: 0, max: null, optimal: 'Varies by age/sex', direction: 'lower' },
  pbf_pct: { min: 0, max: null, optimal: 'Varies by age/sex', direction: 'lower' },
  
  // Cellular Health & Water Balance
  ecw_tbw: { min: 0.381, max: 0.401, optimal: '<0.381', direction: 'lower' },
  vfa_cm2: { min: 0, max: 100, optimal: '<100', direction: 'lower' },
  phase_angle_deg: { min: 6.0, max: null, optimal: '≥6.0°', direction: 'higher' }
};

function getInBodyInputColor(value: number | string, fieldName: string) {
  if (!value || value === '') return '#ffffff'; // White for empty
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const reference = INBODY_REFERENCE_RANGES[fieldName];
  
  if (!reference) return '#ffffff';
  
  if (reference.direction === 'lower') {
    // Lower is better (body fat, ECW/TBW, visceral fat)
    if (fieldName === 'ecw_tbw') {
      if (numValue < 0.381) return '#10b981'; // Green
      else if (numValue < 0.391) return '#fbbf24'; // Yellow
      else if (numValue < 0.401) return '#f97316'; // Orange
      else return '#ef4444'; // Red
    } else if (fieldName === 'vfa_cm2') {
      if (numValue < 100) return '#10b981'; // Green
      else if (numValue < 130) return '#fbbf24'; // Yellow
      else if (numValue < 150) return '#f97316'; // Orange
      else return '#ef4444'; // Red
    } else {
      // Body fat percentage (simplified - would need age/sex specific ranges)
      if (numValue < 15) return '#10b981'; // Green (low)
      else if (numValue < 25) return '#fbbf24'; // Yellow (normal)
      else if (numValue < 35) return '#f97316'; // Orange (high)
      else return '#ef4444'; // Red (very high)
    }
  } else if (reference.direction === 'higher') {
    // Higher is better (muscle mass, phase angle)
    if (fieldName === 'phase_angle_deg') {
      if (numValue >= 6.0) return '#10b981'; // Green
      else if (numValue >= 5.4) return '#fbbf24'; // Yellow
      else if (numValue >= 4.8) return '#f97316'; // Orange
      else return '#ef4444'; // Red
    } else {
      // Muscle mass and body water (simplified)
      if (numValue > 0) return '#10b981'; // Green (any positive value)
      else return '#ef4444'; // Red (zero or negative)
    }
  }
  
  return '#ffffff'; // Default white
}

export default function InBodyTable({ fields }: InBodyTableProps) {
  // Group fields by table type
  const groupedFields = fields.reduce((acc, field) => {
    const type = field.tableType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(field);
    return acc;
  }, {} as Record<string, InBodyField[]>);

  const getTableTitle = (tableType: string) => {
    switch (tableType) {
      case 'composition':
        return 'Body Composition Core';
      case 'cellular':
        return 'Cellular Health & Water Balance';
      default:
        return tableType.charAt(0).toUpperCase() + tableType.slice(1);
    }
  };

  return (
    <div className="inbody-table-container">
      {Object.entries(groupedFields).map(([tableType, typeFields]) => (
        <div key={tableType} className="inbody-section">
          <h4 className="inbody-section-title">{getTableTitle(tableType)}</h4>
          <div className="inbody-table">
            <div className="inbody-table-header">
              <div className="inbody-table-cell header">Metric</div>
              <div className="inbody-table-cell header">Value</div>
            </div>
            {typeFields.map((field) => {
              const inputColor = getInBodyInputColor(field.value, field.name);
              return (
                <div key={field.name} className="inbody-table-row">
                  <div className="inbody-table-cell label">{field.label}</div>
                  <div className="inbody-table-cell input">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="inbody-input"
                      style={{ 
                        backgroundColor: inputColor,
                        color: inputColor !== '#ffffff' ? '#ffffff' : '#000000',
                        fontWeight: inputColor !== '#ffffff' ? '600' : '400'
                      }}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <style jsx>{`
        .inbody-table-container {
          margin-bottom: 1.5rem;
          max-width: 600px;
        }
        
        .inbody-section {
          margin-bottom: 1.5rem;
        }
        
        .inbody-section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .inbody-table {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
          background: white;
          font-size: 0.875rem;
        }
        
        .inbody-table-header {
          display: grid;
          grid-template-columns: 3fr 1fr;
          background: #f9fafb;
          border-bottom: 1px solid #d1d5db;
        }
        
        .inbody-table-row {
          display: grid;
          grid-template-columns: 3fr 1fr;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .inbody-table-row:last-child {
          border-bottom: none;
        }
        
        .inbody-table-cell {
          padding: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .inbody-table-cell.header {
          font-weight: 600;
          color: #374151;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .inbody-table-cell.label {
          font-weight: 500;
          color: #4b5563;
          font-size: 0.75rem;
        }
        
        .inbody-table-cell.input {
          padding: 0.25rem 0.5rem;
        }
        
        .inbody-input {
          width: 100%;
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          text-align: center;
          min-width: 60px;
          transition: background-color 0.2s ease;
        }
        
        .inbody-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .inbody-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
} 