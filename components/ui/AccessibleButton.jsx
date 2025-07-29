import React from 'react';

const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-coast-600 text-white hover:bg-coast-700 focus:ring-coast-500 disabled:bg-coast-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    outline: 'border border-coast-600 text-coast-600 hover:bg-coast-50 focus:ring-coast-500 disabled:border-coast-300',
    ghost: 'text-coast-600 hover:bg-coast-50 focus:ring-coast-500 disabled:text-coast-300'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      {...props}
    >
      {children}
    </button>
  );
};

export default AccessibleButton; 