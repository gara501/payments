import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Breadcrumb } from '../Breadcrumb';

describe('Breadcrumb', () => {
  it('should not render on home page', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumb />
      </MemoryRouter>
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should render breadcrumb on metrics page', () => {
    render(
      <MemoryRouter initialEntries={['/metrics']}>
        <Breadcrumb />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Metrics')).toBeInTheDocument();
  });

  it('should render Dashboard as a link when not on home page', () => {
    render(
      <MemoryRouter initialEntries={['/metrics']}>
        <Breadcrumb />
      </MemoryRouter>
    );
    
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink.tagName).toBe('A');
    expect(dashboardLink).toHaveAttribute('href', '/');
  });

  it('should render current page as text (not link)', () => {
    render(
      <MemoryRouter initialEntries={['/metrics']}>
        <Breadcrumb />
      </MemoryRouter>
    );
    
    const metricsText = screen.getByText('Metrics');
    expect(metricsText.tagName).toBe('SPAN');
    expect(metricsText).toHaveAttribute('aria-current', 'page');
  });

  it('should have proper ARIA label for navigation', () => {
    render(
      <MemoryRouter initialEntries={['/metrics']}>
        <Breadcrumb />
      </MemoryRouter>
    );
    
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
  });

  it('should render separators between breadcrumb items', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/metrics']}>
        <Breadcrumb />
      </MemoryRouter>
    );
    
    // Check for chevron separator SVG
    const separators = container.querySelectorAll('svg');
    expect(separators.length).toBeGreaterThan(0);
  });

  it('should handle multi-segment paths correctly', () => {
    render(
      <MemoryRouter initialEntries={['/settings/profile']}>
        <Breadcrumb />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should capitalize path segments properly', () => {
    render(
      <MemoryRouter initialEntries={['/user-settings']}>
        <Breadcrumb />
      </MemoryRouter>
    );
    
    expect(screen.getByText('User Settings')).toBeInTheDocument();
  });
});
