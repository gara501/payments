import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricsPage } from '../MetricsPage';
import * as useSubscriptionsHook from '../../hooks/useSubscriptions';
import type { Subscription } from '../../types/subscription';

// Mock the useSubscriptions hook
vi.mock('../../hooks/useSubscriptions');

// Mock Recharts components to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
}));

describe('MetricsPage', () => {
  const mockSubscriptions: Subscription[] = [
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
      subscription_date: '2024-01-15',
      value: 9.99,
      is_active: true,
      category: 'Entertainment',
    },
    {
      id: 3,
      name: 'Microsoft 365',
      subscription_date: '2024-02-01',
      value: 12.99,
      is_active: true,
      category: 'Productivity',
    },
  ];

  it('renders the metrics page with three metric cards', () => {
    vi.mocked(useSubscriptionsHook.useSubscriptions).mockReturnValue({
      subscriptions: mockSubscriptions,
      loading: false,
      addSubscription: vi.fn(),
      deleteSubscription: vi.fn(),
      updateSubscription: vi.fn(),
    });

    render(<MetricsPage />);

    expect(screen.getByText('Metrics & Analytics')).toBeInTheDocument();
    expect(screen.getByText('Total Subscription Value')).toBeInTheDocument();
    expect(screen.getByText('Monthly Spending')).toBeInTheDocument();
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
  });

  it('displays the correct total value', () => {
    vi.mocked(useSubscriptionsHook.useSubscriptions).mockReturnValue({
      subscriptions: mockSubscriptions,
      loading: false,
      addSubscription: vi.fn(),
      deleteSubscription: vi.fn(),
      updateSubscription: vi.fn(),
    });

    render(<MetricsPage />);

    // Total: 15.99 + 9.99 + 12.99 = 38.97
    // Both Total Value and Monthly Spending show the same amount
    const values = screen.getAllByText('$38.97');
    expect(values).toHaveLength(2); // Total Value and Monthly Spending
  });

  it('displays the correct number of categories', () => {
    vi.mocked(useSubscriptionsHook.useSubscriptions).mockReturnValue({
      subscriptions: mockSubscriptions,
      loading: false,
      addSubscription: vi.fn(),
      deleteSubscription: vi.fn(),
      updateSubscription: vi.fn(),
    });

    render(<MetricsPage />);

    // Two categories: Entertainment and Productivity
    expect(screen.getByText('2 Categories')).toBeInTheDocument();
  });

  it('renders pie chart for category breakdown', () => {
    vi.mocked(useSubscriptionsHook.useSubscriptions).mockReturnValue({
      subscriptions: mockSubscriptions,
      loading: false,
      addSubscription: vi.fn(),
      deleteSubscription: vi.fn(),
      updateSubscription: vi.fn(),
    });

    render(<MetricsPage />);

    // Verify pie chart is rendered
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('shows empty state when no active subscriptions', () => {
    vi.mocked(useSubscriptionsHook.useSubscriptions).mockReturnValue({
      subscriptions: [],
      loading: false,
      addSubscription: vi.fn(),
      deleteSubscription: vi.fn(),
      updateSubscription: vi.fn(),
    });

    render(<MetricsPage />);

    expect(screen.getByText('No Active Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Add some subscriptions to see your spending analytics and insights.')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useSubscriptionsHook.useSubscriptions).mockReturnValue({
      subscriptions: [],
      loading: true,
      addSubscription: vi.fn(),
      deleteSubscription: vi.fn(),
      updateSubscription: vi.fn(),
    });

    render(<MetricsPage />);

    // Check for loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('only includes active subscriptions in calculations', () => {
    const subscriptionsWithInactive: Subscription[] = [
      ...mockSubscriptions,
      {
        id: 4,
        name: 'Inactive Service',
        subscription_date: '2024-03-01',
        value: 50.00,
        is_active: false,
        category: 'General',
      },
    ];

    vi.mocked(useSubscriptionsHook.useSubscriptions).mockReturnValue({
      subscriptions: subscriptionsWithInactive,
      loading: false,
      addSubscription: vi.fn(),
      deleteSubscription: vi.fn(),
      updateSubscription: vi.fn(),
    });

    render(<MetricsPage />);

    // Total should still be 38.97 (excluding the inactive subscription)
    const values = screen.getAllByText('$38.97');
    expect(values).toHaveLength(2); // Total Value and Monthly Spending
    // Should still show 2 categories (not 3)
    expect(screen.getByText('2 Categories')).toBeInTheDocument();
  });
});
