/* components/ui/SliderRow.jsx - Enhanced Slider Component */
import React from 'react';

export default function SliderRow({
  id,
  value,
  onChange,
  question,
  low,
  high,
  min = 0,
  max = 10,
  step = 1,
  showTicks = true,
  className = ''
}) {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(id, newValue);
  };

  // Generate tick marks
  const ticks = showTicks ? Array.from({ length: max - min + 1 }, (_, i) => min + i) : [];

  // Get color based on value
  const getValueColor = (val) => {
    if (val >= 8) return 'text-success-600';
    if (val >= 6) return 'text-warning-600';
    if (val >= 4) return 'text-secondary-600';
    return 'text-error-600';
  };

  return (
    <div className={`slider-container ${className}`}>
      {/* Question and Value Display */}
      <div className="slider-label">
        <span className="text-sm font-medium text-secondary-700">{question}</span>
        <span className={`slider-value text-sm font-semibold ${getValueColor(value)}`}>
          {value}
        </span>
      </div>

      {/* Slider Input */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="slider-input w-full"
          aria-label={`${question}: ${value} out of ${max}`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        
        {/* Custom track styling */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-2 bg-secondary-200 rounded-full" />
          <div 
            className="h-2 bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-secondary-500 mt-1">
        <span>{low}</span>
        <span>{high}</span>
      </div>

      {/* Tick marks */}
      {showTicks && (
        <div className="slider-ticks">
          {ticks.map((tick) => (
            <span 
              key={tick} 
              className={`
                text-xs select-none
                ${tick <= value ? 'text-primary-600 font-medium' : 'text-secondary-400'}
              `}
            >
              {tick}
            </span>
          ))}
        </div>
      )}

      {/* Value indicator */}
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="h-1 bg-secondary-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  value >= 8 ? 'bg-success-500' :
                  value >= 6 ? 'bg-warning-500' :
                  value >= 4 ? 'bg-secondary-400' :
                  'bg-error-500'
                }`}
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-medium ${getValueColor(value)}`}>
            {value}/{max}
          </span>
        </div>
      </div>
    </div>
  );
}