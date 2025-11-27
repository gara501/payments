import type { Subscription } from '../types/subscription';

const STORAGE_KEY = 'subscriptions';

export class LocalStorageAdapter {
  /**
   * Get all subscriptions from localStorage ordered by subscription_date DESC
   */
  getAll(): Subscription[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      
      const subscriptions: Subscription[] = JSON.parse(stored);
      
      // Sort by subscription_date DESC (newest first)
      return subscriptions.sort((a, b) => 
        new Date(b.subscription_date).getTime() - new Date(a.subscription_date).getTime()
      );
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  /**
   * Insert a new subscription
   */
  insert(subscription: Omit<Subscription, 'id'>): number {
    try {
      const subscriptions = this.getAll();
      
      // Generate a new ID (find max ID and add 1)
      const maxId = subscriptions.length > 0 
        ? Math.max(...subscriptions.map(s => s.id)) 
        : 0;
      const newId = maxId + 1;
      
      const newSubscription: Subscription = {
        ...subscription,
        id: newId
      };
      
      subscriptions.push(newSubscription);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
      
      return newId;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save subscription to localStorage');
    }
  }

  /**
   * Update a subscription by ID
   */
  update(id: number, subscription: Omit<Subscription, 'id'>): boolean {
    try {
      const subscriptions = this.getAll();
      const index = subscriptions.findIndex(s => s.id === id);
      
      if (index === -1) {
        return false; // No subscription was found with that ID
      }
      
      // Update the subscription while preserving the ID
      subscriptions[index] = {
        ...subscription,
        id
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
      return true;
    } catch (error) {
      console.error('Error updating localStorage:', error);
      return false;
    }
  }

  /**
   * Delete a subscription by ID
   */
  delete(id: number): boolean {
    try {
      const subscriptions = this.getAll();
      const initialLength = subscriptions.length;
      
      const filteredSubscriptions = subscriptions.filter(s => s.id !== id);
      
      if (filteredSubscriptions.length === initialLength) {
        return false; // No subscription was found with that ID
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSubscriptions));
      return true;
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      return false;
    }
  }

  /**
   * Get a subscription by ID
   */
  getById(id: number): Subscription | null {
    try {
      const subscriptions = this.getAll();
      return subscriptions.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Check if localStorage is available and working
   */
  checkConnection(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error('localStorage is not available:', error);
      return false;
    }
  }

  /**
   * Get table statistics
   */
  getTableStats(): { totalCount: number, activeCount: number, inactiveCount: number } {
    try {
      const subscriptions = this.getAll();
      const totalCount = subscriptions.length;
      const activeCount = subscriptions.filter(s => s.is_active).length;
      const inactiveCount = totalCount - activeCount;
      
      return { totalCount, activeCount, inactiveCount };
    } catch (error) {
      console.error('Error getting localStorage stats:', error);
      return { totalCount: 0, activeCount: 0, inactiveCount: 0 };
    }
  }

  /**
   * Clear all data (for testing purposes)
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Add test data with background images (for testing purposes)
   */
  addTestData(): void {
    try {
      const testSubscriptions = [
        {
          id: 1,
          name: 'Netflix',
          subscription_date: '2025-01-01',
          value: 15.99,
          is_active: true,
          background_image: 'https://thumbs.dreamstime.com/b/ancient-esoteric-alchemical-image-s-michelspacher-s-cabal-ancient-esoteric-alchemical-image-michelspacher-s-cabal-201453355.jpg'
        },
        {
          id: 2,
          name: 'Spotify',
          subscription_date: '2025-01-15',
          value: 9.99,
          is_active: true,
          background_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
        },
        {
          id: 3,
          name: 'Adobe Creative Cloud',
          subscription_date: '2025-02-01',
          value: 52.99,
          is_active: true,
          background_image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop'
        }
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(testSubscriptions));
      console.log('✅ Added test data with background images');
    } catch (error) {
      console.error('Error adding test data:', error);
    }
  }

  /**
   * Export data as JSON string
   */
  exportData(): string {
    try {
      return localStorage.getItem(STORAGE_KEY) || '[]';
    } catch (error) {
      console.error('Error exporting localStorage data:', error);
      return '[]';
    }
  }

  /**
   * Import data from JSON string
   */
  importData(jsonData: string): boolean {
    try {
      const subscriptions = JSON.parse(jsonData);
      
      // Validate the data structure
      if (!Array.isArray(subscriptions)) {
        throw new Error('Invalid data format: expected array');
      }
      
      // Basic validation of subscription objects
      for (const sub of subscriptions) {
        if (!sub.id || !sub.name || !sub.subscription_date || typeof sub.value !== 'number') {
          throw new Error('Invalid subscription data structure');
        }
      }
      
      localStorage.setItem(STORAGE_KEY, jsonData);
      return true;
    } catch (error) {
      console.error('Error importing localStorage data:', error);
      return false;
    }
  }
}