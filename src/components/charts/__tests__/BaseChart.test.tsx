import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BaseChart, CHART_COLORS, CHART_THEME } from '../BaseChart';

describe('BaseChart', () => {
  it('renders children correctly', () => {
    render(
      <BaseChart>
        <div data-testid="chart-content">Test Chart</div>
      </BaseChart>
    );
    
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('applies custom width and height with responsive behavior', () => {
    const { container } = render(
      <BaseChart width={500} height={400}>
        <div>Chart</div>
      </BaseChart>
    );
    
    const chartContainer = container.querySelector('.chart-container');
    // Width is now 100% for responsiveness with max-width constraint
    expect(chartContainer).toHaveStyle({ width: '100%', maxWidth: '500px', height: '400px' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <BaseChart className="custom-chart">
        <div>Chart</div>
      </BaseChart>
    );
    
    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toHaveClass('custom-chart');
  });

  it('uses default dimensions when not specified with responsive behavior', () => {
    const { container } = render(
      <BaseChart>
        <div>Chart</div>
      </BaseChart>
    );
    
    const chartContainer = container.querySelector('.chart-container');
    // Width is now 100% for responsiveness with max-width constraint
    expect(chartContainer).toHaveStyle({ width: '100%', maxWidth: '400px', height: '300px', minHeight: '200px' });
  });
});

describe('CHART_COLORS', () => {
  it('exports all required color constants', () => {
    expect(CHART_COLORS.primary).toBe('#3B82F6');
    expect(CHART_COLORS.success).toBe('#10B981');
    expect(CHART_COLORS.warning).toBe('#F59E0B');
    expect(CHART_COLORS.danger).toBe('#EF4444');
    expect(CHART_COLORS.neutral).toBe('#6B7280');
  });

  it('exports category-specific colors', () => {
    expect(CHART_COLORS.entertainment).toBe('#3B82F6');
    expect(CHART_COLORS.productivity).toBe('#10B981');
    expect(CHART_COLORS.health).toBe('#EF4444');
    expect(CHART_COLORS.finance).toBe('#F59E0B');
    expect(CHART_COLORS.general).toBe('#6B7280');
  });
});

describe('CHART_THEME', () => {
  it('exports theme configuration', () => {
    expect(CHART_THEME.fontSize).toBe(12);
    expect(CHART_THEME.fontFamily).toBe('Raleway, system-ui, sans-serif');
    expect(CHART_THEME.colors).toBeInstanceOf(Array);
    expect(CHART_THEME.colors.length).toBeGreaterThan(0);
  });

  it('includes grid configuration', () => {
    expect(CHART_THEME.grid.stroke).toBe('#E5E7EB');
    expect(CHART_THEME.grid.strokeWidth).toBe(1);
  });

  it('includes axis configuration', () => {
    expect(CHART_THEME.axis.stroke).toBe('#9CA3AF');
    expect(CHART_THEME.axis.fontSize).toBe(11);
  });

  it('includes tooltip configuration', () => {
    expect(CHART_THEME.tooltip.backgroundColor).toBe('#FFFFFF');
    expect(CHART_THEME.tooltip.border).toBe('1px solid #E5E7EB');
    expect(CHART_THEME.tooltip.borderRadius).toBe('8px');
  });
});

describe('BaseChart Accessibility', () => {
  it('includes role="img" for accessibility', () => {
    const { container } = render(
      <BaseChart>
        <div>Chart</div>
      </BaseChart>
    );
    
    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toHaveAttribute('role', 'img');
  });

  it('includes default aria-label', () => {
    const { container } = render(
      <BaseChart>
        <div>Chart</div>
      </BaseChart>
    );
    
    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toHaveAttribute('aria-label', 'Data visualization chart');
  });

  it('accepts custom aria-label', () => {
    const { container } = render(
      <BaseChart ariaLabel="Custom chart label">
        <div>Chart</div>
      </BaseChart>
    );
    
    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toHaveAttribute('aria-label', 'Custom chart label');
  });

  it('includes aria-description when provided', () => {
    render(
      <BaseChart ariaDescription="This chart shows sales data">
        <div>Chart</div>
      </BaseChart>
    );
    
    expect(screen.getByText('This chart shows sales data')).toBeInTheDocument();
    expect(screen.getByText('This chart shows sales data')).toHaveClass('sr-only');
  });

  it('does not include aria-description element when not provided', () => {
    const { container } = render(
      <BaseChart>
        <div>Chart</div>
      </BaseChart>
    );
    
    const descriptionElement = container.querySelector('#chart-description');
    expect(descriptionElement).not.toBeInTheDocument();
  });
});
