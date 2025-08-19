import React from 'react';

interface ROMField {
  name: string;
  label: string;
  value: { 
    left: string | number; 
    right?: string | number;
    leftPain?: boolean;
    rightPain?: boolean;
  };
  onChange: (value: { 
    left: string | number; 
    right?: string | number;
    leftPain?: boolean;
    rightPain?: boolean;
  }) => void;
  romType: string;
  reference: string;
}

interface ROMTableProps {
  fields: ROMField[];
}

// ROM reference ranges and status calculation
const ROM_REFERENCE_RANGES = {
  neck_flexion: { min: 45, max: null, reference: ">45°" },
  neck_lateral_flexion: { min: 25, max: 45, reference: "25-45°" },
  shoulder_abduction: { min: 170, max: 180, reference: "170-180°" },
  shoulder_flexion: { min: 170, max: 180, reference: "170-180°" },
  shoulder_extension: { min: 45, max: 60, reference: "45-60°" },
  trunk_lateral_flexion: { min: 35, max: null, reference: ">35°" },
  hip_abduction: { min: 40, max: null, reference: ">40°" },
  hip_flexion: { min: 70, max: 80, reference: "70-80°" },
  hip_extension: { min: 20, max: 30, reference: "20-30°" }
};

function getROMStatus(value: number | string, romType: string) {
  if (!value || value === '') return { status: 'N/A', color: 'gray' };
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const reference = ROM_REFERENCE_RANGES[romType];
  
  if (!reference) return { status: 'N/A', color: 'gray' };
  
  if (reference.max) {
    // Range-based reference (e.g., 25-45°)
    if (numValue >= reference.min && numValue <= reference.max) {
      return { status: 'Normal', color: 'green' };
    } else if (numValue >= reference.min * 0.8 && numValue < reference.min) {
      return { status: 'Mild Limitation', color: 'yellow' };
    } else {
      return { status: 'Limited', color: 'orange' };
    }
  } else {
    // Minimum-based reference (e.g., >45°)
    if (numValue >= reference.min) {
      return { status: 'Normal', color: 'green' };
    } else if (numValue >= reference.min * 0.8) {
      return { status: 'Mild Limitation', color: 'yellow' };
    } else {
      return { status: 'Limited', color: 'orange' };
    }
  }
}

function getInputBoxColor(value: number | string, romType: string) {
  if (!value || value === '') return '#ffffff'; // White for empty
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const reference = ROM_REFERENCE_RANGES[romType];
  
  if (!reference) return '#ffffff';
  
  if (reference.max) {
    // Range-based reference (e.g., 25-45°)
    if (numValue >= reference.min && numValue <= reference.max) {
      return '#10b981'; // Green
    } else if (numValue >= reference.min * 0.8 && numValue < reference.min) {
      return '#fbbf24'; // Yellow
    } else if (numValue >= reference.min * 0.6) {
      return '#f97316'; // Orange
    } else {
      return '#ef4444'; // Red
    }
  } else {
    // Minimum-based reference (e.g., >45°)
    if (numValue >= reference.min) {
      return '#10b981'; // Green
    } else if (numValue >= reference.min * 0.8) {
      return '#fbbf24'; // Yellow
    } else if (numValue >= reference.min * 0.6) {
      return '#f97316'; // Orange
    } else {
      return '#ef4444'; // Red
    }
  }
}

