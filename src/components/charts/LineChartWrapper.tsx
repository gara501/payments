import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BaseChart, CHART_COLORS, CHART_THEME } from './BaseChart';
import type { CustomTooltipProps } from '../../types/recharts';
import { isActiveTooltip } from '../../types/recharts';
import { formatCurrency } from '../../utils/chartHelpers';

export interface LineChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface LineChartWrapperProps {
  data: LineChartData[];
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  lineColor?: string;
  dataKey?: string;
  xAxisKey?: string;
  strokeWidth?: number;
  ariaLabel?: string;
  ariaDescription?: string;
}

/**
 * Reusable Line Chart component with consistent styling
 * Responsive and accessible line chart visualization
 */
export const LineChartWrapper: React.FC<LineChartWrapperProps> = ({
  data,
  width = 400,
  height = 300,
  className = '',
  showGrid = true,
  showTooltip = true,
  lineColor = CHART_COLORS.primary,
  dataKey = 'value',
  xAxisKey = 'name',
  strokeWidth = 2,
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
    ? `Line chart showing ${data.length} data points. ${data.map(item => 
        `${item[xAxisKey]}: ${formatCurrency(item[dataKey])}`
      ).join(', ')}`
    : 'Empty line chart with no data';

  return (
    <BaseChart 
      width={width} 
      height={height} 
      className={className}
      ariaLabel={ariaLabel || 'Line chart visualization'}
      ariaDescription={ariaDescription || defaultDescription}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
        <LineChart 
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
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={lineColor}
            strokeWidth={strokeWidth}
            dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
            aria-label="Line chart line"
          />
        </LineChart>
      </ResponsiveContainer>
    </BaseChart>
  );
};
