import React from 'react';

export interface BaseChartProps {
  width?: number;
  height?: number;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescription?: string;
}

/**
 * Base chart wrapper component for consistent styling across all charts
 * Provides responsive container and accessibility features
 */
export const BaseChart: React.FC<BaseChartProps> = ({
  width = 400,
  height = 300,
  className = '',
  children,
  ariaLabel,
  ariaDescription,
}) => {
  return (
    <div 
      className={`chart-container ${className}`}
      style={{ width: '100%', maxWidth: width, height, minHeight: 200 }}
      role="img"
      aria-label={ariaLabel || 'Data visualization chart'}
      aria-describedby={ariaDescription ? 'chart-description' : undefined}
    >
      {ariaDescription && (
        <div id="chart-description" className="sr-only">
          {ariaDescription}
        </div>
      )}
      {children}
    </div>
  );
};

// Common chart colors based on design system
export const CHART_COLORS = {
  primary: '#3B82F6',      // Blue
  success: '#10B981',      // Green  
  warning: '#F59E0B',      // Yellow
  danger: '#EF4444',       // Red
  neutral: '#6B7280',      // Gray
  // Category colors
  entertainment: '#3B82F6', // Blue
  productivity: '#10B981',  // Green
  health: '#EF4444',       // Red
  finance: '#F59E0B',      // Yellow
  general: '#6B7280',      // Gray
} as const;

// Chart theme configuration
export const CHART_THEME = {
  fontSize: 12,
  fontFamily: 'Raleway, system-ui, sans-serif',
  colors: Object.values(CHART_COLORS),
  grid: {
    stroke: '#E5E7EB',
    strokeWidth: 1,
  },
  axis: {
    stroke: '#9CA3AF',
    fontSize: 11,
  },
  tooltip: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
} as const;