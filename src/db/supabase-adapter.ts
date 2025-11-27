import { getSupabaseClient } from './supabase-client';
import type { Subscription } from '../types/subscription';

/**
 * Supabase Database Adapter
 * 
 * Provides CRUD operations for subscriptions using Supabase PostgreSQL database.
 * This adapter replaces the SQLite adapter and provides the same interface.
 */
export class SupabaseAdapter {
  /**
   * Get all subscriptions ordered by subscription_date DESC
   */
  async getAll(): Promise<Subscription[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('subscription_date', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions from Supabase:', error);
      throw new Error(`Failed to fetch subscriptions: ${error.message}`);
    }

    // Transform Supabase data to match our Subscription type
    // Note: Keeping id as number for now to maintain compatibility
    return (data || []).map(row => ({
      id: this.uuidToNumber(row.id),
      name: row.name,
      subscription_date: row.subscription_date,
      value: row.value,
      is_active: row.is_active,
      background_image: row.background_image || undefined,
      category: row.category || 'General',
    }));
  }

  /**
   * Insert a new subscription
   */
  async insert(subscription: Omit<Subscription, 'id'>): Promise<number> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        name: subscription.name,
        subscription_date: subscription.subscription_date,
        value: subscription.value,
        is_active: subscription.is_active,
        background_image: subscription.background_image || null,
        category: subscription.category || 'General',
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting subscription to Supabase:', error);
      throw new Error(`Failed to insert subscription: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from insert operation');
    }

    // Store UUID mapping for later retrieval
    const numericId = this.uuidToNumber(data.id);
    this.storeUuidMapping(numericId, data.id);
    
    return numericId;
  }

  /**
   * Update a subscription by ID
   */
  async update(id: number, subscription: Omit<Subscription, 'id'>): Promise<boolean> {
    const supabase = getSupabaseClient();
    
    // Find the UUID for this numeric ID
    const uuid = await this.numberToUuid(id);
    if (!uuid) {
      console.warn(`No UUID found for numeric ID: ${id}`);
      return false;
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({
        name: subscription.name,
        subscription_date: subscription.subscription_date,
        value: subscription.value,
        is_active: subscription.is_active,
        background_image: subscription.background_image || null,
        category: subscription.category || 'General',
      })
      .eq('id', uuid);

    if (error) {
      console.error('Error updating subscription in Supabase:', error);
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    return true;
  }

  /**
   * Delete a subscription by ID
   */
  async delete(id: number): Promise<boolean> {
    const supabase = getSupabaseClient();
    
    // Find the UUID for this numeric ID
    const uuid = await this.numberToUuid(id);
    if (!uuid) {
      console.warn(`No UUID found for numeric ID: ${id}`);
      return false;
    }

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', uuid);

    if (error) {
      console.error('Error deleting subscription from Supabase:', error);
      throw new Error(`Failed to delete subscription: ${error.message}`);
    }

    // Remove UUID mapping
    this.removeUuidMapping(id);
    
    return true;
  }

  /**
   * Get a subscription by ID
   */
  async getById(id: number): Promise<Subscription | null> {
    const supabase = getSupabaseClient();
    
    // Find the UUID for this numeric ID
    const uuid = await this.numberToUuid(id);
    if (!uuid) {
      console.warn(`No UUID found for numeric ID: ${id}`);
      return null;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', uuid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('Error fetching subscription from Supabase:', error);
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: this.uuidToNumber(data.id),
      name: data.name,
      subscription_date: data.subscription_date,
      value: data.value,
      is_active: data.is_active,
      background_image: data.background_image || undefined,
      category: data.category || 'General',
    };
  }

  /**
   * Check database connection
   */
  async checkConnection(): Promise<boolean> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('subscriptions').select('id').limit(1);
      
      if (error) {
        console.error('Supabase connection check failed:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Supabase connection check failed:', error);
      return false;
    }
  }

  /**
   * Get table statistics
   */
  async getTableStats(): Promise<{ totalCount: number, activeCount: number, inactiveCount: number }> {
    try {
      const supabase = getSupabaseClient();
      
      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        throw totalError;
      }

      // Get active count
      const { count: activeCount, error: activeError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) {
        throw activeError;
      }

      // Get inactive count
      const { count: inactiveCount, error: inactiveError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', false);

      if (inactiveError) {
        throw inactiveError;
      }

      return {
        totalCount: totalCount || 0,
        activeCount: activeCount || 0,
        inactiveCount: inactiveCount || 0,
      };
    } catch (error) {
      console.error('Failed to get table statistics:', error);
      return { totalCount: 0, activeCount: 0, inactiveCount: 0 };
    }
  }

  /**
   * Helper: Convert UUID to a numeric ID for compatibility
   * Uses a simple hash function to generate consistent numeric IDs
   */
  private uuidToNumber(uuid: string): number {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
      const char = uuid.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Helper: Find UUID for a numeric ID
   * This requires fetching all subscriptions and finding the match
   */
  private async numberToUuid(id: number): Promise<string | null> {
    // First check the cache
    const cached = this.getUuidFromCache(id);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from database
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id');

    if (error || !data) {
      return null;
    }

    // Find the UUID that matches this numeric ID and cache all mappings
    for (const row of data) {
      const numericId = this.uuidToNumber(row.id);
      this.storeUuidMapping(numericId, row.id);
      
      if (numericId === id) {
        return row.id;
      }
    }

    return null;
  }

  /**
   * UUID mapping cache (in-memory)
   * Maps numeric IDs to UUIDs for faster lookups
   */
  private uuidCache: Map<number, string> = new Map();

  private storeUuidMapping(numericId: number, uuid: string): void {
    this.uuidCache.set(numericId, uuid);
  }

  private getUuidFromCache(numericId: number): string | null {
    return this.uuidCache.get(numericId) || null;
  }

  private removeUuidMapping(numericId: number): void {
    this.uuidCache.delete(numericId);
  }

  /**
   * Clear the UUID cache (useful for testing or when data changes externally)
   */
  clearCache(): void {
    this.uuidCache.clear();
  }
}
