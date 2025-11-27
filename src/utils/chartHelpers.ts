import { CHART_COLORS } from '../components/charts';
import type { Subscription } from '../types/subscription';

/**
 * Format currency values for chart display
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage values for chart display
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Get color for subscription category (for charts)
 */
export const getCategoryColor = (category: string): string => {
  const categoryLower = category.toLowerCase();
  switch (categoryLower) {
    case 'entertainment':
      return CHART_COLORS.entertainment;
    case 'productivity':
      return CHART_COLORS.productivity;
    case 'health':
      return CHART_COLORS.health;
    case 'finance':
      return CHART_COLORS.finance;
    case 'general':
    default:
      return CHART_COLORS.general;
  }
};

/**
 * Get category icon emoji
 */
export const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'entertainment':
      return '🎬';
    case 'productivity':
      return '💼';
    case 'health':
      return '🏥';
    case 'finance':
      return '💰';
    case 'general':
    default:
      return '📋';
  }
};

/**
 * Prepare data for category breakdown pie chart
 */
export const prepareCategoryChartData = (subscriptions: Subscription[]) => {
  const activeSubscriptions = subscriptions.filter(sub => sub.is_active);
  
  // Group by category and sum values
  const categoryTotals = activeSubscriptions.reduce((acc, sub) => {
    const category = sub.category || 'General';
    acc[category] = (acc[category] || 0) + sub.value;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data format
  return Object.entries(categoryTotals).map(([category, value]) => ({
    name: category,
    value: value,
    color: getCategoryColor(category),
  }));
};

/**
 * Prepare data for monthly spending bar chart
 */
export const prepareMonthlyChartData = (subscriptions: Subscription[]) => {
  const activeSubscriptions = subscriptions.filter(sub => sub.is_active);
  
  // For now, we'll create sample monthly data
  // In a real app, this would be based on actual subscription dates and billing cycles
  const monthlyData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
    { name: 'Aug', value: 0 },
    { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 },
    { name: 'Nov', value: 0 },
    { name: 'Dec', value: 0 },
  ];

  // Distribute subscriptions across months based on their start dates
  activeSubscriptions.forEach(sub => {
    const date = new Date(sub.subscription_date);
    // Use UTC methods to avoid timezone issues
    const month = date.getUTCMonth();
    if (month >= 0 && month < 12) {
      monthlyData[month].value += sub.value;
    }
  });

  return monthlyData.filter(month => month.value > 0);
};

/**
 * Calculate total subscription value
 */
export const calculateTotalValue = (subscriptions: Subscription[]): number => {
  return subscriptions
    .filter(sub => sub.is_active)
    .reduce((total, sub) => total + sub.value, 0);
};

/**
 * Calculate monthly spending total (same as total for monthly subscriptions)
 */
export const calculateMonthlyTotal = (subscriptions: Subscription[]): number => {
  return calculateTotalValue(subscriptions);
};

/**
 * Calculate monthly spending for a specific month and year
 * @param subscriptions - Array of subscriptions
 * @param month - Month (0-11, where 0 is January)
 * @param year - Year (e.g., 2024)
 * @returns Total spending for that month
 */
export const calculateMonthlySpending = (
  subscriptions: Subscription[],
  month: number,
  year: number
): number => {
  return subscriptions
    .filter(sub => {
      if (!sub.is_active) return false;
      
      const subDate = new Date(sub.subscription_date);
      // Use UTC methods to avoid timezone issues with date strings
      const subYear = subDate.getUTCFullYear();
      const subMonth = subDate.getUTCMonth();
      
      // Include subscription if it started on or before the target month/year
      if (subYear < year) return true;
      if (subYear === year && subMonth <= month) return true;
      return false;
    })
    .reduce((total, sub) => total + sub.value, 0);
};

/**
 * Calculate monthly spending for the last N months
 * @param subscriptions - Array of subscriptions
 * @param monthsCount - Number of months to calculate (default: 12)
 * @returns Array of monthly spending data
 */
export const calculateMonthlySpendingHistory = (
  subscriptions: Subscription[],
  monthsCount: number = 12
): Array<{ month: string; year: number; value: number; date: Date }> => {
  const result: Array<{ month: string; year: number; value: number; date: Date }> = [];
  const now = new Date();
  
  for (let i = monthsCount - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const spending = calculateMonthlySpending(subscriptions, month, year);
    
    result.push({
      month: monthNames[month],
      year,
      value: spending,
      date: targetDate,
    });
  }
  
  return result;
};

/**
 * Aggregate spending by category
 * @param subscriptions - Array of subscriptions
 * @param includeInactive - Whether to include inactive subscriptions (default: false)
 * @returns Object mapping category names to total spending amounts
 */
export const aggregateSpendingByCategory = (
  subscriptions: Subscription[],
  includeInactive: boolean = false
): Record<string, number> => {
  const filteredSubscriptions = includeInactive 
    ? subscriptions 
    : subscriptions.filter(sub => sub.is_active);
  
  return filteredSubscriptions.reduce((acc, sub) => {
    const category = sub.category || 'General';
    acc[category] = (acc[category] || 0) + sub.value;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Get subscription statistics
 */
export const getSubscriptionStats = (subscriptions: Subscription[]) => {
  const active = subscriptions.filter(sub => sub.is_active);
  const inactive = subscriptions.filter(sub => !sub.is_active);
  
  return {
    total: subscriptions.length,
    active: active.length,
    inactive: inactive.length,
    totalValue: calculateTotalValue(subscriptions),
    monthlyTotal: calculateMonthlyTotal(subscriptions),
  };
};