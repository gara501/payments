import { DatabaseAdapter } from './adapter';
import { LocalStorageAdapter } from './localStorage-adapter';
import type { Subscription } from '../types/subscription';

export class HybridAdapter {
  private sqliteAdapter: DatabaseAdapter | null = null;
  private localStorageAdapter: LocalStorageAdapter;
  private usingSQLite: boolean = false;

  constructor() {
    this.localStorageAdapter = new LocalStorageAdapter();
    this.initializeAdapter();
  }

  private initializeAdapter(): void {
    console.log('🔧 Initializing HybridAdapter...');
    
    try {
      // Try to initialize SQLite adapter
      console.log('🔧 Attempting SQLite initialization...');
      this.sqliteAdapter = new DatabaseAdapter();
      
      // Test if SQLite is working
      console.log('🔧 Testing SQLite connection...');
      if (this.sqliteAdapter.checkConnection()) {
        this.usingSQLite = true;
        console.log('✅ Using SQLite database for data persistence');
      } else {
        throw new Error('SQLite connection check failed');
      }
    } catch (error) {
      console.warn('⚠️ SQLite initialization failed, falling back to localStorage:', error);
      this.sqliteAdapter = null;
      this.usingSQLite = false;
      console.log('✅ Using localStorage for data persistence');
      
      // Test localStorage availability
      if (this.localStorageAdapter.checkConnection()) {
        console.log('✅ LocalStorage is available and working');
      } else {
        console.error('❌ LocalStorage is also not available!');
      }
    }
  }

  /**
   * Get all subscriptions
   */
  getAll(): Subscription[] {
    console.log('📖 Getting all subscriptions...');
    
    if (this.usingSQLite && this.sqliteAdapter) {
      try {
        console.log('📖 Using SQLite for getAll');
        const data = this.sqliteAdapter.getAll();
        console.log('✅ SQLite getAll successful, found:', data.length, 'subscriptions');
        return data;
      } catch (error) {
        console.error('❌ SQLite getAll failed, falling back to localStorage:', error);
        this.fallbackToLocalStorage();
        const data = this.localStorageAdapter.getAll();
        console.log('✅ LocalStorage getAll successful, found:', data.length, 'subscriptions');
        return data;
      }
    }
    
    console.log('📖 Using localStorage for getAll');
    const data = this.localStorageAdapter.getAll();
    console.log('✅ LocalStorage getAll successful, found:', data.length, 'subscriptions');
    return data;
  }

  /**
   * Insert a new subscription
   */
  insert(subscription: Omit<Subscription, 'id'>): number {
    console.log('💾 Inserting subscription:', subscription.name);
    
    if (this.usingSQLite && this.sqliteAdapter) {
      try {
        console.log('💾 Using SQLite for insert');
        const id = this.sqliteAdapter.insert(subscription);
        console.log('✅ SQLite insert successful, ID:', id);
        return id;
      } catch (error) {
        console.error('❌ SQLite insert failed, falling back to localStorage:', error);
        this.fallbackToLocalStorage();
        const id = this.localStorageAdapter.insert(subscription);
        console.log('✅ LocalStorage insert successful, ID:', id);
        return id;
      }
    }
    
    console.log('💾 Using localStorage for insert');
    const id = this.localStorageAdapter.insert(subscription);
    console.log('✅ LocalStorage insert successful, ID:', id);
    return id;
  }

  /**
   * Update a subscription by ID
   */
  update(id: number, subscription: Omit<Subscription, 'id'>): boolean {
    console.log('✏️ Updating subscription:', id, subscription.name);
    
    if (this.usingSQLite && this.sqliteAdapter) {
      try {
        console.log('✏️ Using SQLite for update');
        const success = this.sqliteAdapter.update(id, subscription);
        console.log('✅ SQLite update successful:', success);
        return success;
      } catch (error) {
        console.error('❌ SQLite update failed, falling back to localStorage:', error);
        this.fallbackToLocalStorage();
        const success = this.localStorageAdapter.update(id, subscription);
        console.log('✅ LocalStorage update successful:', success);
        return success;
      }
    }
    
    console.log('✏️ Using localStorage for update');
    const success = this.localStorageAdapter.update(id, subscription);
    console.log('✅ LocalStorage update successful:', success);
    return success;
  }

  /**
   * Delete a subscription by ID
   */
  delete(id: number): boolean {
    if (this.usingSQLite && this.sqliteAdapter) {
      try {
        return this.sqliteAdapter.delete(id);
      } catch (error) {
        console.error('SQLite delete failed, falling back to localStorage:', error);
        this.fallbackToLocalStorage();
        return this.localStorageAdapter.delete(id);
      }
    }
    
    return this.localStorageAdapter.delete(id);
  }

