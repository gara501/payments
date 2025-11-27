# Implementation Plan

## 1. Install Dependencies and Setup

- [ ] 1.1 Install Supabase client library
  - Run `npm install @supabase/supabase-js`
  - Verify installation in package.json
  - _Requirements: 4.6_

- [ ] 1.2 Remove SQLite WASM dependency
  - Run `npm uninstall @sqlite.org/sqlite-wasm`
  - Verify removal from package.json
  - _Requirements: 4.5_

## 2. Create Supabase Database Schema

- [ ] 2.1 Create Supabase migration SQL file
  - Create `supabase/migrations/001_create_subscriptions_table.sql`
  - Define subscriptions table with UUID primary key
  - Add indexes for subscription_date and category
  - Set up Row Level Security with permissive policy
  - Include clear comments in SQL file
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 7.1, 7.2, 7.3, 7.4_

- [ ] 2.2 Document Supabase setup instructions
  - Update DATABASE_SETUP.md with Supabase instructions
  - Include steps to run migration SQL
  - Document how to verify table creation
  - Add troubleshooting section
  - _Requirements: 7.5, 10.1_

## 3. Create Supabase Client Infrastructure

- [ ] 3.1 Create database types file
  - Create `src/db/database.types.ts`
  - Define Database interface with subscriptions table types
  - Define Row, Insert, and Update types for type safety
  - Export types for use throughout application
  - _Requirements: 1.1, 1.2, 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 3.2 Create Supabase client module
  - Create `src/db/supabase-client.ts`
  - Implement getSupabaseClient() function using singleton pattern
  - Use environment variables from src/config/supabase.ts
  - Add proper TypeScript types using Database interface
  - Handle missing environment variables with clear errors
  - _Requirements: 1.1, 1.2, 1.3_

## 4. Update DatabaseAdapter for Supabase

- [ ] 4.1 Refactor DatabaseAdapter constructor
  - Replace SQLite database initialization with Supabase client
  - Update constructor to accept optional Supabase client for testing
  - Remove all SQLite-specific imports
  - _Requirements: 3.1, 3.2_

- [ ] 4.2 Implement getAll() method with Supabase
  - Replace SQLite query with Supabase select query
  - Use `.from('subscriptions').select('*').order('subscription_date', { ascending: false })`
  - Handle Supabase errors and convert to meaningful messages
  - Map database rows to Subscription type
  - _Requirements: 3.2, 3.7, 11.2_

- [ ] 4.3 Implement insert() method with Supabase
  - Replace SQLite insert with Supabase insert operation
  - Use `.insert().select().single()` to get created record
  - Return UUID string instead of integer ID
  - Handle Supabase errors appropriately
  - _Requirements: 3.3, 3.7, 12.1_

- [ ] 4.4 Implement update() method with Supabase
  - Replace SQLite update with Supabase update operation
  - Use `.update().eq('id', id)` for filtering
  - Accept string UUID instead of integer ID
  - Handle Supabase errors appropriately
  - _Requirements: 3.4, 3.7, 12.1, 12.3_

- [ ] 4.5 Implement delete() method with Supabase
  - Replace SQLite delete with Supabase delete operation
  - Use `.delete().eq('id', id)` for filtering
  - Accept string UUID instead of integer ID
  - Handle Supabase errors appropriately
  - _Requirements: 3.5, 3.7, 12.1, 12.3_

- [ ] 4.6 Implement getById() method with Supabase
  - Replace SQLite query with Supabase select query
  - Use `.select('*').eq('id', id).single()` for single record
  - Handle "not found" error (PGRST116) by returning null
  - Accept string UUID instead of integer ID
  - _Requirements: 3.6, 3.7, 12.1, 12.3_

- [ ] 4.7 Remove SQLite-specific utility methods
  - Remove checkConnection() method (or adapt for Supabase)
  - Remove verifyTableStructure() method
  - Remove getTableStats() method (or adapt for Supabase)
  - Remove getMigrationHistory() method
  - Remove getSchemaVersion() method
  - Remove validateDatabaseSchema() method
  - Remove getDatabaseInfo() method
  - _Requirements: 3.1, 4.1_

## 5. Update Subscription Type

- [ ] 5.1 Update Subscription interface
  - Change id type from `number` to `string` in `src/types/subscription.ts`
  - Add optional created_at field
  - Ensure all other fields remain unchanged
  - Update any type guards or validators
  - _Requirements: 11.2, 12.1, 12.2_

## 6. Update Seed Data Implementation

- [ ] 6.1 Refactor seedData.ts for Supabase
  - Update `src/db/seedData.ts` to use Supabase client
  - Replace SQLite queries with Supabase operations
  - Check if data exists using `.select('*', { count: 'exact', head: true })`
  - Insert sample data using `.insert()`
  - Handle errors gracefully with console logging
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

## 7. Update Database Provider and Hook

- [ ] 7.1 Refactor DatabaseProvider component
  - Update `src/db/DatabaseProvider.tsx`
  - Remove SQLite initialization logic
  - Replace with Supabase client creation
  - Update error messages to reference Supabase
  - Simplify initialization flow (no WASM loading)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 7.2 Refactor useDatabase hook
  - Update `src/hooks/useDatabase.ts`
  - Remove SQLite-specific initialization
  - Simplify to create Supabase client and adapter
  - Update error handling for Supabase errors
  - Remove WASM-related loading states
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

## 8. Update Build Configuration

- [ ] 8.1 Update Vite configuration
  - Modify `vite.config.ts`
  - Remove SQLite WASM copy plugin
  - Remove COOP/COEP headers configuration
  - Remove SharedArrayBuffer-related settings
  - Verify build still works correctly
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 8.2 Verify production build
  - Run `npm run build`
  - Check dist directory for SQLite files (should be none)
  - Verify bundle size is smaller
  - Test production build locally with `npm run preview`
  - _Requirements: 9.4, 9.5_

