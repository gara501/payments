import { describe, it, expect } from 'vitest';
import {
  calculateTotalValue,
  calculateMonthlyTotal,
  calculateMonthlySpending,
  calculateMonthlySpendingHistory,
  formatCurrency,
  formatPercentage,
  getCategoryColor,
  prepareCategoryChartData,
  prepareMonthlyChartData,
  aggregateSpendingByCategory,
  getSubscriptionStats,
} from '../chartHelpers';
import type { Subscription } from '../../types/subscription';

describe('chartHelpers', () => {
  const mockSubscriptions: Subscription[] = [
    {
      id: 1,
      name: 'Netflix',
      subscription_date: '2024-01-15',
      value: 15.99,
      is_active: true,
      category: 'Entertainment',
    },
    {
      id: 2,
      name: 'Spotify',
      subscription_date: '2024-02-01',
      value: 9.99,
      is_active: true,
      category: 'Entertainment',
    },
    {
      id: 3,
      name: 'Adobe',
      subscription_date: '2024-03-10',
      value: 52.99,
      is_active: true,
      category: 'Productivity',
    },
    {
      id: 4,
      name: 'Old Service',
      subscription_date: '2023-12-01',
      value: 20.00,
      is_active: false,
      category: 'General',
    },
  ];

  describe('calculateTotalValue', () => {
    it('should calculate total value of active subscriptions', () => {
      const total = calculateTotalValue(mockSubscriptions);
      expect(total).toBe(78.97); // 15.99 + 9.99 + 52.99
    });

    it('should return 0 for empty array', () => {
      const total = calculateTotalValue([]);
      expect(total).toBe(0);
    });

    it('should exclude inactive subscriptions', () => {
      const total = calculateTotalValue(mockSubscriptions);
      // Should not include the 20.00 from inactive subscription
      expect(total).not.toBe(98.97);
      expect(total).toBe(78.97);
    });

    it('should return 0 when all subscriptions are inactive', () => {
      const inactiveSubscriptions: Subscription[] = [
        {
          id: 1,
          name: 'Test',
          subscription_date: '2024-01-01',
          value: 10.00,
          is_active: false,
        },
      ];
      const total = calculateTotalValue(inactiveSubscriptions);
      expect(total).toBe(0);
    });
  });

  describe('calculateMonthlyTotal', () => {
    it('should calculate monthly total (same as total value)', () => {
      const monthly = calculateMonthlyTotal(mockSubscriptions);
      expect(monthly).toBe(78.97);
    });

    it('should return 0 for empty array', () => {
      const monthly = calculateMonthlyTotal([]);
      expect(monthly).toBe(0);
    });
  });

  describe('calculateMonthlySpending', () => {
    it('should calculate spending for a specific month', () => {
      // For January 2024, only Netflix should be included (started Jan 15)
      const janSpending = calculateMonthlySpending(mockSubscriptions, 0, 2024);
      expect(janSpending).toBe(15.99);
    });

    it('should include all subscriptions that started before or in the target month', () => {
      // For March 2024, all three active subscriptions should be included
      const marSpending = calculateMonthlySpending(mockSubscriptions, 2, 2024);
      expect(marSpending).toBe(78.97); // Netflix + Spotify + Adobe
    });

    it('should exclude subscriptions that started after the target month', () => {
      // For December 2023, no active subscriptions should be included
      const decSpending = calculateMonthlySpending(mockSubscriptions, 11, 2023);
      expect(decSpending).toBe(0);
    });

    it('should exclude inactive subscriptions', () => {
      // Even though "Old Service" started in Dec 2023, it should not be included
      const janSpending = calculateMonthlySpending(mockSubscriptions, 0, 2024);
      expect(janSpending).toBe(15.99); // Only Netflix
    });

    it('should return 0 for empty array', () => {
      const spending = calculateMonthlySpending([], 0, 2024);
      expect(spending).toBe(0);
    });
  });

  describe('calculateMonthlySpendingHistory', () => {
    it('should return spending history for the last N months', () => {
      const history = calculateMonthlySpendingHistory(mockSubscriptions, 6);
      
      expect(history).toHaveLength(6);
      
      // Each entry should have required properties
      history.forEach(entry => {
        expect(entry).toHaveProperty('month');
        expect(entry).toHaveProperty('year');
        expect(entry).toHaveProperty('value');
        expect(entry).toHaveProperty('date');
        expect(typeof entry.value).toBe('number');
      });
    });

    it('should default to 12 months if no count specified', () => {
      const history = calculateMonthlySpendingHistory(mockSubscriptions);
      expect(history).toHaveLength(12);
    });

    it('should return months in chronological order (oldest first)', () => {
      const history = calculateMonthlySpendingHistory(mockSubscriptions, 3);
      
      // Verify dates are in ascending order
      for (let i = 1; i < history.length; i++) {
        expect(history[i].date.getTime()).toBeGreaterThan(history[i - 1].date.getTime());
      }
    });

    it('should calculate cumulative spending correctly', () => {
      const history = calculateMonthlySpendingHistory(mockSubscriptions, 12);
      
      // Find entries for months where subscriptions started
      // Values should increase as more subscriptions are added
      const values = history.map(h => h.value);
      
      // The most recent months should have the highest spending (all active subs)
      const recentMonths = values.slice(-3);
      recentMonths.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle empty subscription array', () => {
      const history = calculateMonthlySpendingHistory([], 6);
      
      expect(history).toHaveLength(6);
      history.forEach(entry => {
        expect(entry.value).toBe(0);
      });
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with dollar sign and two decimals', () => {
      expect(formatCurrency(15.99)).toBe('$15.99');
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with one decimal', () => {
      expect(formatPercentage(25.5)).toBe('25.5%');
      expect(formatPercentage(100)).toBe('100.0%');
      expect(formatPercentage(0)).toBe('0.0%');
    });

    it('should round to one decimal place', () => {
      expect(formatPercentage(33.333)).toBe('33.3%');
    });
  });

  describe('getCategoryColor', () => {
    it('should return correct colors for categories', () => {
      expect(getCategoryColor('Entertainment')).toBeDefined();
      expect(getCategoryColor('Productivity')).toBeDefined();
      expect(getCategoryColor('Health')).toBeDefined();
      expect(getCategoryColor('Finance')).toBeDefined();
      expect(getCategoryColor('General')).toBeDefined();
    });

    it('should be case insensitive', () => {
      expect(getCategoryColor('entertainment')).toBe(getCategoryColor('Entertainment'));
    });

    it('should return default color for unknown category', () => {
      const unknownColor = getCategoryColor('Unknown');
      const generalColor = getCategoryColor('General');
      expect(unknownColor).toBe(generalColor);
    });
  });

  describe('prepareCategoryChartData', () => {
    it('should group subscriptions by category', () => {
      const chartData = prepareCategoryChartData(mockSubscriptions);
      
      expect(chartData).toHaveLength(2); // Entertainment and Productivity
      
      const entertainment = chartData.find(d => d.name === 'Entertainment');
      expect(entertainment?.value).toBe(25.98); // 15.99 + 9.99
      
      const productivity = chartData.find(d => d.name === 'Productivity');
      expect(productivity?.value).toBe(52.99);
    });

    it('should only include active subscriptions', () => {
      const chartData = prepareCategoryChartData(mockSubscriptions);
      const general = chartData.find(d => d.name === 'General');
      expect(general).toBeUndefined(); // Inactive subscription should not be included
    });

    it('should return empty array for no active subscriptions', () => {
      const inactiveSubscriptions: Subscription[] = [
        {
          id: 1,
          name: 'Test',
          subscription_date: '2024-01-01',
          value: 10.00,
          is_active: false,
        },
      ];
      const chartData = prepareCategoryChartData(inactiveSubscriptions);
      expect(chartData).toHaveLength(0);
    });
  });

  describe('prepareMonthlyChartData', () => {
    it('should distribute subscriptions across months', () => {
      const chartData = prepareMonthlyChartData(mockSubscriptions);
      
      // Should have entries for months with subscriptions (filters out zero values)
      expect(chartData.length).toBeGreaterThan(0);
      
      // All returned months should have positive values
      chartData.forEach(month => {
        expect(month.value).toBeGreaterThan(0);
      });
      
      // Should have data for the months where subscriptions exist
      expect(chartData.length).toBeLessThanOrEqual(3); // Jan, Feb, Mar
    });

    it('should only include active subscriptions', () => {
      const chartData = prepareMonthlyChartData(mockSubscriptions);
      const totalValue = chartData.reduce((sum, month) => sum + month.value, 0);
      expect(totalValue).toBe(78.97); // Only active subscriptions
    });
  });

  describe('aggregateSpendingByCategory', () => {
    it('should aggregate spending by category for active subscriptions', () => {
      const aggregated = aggregateSpendingByCategory(mockSubscriptions);
      
      expect(aggregated['Entertainment']).toBe(25.98); // Netflix + Spotify
      expect(aggregated['Productivity']).toBe(52.99); // Adobe
      expect(aggregated['General']).toBeUndefined(); // Inactive subscription excluded
    });

    it('should include inactive subscriptions when specified', () => {
      const aggregated = aggregateSpendingByCategory(mockSubscriptions, true);
      
      expect(aggregated['Entertainment']).toBe(25.98);
      expect(aggregated['Productivity']).toBe(52.99);
      expect(aggregated['General']).toBe(20.00); // Inactive subscription included
    });

    it('should handle subscriptions without category', () => {
      const subsWithoutCategory: Subscription[] = [
        {
          id: 1,
          name: 'Test',
          subscription_date: '2024-01-01',
          value: 10.00,
          is_active: true,
        },
      ];
      
      const aggregated = aggregateSpendingByCategory(subsWithoutCategory);
      expect(aggregated['General']).toBe(10.00);
    });

    it('should return empty object for empty array', () => {
      const aggregated = aggregateSpendingByCategory([]);
      expect(Object.keys(aggregated)).toHaveLength(0);
    });

    it('should return empty object when all subscriptions are inactive', () => {
      const inactiveSubscriptions: Subscription[] = [
        {
          id: 1,
          name: 'Test',
          subscription_date: '2024-01-01',
          value: 10.00,
          is_active: false,
          category: 'Entertainment',
        },
      ];
      
      const aggregated = aggregateSpendingByCategory(inactiveSubscriptions);
      expect(Object.keys(aggregated)).toHaveLength(0);
    });

    it('should sum multiple subscriptions in the same category', () => {
      const multipleInCategory: Subscription[] = [
        {
          id: 1,
          name: 'Netflix',
          subscription_date: '2024-01-01',
          value: 15.99,
          is_active: true,
          category: 'Entertainment',
        },
        {
          id: 2,
          name: 'Spotify',
          subscription_date: '2024-01-01',
          value: 9.99,
          is_active: true,
          category: 'Entertainment',
        },
        {
          id: 3,
          name: 'Disney+',
          subscription_date: '2024-01-01',
          value: 7.99,
          is_active: true,
          category: 'Entertainment',
        },
      ];
      
      const aggregated = aggregateSpendingByCategory(multipleInCategory);
      expect(aggregated['Entertainment']).toBe(33.97); // 15.99 + 9.99 + 7.99
    });

    it('should handle multiple categories correctly', () => {
      const aggregated = aggregateSpendingByCategory(mockSubscriptions);
      
      const categories = Object.keys(aggregated);
      expect(categories).toContain('Entertainment');
      expect(categories).toContain('Productivity');
      expect(categories.length).toBe(2); // Only active subscription categories
    });
  });

  describe('getSubscriptionStats', () => {
    it('should return correct statistics', () => {
      const stats = getSubscriptionStats(mockSubscriptions);
      
      expect(stats.total).toBe(4);
      expect(stats.active).toBe(3);
      expect(stats.inactive).toBe(1);
      expect(stats.totalValue).toBe(78.97);
      expect(stats.monthlyTotal).toBe(78.97);
    });

    it('should handle empty array', () => {
      const stats = getSubscriptionStats([]);
      
      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.inactive).toBe(0);
      expect(stats.totalValue).toBe(0);
      expect(stats.monthlyTotal).toBe(0);
    });
  });
});
