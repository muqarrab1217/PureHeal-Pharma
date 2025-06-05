import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-100 text-primary-800';
      case 'secondary':
        return 'bg-secondary-100 text-secondary-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'danger':
        return 'bg-danger-100 text-danger-800';
      case 'warning':
        return 'bg-warning-100 text-warning-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-primary-100 text-primary-800';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariantClasses()} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;