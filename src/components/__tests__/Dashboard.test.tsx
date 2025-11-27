import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import { useSubscriptions } from '../../hooks/useSubscriptions';

// Mock the Supabase client to avoid real database connections in tests
vi.mock('../../db/supabase-client', () => ({
  getSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'test-uuid' },
            error: null,
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
  })),
  resetSupabaseClient: vi.fn(),
}));

// Mock the useSubscriptions hook
vi.mock('../../hooks/useSubscriptions');

const mockUseSubscriptions = vi.mocked(useSubscriptions);

// Helper function to render Dashboard with Router context
const renderDashboard = () => {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};

describe('Dashboard', () => {
  const mockLoadMore = vi.fn();
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test for: "Renders 10 items on initial load"
  it('should render exactly 10 items on initial load when there are more than 10 subscriptions', () => {
    // Create 15 subscriptions to test initial limit of 10
    const mockSubscriptions = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Subscription ${i + 1}`,
      subscription_date: '2024-01-01',
      value: 9.99,
      is_active: true,
      background_image: `image${i + 1}.jpg`,
    }));

    mockUseSubscriptions.mockReturnValue({
      subscriptions: mockSubscriptions,
      visibleSubscriptions: mockSubscriptions.slice(0, 10), // Initial load shows first 10
      loading: false,
      error: null,
      currentLimit: 10, // Initial limit is 10
      hasMore: true,
      storageInfo: {
        type: 'localStorage' as const,
        isWorking: true,
        stats: { totalCount: 15, activeCount: 15, inactiveCount: 0 }
      },
      getAll: vi.fn(),
      add: vi.fn(),
      delete: mockDelete,
      setCurrentLimit: vi.fn(),
      loadMore: mockLoadMore,
    });

    renderDashboard();

    // Should render exactly 10 subscription cards on initial load
    const subscriptionCards = screen.getAllByText(/Subscription \d+/);
    expect(subscriptionCards).toHaveLength(10);

    // Verify the first 10 items are displayed (Subscription 1 through Subscription 10)
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Subscription ${i}`)).toBeInTheDocument();
    }

    // Verify items 11-15 are NOT displayed initially
    expect(screen.queryByText('Subscription 11')).not.toBeInTheDocument();
    expect(screen.queryByText('Subscription 15')).not.toBeInTheDocument();
  });

  // Test for: "View more" loads +5 items
  it('should load +5 more items when "View more" button is clicked', async () => {
    // Create 20 subscriptions to test loading more
    const mockSubscriptions = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Subscription ${i + 1}`,
      subscription_date: '2024-01-01',
      value: 9.99,
      is_active: true,
      background_image: `image${i + 1}.jpg`,
    }));

    // Initial state: showing first 10 items
    const mockUseSubscriptionsInitial = {
      subscriptions: mockSubscriptions,
      visibleSubscriptions: mockSubscriptions.slice(0, 10),
      loading: false,
      error: null,
      currentLimit: 10,
      hasMore: true,
      storageInfo: {
        type: 'localStorage' as const,
        isWorking: true,
        stats: { totalCount: 20, activeCount: 20, inactiveCount: 0 }
      },
      getAll: vi.fn(),
      add: vi.fn(),
      delete: mockDelete,
      setCurrentLimit: vi.fn(),
      loadMore: mockLoadMore,
    };

    mockUseSubscriptions.mockReturnValue(mockUseSubscriptionsInitial);

    const { rerender } = renderDashboard();

    // Initially should show 10 items
    expect(screen.getAllByText(/Subscription \d+/)).toHaveLength(10);
    expect(screen.getByText('Subscription 10')).toBeInTheDocument();
    expect(screen.queryByText('Subscription 11')).not.toBeInTheDocument();

    // Click "View More" button
    const viewMoreButton = screen.getByRole('button', { name: /load 5 more subscriptions/i });
    fireEvent.click(viewMoreButton);

    // Verify loadMore was called (wait for the setTimeout in handleLoadMore)
    await waitFor(() => {
      expect(mockLoadMore).toHaveBeenCalledTimes(1);
    });

    // Simulate the state after loadMore is called (limit increased to 15)
    const mockUseSubscriptionsAfterLoadMore = {
      ...mockUseSubscriptionsInitial,
      visibleSubscriptions: mockSubscriptions.slice(0, 15), // Now showing first 15
      currentLimit: 15,
      hasMore: true, // Still more items available
    };

    mockUseSubscriptions.mockReturnValue(mockUseSubscriptionsAfterLoadMore);
    rerender(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Should now show 15 items (10 + 5 more)
    await waitFor(() => {
      const subscriptionCards = screen.getAllByText(/Subscription \d+/);
      expect(subscriptionCards).toHaveLength(15);
    });

    // Verify items 11-15 are now visible
    expect(screen.getByText('Subscription 11')).toBeInTheDocument();
    expect(screen.getByText('Subscription 15')).toBeInTheDocument();

    // Verify items 16-20 are still not visible
    expect(screen.queryByText('Subscription 16')).not.toBeInTheDocument();
    expect(screen.queryByText('Subscription 20')).not.toBeInTheDocument();
  });

  it('should render View More button when hasMore is true', () => {
    // Mock 15 subscriptions with limit of 10
    const mockSubscriptions = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Subscription ${i + 1}`,
      subscription_date: '2024-01-01',
      value: 9.99,
      is_active: true,
    }));

    mockUseSubscriptions.mockReturnValue({
      subscriptions: mockSubscriptions,
      visibleSubscriptions: mockSubscriptions.slice(0, 10), // First 10 items
      loading: false,
      error: null,
      currentLimit: 10,
      hasMore: true, // More items available
      storageInfo: {
        type: 'localStorage' as const,
        isWorking: true,
        stats: { totalCount: 15, activeCount: 15, inactiveCount: 0 }
      },
      getAll: vi.fn(),
      add: vi.fn(),
      delete: mockDelete,
      setCurrentLimit: vi.fn(),
      loadMore: mockLoadMore,
    });

    renderDashboard();

    // Should show 10 subscription cards
    expect(screen.getAllByText(/Subscription \d+/)).toHaveLength(10);

    // Should show View More button
    const viewMoreButton = screen.getByRole('button', { name: /load 5 more subscriptions/i });
    expect(viewMoreButton).toBeInTheDocument();
  });

  it('should not render View More button when hasMore is false', () => {
    // Mock 5 subscriptions with limit of 10
    const mockSubscriptions = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Subscription ${i + 1}`,
      subscription_date: '2024-01-01',
      value: 9.99,
      is_active: true,
    }));

    mockUseSubscriptions.mockReturnValue({
      subscriptions: mockSubscriptions,
      visibleSubscriptions: mockSubscriptions, // All 5 items
      loading: false,
      error: null,
      currentLimit: 10,
      hasMore: false, // No more items available
      storageInfo: {
        type: 'localStorage' as const,
        isWorking: true,
        stats: { totalCount: 5, activeCount: 5, inactiveCount: 0 }
      },
      getAll: vi.fn(),
      add: vi.fn(),
      delete: mockDelete,
      setCurrentLimit: vi.fn(),
      loadMore: mockLoadMore,
    });

    renderDashboard();

    // Should show 5 subscription cards
    expect(screen.getAllByText(/Subscription \d+/)).toHaveLength(5);

    // Should NOT show View More button
    expect(screen.queryByRole('button', { name: /view more \(\+5\)/i })).not.toBeInTheDocument();
  });

  it('should call loadMore when View More button is clicked', async () => {
    // Mock 15 subscriptions with limit of 10
    const mockSubscriptions = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Subscription ${i + 1}`,
      subscription_date: '2024-01-01',
      value: 9.99,
      is_active: true,
    }));

    mockUseSubscriptions.mockReturnValue({
      subscriptions: mockSubscriptions,
      visibleSubscriptions: mockSubscriptions.slice(0, 10),
      loading: false,
      error: null,
      currentLimit: 10,
      hasMore: true,
      storageInfo: {
        type: 'localStorage' as const,
        isWorking: true,
        stats: { totalCount: 15, activeCount: 15, inactiveCount: 0 }
      },
      getAll: vi.fn(),
      add: vi.fn(),
      delete: mockDelete,
      setCurrentLimit: vi.fn(),
      loadMore: mockLoadMore,
    });

    renderDashboard();

    const viewMoreButton = screen.getByRole('button', { name: /load 5 more subscriptions/i });
    
    fireEvent.click(viewMoreButton);

    await waitFor(() => {
      expect(mockLoadMore).toHaveBeenCalledTimes(1);
    });
  });

  it('should show loading state', () => {
    mockUseSubscriptions.mockReturnValue({
      subscriptions: [],
      visibleSubscriptions: [],
      loading: true,
      error: null,
      currentLimit: 10,
      hasMore: false,
      storageInfo: {
        type: 'localStorage' as const,
        isWorking: true,
        stats: { totalCount: 0, activeCount: 0, inactiveCount: 0 }
      },
      getAll: vi.fn(),
      add: vi.fn(),
      delete: mockDelete,
      setCurrentLimit: vi.fn(),
      loadMore: mockLoadMore,
    });

    renderDashboard();

    // Check for the loading spinner by its CSS class
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseSubscriptions.mockReturnValue({
      subscriptions: [],
      visibleSubscriptions: [],
      loading: false,
      error: 'Failed to load subscriptions',
      currentLimit: 10,
      hasMore: false,
      storageInfo: {
        type: 'localStorage' as const,
        isWorking: false,
        stats: { totalCount: 0, activeCount: 0, inactiveCount: 0 }
      },
      getAll: vi.fn(),
      add: vi.fn(),
      delete: mockDelete,
      setCurrentLimit: vi.fn(),
      loadMore: mockLoadMore,
    });

    renderDashboard();

    expect(screen.getByText('Error loading subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Failed to load subscriptions')).toBeInTheDocument();
  });

  it('should open and close add subscription modal', async () => {
    mockUseSubscriptions.mockReturnValue({
      subscriptions: [],
      visibleSubscriptions: [],
      loading: false,
      error: null,
      currentLimit: 10,
      hasMore: false,
      storageInfo: {
        type: 'localStorage' as const,
        isWorking: true,
        stats: { totalCount: 0, activeCount: 0, inactiveCount: 0 }
      },
      getAll: vi.fn(),
      add: vi.fn(),
      delete: mockDelete,
      setCurrentLimit: vi.fn(),
      loadMore: mockLoadMore,
    });

    renderDashboard();

    // Modal form fields should not be visible initially
    expect(screen.queryByLabelText(/name \*/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/subscription date \*/i)).not.toBeInTheDocument();

    // Click the "Add Subscription" button
    const addButton = screen.getByRole('button', { name: /add new subscription/i });
    fireEvent.click(addButton);

    // Modal should now be visible with form fields
    await waitFor(() => {
      expect(screen.getByLabelText(/name \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/start date \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/monthly cost \*/i)).toBeInTheDocument();
    });

    // Modal should have backdrop (may be animating in)
    expect(document.querySelector('.fixed.inset-0.bg-black')).toBeInTheDocument();

    // Click cancel button to close modal
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Modal should be closed - form fields should not be visible
    await waitFor(() => {
      expect(screen.queryByLabelText(/name \*/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/subscription date \*/i)).not.toBeInTheDocument();
    });
  });







  it('should have Add Subscription button with proper accessibility attributes', () => {
    mockUseSubscriptions.mockReturnValue({
      subscriptions: [],
      visibleSubscriptions: [],
      loading: false,
      error: null,
      currentLimit: 10,
      hasMore: false,
      storageInfo: {
        type: 'localStorage' as const,
        isWorking: true,
        stats: { totalCount: 0, activeCount: 0, inactiveCount: 0 }
      },
      getAll: vi.fn(),
      add: vi.fn(),
      delete: mockDelete,
      setCurrentLimit: vi.fn(),
      loadMore: mockLoadMore,
    });

    renderDashboard();

    const addButton = screen.getByRole('button', { name: /add new subscription to your list/i });
    
    // Check that button has proper type attribute
    expect(addButton).toHaveAttribute('type', 'button');
    
    // Check that button has descriptive aria-label
    expect(addButton).toHaveAttribute('aria-label', 'Add new subscription to your list');
    
    // Check that button has title for tooltip
    expect(addButton).toHaveAttribute('title', 'Add a new subscription');
    
    // Check that button has visible text content wrapped in span
    const textSpan = addButton.querySelector('span');
    expect(textSpan).toBeInTheDocument();
    expect(textSpan).toHaveTextContent('Add Subscription');
    
    // Check that SVG icon has proper accessibility attributes
    const svg = addButton.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('focusable', 'false');
  });
});