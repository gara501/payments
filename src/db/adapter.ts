import { SupabaseAdapter } from './supabase-adapter';
import type { Subscription } from '../types/subscription';

export class DatabaseAdapter {
  private supabaseAdapter: SupabaseAdapter;

  constructor() {
    this.supabaseAdapter = new SupabaseAdapter();
  }

  /**
   * Get all subscriptions ordered by subscription_date DESC
   */
  async getAll(): Promise<Subscription[]> {
    return this.supabaseAdapter.getAll();
  }

  /**
   * Insert a new subscription
   */
  async insert(subscription: Omit<Subscription, 'id'>): Promise<number> {
    return this.supabaseAdapter.insert(subscription);
  }

  /**
   * Update a subscription by ID
   */
  async update(id: number, subscription: Omit<Subscription, 'id'>): Promise<boolean> {
    return this.supabaseAdapter.update(id, subscription);
  }

  /**
   * Delete a subscription by ID
   */
  async delete(id: number): Promise<boolean> {
    return this.supabaseAdapter.delete(id);
  }

  /**
   * Get a subscription by ID
   */
  async getById(id: number): Promise<Subscription | null> {
    return this.supabaseAdapter.getById(id);
  }

  /**
   * Check database connection and table existence
   */
  async checkConnection(): Promise<boolean> {
    return this.supabaseAdapter.checkConnection();
  }

  /**
   * Verify table structure matches expected schema
   * For Supabase, we just check if we can connect
   */
  async verifyTableStructure(): Promise<boolean> {
    return this.supabaseAdapter.checkConnection();
  }

  /**
   * Get table statistics
   */
  async getTableStats(): Promise<{ totalCount: number, activeCount: number, inactiveCount: number }> {
    return this.supabaseAdapter.getTableStats();
  }

  /**
   * Validate database schema
   * For Supabase, we just check if we can connect
   */
  async validateDatabaseSchema(): Promise<boolean> {
    return this.supabaseAdapter.checkConnection();
  }

  /**
   * Get comprehensive database info
   */
  async getDatabaseInfo(): Promise<{
    isValid: boolean;
    stats: { totalCount: number, activeCount: number, inactiveCount: number };
  }> {
    const [isValid, stats] = await Promise.all([
      this.validateDatabaseSchema(),
      this.getTableStats()
    ]);
    
    return {
      isValid,
      stats
    };
  }
}