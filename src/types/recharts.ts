/**
 * Type definitions for Recharts components
 * Provides proper TypeScript types for custom tooltip and legend components
 */

/**
 * Custom tooltip payload structure for charts
 */
export interface ChartTooltipPayload {
  name: string;
  value: number;
  color?: string;
  dataKey?: string;
  payload?: any;
  [key: string]: any;
}

/**
 * Props for custom tooltip components
 */
export interface CustomTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
}

/**
 * Props for custom legend components
 */
export interface CustomLegendProps {
  payload?: Array<{
    value: string;
    type?: string;
    id?: string;
    color?: string;
  }>;
}

/**
 * Generic chart data structure
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

/**
 * Type guard to check if tooltip is active with valid payload
 */
export function isActiveTooltip(
  active: boolean | undefined,
  payload: ChartTooltipPayload[] | undefined
): payload is ChartTooltipPayload[] {
  return active === true && Array.isArray(payload) && payload.length > 0;
}

/**
 * Re-export commonly used Recharts types for convenience
 */
export type {
  TooltipProps,
  LegendProps,
  CartesianGridProps,
  XAxisProps,
  YAxisProps,
} from 'recharts';
