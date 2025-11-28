# Requirements Document

## Introduction

This feature involves migrating the subscription management application from a client-side SQLite WASM database to Supabase, a cloud-based PostgreSQL database with real-time capabilities. The migration will enable multi-device synchronization, user authentication, and cloud-based data persistence while maintaining all existing functionality. The system will leverage the existing Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) that are already configured.

## Glossary

- **Supabase**: An open-source Firebase alternative providing PostgreSQL database, authentication, and real-time subscriptions
- **DatabaseAdapter**: The abstraction layer that provides CRUD operations for subscriptions
- **Migration**: The process of transitioning from SQLite WASM to Supabase
- **Row Level Security (RLS)**: PostgreSQL security feature that restricts database access based on user identity
- **Supabase Client**: The JavaScript client library for interacting with Supabase services

## Requirements

### Requirement 1

**User Story:** As a developer, I want to replace the SQLite WASM database with Supabase, so that subscription data is stored in the cloud and accessible across devices.

#### Acceptance Criteria

1. WHEN the application initializes THEN the system SHALL connect to Supabase using the configured environment variables
2. WHEN the Supabase client is created THEN the system SHALL use VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the environment configuration
3. WHEN environment variables are missing THEN the system SHALL display a clear error message indicating the configuration issue
4. WHEN the database connection is established THEN the system SHALL verify the connection before allowing data operations
5. WHEN the application starts THEN the system SHALL no longer initialize SQLite WASM

### Requirement 2

**User Story:** As a developer, I want to create the subscriptions table in Supabase with the same schema as SQLite, so that existing functionality continues to work without changes.

#### Acceptance Criteria

1. WHEN creating the subscriptions table THEN the system SHALL include columns: id, name, subscription_date, value, is_active, background_image, category, created_at
2. WHEN defining the id column THEN the system SHALL use a UUID primary key with automatic generation
3. WHEN defining text columns THEN the system SHALL use appropriate PostgreSQL text types
4. WHEN defining numeric columns THEN the system SHALL use numeric or decimal types for currency values
5. WHEN defining boolean columns THEN the system SHALL use PostgreSQL boolean type instead of integer
6. WHEN defining timestamp columns THEN the system SHALL use timestamptz for timezone-aware timestamps
7. WHEN creating the table THEN the system SHALL set appropriate default values for category and created_at columns

### Requirement 3

**User Story:** As a developer, I want to update the DatabaseAdapter to use Supabase instead of SQLite, so that all CRUD operations work with the cloud database.

#### Acceptance Criteria

1. WHEN the DatabaseAdapter is instantiated THEN the system SHALL initialize a Supabase client instead of SQLite connection
2. WHEN calling getAll() THEN the system SHALL execute a Supabase query to retrieve all subscriptions ordered by subscription_date DESC
3. WHEN calling insert() THEN the system SHALL execute a Supabase insert operation and return the new record's UUID
4. WHEN calling update() THEN the system SHALL execute a Supabase update operation using the subscription UUID
5. WHEN calling delete() THEN the system SHALL execute a Supabase delete operation using the subscription UUID
6. WHEN calling getById() THEN the system SHALL execute a Supabase select query filtered by UUID
7. WHEN any database operation fails THEN the system SHALL handle Supabase errors and return meaningful error messages

### Requirement 4

**User Story:** As a developer, I want to remove all SQLite-specific code and dependencies, so that the application no longer relies on client-side database storage.

#### Acceptance Criteria

1. WHEN removing SQLite code THEN the system SHALL delete the sqlite.ts file
2. WHEN removing SQLite code THEN the system SHALL delete the migrations.ts file
3. WHEN removing SQLite code THEN the system SHALL delete the localStorage-adapter.ts file
4. WHEN removing SQLite code THEN the system SHALL delete the hybrid-adapter.ts file
5. WHEN updating package.json THEN the system SHALL remove the @sqlite.org/sqlite-wasm dependency
6. WHEN updating package.json THEN the system SHALL add the @supabase/supabase-js dependency
7. WHEN removing SQLite code THEN the system SHALL delete all SQLite-related test files

### Requirement 5

**User Story:** As a developer, I want to update the DatabaseProvider to initialize Supabase instead of SQLite, so that the application uses the cloud database from startup.

#### Acceptance Criteria

1. WHEN the DatabaseProvider initializes THEN the system SHALL create a Supabase client using environment variables
2. WHEN the DatabaseProvider initializes THEN the system SHALL no longer call initializeDatabase() for SQLite
3. WHEN the DatabaseProvider initializes THEN the system SHALL verify Supabase connection before marking as initialized
4. WHEN initialization fails THEN the system SHALL display appropriate error messages with retry functionality
5. WHEN the provider is ready THEN the system SHALL pass the Supabase-based DatabaseAdapter to child components