export default function ROMTable({ fields }: ROMTableProps) {
  // Group fields by ROM type
  const groupedFields = fields.reduce((acc, field) => {
    const type = field.romType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(field);
    return acc;
  }, {} as Record<string, ROMField[]>);

  return (
    <div className="rom-table-container">
      {Object.entries(groupedFields).map(([romType, typeFields]) => (
        <div key={romType} className="rom-section">
          <h4 className="rom-section-title">{romType.charAt(0).toUpperCase() + romType.slice(1)} ROM</h4>
          <div className="rom-table">
            {typeFields.map((field) => {
              const isNeckFlexion = field.name === 'neck_flexion';
              
              if (isNeckFlexion) {
                // Special case for neck flexion - single value box
                const valueColor = getInputBoxColor(field.value.left || '', field.name);
                return (
                  <div key={field.name}>
                    <div className="rom-table-header-single">
                      <div className="rom-table-cell header">ROM TYPE</div>
                      <div className="rom-table-cell header">VALUE</div>
                      <div className="rom-table-cell header">PAIN</div>
                    </div>
                    <div className="rom-table-row-single">
                      <div className="rom-table-cell label">{field.label}</div>
                      <div className="rom-table-cell input">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="rom-input"
                          style={{ 
                            backgroundColor: valueColor,
                            color: valueColor !== '#ffffff' ? '#ffffff' : '#000000',
                            fontWeight: valueColor !== '#ffffff' ? '600' : '400'
                          }}
                          value={field.value.left || ''}
                          onChange={(e) => field.onChange({
                            ...field.value,
                            left: e.target.value
                          })}
                        />
                      </div>
                      <div className="rom-table-cell checkbox">
                        <input
                          type="checkbox"
                          className="pain-checkbox"
                          checked={field.value.leftPain || false}
                          onChange={(e) => field.onChange({
                            ...field.value,
                            leftPain: e.target.checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Standard left/right structure for all other movements
                const leftColor = getInputBoxColor(field.value.left || '', field.name);
                const rightColor = getInputBoxColor(field.value.right || '', field.name);
                
                return (
                  <div key={field.name}>
                    <div className="rom-table-header">
                      <div className="rom-table-cell header">ROM TYPE</div>
                      <div className="rom-table-cell header">LEFT</div>
                      <div className="rom-table-cell header">PAIN</div>
                      <div className="rom-table-cell header">RIGHT</div>
                      <div className="rom-table-cell header">PAIN</div>
                    </div>
                    <div className="rom-table-row">
                      <div className="rom-table-cell label">{field.label}</div>
                      <div className="rom-table-cell input">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="rom-input"
                          style={{ 
                            backgroundColor: leftColor,
                            color: leftColor !== '#ffffff' ? '#ffffff' : '#000000',
                            fontWeight: leftColor !== '#ffffff' ? '600' : '400'
                          }}
                          value={field.value.left || ''}
                          onChange={(e) => field.onChange({
                            ...field.value,
                            left: e.target.value
                          })}
                        />
                      </div>
                      <div className="rom-table-cell checkbox">
                        <input
                          type="checkbox"
                          className="pain-checkbox"
                          checked={field.value.leftPain || false}
                          onChange={(e) => field.onChange({
                            ...field.value,
                            leftPain: e.target.checked
                          })}
                        />
                      </div>
                      <div className="rom-table-cell input">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="rom-input"
                          style={{ 
                            backgroundColor: rightColor,
                            color: rightColor !== '#ffffff' ? '#ffffff' : '#000000',
                            fontWeight: rightColor !== '#ffffff' ? '600' : '400'
                          }}
                          value={field.value.right || ''}
                          onChange={(e) => field.onChange({
                            ...field.value,
                            right: e.target.value
                          })}
                        />
                      </div>
                      <div className="rom-table-cell checkbox">
                        <input
                          type="checkbox"
                          className="pain-checkbox"
                          checked={field.value.rightPain || false}
                          onChange={(e) => field.onChange({
                            ...field.value,
                            rightPain: e.target.checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
      
      <style jsx>{`
        .rom-table-container {
          margin-bottom: 1.5rem;
          max-width: 800px;
        }
        
        .rom-section {
          margin-bottom: 1.5rem;
        }
        
        .rom-section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .rom-table {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
          background: white;
          font-size: 0.875rem;
        }
        
        .rom-table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 0.5fr 1fr 0.5fr;
          background: #f9fafb;
          border-bottom: 1px solid #d1d5db;
        }
        
        .rom-table-header-single {
          display: grid;
          grid-template-columns: 2fr 1fr 0.5fr;
          background: #f9fafb;
          border-bottom: 1px solid #d1d5db;
        }
        
        .rom-table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 0.5fr 1fr 0.5fr;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .rom-table-row-single {
          display: grid;
          grid-template-columns: 2fr 1fr 0.5fr;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .rom-table-row:last-child,
        .rom-table-row-single:last-child {
          border-bottom: none;
        }
        
        .rom-table-cell {
          padding: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .rom-table-cell.header {
          font-weight: 600;
          color: #374151;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .rom-table-cell.label {
          font-weight: 500;
          color: #4b5563;
          font-size: 0.75rem;
        }
        
        .rom-table-cell.input {
          padding: 0.25rem 0.5rem;
        }
        
        .rom-table-cell.checkbox {
          padding: 0.25rem 0.5rem;
          justify-content: center;
        }
        
        .pain-checkbox {
          width: 1rem;
          height: 1rem;
          accent-color: #ef4444;
          cursor: pointer;
        }
        
        .rom-input {
          width: 100%;
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          text-align: center;
          min-width: 60px;
          transition: background-color 0.2s ease;
        }
        
        .rom-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .rom-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
} 