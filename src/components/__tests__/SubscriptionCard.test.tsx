import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SubscriptionCard } from '../SubscriptionCard';
import type { Subscription } from '../../types/subscription';
import * as dateHelpers from '../../utils/dateHelpers';

// Mock the dateHelpers module
vi.mock('../../utils/dateHelpers', () => ({
  getDaysLeft: vi.fn(() => 15)
}));

const mockSubscription: Subscription = {
  id: 1,
  name: 'Netflix',
  subscription_date: '2024-01-01',
  value: 15.99,
  is_active: true,
  background_image: 'https://example.com/netflix.jpg'
};

describe('SubscriptionCard', () => {
  it('renders subscription information correctly', () => {
    const mockOnDelete = vi.fn();
    
    render(
      <SubscriptionCard 
        subscription={mockSubscription} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('15 days')).toBeInTheDocument();
  });

  it('renders delete button with proper accessibility', () => {
    const mockOnDelete = vi.fn();
    
    render(
      <SubscriptionCard 
        subscription={mockSubscription} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByLabelText('Delete Netflix subscription');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass('bg-white/90');
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    const mockOnDelete = vi.fn();
    
    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(
      <SubscriptionCard 
        subscription={mockSubscription} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByLabelText('Delete Netflix subscription');
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete "Netflix"?');
    expect(mockOnDelete).toHaveBeenCalledWith(1);
    
    confirmSpy.mockRestore();
  });

  it('does not call onDelete when delete is cancelled', () => {
    const mockOnDelete = vi.fn();
    
    // Mock window.confirm to return false
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    render(
      <SubscriptionCard 
        subscription={mockSubscription} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByLabelText('Delete Netflix subscription');
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete "Netflix"?');
    expect(mockOnDelete).not.toHaveBeenCalled();
    
    confirmSpy.mockRestore();
  });

  it('displays correct status colors and text for different states', () => {
    const mockOnDelete = vi.fn();
    const getDaysLeftSpy = vi.spyOn(dateHelpers, 'getDaysLeft');
    
    // Test Green = Active (more than 10 days left)
    getDaysLeftSpy.mockReturnValue(15);
    const { rerender } = render(
      <SubscriptionCard 
        subscription={mockSubscription} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    let statusIndicator = screen.getByLabelText('Status: Active');
    expect(statusIndicator).toHaveClass('bg-green-100');
    
    // Test Yellow = Expiring soon (10 days or less)
    getDaysLeftSpy.mockReturnValue(10);
    rerender(
      <SubscriptionCard 
        subscription={mockSubscription} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Expiring Soon')).toBeInTheDocument();
    statusIndicator = screen.getByLabelText('Status: Expiring Soon');
    expect(statusIndicator).toHaveClass('bg-yellow-100');
    
    // Test Yellow = Expiring soon (less than 10 days)
    getDaysLeftSpy.mockReturnValue(5);
    rerender(
      <SubscriptionCard 
        subscription={mockSubscription} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Expiring Soon')).toBeInTheDocument();
    statusIndicator = screen.getByLabelText('Status: Expiring Soon');
    expect(statusIndicator).toHaveClass('bg-yellow-100');
    
    // Test Red = Expired (0 days left)
    getDaysLeftSpy.mockReturnValue(0);
    rerender(
      <SubscriptionCard 
        subscription={mockSubscription} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getAllByText('Expired')).toHaveLength(2); // Status text and days left text
    statusIndicator = screen.getByLabelText('Status: Expired');
    expect(statusIndicator).toHaveClass('bg-red-100');
    
    // Test inactive subscription (gray)
    const inactiveSubscription = { ...mockSubscription, is_active: false };
    rerender(
      <SubscriptionCard 
        subscription={inactiveSubscription} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Inactive')).toBeInTheDocument();
    statusIndicator = screen.getByLabelText('Status: Inactive');
    expect(statusIndicator).toHaveClass('bg-gray-100');
    
    getDaysLeftSpy.mockRestore();
  });


});