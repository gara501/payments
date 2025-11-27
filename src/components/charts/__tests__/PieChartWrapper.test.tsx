import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PieChartWrapper } from '../PieChartWrapper';
import type { PieChartData } from '../PieChartWrapper';

// Mock Recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ data, dataKey }: { data: PieChartData[]; dataKey: string }) => (
    <div data-testid="pie" data-key={dataKey} data-items={data.length} />
  ),
  Cell: () => <div data-testid="cell" />,
  Tooltip: ({ content }: { content: React.ComponentType }) => (
    <div data-testid="tooltip">{content && 'Custom Tooltip'}</div>
  ),
  Legend: () => <div data-testid="legend" />,
}));

describe('PieChartWrapper', () => {
  const mockData: PieChartData[] = [
    { name: 'Entertainment', value: 25.98, color: '#3B82F6' },
    { name: 'Productivity', value: 12.99, color: '#10B981' },
    { name: 'Health', value: 9.99, color: '#EF4444' },
  ];

  it('renders pie chart with data', () => {
    render(<PieChartWrapper data={mockData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('renders with custom dimensions and responsive behavior', () => {
    const { container } = render(
      <PieChartWrapper data={mockData} width={500} height={400} />
    );

    const chartContainer = container.querySelector('.chart-container');
    // Width is now 100% for responsiveness with max-width constraint
    expect(chartContainer).toHaveStyle({ width: '100%', maxWidth: '500px', height: '400px' });
  });

  it('uses default dimensions when not specified with responsive behavior', () => {
    const { container } = render(<PieChartWrapper data={mockData} />);

    const chartContainer = container.querySelector('.chart-container');
    // Width is now 100% for responsiveness with max-width constraint
    expect(chartContainer).toHaveStyle({ width: '100%', maxWidth: '400px', height: '300px', minHeight: '200px' });
  });

  it('renders legend when showLegend is true', () => {
    render(<PieChartWrapper data={mockData} showLegend={true} />);

    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('does not render legend when showLegend is false', () => {
    render(<PieChartWrapper data={mockData} showLegend={false} />);

    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });

  it('renders tooltip when showTooltip is true', () => {
    render(<PieChartWrapper data={mockData} showTooltip={true} />);

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('does not render tooltip when showTooltip is false', () => {
    render(<PieChartWrapper data={mockData} showTooltip={false} />);

    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PieChartWrapper data={mockData} className="custom-pie-chart" />
    );

    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toHaveClass('custom-pie-chart');
  });

  it('handles empty data array', () => {
    render(<PieChartWrapper data={[]} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('passes correct dataKey to Pie component', () => {
    render(<PieChartWrapper data={mockData} />);

    const pieElement = screen.getByTestId('pie');
    expect(pieElement).toHaveAttribute('data-key', 'value');
  });

  it('renders correct number of data items', () => {
    render(<PieChartWrapper data={mockData} />);

    const pieElement = screen.getByTestId('pie');
    expect(pieElement).toHaveAttribute('data-items', '3');
  });
});

describe('PieChartWrapper Accessibility', () => {
  const mockData: PieChartData[] = [
    { name: 'Entertainment', value: 25.98, color: '#3B82F6' },
    { name: 'Productivity', value: 12.99, color: '#10B981' },
  ];

  it('includes default aria-label', () => {
    const { container } = render(<PieChartWrapper data={mockData} />);
    
    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toHaveAttribute('aria-label', 'Pie chart visualization');
  });

  it('accepts custom aria-label', () => {
    const { container } = render(
      <PieChartWrapper data={mockData} ariaLabel="Category spending chart" />
    );
    
    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toHaveAttribute('aria-label', 'Category spending chart');
  });

  it('generates accessible description from data', () => {
    render(<PieChartWrapper data={mockData} />);
    
    // Check that description includes category names and values
    const description = screen.getByText(/Entertainment.*Productivity/);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('sr-only');
  });

  it('accepts custom aria-description', () => {
    render(
      <PieChartWrapper 
        data={mockData} 
        ariaDescription="Custom description for pie chart" 
      />
    );
    
    expect(screen.getByText('Custom description for pie chart')).toBeInTheDocument();
  });

  it('handles empty data with appropriate description', () => {
    render(<PieChartWrapper data={[]} />);
    
    expect(screen.getByText('Empty pie chart with no data')).toBeInTheDocument();
  });
});
