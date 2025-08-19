/* ---------------------------------------------------------------
   components/ui/MetricFieldWithCorrection.tsx - Enhanced MetricField with Manual Correction
   – Allows healthcare professionals to override AI-extracted data
   – Shows original AI value vs manual correction
   – Provides data source validation and confirmation
---------------------------------------------------------------- */
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { UseFormRegister } from 'react-hook-form';

interface Props {
  name: string;
  label: string;
  step?: string | number;
  register?: UseFormRegister<any>;
  aiExtractedValue?: number | string; // Original AI-extracted value
  referenceRange?: string; // Clinical reference range for validation
  unit?: string; // Unit of measurement
}

export default function MetricFieldWithCorrection({
  name,
  label,
  step = 'any',
  register: propRegister,
  aiExtractedValue,
  referenceRange,
  unit
}: Props) {
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  
  // 1️⃣ prefer the explicit prop, else try FormContext
  const ctx = useFormContext();
  const register = propRegister ?? ctx?.register;

  // 2️⃣ guard against missing register()
  if (!register) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `MetricFieldWithCorrection: no register() function found for "${name}". ` +
        'Either wrap the field with <FormProvider> or pass the register prop.'
      );
    }
    return null;
  }

  const errors = ctx?.formState?.errors ?? {};
  const currentValue = ctx?.watch?.(name) ?? aiExtractedValue;

  // Determine if manual override is active
  const hasManualOverride = isManualOverride && currentValue !== aiExtractedValue;
  const dataSource = hasManualOverride ? 'manual' : 'ai';

  // Get color based on data source
  const getDataSourceColor = () => {
    if (dataSource === 'manual') return '#f59e0b'; // Yellow for manual
    return '#10b981'; // Green for AI
  };

  // Get background color for the input
  const getInputBackgroundColor = () => {
    if (dataSource === 'manual') return '#fef3c7'; // Light yellow for manual
    return '#f0fdf4'; // Light green for AI
  };

  const handleManualOverride = () => {
    setIsManualOverride(true);
    // Clear the current value to allow manual input
    ctx?.setValue?.(name, '');
  };

  const handleRevertToAI = () => {
    setIsManualOverride(false);
    ctx?.setValue?.(name, aiExtractedValue);
  };

  const handleConfirmManual = () => {
    setIsManualOverride(false);
    // Keep the manual value but mark it as confirmed
  };

  return (
    <div className="form-field-enhanced">
      <div className="flex items-center justify-between mb-2">
        <label className="form-label flex items-center gap-2">
          {label}
          {unit && <span className="text-sm text-gray-500">({unit})</span>}
        </label>
        
        {/* Data Source Indicator */}
        <div className="flex items-center gap-2">
          <span 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: getDataSourceColor(),
              color: 'white'
            }}
          >
            {dataSource === 'manual' ? '✏️ Manual' : '🤖 AI'}
          </span>
          
          {/* Manual Override Controls */}
          {aiExtractedValue !== undefined && (
            <div className="flex items-center gap-1">
              {!isManualOverride ? (
                <button
                  type="button"
                  onClick={handleManualOverride}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  title="Override AI-extracted value with manual input"
                >
                  ✏️ Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRevertToAI}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    title="Revert to AI-extracted value"
                  >
                    ↩️ Revert
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmManual}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    title="Confirm manual value"
                  >
                    ✓ Confirm
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Extracted Value Display */}
      {aiExtractedValue !== undefined && (
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">AI Extracted:</span>
            <span 
              className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-mono"
            >
              {aiExtractedValue}
            </span>
            <button
              type="button"
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showOriginal ? 'Hide' : 'Show'} Original
            </button>
          </div>
          
          {showOriginal && (
            <div className="mt-1 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <strong>Original AI Extraction:</strong> {aiExtractedValue}
              {referenceRange && (
                <span className="block mt-1">
                  <strong>Reference Range:</strong> {referenceRange}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          type="number"
          step={step}
          {...register(name, { 
            valueAsNumber: true, 
            required: 'Required',
            validate: (value) => {
              if (value === '' || value === null || value === undefined) {
                return 'Value is required';
              }
              if (isNaN(Number(value))) {
                return 'Must be a valid number';
              }
              return true;
            }
          })}
          className="form-input w-full"
          placeholder={isManualOverride ? "Enter manual value..." : "AI extracted value"}
          style={{ 
            backgroundColor: getInputBackgroundColor(),
            borderColor: getDataSourceColor(),
            borderWidth: '2px'
          }}
        />
        
        {/* Manual Override Indicator */}
        {isManualOverride && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <span className="text-yellow-600 text-sm">✏️</span>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {errors[name] && (
        <span className="form-error">
          {String(errors[name]?.message)}
        </span>
      )}

      {/* Data Source Summary */}
      <div className="mt-2 text-xs text-gray-500">
        {dataSource === 'manual' ? (
          <span className="text-yellow-600">
            ⚠️ Manual override active - verify clinical accuracy
          </span>
        ) : (
          <span className="text-green-600">
            ✓ Using AI-extracted value
          </span>
        )}
      </div>

      <style jsx>{`
        .form-field-enhanced {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background-color: #fafafa;
        }
        
        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-error {
          color: #dc2626;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
