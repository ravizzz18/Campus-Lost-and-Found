import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-6 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-[#D9824B] border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {label && <p className="text-xs text-slate-500 font-medium">{label}</p>}
    </div>
  );
};
