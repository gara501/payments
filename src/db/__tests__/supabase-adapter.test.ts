/**
 * Integration tests for Supabase Adapter
 * Tests CRUD operations against real Supabase database
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SupabaseAdapter } from '../supabase-adapter';
import type { Subscription } from '../../types/subscription';

describe('SupabaseAdapter - CRUD Operations', () => {
  let adapter: SupabaseAdapter;
  let testSubscriptionIds: number[] = [];

  beforeEach(() => {
    adapter = new SupabaseAdapter();
    testSubscriptionIds = [];
  });

  afterEach(async () => {
    // Clean up test subscriptions
    for (const id of testSubscriptionIds) {
      try {
        await adapter.delete(id);
      } catch (error) {
        console.warn(`Failed to clean up test subscription ${id}:`, error);
      }
    }
    adapter.clearCache();
  });

  describe('insert (add) operation', () => {
    it('should insert a new subscription with all fields', async () => {
      const newSubscription: Omit<Subscription, 'id'> = {
        name: 'Test Netflix',
        subscription_date: '2025-01-15',
        value: 15.99,
        is_active: true,
        background_image: 'https://example.com/netflix.png',
        category: 'Entertainment',
      };

      const id = await adapter.insert(newSubscription);
      testSubscriptionIds.push(id);

      expect(id).toBeDefined();
      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThan(0);

      // Verify the subscription was inserted
      const retrieved = await adapter.getById(id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe(newSubscription.name);
      expect(retrieved?.subscription_date).toBe(newSubscription.subscription_date);
      expect(retrieved?.value).toBe(newSubscription.value);
      expect(retrieved?.is_active).toBe(newSubscription.is_active);
      expect(retrieved?.background_image).toBe(newSubscription.background_image);
      expect(retrieved?.category).toBe(newSubscription.category);
    });

    it('should insert a subscription with minimal required fields', async () => {
      const newSubscription: Omit<Subscription, 'id'> = {
        name: 'Test Spotify',
        subscription_date: '2025-02-01',
        value: 9.99,
        is_active: true,
      };

      const id = await adapter.insert(newSubscription);
      testSubscriptionIds.push(id);

      expect(id).toBeDefined();
      expect(typeof id).toBe('number');

      // Verify the subscription was inserted with defaults
      const retrieved = await adapter.getById(id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe(newSubscription.name);
      expect(retrieved?.category).toBe('General'); // Default category
    });

    it('should insert multiple subscriptions and retrieve them all', async () => {
      const subscription1: Omit<Subscription, 'id'> = {
        name: 'Test Service 1',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
        category: 'Productivity',
      };

      const subscription2: Omit<Subscription, 'id'> = {
        name: 'Test Service 2',
        subscription_date: '2025-01-15',
        value: 20.00,
        is_active: false,
        category: 'Finance',
      };

      const id1 = await adapter.insert(subscription1);
      const id2 = await adapter.insert(subscription2);
      testSubscriptionIds.push(id1, id2);

      const allSubscriptions = await adapter.getAll();
      
      const insertedSubs = allSubscriptions.filter(
        sub => sub.id === id1 || sub.id === id2
      );

      expect(insertedSubs).toHaveLength(2);
    });
  });

  describe('update (modify) operation', () => {
    it('should update an existing subscription', async () => {
      // First insert a subscription
      const original: Omit<Subscription, 'id'> = {
        name: 'Original Name',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
        category: 'Entertainment',
      };

      const id = await adapter.insert(original);
      testSubscriptionIds.push(id);

      // Update the subscription
      const updated: Omit<Subscription, 'id'> = {
        name: 'Updated Name',
        subscription_date: '2025-02-01',
        value: 15.00,
        is_active: false,
        category: 'Productivity',
        background_image: 'https://example.com/updated.png',
      };

      const updateResult = await adapter.update(id, updated);
      expect(updateResult).toBe(true);

      // Verify the update
      const retrieved = await adapter.getById(id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe(updated.name);
      expect(retrieved?.subscription_date).toBe(updated.subscription_date);
      expect(retrieved?.value).toBe(updated.value);
      expect(retrieved?.is_active).toBe(updated.is_active);
      expect(retrieved?.category).toBe(updated.category);
      expect(retrieved?.background_image).toBe(updated.background_image);
    });

    it('should update only specific fields', async () => {
      // Insert a subscription
      const original: Omit<Subscription, 'id'> = {
        name: 'Test Service',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
        category: 'Entertainment',
        background_image: 'https://example.com/original.png',
      };

      const id = await adapter.insert(original);
      testSubscriptionIds.push(id);

      // Update only the name and value
      const updated: Omit<Subscription, 'id'> = {
        name: 'Updated Service Name',
        subscription_date: original.subscription_date,
        value: 12.99,
        is_active: original.is_active,
        category: original.category,
        background_image: original.background_image,
      };

      await adapter.update(id, updated);

      // Verify only specified fields changed
      const retrieved = await adapter.getById(id);
      expect(retrieved?.name).toBe(updated.name);
      expect(retrieved?.value).toBe(updated.value);
      expect(retrieved?.subscription_date).toBe(original.subscription_date);
      expect(retrieved?.is_active).toBe(original.is_active);
    });

    it('should toggle is_active status', async () => {
      const subscription: Omit<Subscription, 'id'> = {
        name: 'Toggle Test',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
        category: 'General',
      };

      const id = await adapter.insert(subscription);
      testSubscriptionIds.push(id);

      // Toggle to inactive
      await adapter.update(id, { ...subscription, is_active: false });
      let retrieved = await adapter.getById(id);
      expect(retrieved?.is_active).toBe(false);

      // Toggle back to active
      await adapter.update(id, { ...subscription, is_active: true });
      retrieved = await adapter.getById(id);
      expect(retrieved?.is_active).toBe(true);
    });

    it('should return false when updating non-existent subscription', async () => {
      const nonExistentId = 999999999;
      const subscription: Omit<Subscription, 'id'> = {
        name: 'Test',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
      };

      const result = await adapter.update(nonExistentId, subscription);
      expect(result).toBe(false);
    });
  });

  describe('delete operation', () => {
    it('should delete an existing subscription', async () => {
      // Insert a subscription
      const subscription: Omit<Subscription, 'id'> = {
        name: 'To Be Deleted',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
        category: 'General',
      };

      const id = await adapter.insert(subscription);

      // Verify it exists
      let retrieved = await adapter.getById(id);
      expect(retrieved).toBeDefined();

      // Delete it
      const deleteResult = await adapter.delete(id);
      expect(deleteResult).toBe(true);

      // Verify it's gone
      retrieved = await adapter.getById(id);
      expect(retrieved).toBeNull();
    });

    it('should delete multiple subscriptions', async () => {
      // Insert multiple subscriptions
      const sub1: Omit<Subscription, 'id'> = {
        name: 'Delete Test 1',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
      };

      const sub2: Omit<Subscription, 'id'> = {
        name: 'Delete Test 2',
        subscription_date: '2025-01-15',
        value: 15.00,
        is_active: true,
      };

      const id1 = await adapter.insert(sub1);
      const id2 = await adapter.insert(sub2);

      // Delete both
      const result1 = await adapter.delete(id1);
      const result2 = await adapter.delete(id2);

      expect(result1).toBe(true);
      expect(result2).toBe(true);

      // Verify both are gone
      const retrieved1 = await adapter.getById(id1);
      const retrieved2 = await adapter.getById(id2);

      expect(retrieved1).toBeNull();
      expect(retrieved2).toBeNull();
    });

    it('should return false when deleting non-existent subscription', async () => {
      const nonExistentId = 999999999;
      const result = await adapter.delete(nonExistentId);
      expect(result).toBe(false);
    });
  });

  describe('getAll operation', () => {
    it('should retrieve all subscriptions ordered by date', async () => {
      // Insert subscriptions with different dates
      const sub1: Omit<Subscription, 'id'> = {
        name: 'Oldest',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
      };

      const sub2: Omit<Subscription, 'id'> = {
        name: 'Newest',
        subscription_date: '2025-03-01',
        value: 15.00,
        is_active: true,
      };

      const sub3: Omit<Subscription, 'id'> = {
        name: 'Middle',
        subscription_date: '2025-02-01',
        value: 12.00,
        is_active: true,
      };

      const id1 = await adapter.insert(sub1);
      const id2 = await adapter.insert(sub2);
      const id3 = await adapter.insert(sub3);
      testSubscriptionIds.push(id1, id2, id3);

      const allSubs = await adapter.getAll();
      const testSubs = allSubs.filter(
        sub => sub.id === id1 || sub.id === id2 || sub.id === id3
      );

      expect(testSubs).toHaveLength(3);
      
      // Verify ordering (DESC by subscription_date)
      expect(testSubs[0].subscription_date >= testSubs[1].subscription_date).toBe(true);
      expect(testSubs[1].subscription_date >= testSubs[2].subscription_date).toBe(true);
    });
  });

  describe('getById operation', () => {
    it('should retrieve a subscription by ID', async () => {
      const subscription: Omit<Subscription, 'id'> = {
        name: 'Get By ID Test',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
        category: 'Health',
      };

      const id = await adapter.insert(subscription);
      testSubscriptionIds.push(id);

      const retrieved = await adapter.getById(id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(id);
      expect(retrieved?.name).toBe(subscription.name);
      expect(retrieved?.category).toBe(subscription.category);
    });

    it('should return null for non-existent ID', async () => {
      const nonExistentId = 999999999;
      const retrieved = await adapter.getById(nonExistentId);
      expect(retrieved).toBeNull();
    });
  });

  describe('checkConnection operation', () => {
    it('should verify database connection', async () => {
      const isConnected = await adapter.checkConnection();
      expect(isConnected).toBe(true);
    });
  });

  describe('getTableStats operation', () => {
    it('should return table statistics', async () => {
      // Insert test data with different active states
      const activeSub: Omit<Subscription, 'id'> = {
        name: 'Active Sub',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: true,
      };

      const inactiveSub: Omit<Subscription, 'id'> = {
        name: 'Inactive Sub',
        subscription_date: '2025-01-01',
        value: 10.00,
        is_active: false,
      };

      const id1 = await adapter.insert(activeSub);
      const id2 = await adapter.insert(inactiveSub);
      testSubscriptionIds.push(id1, id2);

      const stats = await adapter.getTableStats();
      
      expect(stats).toBeDefined();
      expect(stats.totalCount).toBeGreaterThanOrEqual(2);
      expect(stats.activeCount).toBeGreaterThanOrEqual(1);
      expect(stats.inactiveCount).toBeGreaterThanOrEqual(1);
      expect(stats.totalCount).toBe(stats.activeCount + stats.inactiveCount);
    });
  });
});
