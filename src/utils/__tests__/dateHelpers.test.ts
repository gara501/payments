import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDaysLeft } from '../dateHelpers';

describe('getDaysLeft', () => {
  beforeEach(() => {
    // Mock the current date to 2024-01-15 for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return correct days remaining for a future expiration', () => {
    // Subscription started on 2024-01-01, expires on 2024-01-31
    // Current date is 2024-01-15, so 16 days remaining
    const result = getDaysLeft('2024-01-01');
    expect(result).toBe(16);
  });

  it('should return 0 for expired subscriptions', () => {
    // Subscription started on 2023-12-01, expired on 2023-12-31
    // Current date is 2024-01-15, so it's expired
    const result = getDaysLeft('2023-12-01');
    expect(result).toBe(0);
  });

  it('should return 0 for subscriptions expiring today', () => {
    // Subscription started on 2023-12-16, expires on 2024-01-15 (today)
    const result = getDaysLeft('2023-12-16');
    expect(result).toBe(0);
  });

  it('should return 1 for subscriptions expiring tomorrow', () => {
    // Subscription started on 2023-12-17, expires on 2024-01-16 (tomorrow)
    const result = getDaysLeft('2023-12-17');
    expect(result).toBe(1);
  });

  it('should handle invalid date strings gracefully', () => {
    const result = getDaysLeft('invalid-date');
    expect(result).toBe(0);
  });

  it('should handle empty string gracefully', () => {
    const result = getDaysLeft('');
    expect(result).toBe(0);
  });

  it('should handle edge case of subscription starting today', () => {
    // Subscription starts today (2024-01-15), expires in 30 days (2024-02-14)
    const result = getDaysLeft('2024-01-15');
    expect(result).toBe(30);
  });
});