## 9. Remove SQLite Code and Files

- [ ] 9.1 Delete SQLite implementation files
  - Delete `src/db/sqlite.ts`
  - Delete `src/db/migrations.ts`
  - Delete `src/db/localStorage-adapter.ts`
  - Delete `src/db/hybrid-adapter.ts`
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 9.2 Delete SQLite test files
  - Delete `src/db/__tests__/localStorage-adapter.test.ts`
  - Delete any other SQLite-specific test files
  - Delete test HTML files related to SQLite (test-db.html, test-migration.html, etc.)
  - _Requirements: 4.7_

- [ ] 9.3 Remove SQLite WASM assets
  - Delete `public/sqlite3.wasm`
  - Delete `public/sqlite3-worker1.js`
  - Delete `public/sqlite3-worker1-promiser.js`
  - Delete `public/sqlite3-opfs-async-proxy.js`
  - _Requirements: 9.1_

## 10. Update Tests for Supabase

- [ ] 10.1 Create Supabase test utilities
  - Create mock Supabase client for testing
  - Create helper functions for test data
  - Set up test fixtures with sample subscriptions
  - _Requirements: 6.1, 6.2_

- [ ] 10.2 Update DatabaseAdapter tests
  - Update tests to use mock Supabase client
  - Test getAll() with mocked Supabase responses
  - Test insert() with UUID return values
  - Test update() with string IDs
  - Test delete() with string IDs
  - Test getById() with string IDs and not found cases
  - Test error handling with Supabase error objects
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10.3 Update useSubscriptions hook tests
  - Update `src/hooks/__tests__/useSubscriptions.test.tsx`
  - Mock DatabaseAdapter with Supabase behavior
  - Verify hook works with string UUIDs
  - Test async operations complete correctly
  - _Requirements: 6.4, 11.5_

- [ ] 10.4 Update component tests
  - Update Dashboard tests to work with string IDs
  - Update SubscriptionCard tests to work with string IDs
  - Update AddSubscriptionForm tests if needed
  - Ensure all tests pass with new implementation
  - _Requirements: 6.4, 11.1, 11.2, 11.3, 11.4_

## 11. Update Documentation

- [ ] 11.1 Update DATABASE_SETUP.md
  - Replace SQLite setup instructions with Supabase setup
  - Include Supabase project creation steps
  - Document environment variable configuration
  - Include migration SQL script
  - Add troubleshooting section for common issues
  - _Requirements: 10.1, 10.4, 10.5_

- [ ] 11.2 Update README.md
  - Remove references to SQLite WASM
  - Add Supabase setup instructions
  - Update technology stack section
  - Update development setup steps
  - _Requirements: 10.3_

- [ ] 11.3 Update main spec design.md
  - Update architecture diagrams to show Supabase
  - Update database schema section
  - Update technology stack section
  - Remove SQLite-specific content
  - _Requirements: 10.2_

- [ ] 11.4 Update steering rules
  - Update `tech.md` to reference Supabase instead of SQLite
  - Update `structure.md` if database file structure changed
  - Update `product.md` to mention cloud-based storage
  - _Requirements: 10.2, 10.3_

## 12. Integration Testing and Validation

- [ ] 12.1 Test complete CRUD flow
  - Manually test adding a subscription
  - Manually test viewing subscriptions
  - Manually test editing a subscription
  - Manually test deleting a subscription
  - Verify data persists across page refreshes
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 12.2 Test error scenarios
  - Test with invalid Supabase credentials
  - Test with network disconnection
  - Test with invalid data inputs
  - Verify error messages are user-friendly
  - _Requirements: 1.3, 3.7_

- [ ] 12.3 Test seed data functionality
  - Clear Supabase table
  - Restart application
  - Verify sample data is seeded automatically
  - Verify seed doesn't run when data exists
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 12.4 Performance testing
  - Test with large number of subscriptions (100+)
  - Verify query performance is acceptable
  - Check network request times
  - Verify loading states display correctly
  - _Requirements: 1.4_

## 13. Final Cleanup and Verification

- [ ] 13.1 Code cleanup
  - Remove unused imports throughout codebase
  - Remove commented-out SQLite code
  - Update code comments to reference Supabase
  - Run linter and fix any issues
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 13.2 Verify no SQLite references remain
  - Search codebase for "sqlite" (case-insensitive)
  - Search for "wasm" references
  - Search for "migrations" references (except Supabase migrations)
  - Remove or update any found references
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 13.3 Run full test suite
  - Run `npm run test:run`
  - Verify all tests pass
  - Fix any failing tests
  - Ensure test coverage is maintained
  - _Requirements: 6.4_

- [ ] 13.4 Build and deploy verification
  - Run production build
  - Deploy to staging environment
  - Test all functionality in production build
  - Verify environment variables work correctly
  - _Requirements: 9.4, 9.5_

## 14. Update Existing Specs

- [ ] 14.1 Update main requirements.md
  - Update Requirement 8 to reference Supabase instead of SQLite
  - Update any other requirements that mention database technology
  - Ensure all requirements are still accurate
  - _Requirements: 10.1, 10.2_

- [ ] 14.2 Update main design.md
  - Update Architecture section to show Supabase
  - Update Data Persistence Design section
  - Update Database Schema section
  - Update Technology Stack section
  - Remove SQLite-specific diagrams and content
  - _Requirements: 10.2_

- [ ] 14.3 Update main tasks.md
  - Mark SQLite-related tasks as completed/obsolete
  - Update task descriptions that reference database
  - Ensure future tasks are compatible with Supabase
  - _Requirements: 10.2_
