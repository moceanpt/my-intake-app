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
}

interface ROMTableProps {
  fields: ROMField[];
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
            <div className="rom-table-header">
              <div className="rom-table-cell header">ROM Type</div>
              <div className="rom-table-cell header">Left</div>
              <div className="rom-table-cell header">Pain</div>
              <div className="rom-table-cell header">Right</div>
              <div className="rom-table-cell header">Pain</div>
            </div>
            {typeFields.map((field) => {
              // Neck flexion only has Left value
              const showRightColumn = field.name !== 'neck_flexion';
              
              return (
                <div key={field.name} className="rom-table-row">
                  <div className="rom-table-cell label">{field.label}</div>
                  <div className="rom-table-cell input">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="rom-input"
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
                  {showRightColumn && (
                    <div className="rom-table-cell input">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="rom-input"
                        value={field.value.right || ''}
                        onChange={(e) => field.onChange({
                          ...field.value,
                          right: e.target.value
                        })}
                      />
                    </div>
                  )}
                  {showRightColumn && (
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
                  )}
                  {!showRightColumn && (
                    <div className="rom-table-cell disabled">
                      <span className="text-gray-400 text-sm">N/A</span>
                    </div>
                  )}
                  {!showRightColumn && (
                    <div className="rom-table-cell disabled">
                      <span className="text-gray-400 text-sm">N/A</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <style jsx>{`
        .rom-table-container {
          margin-bottom: 1.5rem;
          max-width: 600px;
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
        
        .rom-table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 0.5fr 1fr 0.5fr;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .rom-table-row:last-child {
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
        
        .rom-table-cell.disabled {
          padding: 0.25rem 0.5rem;
          justify-content: center;
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