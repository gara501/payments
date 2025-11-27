import React, { useMemo } from 'react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { MetricCard } from './MetricCard';
import { PieChartWrapper } from './charts/PieChartWrapper';
import { BarChartWrapper } from './charts/BarChartWrapper';
import { LineChartWrapper } from './charts/LineChartWrapper';
import {
  calculateTotalValue,
  calculateMonthlyTotal,
  prepareCategoryChartData,
  calculateMonthlySpendingHistory,
  formatCurrency,
  getSubscriptionStats,
} from '../utils/chartHelpers';

/**
 * MetricsPage Component
 * Displays comprehensive subscription analytics with three key metrics:
 * 1. Total value of all active subscriptions
 * 2. Monthly spending with trend chart
 * 3. Category breakdown with pie chart
 * 
 * Based on Requirements 10.1, 10.2, 10.4, 10.5
 */
export const MetricsPage: React.FC = () => {
  const { subscriptions, loading } = useSubscriptions();

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalValue = calculateTotalValue(subscriptions);
    const monthlyTotal = calculateMonthlyTotal(subscriptions);
    const categoryData = prepareCategoryChartData(subscriptions);
    const monthlySpendingHistory = calculateMonthlySpendingHistory(subscriptions, 12);
    const stats = getSubscriptionStats(subscriptions);
    
    // Transform monthly spending history to match LineChartData interface
    const monthlySpendingData = monthlySpendingHistory.map(item => ({
      name: item.month,
      value: item.value,
    }));

    // Calculate average subscription cost
    const averageCost = stats.active > 0 ? totalValue / stats.active : 0;

    return {
      totalValue,
      monthlyTotal,
      categoryData,
      monthlySpendingData,
      stats,
      averageCost,
    };
  }, [subscriptions]);

  // Check if there are any active subscriptions
  const hasActiveSubscriptions = subscriptions.some(sub => sub.is_active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-3 tracking-tight leading-tight">
            Metrics & Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
            View insights about your subscription spending and trends
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasActiveSubscriptions && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                className="w-12 h-12 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Active Subscriptions
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Add some subscriptions to see your spending analytics and insights.
            </p>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && hasActiveSubscriptions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Subscriptions Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Subscriptions
                </h3>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg 
                    className="w-5 h-5 text-blue-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {metrics.stats.total}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                All subscriptions
              </p>
            </div>

            {/* Active Subscriptions Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Active
                </h3>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg 
                    className="w-5 h-5 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {metrics.stats.active}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Currently active
              </p>
            </div>

            {/* Inactive Subscriptions Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Inactive
                </h3>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg 
                    className="w-5 h-5 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {metrics.stats.inactive}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Not currently active
              </p>
            </div>

            {/* Average Cost Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Average Cost
                </h3>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg 
                    className="w-5 h-5 text-purple-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" 
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(metrics.averageCost)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Per subscription
              </p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        {!loading && hasActiveSubscriptions && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Metric 1: Total Value */}
            <MetricCard
              title="Total Subscription Value"
              value={formatCurrency(metrics.totalValue)}
              subtitle="Total value of all active subscriptions"
              icon={
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 text-blue-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              }
              chart={
                metrics.monthlySpendingData.length > 0 ? (
                  <LineChartWrapper
                    data={metrics.monthlySpendingData}
                    height={200}
                    showGrid={false}
                    lineColor="#3B82F6"
                    strokeWidth={2}
                    ariaLabel="Monthly spending trend line chart"
                    ariaDescription={`Line chart showing spending trends over ${metrics.monthlySpendingData.length} months`}
                  />
                ) : null
              }
            />

            {/* Metric 2: Monthly Spending */}
            <MetricCard
              title="Monthly Spending"
              value={formatCurrency(metrics.monthlyTotal)}
              subtitle="Total monthly subscription costs"
              icon={
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
              }
              chart={
                metrics.monthlySpendingData.length > 0 ? (
                  <BarChartWrapper
                    data={metrics.monthlySpendingData}
                    height={200}
                    showGrid={true}
                    barColor="#10B981"
                    ariaLabel="Monthly spending bar chart"
                    ariaDescription={`Bar chart displaying monthly subscription costs over ${metrics.monthlySpendingData.length} months`}
                  />
                ) : null
              }
            />

            {/* Metric 3: Category Breakdown */}
            <MetricCard
              title="Category Breakdown"
              value={`${metrics.categoryData.length} Categories`}
              subtitle="Spending distribution by category"
              icon={
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 text-purple-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
                    />
                  </svg>
                </div>
              }
              chart={
                metrics.categoryData.length > 0 ? (
                  <PieChartWrapper
                    data={metrics.categoryData}
                    height={250}
                    showLegend={true}
                    innerRadius={50}
                    outerRadius={90}
                    ariaLabel="Category spending breakdown pie chart"
                    ariaDescription={`Pie chart showing subscription spending across ${metrics.categoryData.length} categories`}
                  />
                ) : null
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
