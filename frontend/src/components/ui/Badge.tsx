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
    lost: 'bg-amber-400/10 text-amber-300 border-amber-300/20',
    found: 'bg-emerald-400/10 text-emerald-300 border-emerald-300/20',
    resolved: 'bg-slate-300/10 text-slate-300 border-slate-300/20',
    flagged: 'bg-rose-400/10 text-rose-300 border-rose-300/20',
    neutral: 'bg-slate-300/10 text-slate-300 border-slate-300/20',
    royal: 'bg-royal-400/10 text-royal-300 border-royal-300/20',
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
