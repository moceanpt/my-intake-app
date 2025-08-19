/* components/ui/Card.jsx - Enhanced Card Component */
import React from 'react';

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  border = true,
  ...props
}) {
  // Variant styles
  const variantClasses = {
    default: 'bg-white',
    elevated: 'bg-white',
    outlined: 'bg-white border-2',
    ghost: 'bg-transparent'
  };

  // Padding variants
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  // Shadow variants
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  // Border styles
  const borderClasses = border ? 'border border-secondary-200' : '';

  return (
    <div
      className={`
        card
        rounded-lg
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${borderClasses}
        font-sans
        text-secondary-900
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// Card sub-components for better composition
Card.Header = function CardHeader({ children, className = '', ...props }) {
  return (
    <div 
      className={`card-header font-semibold text-lg mb-2 text-primary-700 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`card-body text-base ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '', ...props }) {
  return (
    <div 
      className={`card-footer mt-4 pt-2 border-t text-sm ${className}`} 
      style={{ 
        borderColor: 'var(--color-secondary-100)',
        color: 'var(--color-secondary-500)'
      }}
      {...props}
    >
      {children}
    </div>
  );
}; 