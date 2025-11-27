import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BaseChart, CHART_COLORS, CHART_THEME } from './BaseChart';
import type { CustomTooltipProps } from '../../types/recharts';
import { isActiveTooltip } from '../../types/recharts';
import { formatCurrency, formatPercentage } from '../../utils/chartHelpers';

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
  total?: number;
}

export interface PieChartWrapperProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  ariaLabel?: string;
  ariaDescription?: string;
}

/**
 * Reusable Pie Chart component with consistent styling
 * Responsive and accessible pie chart visualization
 */
export const PieChartWrapper: React.FC<PieChartWrapperProps> = ({
  data,
  width = 400,
  height = 300,
  className = '',
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  outerRadius = 80,
  ariaLabel,
  ariaDescription,
}) => {
  // Custom tooltip formatter
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (isActiveTooltip(active, payload)) {
      const data = payload[0];
      const total = data.payload?.total || 0;
      return (
        <div 
          className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
          style={CHART_THEME.tooltip}
        >
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-semibold">{formatCurrency(data.value)}</span>
          </p>
          {total > 0 && (
            <p className="text-sm text-gray-600">
              Percentage: <span className="font-semibold">{formatPercentage((data.value / total) * 100)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  // Generate accessible description
  const defaultDescription = data.length > 0
    ? `Pie chart showing ${data.length} categories. ${data.map(item => 
        `${item.name}: ${formatCurrency(item.value)} (${formatPercentage((item.value / total) * 100)})`
      ).join(', ')}`
    : 'Empty pie chart with no data';

  return (
    <BaseChart 
      width={width} 
      height={height} 
      className={className}
      ariaLabel={ariaLabel || 'Pie chart visualization'}
      ariaDescription={ariaDescription || defaultDescription}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            aria-label="Pie chart segments"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || CHART_COLORS[Object.keys(CHART_COLORS)[index % Object.keys(CHART_COLORS).length] as keyof typeof CHART_COLORS]}
                aria-label={`${entry.name}: ${formatCurrency(entry.value)}`}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: CHART_THEME.fontSize }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </BaseChart>
  );
};