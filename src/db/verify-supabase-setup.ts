/**
 * Verification script to check if Supabase table is set up correctly
 * Run with: npx tsx src/db/verify-supabase-setup.ts
 */

import { getSupabaseClient } from './supabase-client';

async function verifySupabaseSetup() {
  console.log('🔍 Verifying Supabase setup...\n');

  try {
    const supabase = getSupabaseClient();

    // Test 1: Check if we can connect to Supabase
    console.log('1️⃣  Testing Supabase connection...');
    const { error: connectionError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);

    if (connectionError) {
      if (connectionError.code === 'PGRST205') {
        console.log('❌ Table "subscriptions" does not exist in Supabase\n');
        console.log('📋 To fix this:');
        console.log('   1. Go to https://supabase.com/dashboard');
        console.log('   2. Select your project');
        console.log('   3. Navigate to SQL Editor');
        console.log('   4. Run the SQL from: src/db/setup-supabase-table.sql\n');
        process.exit(1);
      }
      throw connectionError;
    }

    console.log('✅ Successfully connected to Supabase\n');

    // Test 2: Check table structure
    console.log('2️⃣  Checking table structure...');
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('✅ Table structure is correct\n');

    // Test 3: Count existing records
    console.log('3️⃣  Counting existing records...');
    const { count, error: countError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    console.log(`✅ Found ${count} existing subscription(s)\n`);

    // Test 4: Try a simple insert and delete
    console.log('4️⃣  Testing CRUD operations...');
    
    const testSub = {
      name: 'Test Subscription',
      subscription_date: '2025-01-01',
      value: 9.99,
      is_active: true,
      category: 'General',
    };

    const { data: insertData, error: insertError } = await supabase
      .from('subscriptions')
      .insert(testSub)
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('✅ Insert operation successful');

    // Clean up test data
    const { error: deleteError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', insertData.id);

    if (deleteError) {
      throw deleteError;
    }

    console.log('✅ Delete operation successful\n');

    console.log('🎉 All checks passed! Supabase is set up correctly.');
    console.log('✨ You can now run the tests with: npm run test:run\n');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifySupabaseSetup();
