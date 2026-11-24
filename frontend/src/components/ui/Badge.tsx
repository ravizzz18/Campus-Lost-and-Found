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
    lost: 'bg-[#D5A15D]/10 text-[#D5A15D] border-[#D5A15D]/25',
    found: 'bg-[#8FA889]/10 text-[#8FA889] border-[#8FA889]/25',
    resolved: 'bg-[#A29B91]/10 text-[#A29B91] border-[#A29B91]/20',
    flagged: 'bg-[#CF7668]/10 text-[#CF7668] border-[#CF7668]/25',
    neutral: 'bg-[#A29B91]/10 text-[#A29B91] border-[#A29B91]/20',
    royal: 'bg-[#D9824B]/10 text-[#D9824B] border-[#D9824B]/25',
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
