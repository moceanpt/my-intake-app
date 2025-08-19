/* ---------------------------------------------------------------
   components/ui/ROMTableWithCorrection.tsx - Enhanced ROM Table with Manual Correction
   – Allows healthcare professionals to override AI-extracted ROM data
   – Shows original AI values vs manual corrections
   – Provides data source validation and clinical reference ranges
---------------------------------------------------------------- */
import React, { useState } from 'react';

interface ROMField {
  name: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  romType: string;
  reference: string;
  aiExtractedValue?: any; // Original AI-extracted value
}

interface ROMTableWithCorrectionProps {
  fields: ROMField[];
}

const ROMTableWithCorrection: React.FC<ROMTableWithCorrectionProps> = ({ fields }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };





  return (
    <div className="rom-table-container">
      {/* Simple Edit Button - Top Right */}
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
          {isEditing ? 'Done Editing' : 'Edit ROM Values'}
        </button>
      </div>

      {fields.map((field) => {
        const currentValue = field.value || {};
        
        // Get colors for the input boxes (using original ROM table logic)
        const getInputBoxColor = (value, metricName) => {
          if (value === null || value === undefined || value === '') return '#ffffff';
          
          const numValue = Number(value);
          
          // Basic color coding based on typical ROM ranges
          if (metricName.includes('neck') || metricName.includes('shoulder') || metricName.includes('hip')) {
            if (numValue >= 80) return '#10b981'; // Green
            if (numValue >= 60) return '#f59e0b'; // Yellow
            if (numValue >= 40) return '#f97316'; // Orange
            return '#ef4444'; // Red
          }
          
          if (metricName.includes('trunk')) {
            if (numValue >= 20) return '#10b981'; // Green
            if (numValue >= 15) return '#f59e0b'; // Yellow
            if (numValue >= 10) return '#f97316'; // Orange
            return '#ef4444'; // Red
          }
          
          return '#ffffff'; // Default white
        };

        const leftColor = getInputBoxColor(currentValue.left, field.name);
        const rightColor = getInputBoxColor(currentValue.right, field.name);

        return (
          <div key={field.name} className="rom-section">
            <div className="rom-section-title">
              {field.label}
            </div>

            {/* ROM Table - Using original styling */}
            <div className="rom-table">
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
                    value={currentValue.left || ''}
                    onChange={(e) => field.onChange({
                      ...currentValue,
                      left: e.target.value
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="rom-table-cell checkbox">
                  <input
                    type="checkbox"
                    className="pain-checkbox"
                    checked={currentValue.leftPain || false}
                    onChange={(e) => field.onChange({
                      ...currentValue,
                      leftPain: e.target.checked
                    })}
                    disabled={!isEditing}
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
                    value={currentValue.right || ''}
                    onChange={(e) => field.onChange({
                      ...currentValue,
                      right: e.target.value
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="rom-table-cell checkbox">
                  <input
                    type="checkbox"
                    className="pain-checkbox"
                    checked={currentValue.rightPain || false}
                    onChange={(e) => field.onChange({
                      ...currentValue,
                      rightPain: e.target.checked
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        /* Using original ROM table styling with minimal additions for manual correction */
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
          display: flex;
          align-items: center;
          justify-content: space-between;
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
};

export default ROMTableWithCorrection;
