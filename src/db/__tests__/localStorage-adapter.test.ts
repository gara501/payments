import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageAdapter } from '../localStorage-adapter';
import type { Subscription } from '../../types/subscription';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    localStorageMock.clear();
    adapter = new LocalStorageAdapter();
  });

  it('should start with empty subscriptions', () => {
    const subscriptions = adapter.getAll();
    expect(subscriptions).toEqual([]);
  });

  it('should insert and retrieve a subscription', () => {
    const subscription = {
      name: 'Netflix',
      subscription_date: '2025-01-01',
      value: 15.99,
      is_active: true,
      background_image: 'https://example.com/netflix.jpg'
    };

    const id = adapter.insert(subscription);
    expect(id).toBe(1);

    const subscriptions = adapter.getAll();
    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0]).toEqual({
      id: 1,
      ...subscription
    });
  });

  it('should generate incremental IDs', () => {
    const subscription1 = {
      name: 'Netflix',
      subscription_date: '2025-01-01',
      value: 15.99,
      is_active: true
    };

    const subscription2 = {
      name: 'Spotify',
      subscription_date: '2025-01-02',
      value: 9.99,
      is_active: true
    };

    const id1 = adapter.insert(subscription1);
    const id2 = adapter.insert(subscription2);

    expect(id1).toBe(1);
    expect(id2).toBe(2);
  });

  it('should delete a subscription by ID', () => {
    const subscription = {
      name: 'Netflix',
      subscription_date: '2025-01-01',
      value: 15.99,
      is_active: true
    };

    const id = adapter.insert(subscription);
    expect(adapter.getAll()).toHaveLength(1);

    const deleted = adapter.delete(id);
    expect(deleted).toBe(true);
    expect(adapter.getAll()).toHaveLength(0);
  });

  it('should return false when deleting non-existent subscription', () => {
    const deleted = adapter.delete(999);
    expect(deleted).toBe(false);
  });

  it('should get subscription by ID', () => {
    const subscription = {
      name: 'Netflix',
      subscription_date: '2025-01-01',
      value: 15.99,
      is_active: true
    };

    const id = adapter.insert(subscription);
    const retrieved = adapter.getById(id);

    expect(retrieved).toEqual({
      id,
      ...subscription
    });
  });

  it('should return null for non-existent subscription', () => {
    const retrieved = adapter.getById(999);
    expect(retrieved).toBeNull();
  });

  it('should sort subscriptions by date DESC', () => {
    const subscription1 = {
      name: 'Netflix',
      subscription_date: '2025-01-01',
      value: 15.99,
      is_active: true
    };

    const subscription2 = {
      name: 'Spotify',
      subscription_date: '2025-01-15',
      value: 9.99,
      is_active: true
    };

    adapter.insert(subscription1);
    adapter.insert(subscription2);

    const subscriptions = adapter.getAll();
    expect(subscriptions[0].name).toBe('Spotify'); // More recent date first
    expect(subscriptions[1].name).toBe('Netflix');
  });

  it('should get correct table statistics', () => {
    const activeSubscription = {
      name: 'Netflix',
      subscription_date: '2025-01-01',
      value: 15.99,
      is_active: true
    };

    const inactiveSubscription = {
      name: 'Spotify',
      subscription_date: '2025-01-02',
      value: 9.99,
      is_active: false
    };

    adapter.insert(activeSubscription);
    adapter.insert(inactiveSubscription);

    const stats = adapter.getTableStats();
    expect(stats).toEqual({
      totalCount: 2,
      activeCount: 1,
      inactiveCount: 1
    });
  });

  it('should check connection successfully', () => {
    const isConnected = adapter.checkConnection();
    expect(isConnected).toBe(true);
  });

  it('should clear all data', () => {
    const subscription = {
      name: 'Netflix',
      subscription_date: '2025-01-01',
      value: 15.99,
      is_active: true
    };

    adapter.insert(subscription);
    expect(adapter.getAll()).toHaveLength(1);

    adapter.clear();
    expect(adapter.getAll()).toHaveLength(0);
  });

  it('should export and import data', () => {
    const subscription = {
      name: 'Netflix',
      subscription_date: '2025-01-01',
      value: 15.99,
      is_active: true
    };

    adapter.insert(subscription);
    const exported = adapter.exportData();
    
    adapter.clear();
    expect(adapter.getAll()).toHaveLength(0);

    const imported = adapter.importData(exported);
    expect(imported).toBe(true);
    expect(adapter.getAll()).toHaveLength(1);
  });
});