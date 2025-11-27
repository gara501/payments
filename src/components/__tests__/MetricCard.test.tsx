import { render, screen } from '@testing-library/react';
import { MetricCard } from '../MetricCard';
import { formatCurrency } from '../../utils/chartHelpers';

describe('MetricCard', () => {
  it('renders with title and string value', () => {
    render(
      <MetricCard
        title="Total Subscriptions"
        value="12"
      />
    );

    expect(screen.getByText('Total Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders with title and numeric value', () => {
    render(
      <MetricCard
        title="Total Value"
        value={150.50}
      />
    );

    expect(screen.getByText('Total Value')).toBeInTheDocument();
    expect(screen.getByText('150.5')).toBeInTheDocument();
  });

  it('applies custom formatter to numeric values', () => {
    render(
      <MetricCard
        title="Monthly Spending"
        value={250.75}
        format={formatCurrency}
      />
    );

    expect(screen.getByText('Monthly Spending')).toBeInTheDocument();
    expect(screen.getByText('$250.75')).toBeInTheDocument();
  });

  it('does not apply formatter to string values', () => {
    render(
      <MetricCard
        title="Status"
        value="Active"
        format={formatCurrency}
      />
    );

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders with subtitle when provided', () => {
    render(
      <MetricCard
        title="Total Value"
        value={100}
        subtitle="All active subscriptions"
      />
    );

    expect(screen.getByText('Total Value')).toBeInTheDocument();
    expect(screen.getByText('All active subscriptions')).toBeInTheDocument();
  });

  it('renders with chart when provided', () => {
    const mockChart = <div data-testid="mock-chart">Chart Content</div>;
    
    render(
      <MetricCard
        title="Category Breakdown"
        value={500}
        chart={mockChart}
      />
    );

    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    expect(screen.getByText('Chart Content')).toBeInTheDocument();
  });

  it('renders with icon when provided', () => {
    const mockIcon = (
      <svg data-testid="mock-icon" width="24" height="24">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
    
    render(
      <MetricCard
        title="Total Spending"
        value={300}
        icon={mockIcon}
      />
    );

    expect(screen.getByText('Total Spending')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricCard
        title="Test Metric"
        value={100}
        className="custom-class"
      />
    );

    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('renders without optional props', () => {
    render(
      <MetricCard
        title="Simple Metric"
        value={42}
      />
    );

    expect(screen.getByText('Simple Metric')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('has proper styling classes for card layout', () => {
    const { container } = render(
      <MetricCard
        title="Styled Metric"
        value={100}
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('rounded-2xl');
    expect(card).toHaveClass('shadow-lg');
    expect(card).toHaveClass('border');
  });
});
