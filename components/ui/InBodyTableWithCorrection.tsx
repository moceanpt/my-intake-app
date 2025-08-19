import React, { useState } from 'react';

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

function getInBodyInputColor(value, fieldName) {
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
      // Generic lower is better
      if (numValue <= reference.max) return '#10b981'; // Green
      else if (numValue <= reference.max * 1.2) return '#fbbf24'; // Yellow
      else if (numValue <= reference.max * 1.5) return '#f97316'; // Orange
      else return '#ef4444'; // Red
    }
  } else if (reference.direction === 'higher') {
    // Higher is better (phase angle, muscle mass)
    if (fieldName === 'phase_angle_deg') {
      if (numValue >= 6.0) return '#10b981'; // Green
      else if (numValue >= 5.0) return '#fbbf24'; // Yellow
      else if (numValue >= 4.0) return '#f97316'; // Orange
      else return '#ef4444'; // Red
    }
  }
  
  return '#ffffff'; // Default white
}

const InBodyTableWithCorrection = ({ fields, aiExtractedData = {} }) => {
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
            {isEditing ? 'Done Editing' : 'Edit InBody Values'}
          </button>
        </div>
      )}

      {Object.entries(groupedFields).map(([tableType, typeFields]) => (
        <div key={tableType} className="inbody-section">
          <h4 className="inbody-section-title">{getTableTitle(tableType)}</h4>
          <div className="inbody-table">
            <div className="inbody-table-header">
              <div className="inbody-table-cell header">METRIC</div>
              <div className="inbody-table-cell header">VALUE</div>
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
          background: #f9fafb;
          color: #374151;
        }
        
        .inbody-table-cell.label {
          background: #ffffff;
          color: #374151;
        }
        
        .inbody-table-cell.input {
          background: #ffffff;
          justify-content: center;
        }
        
        .inbody-input {
          width: 100%;
          max-width: 80px;
          padding: 0.375rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .inbody-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .inbody-input:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default InBodyTableWithCorrection;