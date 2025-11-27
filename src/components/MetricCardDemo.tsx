import React from 'react';
import { MetricCard } from './MetricCard';
import { PieChartWrapper } from './charts/PieChartWrapper';
import { formatCurrency, formatPercentage } from '../utils/chartHelpers';

/**
 * Demo component showing various MetricCard usage examples
 * This demonstrates the flexibility and features of the MetricCard component
 */
export const MetricCardDemo: React.FC = () => {
  // Sample data for pie chart
  const categoryData = [
    { name: 'Entertainment', value: 45.99, color: '#3B82F6' },
    { name: 'Productivity', value: 29.99, color: '#10B981' },
    { name: 'Health', value: 19.99, color: '#EF4444' },
    { name: 'Finance', value: 15.00, color: '#F59E0B' },
  ];

  const totalValue = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          MetricCard Component Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Simple metric with string value */}
          <MetricCard
            title="Total Subscriptions"
            value="12"
            subtitle="Active subscriptions"
          />

          {/* Metric with numeric value and formatter */}
          <MetricCard
            title="Monthly Spending"
            value={totalValue}
            format={formatCurrency}
            subtitle="Total monthly cost"
          />

          {/* Metric with percentage */}
          <MetricCard
            title="Savings Rate"
            value={15.5}
            format={(val) => formatPercentage(val)}
            subtitle="Compared to last month"
          />

          {/* Metric with icon */}
          <MetricCard
            title="Active Services"
            value={8}
            subtitle="Currently subscribed"
            icon={
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
          />

          {/* Metric with chart */}
          <MetricCard
            title="Category Breakdown"
            value={totalValue}
            format={formatCurrency}
            subtitle="Spending by category"
            chart={
              <PieChartWrapper
                data={categoryData}
                width={300}
                height={200}
                showLegend={false}
                innerRadius={40}
                outerRadius={70}
              />
            }
            className="md:col-span-2"
          />

          {/* Large metric card */}
          <MetricCard
            title="Annual Total"
            value={totalValue * 12}
            format={formatCurrency}
            subtitle="Projected yearly spending"
            className="lg:col-span-1"
          />
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            MetricCard Features
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Flexible value display (string or number)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Custom formatting functions for currency, percentages, etc.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Optional chart integration for data visualization</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Icon support for visual enhancement</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Subtitle support for additional context</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Responsive design with hover effects</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Consistent styling with FlyonUI design system</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
