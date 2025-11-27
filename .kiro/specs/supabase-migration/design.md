# Design Document

## Overview

This document defines the architectural design for migrating the Subscription Dashboard application from SQLite WASM to Supabase (PostgreSQL). The migration maintains all existing functionality while transitioning to a cloud-based database solution that enables multi-device synchronization and prepares the application for future authentication features.

The design focuses on minimal disruption to existing components, maintaining the same DatabaseAdapter interface, and ensuring a smooth transition from client-side to cloud-based data storage.

## Architecture

### Current Architecture (SQLite WASM)
```
React Components
    ↓
useSubscriptions Hook
    ↓
DatabaseAdapter
    ↓
SQLite WASM (In-Memory)
```

### New Architecture (Supabase)
```
React Components
    ↓
useSubscriptions Hook
    ↓
DatabaseAdapter
    ↓
Supabase Client
    ↓
Supabase Cloud (PostgreSQL)
```

### Key Architectural Changes

1. **Database Layer**: Replace SQLite WASM with Supabase JavaScript client
2. **Data Storage**: Transition from in-memory/local storage to cloud-based PostgreSQL
3. **Connection Management**: Replace SQLite initialization with Supabase client creation
4. **Data Types**: Migrate from SQLite types (INTEGER, TEXT, REAL) to PostgreSQL types (UUID, TEXT, NUMERIC, BOOLEAN, TIMESTAMPTZ)
5. **Build Process**: Remove WASM-specific build steps and SharedArrayBuffer headers

## Component Design

### Supabase Client Configuration

**Location**: `src/db/supabase-client.ts` (new file)

**Responsibilities**:
- Create and export a singleton Supabase client instance
- Use environment variables from `src/config/env.ts`
- Provide type-safe client access throughout the application

**Implementation**:
```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '../config/supabase';
import type { Database } from './database.types';

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    const config = getSupabaseConfig();
    supabaseClient = createClient<Database>(config.url, config.apiKey);
  }
  return supabaseClient;
}
```

### Database Types

**Location**: `src/db/database.types.ts` (new file)

**Responsibilities**:
- Define TypeScript types for Supabase database schema
- Provide type safety for database operations
- Auto-generated from Supabase schema (or manually defined)

**Schema Definition**:
```typescript
export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string; // UUID
          name: string;
          subscription_date: string; // ISO 8601
          value: number;
          is_active: boolean;
          background_image: string | null;
          category: string;
          created_at: string; // ISO 8601
        };
        Insert: {
          id?: string;
          name: string;
          subscription_date: string;
          value: number;
          is_active: boolean;
          background_image?: string | null;
          category?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subscription_date?: string;
          value?: number;
          is_active?: boolean;
          background_image?: string | null;
          category?: string;
          created_at?: string;
        };
      };
    };
  };
}
```

### Updated DatabaseAdapter

**Location**: `src/db/adapter.ts` (modified)

**Responsibilities**:
- Provide the same CRUD interface as before
- Translate operations to Supabase queries
- Handle Supabase-specific errors
- Convert between Supabase types and application types

**Key Changes**:
- Replace SQLite `prepare()` and `step()` with Supabase query builder
- Change ID type from `number` to `string` (UUID)
- Use Supabase error handling instead of SQLite exceptions
- Convert PostgreSQL booleans to JavaScript booleans (no longer needed, native support)

**Method Implementations**:

