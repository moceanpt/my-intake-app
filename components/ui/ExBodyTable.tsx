import React from 'react';

interface ExBodyField {
  name: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  tableType: string;
}

interface ExBodyTableProps {
  fields: ExBodyField[];
}

// ExBody reference ranges for color coding
const EXBODY_REFERENCE_RANGES = {
  // Deviation metrics (lower is better)
  loss_of_height_in: { min: 0, max: 0.5, optimal: '≤0.5', direction: 'lower' },
  misalignment_deviation: { min: 0, max: 10, optimal: '0-10', direction: 'lower' },
  imbalance_deviation: { min: 0, max: 10, optimal: '0-10', direction: 'lower' },
  musculoskeletal_index: { min: 0, max: 20, optimal: '0-20', direction: 'lower' },
  
  // Alignment metrics (lower is better)
  shoulder_inclination_deg: { min: 0, max: 1, optimal: '≤1°', direction: 'lower' },
  shoulder_inclination_mm: { min: 0, max: 5, optimal: '≤5mm', direction: 'lower' },
  fhp_deg: { min: 0, max: 15, optimal: '≤15°', direction: 'lower' },
  fhp_mm: { min: 0, max: 5, optimal: '≤5mm', direction: 'lower' },
  pcmt_lb: { min: 0, max: 2, optimal: '≤2lb', direction: 'lower' },
  pelvic_tilt_deg: { min: 0, max: 5, optimal: '≤5°', direction: 'lower' },
  pelvic_tilt_mm: { min: 0, max: 10, optimal: '≤10mm', direction: 'lower' },
  knee_flexion_ext_deg: { min: -5, max: 5, optimal: '-5 to +5°', direction: 'center' },
  knee_flexion_ext_mm: { min: 0, max: 5, optimal: '≤5mm', direction: 'lower' }
};

function getExBodyInputColor(value: number | string, fieldName: string) {
  if (!value || value === '') return '#ffffff'; // White for empty
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const reference = EXBODY_REFERENCE_RANGES[fieldName];
  
  if (!reference) return '#ffffff';
  
  if (reference.direction === 'lower') {
    // Lower is better (deviation metrics)
    if (numValue <= reference.max) {
      return '#10b981'; // Green
    } else if (numValue <= reference.max * 1.5) {
      return '#fbbf24'; // Yellow
    } else if (numValue <= reference.max * 2) {
      return '#f97316'; // Orange
    } else {
      return '#ef4444'; // Red
    }
  } else if (reference.direction === 'center') {
    // Center range is optimal (knee flexion/extension)
    if (numValue >= reference.min && numValue <= reference.max) {
      return '#10b981'; // Green
    } else if (Math.abs(numValue) <= reference.max * 1.5) {
      return '#fbbf24'; // Yellow
    } else if (Math.abs(numValue) <= reference.max * 2) {
      return '#f97316'; // Orange
    } else {
      return '#ef4444'; // Red
    }
  }
  
  return '#ffffff'; // Default white
}

export default function ExBodyTable({ fields }: ExBodyTableProps) {
  // Group fields by table type
  const groupedFields = fields.reduce((acc, field) => {
    const type = field.tableType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(field);
    return acc;
  }, {} as Record<string, ExBodyField[]>);

  const getTableTitle = (tableType: string) => {
    switch (tableType) {
      case 'deviation':
        return 'Musculoskeletal Deviation Chart';
      case 'alignment':
        return 'Musculoskeletal Alignment Analysis';
      default:
        return tableType.charAt(0).toUpperCase() + tableType.slice(1);
    }
  };

  return (
    <div className="exbody-table-container">
      {Object.entries(groupedFields).map(([tableType, typeFields]) => (
        <div key={tableType} className="exbody-section">
          <h4 className="exbody-section-title">{getTableTitle(tableType)}</h4>
          <div className="exbody-table">
            <div className="exbody-table-header">
              <div className="exbody-table-cell header">Metric</div>
              <div className="exbody-table-cell header">Value</div>
            </div>
            {typeFields.map((field) => {
              const inputColor = getExBodyInputColor(field.value, field.name);
              return (
                <div key={field.name} className="exbody-table-row">
                  <div className="exbody-table-cell label">{field.label}</div>
                  <div className="exbody-table-cell input">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="exbody-input"
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
        .exbody-table-container {
          margin-bottom: 1.5rem;
          max-width: 600px;
        }
        
        .exbody-section {
          margin-bottom: 1.5rem;
        }
        
        .exbody-section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .exbody-table {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
          background: white;
          font-size: 0.875rem;
        }
        
        .exbody-table-header {
          display: grid;
          grid-template-columns: 3fr 1fr;
          background: #f9fafb;
          border-bottom: 1px solid #d1d5db;
        }
        
        .exbody-table-row {
          display: grid;
          grid-template-columns: 3fr 1fr;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .exbody-table-row:last-child {
          border-bottom: none;
        }
        
        .exbody-table-cell {
          padding: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .exbody-table-cell.header {
          font-weight: 600;
          color: #374151;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .exbody-table-cell.label {
          font-weight: 500;
          color: #4b5563;
          font-size: 0.75rem;
        }
        
        .exbody-table-cell.input {
          padding: 0.25rem 0.5rem;
        }
        
        .exbody-input {
          width: 100%;
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          text-align: center;
          min-width: 60px;
          transition: background-color 0.2s ease;
        }
        
        .exbody-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .exbody-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
} 