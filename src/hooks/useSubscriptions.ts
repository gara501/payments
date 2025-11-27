import { useState, useEffect, useCallback } from 'react';
import { useDatabaseContext } from '../db/DatabaseProvider';
import type { Subscription, CreateSubscriptionInput } from '../types';
import { useToast } from './useToast';

interface StorageInfo {
  type: 'supabase';
  isWorking: boolean;
  stats: {
    totalCount: number;
    activeCount: number;
    inactiveCount: number;
  };
}

interface UseSubscriptionsReturn {
  subscriptions: Subscription[];
  visibleSubscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  currentLimit: number;
  hasMore: boolean;
  storageInfo: StorageInfo;
  getAll: () => Promise<void>;
  add: (subscription: CreateSubscriptionInput) => Promise<boolean>;
  update: (id: number, subscription: CreateSubscriptionInput) => Promise<boolean>;
  delete: (id: number) => Promise<boolean>;
  setCurrentLimit: (limit: number) => void;
  loadMore: () => void;
}

export function useSubscriptions(): UseSubscriptionsReturn {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    type: 'supabase',
    isWorking: false,
    stats: { totalCount: 0, activeCount: 0, inactiveCount: 0 }
  });
  const { adapter } = useDatabaseContext();
  const { showSuccess, showError } = useToast();

  // Get all subscriptions from database
  const getAll = useCallback(async () => {
    if (!adapter) {
      setError('Database not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await adapter.getAll();
      setSubscriptions(data);
      
      // Update storage info
      const stats = await adapter.getTableStats();
      const isWorking = await adapter.checkConnection();
      setStorageInfo({
        type: 'supabase',
        isWorking,
        stats
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subscriptions';
      setError(errorMessage);
      setStorageInfo(prev => ({ ...prev, isWorking: false }));
      console.error('Error loading subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, [adapter]);

  // Add a new subscription
  const add = useCallback(async (subscription: CreateSubscriptionInput): Promise<boolean> => {
    if (!adapter) {
      showError('Database not initialized');
      return false;
    }

    setError(null);

    try {
      const subscriptionWithCategory = {
        ...subscription,
        category: subscription.category || 'General'
      };
      const newId = await adapter.insert(subscriptionWithCategory);

      if (newId) {
        // Refresh the subscriptions list after successful insert
        await getAll();
        showSuccess(`Successfully added "${subscription.name}" subscription`);
        return true;
      }

      const errorMessage = 'Failed to add subscription';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add subscription';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error adding subscription:', err);
      return false;
    }
  }, [adapter, getAll, showSuccess, showError]);

  // Update a subscription by ID
  const updateSubscription = useCallback(async (id: number, subscription: CreateSubscriptionInput): Promise<boolean> => {
    if (!adapter) {
      showError('Database not initialized');
      return false;
    }

    setError(null);

    try {
      const subscriptionWithCategory = {
        ...subscription,
        category: subscription.category || 'General'
      };
      const success = await adapter.update(id, subscriptionWithCategory);

      if (success) {
        // Refresh the subscriptions list after successful update
        await getAll();
        showSuccess(`Successfully updated "${subscription.name}" subscription`);
        return true;
      }

      const errorMessage = 'Failed to update subscription';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subscription';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error updating subscription:', err);
      return false;
    }
  }, [adapter, getAll, showSuccess, showError]);

  // Delete a subscription by ID
  const deleteSubscription = useCallback(async (id: number): Promise<boolean> => {
    if (!adapter) {
      showError('Database not initialized');
      return false;
    }

    setError(null);

    try {
      // Find the subscription name before deleting for the success message
      const subscriptionToDelete = subscriptions.find(sub => sub.id === id);
      const subscriptionName = subscriptionToDelete?.name || 'subscription';

      const success = await adapter.delete(id);

      if (success) {
        // Refresh the subscriptions list after successful deletion
        await getAll();
        showSuccess(`Successfully deleted "${subscriptionName}"`);
        return true;
      }

      const errorMessage = 'Failed to delete subscription';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete subscription';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error deleting subscription:', err);
      return false;
    }
  }, [adapter, getAll, subscriptions, showSuccess, showError]);

  // Compute visible subscriptions based on current limit
  const visibleSubscriptions = subscriptions.slice(0, currentLimit);
  const hasMore = subscriptions.length > currentLimit;

  // Load more subscriptions by increasing limit by 5
  const loadMore = useCallback(() => {
    setCurrentLimit(prevLimit => prevLimit + 5);
  }, []);

  // Load subscriptions on mount
  useEffect(() => {
    if (adapter) {
      getAll();
    }
  }, [adapter, getAll]);

  return {
    subscriptions,
    visibleSubscriptions,
    loading,
    error,
    currentLimit,
    hasMore,
    storageInfo,
    getAll,
    add,
    update: updateSubscription,
    delete: deleteSubscription,
    setCurrentLimit,
    loadMore,
  };
}