```typescript
// getAll() - Retrieve all subscriptions
async getAll(): Promise<Subscription[]> {
  const { data, error } = await this.supabase
    .from('subscriptions')
    .select('*')
    .order('subscription_date', { ascending: false });
  
  if (error) throw new Error(`Failed to fetch subscriptions: ${error.message}`);
  
  return data.map(row => ({
    id: row.id,
    name: row.name,
    subscription_date: row.subscription_date,
    value: row.value,
    is_active: row.is_active,
    background_image: row.background_image || undefined,
    category: row.category || 'General',
  }));
}

// insert() - Create new subscription
async insert(subscription: Omit<Subscription, 'id'>): Promise<string> {
  const { data, error } = await this.supabase
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
  
  if (error) throw new Error(`Failed to insert subscription: ${error.message}`);
  
  return data.id;
}

// update() - Update existing subscription
async update(id: string, subscription: Omit<Subscription, 'id'>): Promise<boolean> {
  const { error } = await this.supabase
    .from('subscriptions')
    .update({
      name: subscription.name,
      subscription_date: subscription.subscription_date,
      value: subscription.value,
      is_active: subscription.is_active,
      background_image: subscription.background_image || null,
      category: subscription.category || 'General',
    })
    .eq('id', id);
  
  if (error) throw new Error(`Failed to update subscription: ${error.message}`);
  
  return true;
}

// delete() - Remove subscription
async delete(id: string): Promise<boolean> {
  const { error } = await this.supabase
    .from('subscriptions')
    .delete()
    .eq('id', id);
  
  if (error) throw new Error(`Failed to delete subscription: ${error.message}`);
  
  return true;
}

// getById() - Retrieve single subscription
async getById(id: string): Promise<Subscription | null> {
  const { data, error } = await this.supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to fetch subscription: ${error.message}`);
  }
  
  return {
    id: data.id,
    name: data.name,
    subscription_date: data.subscription_date,
    value: data.value,
    is_active: data.is_active,
    background_image: data.background_image || undefined,
    category: data.category || 'General',
  };
}
```

### Updated DatabaseProvider

**Location**: `src/db/DatabaseProvider.tsx` (modified)

**Responsibilities**:
- Initialize Supabase client on mount
- Verify connection to Supabase
- Provide DatabaseAdapter instance to components
- Handle initialization errors

**Key Changes**:
- Remove SQLite initialization logic
- Replace with Supabase client creation
- Simplify initialization (no WASM loading)
- Update error messages to reference Supabase

### Updated useDatabase Hook

**Location**: `src/hooks/useDatabase.ts` (modified)

**Responsibilities**:
- Manage database initialization state
- Create DatabaseAdapter instance
- Handle connection errors
- Provide retry functionality

**Key Changes**:
- Remove SQLite-specific initialization
- Simplify to just create Supabase client
- Update error handling for Supabase errors
- Remove WASM-related loading states

### Subscription Type Updates

**Location**: `src/types/subscription.ts` (modified)

**Changes**:
- Change `id` type from `number` to `string`
- All other fields remain the same
- Add optional `created_at` field for future use

```typescript
export interface Subscription {
  id: string; // Changed from number to string (UUID)
  name: string;
  subscription_date: string;
  value: number;
  is_active: boolean;
  background_image?: string;
  category?: string;
  created_at?: string; // New optional field
}
```

## Database Schema Design

### Supabase Migration SQL

**File**: `supabase/migrations/001_create_subscriptions_table.sql`

```sql
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_date TIMESTAMPTZ NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  background_image TEXT,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on subscription_date for sorting
CREATE INDEX idx_subscriptions_date ON subscriptions(subscription_date DESC);

-- Create index on category for filtering
CREATE INDEX idx_subscriptions_category ON subscriptions(category);

-- Enable Row Level Security (for future authentication)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (will be restricted with auth)
CREATE POLICY "Allow all operations for now" ON subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Schema Comparison

| Field | SQLite Type | Supabase Type | Notes |
|-------|-------------|---------------|-------|
| id | INTEGER (AUTOINCREMENT) | UUID | Changed to UUID for better distribution |
| name | TEXT | TEXT | No change |
| subscription_date | TEXT (ISO) | TIMESTAMPTZ | Proper timestamp with timezone |
| value | REAL | NUMERIC(10, 2) | Precise decimal for currency |
| is_active | INTEGER (0/1) | BOOLEAN | Native boolean support |
| background_image | TEXT | TEXT | No change |
| category | TEXT | TEXT | No change |
| created_at | TEXT (ISO) | TIMESTAMPTZ | Proper timestamp with timezone |

## Data Migration Strategy

### Seed Data Implementation

**Location**: `src/db/seedData.ts` (modified)

