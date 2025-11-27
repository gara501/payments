/**
 * Test file for database migration functionality
 * This file can be used to test the migration system in isolation
 */

import { initializeDatabase, closeDatabase } from './sqlite';
import { DatabaseAdapter } from './adapter';

export async function testMigrationSystem(): Promise<void> {
  console.log('🧪 Testing database migration system...');
  
  try {
    // Initialize database (this will run migrations)
    console.log('1. Initializing database...');
    await initializeDatabase();
    
    // Create adapter to test functionality
    console.log('2. Creating database adapter...');
    const adapter = new DatabaseAdapter();
    
    // Test connection
    console.log('3. Testing database connection...');
    const isConnected = adapter.checkConnection();
    if (!isConnected) {
      throw new Error('Database connection test failed');
    }
    console.log('✓ Database connection successful');
    
    // Test schema validation
    console.log('4. Validating database schema...');
    const isSchemaValid = adapter.validateDatabaseSchema();
    if (!isSchemaValid) {
      throw new Error('Schema validation failed');
    }
    console.log('✓ Database schema validation passed');
    
    // Get database info
    console.log('5. Getting database information...');
    const dbInfo = adapter.getDatabaseInfo();
    console.log(`✓ Schema version: ${dbInfo.schemaVersion}`);
    console.log(`✓ Schema valid: ${dbInfo.isValid}`);
    console.log(`✓ Total subscriptions: ${dbInfo.stats.totalCount}`);
    console.log(`✓ Active subscriptions: ${dbInfo.stats.activeCount}`);
    console.log(`✓ Inactive subscriptions: ${dbInfo.stats.inactiveCount}`);
    
    // Show migration history
    if (dbInfo.migrationHistory.length > 0) {
      console.log('✓ Migration history:');
      dbInfo.migrationHistory.forEach(migration => {
        console.log(`  - v${migration.version}: ${migration.name} (applied: ${migration.appliedAt})`);
      });
    } else {
      console.log('✓ No migration history (fresh database)');
    }
    
    // Test basic CRUD operations
    console.log('6. Testing CRUD operations...');
    
    // Test insert
    const testSubscription = {
      name: 'Test Migration Service',
      subscription_date: '2024-01-01',
      value: 9.99,
      is_active: true,
      background_image: undefined,
      category: 'General'
    };
    
    const insertedId = adapter.insert(testSubscription);
    console.log(`✓ Insert test passed (ID: ${insertedId})`);
    
    // Test getById
    const retrieved = adapter.getById(insertedId);
    if (!retrieved || retrieved.name !== testSubscription.name) {
      throw new Error('GetById test failed');
    }
    console.log('✓ GetById test passed');
    
    // Test getAll
    const allSubscriptions = adapter.getAll();
    if (allSubscriptions.length === 0) {
      throw new Error('GetAll test failed - no subscriptions found');
    }
    console.log(`✓ GetAll test passed (${allSubscriptions.length} subscriptions)`);
    
    // Test delete
    const deleteSuccess = adapter.delete(insertedId);
    if (!deleteSuccess) {
      throw new Error('Delete test failed');
    }
    console.log('✓ Delete test passed');
    
    // Verify deletion
    const deletedItem = adapter.getById(insertedId);
    if (deletedItem !== null) {
      throw new Error('Delete verification failed');
    }
    console.log('✓ Delete verification passed');
    
    console.log('🎉 All migration system tests passed!');
    
  } catch (error) {
    console.error('❌ Migration system test failed:', error);
    throw error;
  } finally {
    // Clean up
    closeDatabase();
  }
}

// Export for use in other test files
export default testMigrationSystem;