import React, { useState } from 'react';

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

function getExBodyInputColor(value, fieldName) {
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
    // Optimal range in center
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

const ExBodyTableWithCorrection = ({ fields, aiExtractedData = {} }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const hasAIExtractedData = Object.keys(aiExtractedData).length > 0;

  // Group fields by table type
  const groupedFields = fields.reduce((acc, field) => {
    const type = field.tableType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(field);
    return acc;
  }, {});

  const getTableTitle = (tableType) => {
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
            {isEditing ? 'Done Editing' : 'Edit ExBody Values'}
          </button>
        </div>
      )}

      {Object.entries(groupedFields).map(([tableType, typeFields]) => (
        <div key={tableType} className="exbody-section">
          <h4 className="exbody-section-title">{getTableTitle(tableType)}</h4>
          <div className="exbody-table">
            <div className="exbody-table-header">
              <div className="exbody-table-cell header">METRIC</div>
              <div className="exbody-table-cell header">VALUE</div>
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
                      disabled={!isEditing}
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
          font-weight: 600;
          color: #374151;
        }
        
        .exbody-table-row {
          display: grid;
          grid-template-columns: 3fr 1fr;
          border-top: 1px solid #e5e7eb;
        }
        
        .exbody-table-cell {
          padding: 0.75rem;
          display: flex;
          align-items: center;
        }
        
        .exbody-table-cell.header {
          font-weight: 600;
          background: #f9fafb;
        }
        
        .exbody-table-cell.label {
          background: #ffffff;
        }
        
        .exbody-table-cell.input {
          background: #ffffff;
          justify-content: center;
        }
        
        .exbody-input {
          width: 100%;
          max-width: 80px;
          padding: 0.375rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .exbody-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .exbody-input:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default ExBodyTableWithCorrection;
