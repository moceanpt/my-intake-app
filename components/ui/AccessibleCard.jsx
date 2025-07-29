import React from 'react';

const AccessibleCard = ({
  children,
  title,
  subtitle,
  role = 'region',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  className = '',
  onClick,
  interactive = false,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6';
  const interactiveClasses = interactive ? 'cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-coast-500 focus:ring-offset-2' : '';
  const classes = `${baseClasses} ${interactiveClasses} ${className}`;

  const CardWrapper = interactive ? 'button' : 'div';

  return (
    <CardWrapper
      className={classes}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      onClick={onClick}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </CardWrapper>
  );
};

export default AccessibleCard; 