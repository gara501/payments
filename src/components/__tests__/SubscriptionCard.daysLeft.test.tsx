import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubscriptionCard } from '../SubscriptionCard';
import type { Subscription } from '../../types/subscription';

const mockSubscription: Subscription = {
  id: 1,
  name: 'Netflix',
  subscription_date: '2024-01-01',
  value: 15.99,
  is_active: true,
  background_image: 'https://example.com/netflix.jpg'
};

describe('SubscriptionCard - Days Left Calculation', () => {
  it('calculates correct days left for future expiration', () => {
    const mockOnDelete = () => {};
    
    // Create a subscription that started 10 days ago (should have 20 days left)
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const subscriptionWithFutureExpiry: Subscription = {
      ...mockSubscription,
      subscription_date: tenDaysAgo.toISOString().split('T')[0] // Format as YYYY-MM-DD
    };

    render(
      <SubscriptionCard 
        subscription={subscriptionWithFutureExpiry} 
        onDelete={mockOnDelete} 
      />
    );

    // Check that it calculated 20 days left (actual calculation)
    expect(screen.getByText('20 days')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calculates correct days left for expiring soon subscription', () => {
    const mockOnDelete = () => {};
    
    // Create a subscription that started 25 days ago (should have 5 days left)
    const twentyFiveDaysAgo = new Date();
    twentyFiveDaysAgo.setDate(twentyFiveDaysAgo.getDate() - 25);
    const subscriptionExpiringSoon: Subscription = {
      ...mockSubscription,
      subscription_date: twentyFiveDaysAgo.toISOString().split('T')[0]
    };

    render(
      <SubscriptionCard 
        subscription={subscriptionExpiringSoon} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('5 days')).toBeInTheDocument();
    expect(screen.getByText('Expiring Soon')).toBeInTheDocument();
  });

  it('shows expired status for subscription past 30 days', () => {
    const mockOnDelete = () => {};
    
    // Create a subscription that started 35 days ago (should be expired)
    const thirtyFiveDaysAgo = new Date();
    thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);
    const expiredSubscription: Subscription = {
      ...mockSubscription,
      subscription_date: thirtyFiveDaysAgo.toISOString().split('T')[0]
    };

    render(
      <SubscriptionCard 
        subscription={expiredSubscription} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getAllByText('Expired')).toHaveLength(2); // Status text and days left text
    const statusIndicator = screen.getByLabelText('Status: Expired');
    expect(statusIndicator).toHaveClass('bg-red-100');
  });

  it('handles edge case of subscription expiring today', () => {
    const mockOnDelete = () => {};
    
    // Create a subscription that started exactly 30 days ago (expires today)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const subscriptionExpiringToday: Subscription = {
      ...mockSubscription,
      subscription_date: thirtyDaysAgo.toISOString().split('T')[0]
    };

    render(
      <SubscriptionCard 
        subscription={subscriptionExpiringToday} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getAllByText('Expired')).toHaveLength(2); // Status text and days left text
  });

  it('handles subscription starting today', () => {
    const mockOnDelete = () => {};
    
    // Create a subscription that starts today (should have 30 days left)
    const today = new Date();
    const subscriptionStartingToday: Subscription = {
      ...mockSubscription,
      subscription_date: today.toISOString().split('T')[0]
    };

    render(
      <SubscriptionCard 
        subscription={subscriptionStartingToday} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('30 days')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('handles invalid date gracefully', () => {
    const mockOnDelete = () => {};
    
    const subscriptionWithInvalidDate: Subscription = {
      ...mockSubscription,
      subscription_date: 'invalid-date'
    };

    render(
      <SubscriptionCard 
        subscription={subscriptionWithInvalidDate} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getAllByText('Expired')).toHaveLength(2); // Status text and days left text
  });

  it('correctly handles boundary case of exactly 10 days left (expiring soon threshold)', () => {
    const mockOnDelete = () => {};
    
    // Create a subscription that started 20 days ago (should have exactly 10 days left)
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
    const subscriptionAtThreshold: Subscription = {
      ...mockSubscription,
      subscription_date: twentyDaysAgo.toISOString().split('T')[0]
    };

    render(
      <SubscriptionCard 
        subscription={subscriptionAtThreshold} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('10 days')).toBeInTheDocument();
    expect(screen.getByText('Expiring Soon')).toBeInTheDocument();
    const statusIndicator = screen.getByLabelText('Status: Expiring Soon');
    expect(statusIndicator).toHaveClass('bg-yellow-100');
  });

  it('correctly handles boundary case of exactly 11 days left (still active)', () => {
    const mockOnDelete = () => {};
    
    // Create a subscription that started 19 days ago (should have exactly 11 days left)
    const nineteenDaysAgo = new Date();
    nineteenDaysAgo.setDate(nineteenDaysAgo.getDate() - 19);
    const subscriptionJustActive: Subscription = {
      ...mockSubscription,
      subscription_date: nineteenDaysAgo.toISOString().split('T')[0]
    };

    render(
      <SubscriptionCard 
        subscription={subscriptionJustActive} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('11 days')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    const statusIndicator = screen.getByLabelText('Status: Active');
    expect(statusIndicator).toHaveClass('bg-green-100');
  });
});