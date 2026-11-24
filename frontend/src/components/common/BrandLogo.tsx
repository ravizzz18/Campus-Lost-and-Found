import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-xl font-bold',
  };

  return (
    <Link to="/" className="inline-flex items-center gap-2.5 group select-none">
      <div className={`${iconSizes[size]} rounded-lg border border-royal-400/20 bg-royal-500/10 flex items-center justify-center text-white shadow-[0_0_24px_rgba(49,95,234,0.12)] group-hover:bg-royal-500/20 transition-colors`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-royal-400 group-hover:text-white transition-colors"
        >
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`${textSizes[size]} tracking-tight leading-none ${isDark ? 'text-white' : 'text-white'}`}>
          Campus Lost & Found
        </span>
        <span className={`text-[10px] uppercase font-semibold tracking-wider mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-300'}`}>
          BMSIT&M
        </span>
      </div>
    </Link>
  );
};
