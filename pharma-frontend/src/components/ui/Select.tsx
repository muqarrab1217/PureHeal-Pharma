import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: Option[];
  size?: 'sm' | 'md' | 'lg';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = false, options, size = 'md', className = '', ...props }, ref) => {
    const getSizeClasses = (): string => {
      switch (size) {
        case 'sm':
          return 'py-1.5 text-sm';
        case 'md':
          return 'py-2 text-sm';
        case 'lg':
          return 'py-2.5 text-base';
        default:
          return 'py-2 text-sm';
      }
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              appearance-none
              block w-full pl-3 pr-10 ${getSizeClasses()} bg-white border rounded-md
              ${
                error
                  ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              }
              focus:outline-none focus:ring-1
              ${props.disabled ? 'bg-gray-100 text-gray-500' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;