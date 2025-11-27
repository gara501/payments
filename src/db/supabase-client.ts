/**
 * Supabase client singleton
 * 
 * This module provides a centralized Supabase client instance
 * that can be used throughout the application.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '../config/supabase';
import type { Database } from './database.types';

let supabaseClient: SupabaseClient<Database> | null = null;

/**
 * Get or create the Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    const config = getSupabaseConfig();
    supabaseClient = createClient<Database>(config.url, config.apiKey);
  }
  return supabaseClient;
}

/**
 * Reset the Supabase client (useful for testing)
 */
export function resetSupabaseClient(): void {
  supabaseClient = null;
}
