import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'lost' | 'found' | 'resolved' | 'flagged' | 'neutral' | 'royal';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  ...props
}) => {
  const variants = {
    lost: 'bg-amber-50 text-amber-800 border-amber-200/80',
    found: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    resolved: 'bg-slate-100 text-slate-700 border-slate-200',
    flagged: 'bg-rose-50 text-rose-800 border-rose-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    royal: 'bg-royal-50 text-royal-700 border-royal-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
