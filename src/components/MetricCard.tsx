import React from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  chart?: React.ReactNode;
  format?: (value: number) => string;
  className?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

/**
 * Reusable component for displaying individual metrics
 * Supports title, value, optional chart display, and custom formatting
 * Based on Requirements 10.1, 12.3, 12.4
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  chart,
  format,
  className = '',
  icon,
  subtitle,
}) => {
  // Format the value if a formatter is provided and value is a number
  const displayValue = typeof value === 'number' && format 
    ? format(value) 
    : value;

  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* Value Section */}
      <div className="mb-6">
        <p className="text-4xl font-bold text-gray-900 tracking-tight">
          {displayValue}
        </p>
      </div>

      {/* Chart Section */}
      {chart && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          {chart}
        </div>
      )}
    </div>
  );
};
