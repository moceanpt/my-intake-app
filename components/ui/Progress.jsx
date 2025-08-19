/* components/ui/Progress.jsx - Enhanced Progress Indicator */
import React from 'react';

const STEP_LABELS = [
  'Goals & Reasons',
  'Medical History', 
  'Health Check',
  'Lifestyle',
  'Complete'
];

export default function Progress({ step, total }) {
  const progressPercentage = ((step + 1) / total) * 100;
  const currentStep = step + 1;

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="progress-container h-2 mb-4">
        <div 
          className={`progress-bar`}
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Step ${currentStep} of ${total}`}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {STEP_LABELS.map((label, index) => {
          const isCompleted = index < step;
          const isCurrent = index === step;
          const isUpcoming = index > step;

          return (
            <div key={index} className="flex flex-col items-center">
              {/* Step Circle */}
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300
                  ${isCompleted 
                    ? 'bg-primary-600 text-white' 
                    : isCurrent 
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-600' 
                    : 'bg-secondary-200 text-secondary-500'
                  }
                `}
                aria-label={`Step ${index + 1}: ${label}`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Label */}
              <span 
                className={`
                  text-xs font-medium mt-2 text-center max-w-20
                  ${isCurrent ? 'text-primary-700' : 'text-secondary-500'}
                  ${isUpcoming ? 'opacity-50' : ''}
                `}
              >
                {label}
              </span>

              {/* Connector Line */}
              {index < STEP_LABELS.length - 1 && (
                <div 
                  className={`
                    absolute top-4 left-1/2 w-full h-0.5 -z-10
                    ${isCompleted ? 'bg-primary-600' : 'bg-secondary-200'}
                  `}
                  style={{ 
                    left: `calc(50% + ${(index + 1) * (100 / (STEP_LABELS.length - 1))}%)`,
                    width: `${100 / (STEP_LABELS.length - 1)}%`
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Description */}
      <div className="mt-6 text-center">
        <p className="text-sm text-secondary-600">
          Step {currentStep} of {total}: {STEP_LABELS[step]}
        </p>
      </div>
    </div>
  );
}