**Approach**:
1. Check if subscriptions table is empty
2. If empty, insert sample data using Supabase client
3. Use the same sample data as SQLite version
4. Handle errors gracefully (log but don't fail)

**Implementation**:
```typescript
export async function seedDatabase(supabase: SupabaseClient): Promise<void> {
  // Check if data exists
  const { count, error: countError } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('Failed to check subscription count:', countError);
    return;
  }
  
  if (count && count > 0) {
    console.log('Database already contains data, skipping seed');
    return;
  }
  
  // Insert sample data
  const sampleData = [
    {
      name: 'Netflix',
      subscription_date: '2024-01-15',
      value: 15.99,
      is_active: true,
      background_image: '/assets/subscriptions/netflix.svg',
      category: 'Entertainment'
    },
    // ... more sample data
  ];
  
  const { error } = await supabase
    .from('subscriptions')
    .insert(sampleData);
  
  if (error) {
    console.error('Failed to seed database:', error);
  } else {
    console.log(`✓ Seeded database with ${sampleData.length} subscriptions`);
  }
}
```

## Error Handling

### Supabase Error Types

1. **Network Errors**: Connection failures, timeouts
2. **Authentication Errors**: Invalid API key, expired tokens
3. **Query Errors**: Invalid SQL, constraint violations
4. **Not Found Errors**: Record doesn't exist (PGRST116)

### Error Handling Strategy

```typescript
function handleSupabaseError(error: PostgrestError): never {
  // Map Supabase error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    'PGRST116': 'Record not found',
    '23505': 'Duplicate entry',
    '23503': 'Referenced record does not exist',
    '42P01': 'Table does not exist',
  };
  
  const message = errorMessages[error.code] || error.message;
  throw new Error(message);
}
```

## Build Configuration Changes

### Vite Configuration Updates

**File**: `vite.config.ts`

**Changes to Remove**:
1. SQLite WASM copy plugin
2. COOP/COEP headers configuration
3. SharedArrayBuffer-related settings

**Simplified Configuration**:
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/payments/',
  build: {
    target: 'es2020',
  },
  // Remove: SQLite WASM plugin
  // Remove: Custom headers for SharedArrayBuffer
});
```

### Package.json Updates

**Dependencies to Remove**:
- `@sqlite.org/sqlite-wasm`

**Dependencies to Add**:
- `@supabase/supabase-js` (^2.39.0 or latest)

## Testing Strategy

### Unit Tests

**DatabaseAdapter Tests**:
- Mock Supabase client responses
- Test each CRUD operation
- Verify error handling
- Test data transformation

**Example Test Structure**:
```typescript
describe('DatabaseAdapter', () => {
  let adapter: DatabaseAdapter;
  let mockSupabase: jest.Mocked<SupabaseClient>;
  
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    adapter = new DatabaseAdapter(mockSupabase);
  });
  
  it('should fetch all subscriptions', async () => {
    mockSupabase.from().select().order.mockResolvedValue({
      data: [/* mock data */],
      error: null
    });
    
    const result = await adapter.getAll();
    expect(result).toHaveLength(2);
  });
  
  // More tests...
});
```

### Integration Tests

**Supabase Connection Tests**:
- Verify environment variables are loaded
- Test actual connection to Supabase (in CI/CD)
- Validate schema matches expectations

### Migration Validation

**Checklist**:
- [ ] All CRUD operations work with Supabase
- [ ] Data types are correctly handled
- [ ] Error messages are user-friendly
- [ ] Performance is acceptable
- [ ] No SQLite code remains in codebase

## Performance Considerations

### Query Optimization

1. **Indexes**: Create indexes on frequently queried columns (subscription_date, category)
2. **Select Specific Columns**: Only fetch needed columns (though `*` is fine for this app)
3. **Pagination**: Use Supabase's built-in pagination for large datasets
4. **Caching**: Consider implementing client-side caching for frequently accessed data

### Network Considerations

1. **Loading States**: Show loading indicators during async operations
2. **Error Recovery**: Implement retry logic for network failures
3. **Optimistic Updates**: Update UI immediately, sync with server in background
4. **Debouncing**: Debounce rapid updates to reduce API calls

## Security Considerations

### Current Implementation (No Auth)

- Use public anon key for all operations
- Row Level Security policy allows all operations
- No user-specific data isolation

### Future Authentication Preparation

- RLS policies are in place but permissive
- Schema supports adding `user_id` column later
- Supabase Auth can be integrated without schema changes

### API Key Security

- API keys stored in environment variables
- Never commit `.env` file to version control
- Use different keys for development and production

## Migration Checklist

### Code Changes
- [ ] Install @supabase/supabase-js
- [ ] Create supabase-client.ts
- [ ] Create database.types.ts
- [ ] Update DatabaseAdapter to use Supabase
- [ ] Update DatabaseProvider
- [ ] Update useDatabase hook
- [ ] Update Subscription type (id: string)
- [ ] Update seedData.ts
- [ ] Remove sqlite.ts
- [ ] Remove migrations.ts
- [ ] Remove localStorage-adapter.ts
- [ ] Remove hybrid-adapter.ts

### Configuration Changes
- [ ] Update vite.config.ts
- [ ] Update package.json
- [ ] Verify environment variables are set

### Database Setup
- [ ] Run Supabase migration SQL
- [ ] Verify table structure
- [ ] Test RLS policies
- [ ] Seed initial data

### Testing
- [ ] Update DatabaseAdapter tests
- [ ] Update integration tests
- [ ] Remove SQLite-specific tests
- [ ] Test all CRUD operations
- [ ] Test error handling

### Documentation
- [ ] Update DATABASE_SETUP.md
- [ ] Update README.md
- [ ] Update design.md in main spec
- [ ] Update architecture diagrams
- [ ] Document Supabase setup process

### Cleanup
- [ ] Remove SQLite WASM files from public/
- [ ] Remove SQLite test HTML files
- [ ] Remove unused imports
- [ ] Update comments and documentation

## Rollback Strategy

If issues arise during migration:

1. **Keep SQLite Code**: Don't delete SQLite files until Supabase is fully tested
2. **Feature Flag**: Use environment variable to toggle between SQLite and Supabase
3. **Backup Data**: Export existing data before migration
4. **Gradual Rollout**: Test with subset of users first

## Future Enhancements

### Authentication Integration
- Add user_id column to subscriptions table
- Update RLS policies to filter by user
- Implement Supabase Auth
- Add login/logout functionality

### Real-time Features
- Subscribe to subscription changes
- Live updates across devices
- Collaborative features

### Advanced Queries
- Full-text search on subscription names
- Complex filtering and sorting
- Analytics and reporting

## Technology Stack Updates

### New Dependencies
- **@supabase/supabase-js**: Official Supabase JavaScript client
- Provides type-safe database operations
- Includes authentication and real-time capabilities

### Removed Dependencies
- **@sqlite.org/sqlite-wasm**: No longer needed
- Reduces bundle size significantly
- Simplifies build process

## Flow Diagrams

### Supabase Initialization Flow
```
App starts
    ↓
