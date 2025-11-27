-- Supabase Table Setup for Subscription Management
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_date DATE NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  background_image TEXT,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Optional for now, required for auth later
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations for now (will be restricted with auth)
CREATE POLICY "Allow all operations for now" ON subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_date ON subscriptions(subscription_date DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON subscriptions(category);

-- Verify table creation
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;
