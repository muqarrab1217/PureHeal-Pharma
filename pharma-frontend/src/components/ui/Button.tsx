import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-700 text-white';
      case 'secondary':
        return 'bg-secondary-500 hover:bg-secondary-600 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger':
        return 'bg-danger-500 hover:bg-danger-600 text-white';
      case 'warning':
        return 'bg-warning-500 hover:bg-warning-600 text-white';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'outline':
        return 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50';
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'xs':
        return 'text-xs px-2 py-1';
      case 'sm':
        return 'text-sm px-3 py-1.5';
      case 'md':
        return 'text-sm px-4 py-2';
      case 'lg':
        return 'text-base px-5 py-2.5';
      case 'xl':
        return 'text-lg px-6 py-3';
      default:
        return 'text-sm px-4 py-2';
    }
  };

  return (
    <button
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
        ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className={`mr-2 ${size === 'xs' ? 'text-xs' : ''}`}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={`ml-2 ${size === 'xs' ? 'text-xs' : ''}`}>{icon}</span>}
    </button>
  );
};

export default Button;