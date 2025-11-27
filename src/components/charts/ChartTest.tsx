import React from 'react';
import { PieChartWrapper, BarChartWrapper, LineChartWrapper } from './index';

// Sample data for testing
const samplePieData = [
  { name: 'Entertainment', value: 45.97, color: '#3B82F6' },
  { name: 'Productivity', value: 120.64, color: '#10B981' },
  { name: 'Finance', value: 3.00, color: '#F59E0B' },
  { name: 'General', value: 14.98, color: '#6B7280' },
];

const sampleBarData = [
  { name: 'Jan', value: 150.50 },
  { name: 'Feb', value: 180.25 },
  { name: 'Mar', value: 165.75 },
  { name: 'Apr', value: 195.00 },
];

const sampleLineData = [
  { name: 'Week 1', value: 45.50 },
  { name: 'Week 2', value: 52.25 },
  { name: 'Week 3', value: 48.75 },
  { name: 'Week 4', value: 55.00 },
];

/**
 * Test component to verify Recharts integration
 */
export const ChartTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Chart Components Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Pie Chart - Category Breakdown</h2>
          <PieChartWrapper 
            data={samplePieData}
            height={300}
            showLegend={true}
            showTooltip={true}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Bar Chart - Monthly Spending</h2>
          <BarChartWrapper 
            data={sampleBarData}
            height={300}
            showGrid={true}
            showTooltip={true}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Line Chart - Weekly Trends</h2>
          <LineChartWrapper 
            data={sampleLineData}
            height={300}
            showGrid={true}
            showTooltip={true}
          />
        </div>
      </div>
    </div>
  );
};