Load environment variables
    ↓
Create Supabase client
    ↓
Verify connection
    ↓
Create DatabaseAdapter
    ↓
Check if database is empty
    ↓
Seed data if needed
    ↓
App ready
```

### CRUD Operation Flow (Example: Insert)
```
User submits form
    ↓
Component calls useSubscriptions.add()
    ↓
Hook calls adapter.insert()
    ↓
Adapter calls supabase.from('subscriptions').insert()
    ↓
Supabase sends request to PostgreSQL
    ↓
PostgreSQL inserts record
    ↓
Supabase returns new record with UUID
    ↓
Adapter returns UUID to hook
    ↓
Hook updates local state
    ↓
Component re-renders with new data
```

### Error Handling Flow
```
Database operation fails
    ↓
Supabase returns error object
    ↓
Adapter catches error
    ↓
Adapter maps error code to message
    ↓
Adapter throws formatted error
    ↓
Hook catches error
    ↓
Hook updates error state
    ↓
Component displays error toast
```

## Conclusion

This migration from SQLite WASM to Supabase represents a significant architectural shift from client-side to cloud-based data storage. The design maintains backward compatibility with existing components while enabling future features like authentication and real-time synchronization. The implementation focuses on minimal disruption, clear error handling, and maintaining the same developer experience for component authors.
