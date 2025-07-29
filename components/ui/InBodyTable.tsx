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
            {typeFields.map((field) => (
              <div key={field.name} className="inbody-table-row">
                <div className="inbody-table-cell label">{field.label}</div>
                <div className="inbody-table-cell input">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="inbody-input"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
              </div>
            ))}
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