/* components/ui/Chip.jsx - Enhanced Chip Component */
import React from 'react';

export default function Chip({
  label,
  active = false,
  disabled = false,
  onClick,
  className = '',
  size = 'md',
  variant = 'default'
}) {
  const handleClick = () => {
    if (disabled) return;
    
    // Remember scroll position for smooth UX
    const y = window.scrollY;
    onClick?.();
    requestAnimationFrame(() => window.scrollTo({ top: y }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Visual variants
  const variantClasses = {
    default: active 
      ? 'bg-primary-600 text-white border-primary-600' 
      : 'bg-white text-secondary-700 border-secondary-300 hover:border-primary-400 hover:text-primary-700',
    outline: active 
      ? 'bg-primary-50 text-primary-700 border-primary-600' 
      : 'bg-transparent text-secondary-700 border-secondary-300 hover:border-primary-400 hover:text-primary-700',
    ghost: active 
      ? 'bg-primary-100 text-primary-700 border-transparent' 
      : 'bg-transparent text-secondary-700 border-transparent hover:bg-secondary-100'
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        chip
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-pressed={active}
      aria-label={`${active ? 'Deselect' : 'Select'} ${label}`}
      tabIndex={disabled ? -1 : 0}
    >
      {label}
      {/* Removed checkmark SVG for active state. Now, only the filled blue background and white text indicate selection. */}
    </button>
  );
}