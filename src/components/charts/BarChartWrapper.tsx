import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BaseChart, CHART_COLORS, CHART_THEME } from './BaseChart';
import type { CustomTooltipProps } from '../../types/recharts';
import { isActiveTooltip } from '../../types/recharts';
import { formatCurrency } from '../../utils/chartHelpers';

export interface BarChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface BarChartWrapperProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  barColor?: string;
  dataKey?: string;
  xAxisKey?: string;
  ariaLabel?: string;
  ariaDescription?: string;
}

/**
 * Reusable Bar Chart component with consistent styling
 * Responsive and accessible bar chart visualization
 */
export const BarChartWrapper: React.FC<BarChartWrapperProps> = ({
  data,
  width = 400,
  height = 300,
  className = '',
  showGrid = true,
  showTooltip = true,
  barColor = CHART_COLORS.primary,
  dataKey = 'value',
  xAxisKey = 'name',
  ariaLabel,
  ariaDescription,
}) => {
  // Custom tooltip formatter
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (isActiveTooltip(active, payload)) {
      const data = payload[0];
      return (
        <div 
          className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
          style={CHART_THEME.tooltip}
        >
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-semibold">{formatCurrency(data.value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Generate accessible description
  const defaultDescription = data.length > 0
    ? `Bar chart showing ${data.length} data points. ${data.map(item => 
        `${item[xAxisKey]}: ${formatCurrency(item[dataKey])}`
      ).join(', ')}`
    : 'Empty bar chart with no data';

  return (
    <BaseChart 
      width={width} 
      height={height} 
      className={className}
      ariaLabel={ariaLabel || 'Bar chart visualization'}
      ariaDescription={ariaDescription || defaultDescription}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={CHART_THEME.grid.stroke}
              strokeWidth={CHART_THEME.grid.strokeWidth}
            />
          )}
          <XAxis 
            dataKey={xAxisKey}
            stroke={CHART_THEME.axis.stroke}
            fontSize={CHART_THEME.axis.fontSize}
            fontFamily={CHART_THEME.fontFamily}
            aria-label="X axis"
          />
          <YAxis 
            stroke={CHART_THEME.axis.stroke}
            fontSize={CHART_THEME.axis.fontSize}
            fontFamily={CHART_THEME.fontFamily}
            tickFormatter={(value) => `${value}`}
            aria-label="Y axis"
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          <Bar 
            dataKey={dataKey} 
            fill={barColor}
            radius={[4, 4, 0, 0]}
            aria-label="Bar chart bars"
          />
        </BarChart>
      </ResponsiveContainer>
    </BaseChart>
  );
};
