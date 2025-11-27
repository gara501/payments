// Debug script to test storage behavior
import { HybridAdapter } from './src/db/hybrid-adapter.js';

console.log('=== Storage Debug Test ===');

try {
    const adapter = new HybridAdapter();
    console.log('Adapter created successfully');
    
    const storageInfo = adapter.getStorageInfo();
    console.log('Storage Info:', storageInfo);
    
    // Test adding a subscription
    const testSub = {
        name: 'Debug Test Subscription',
        subscription_date: '2025-01-01',
        value: 9.99,
        is_active: true
    };
    
    console.log('Adding test subscription...');
    const id = adapter.insert(testSub);
    console.log('Inserted with ID:', id);
    
    // Test retrieving subscriptions
    console.log('Retrieving all subscriptions...');
    const subs = adapter.getAll();
    console.log('Found subscriptions:', subs);
    
    // Check localStorage directly
    console.log('Direct localStorage check:');
    const directData = localStorage.getItem('subscriptions');
    console.log('Raw localStorage data:', directData);
    
} catch (error) {
    console.error('Error during debug test:', error);
}