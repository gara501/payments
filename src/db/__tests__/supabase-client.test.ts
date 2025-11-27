/**
 * Tests for Supabase client
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getSupabaseClient, resetSupabaseClient } from '../supabase-client';

describe('Supabase Client', () => {
  beforeEach(() => {
    resetSupabaseClient();
  });

  it('should create a Supabase client instance', () => {
    const client = getSupabaseClient();
    expect(client).toBeDefined();
    expect(client.from).toBeDefined();
  });

  it('should return the same instance on multiple calls', () => {
    const client1 = getSupabaseClient();
    const client2 = getSupabaseClient();
    expect(client1).toBe(client2);
  });

  it('should reset the client instance', () => {
    const client1 = getSupabaseClient();
    resetSupabaseClient();
    const client2 = getSupabaseClient();
    expect(client1).not.toBe(client2);
  });
});
