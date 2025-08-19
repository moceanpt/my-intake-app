import React from 'react';

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ...props
}) {
  const variantClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    ghost: 'btn btn-ghost',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };
  return (
    <button
      className={`rounded-lg font-sans font-medium transition-colors duration-150 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span 
          className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent rounded-full inline-block align-middle border-primary-600"
        ></span>
      ) : null}
      {children}
    </button>
  );
} 