  /**
   * Get a subscription by ID
   */
  getById(id: number): Subscription | null {
    if (this.usingSQLite && this.sqliteAdapter) {
      try {
        return this.sqliteAdapter.getById(id);
      } catch (error) {
        console.error('SQLite getById failed, falling back to localStorage:', error);
        this.fallbackToLocalStorage();
        return this.localStorageAdapter.getById(id);
      }
    }
    
    return this.localStorageAdapter.getById(id);
  }

  /**
   * Check connection status
   */
  checkConnection(): boolean {
    if (this.usingSQLite && this.sqliteAdapter) {
      try {
        return this.sqliteAdapter.checkConnection();
      } catch (error) {
        console.error('SQLite connection check failed:', error);
        this.fallbackToLocalStorage();
        return this.localStorageAdapter.checkConnection();
      }
    }
    
    return this.localStorageAdapter.checkConnection();
  }

  /**
   * Get table statistics
   */
  getTableStats(): { totalCount: number, activeCount: number, inactiveCount: number } {
    if (this.usingSQLite && this.sqliteAdapter) {
      try {
        return this.sqliteAdapter.getTableStats();
      } catch (error) {
        console.error('SQLite getTableStats failed, falling back to localStorage:', error);
        this.fallbackToLocalStorage();
        return this.localStorageAdapter.getTableStats();
      }
    }
    
    return this.localStorageAdapter.getTableStats();
  }

  /**
   * Get current storage type
   */
  getStorageType(): 'sqlite' | 'localStorage' {
    return this.usingSQLite ? 'sqlite' : 'localStorage';
  }

  /**
   * Get storage info
   */
  getStorageInfo(): {
    type: 'sqlite' | 'localStorage';
    isWorking: boolean;
    stats: { totalCount: number, activeCount: number, inactiveCount: number };
  } {
    const type = this.getStorageType();
    const isWorking = this.checkConnection();
    const stats = this.getTableStats();
    
    return { type, isWorking, stats };
  }

  /**
   * Force fallback to localStorage (for testing or manual override)
   */
  private fallbackToLocalStorage(): void {
    if (this.usingSQLite) {
      console.log('Switching from SQLite to localStorage');
      this.usingSQLite = false;
      this.sqliteAdapter = null;
    }
  }

  /**
   * Migrate data from SQLite to localStorage (if needed)
   */
  migrateToLocalStorage(): boolean {
    if (!this.usingSQLite || !this.sqliteAdapter) {
      console.log('Already using localStorage or SQLite not available');
      return true;
    }

    try {
      const sqliteData = this.sqliteAdapter.getAll();
      
      // Clear localStorage first
      this.localStorageAdapter.clear();
      
      // Insert each subscription into localStorage
      for (const subscription of sqliteData) {
        const { id, ...subscriptionData } = subscription;
        this.localStorageAdapter.insert(subscriptionData);
      }
      
      console.log(`Migrated ${sqliteData.length} subscriptions from SQLite to localStorage`);
      this.fallbackToLocalStorage();
      return true;
    } catch (error) {
      console.error('Failed to migrate data to localStorage:', error);
      return false;
    }
  }

  /**
   * Export data (works with both storage types)
   */
  exportData(): string {
    const subscriptions = this.getAll();
    return JSON.stringify(subscriptions, null, 2);
  }

  /**
   * Import data (works with both storage types)
   */
  importData(jsonData: string): boolean {
    try {
      const subscriptions = JSON.parse(jsonData);
      
      if (!Array.isArray(subscriptions)) {
        throw new Error('Invalid data format: expected array');
      }

      // Clear existing data
      if (this.usingSQLite && this.sqliteAdapter) {
        // For SQLite, we'd need to implement a clear method
        console.warn('SQLite data clearing not implemented in import');
      } else {
        this.localStorageAdapter.clear();
      }

      // Import each subscription
      for (const sub of subscriptions) {
        const { id, ...subscriptionData } = sub;
        this.insert(subscriptionData);
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Add test data with background images (for testing purposes)
   */
  addTestData(): void {
    console.log('🧪 Adding test data with background images...');
    
    if (this.usingSQLite && this.sqliteAdapter) {
      console.log('🧪 SQLite test data not implemented');
    } else {
      this.localStorageAdapter.addTestData();
    }
  }
}