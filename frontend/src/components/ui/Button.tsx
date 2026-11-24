import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111110] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#D9824B] text-[#111110] hover:bg-[#E0925D] active:bg-[#B86B43] focus:ring-[#D9824B] shadow-[0_8px_24px_rgba(217,130,75,0.12)]',
    secondary: 'bg-[#22201D] text-[#F2EEE8] border border-[#35312C] hover:bg-[#292620] active:bg-[#191816] focus:ring-[#D9824B]/40',
    outline: 'border border-[#35312C] bg-transparent text-[#F2EEE8] hover:bg-[#22201D] hover:border-[#D9824B]/50 focus:ring-[#D9824B]/40',
    ghost: 'bg-transparent text-[#A29B91] hover:bg-[#22201D] hover:text-[#F2EEE8] focus:ring-[#35312C]',
    danger: 'bg-[#CF7668] text-[#111110] hover:bg-[#D9877B] focus:ring-[#CF7668] shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {rightIcon && !isLoading && rightIcon}
    </button>
  );
};
