/**
 * Supabase configuration
 * 
 * This file provides a centralized configuration for Supabase
 * using environment variables.
 */

import { env } from './env';

export const supabaseConfig = {
  url: env.supabase.url,
  apiKey: env.supabase.apiKey,
} as const;

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseConfig.url && supabaseConfig.apiKey);
}

/**
 * Get Supabase URL
 */
export function getSupabaseUrl(): string {
  if (!supabaseConfig.url) {
    throw new Error(
      'Supabase URL is not configured. Please set VITE_SUPABASE_URL in your .env file.'
    );
  }
  return supabaseConfig.url;
}

/**
 * Get Supabase API Key
 */
export function getSupabaseApiKey(): string {
  if (!supabaseConfig.apiKey) {
    throw new Error(
      'Supabase API Key is not configured. Please set VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }
  return supabaseConfig.apiKey;
}

/**
 * Get complete Supabase configuration
 */
export function getSupabaseConfig() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not fully configured. Please check your .env file.'
    );
  }
  return supabaseConfig;
}