### Requirement 6

**User Story:** As a developer, I want to update all database-related tests to work with Supabase, so that the test suite validates the new implementation.

#### Acceptance Criteria

1. WHEN running tests THEN the system SHALL use Supabase test utilities or mocks instead of SQLite
2. WHEN testing CRUD operations THEN the system SHALL verify Supabase client method calls
3. WHEN testing error handling THEN the system SHALL simulate Supabase error responses
4. WHEN running the test suite THEN all existing database tests SHALL pass with the Supabase implementation
5. WHEN testing the DatabaseAdapter THEN the system SHALL verify correct Supabase query construction

### Requirement 7

**User Story:** As a developer, I want to create a Supabase migration script, so that the database schema can be version-controlled and deployed consistently.

#### Acceptance Criteria

1. WHEN creating the migration script THEN the system SHALL define the subscriptions table with all required columns
2. WHEN creating the migration script THEN the system SHALL include appropriate indexes for performance
3. WHEN creating the migration script THEN the system SHALL set up Row Level Security policies for future authentication
4. WHEN the migration script is executed THEN the system SHALL create the table in the Supabase project
5. WHEN the migration script is provided THEN the system SHALL include clear instructions for running it

### Requirement 8

**User Story:** As a developer, I want to update the seed data functionality to work with Supabase, so that development and testing environments have sample data.

#### Acceptance Criteria

1. WHEN seeding data THEN the system SHALL use Supabase insert operations instead of SQLite
2. WHEN seeding data THEN the system SHALL check if data already exists before inserting
3. WHEN seeding data THEN the system SHALL insert the same sample subscriptions as the SQLite version
4. WHEN seeding fails THEN the system SHALL log errors but not prevent application startup
5. WHEN the database is empty THEN the system SHALL automatically seed sample data on first load

### Requirement 9

**User Story:** As a developer, I want to update the build configuration to remove SQLite WASM assets, so that the production bundle is smaller and cleaner.

#### Acceptance Criteria

1. WHEN building for production THEN the system SHALL no longer copy SQLite WASM files to the public directory
2. WHEN updating vite.config.ts THEN the system SHALL remove the SQLite WASM plugin
3. WHEN updating vite.config.ts THEN the system SHALL remove COOP/COEP headers that were required for SharedArrayBuffer
4. WHEN building the application THEN the system SHALL produce a smaller bundle without SQLite dependencies
5. WHEN the build completes THEN the system SHALL verify no SQLite-related files are in the dist directory

### Requirement 10

**User Story:** As a developer, I want to update all documentation to reflect the Supabase migration, so that setup instructions and architecture diagrams are accurate.

#### Acceptance Criteria

1. WHEN updating documentation THEN the system SHALL modify DATABASE_SETUP.md to describe Supabase setup
2. WHEN updating documentation THEN the system SHALL update the architecture section in design.md
3. WHEN updating documentation THEN the system SHALL update README.md to remove SQLite references
4. WHEN updating documentation THEN the system SHALL add Supabase environment variable setup instructions
5. WHEN updating documentation THEN the system SHALL include the Supabase migration SQL script in the documentation

### Requirement 11

**User Story:** As a developer, I want to maintain backward compatibility with the existing component API, so that React components don't need to be modified.

#### Acceptance Criteria

1. WHEN components call DatabaseAdapter methods THEN the system SHALL provide the same method signatures as before
2. WHEN components receive subscription data THEN the system SHALL return the same Subscription type structure
3. WHEN components handle errors THEN the system SHALL receive errors in the same format as before
4. WHEN the migration is complete THEN the system SHALL not require changes to Dashboard, SubscriptionCard, or form components
5. WHEN the useSubscriptions hook is called THEN the system SHALL work identically with Supabase as it did with SQLite

### Requirement 12

**User Story:** As a developer, I want to handle Supabase-specific data types correctly, so that UUIDs and timestamps work properly throughout the application.

#### Acceptance Criteria

1. WHEN working with subscription IDs THEN the system SHALL handle UUID strings instead of integer IDs
2. WHEN displaying subscription IDs THEN the system SHALL format UUIDs appropriately for the UI
3. WHEN comparing subscription IDs THEN the system SHALL use string comparison instead of numeric comparison
4. WHEN working with timestamps THEN the system SHALL handle ISO 8601 timestamp strings from Supabase
5. WHEN converting boolean values THEN the system SHALL work with native PostgreSQL booleans instead of 0/1 integers
