# Supabase Adapter Tests

## Prerequisites

Before running the Supabase adapter tests, you need to set up the database table in your Supabase project.

### Step 1: Verify Current Setup

Run the verification script to check if your Supabase database is ready:

```bash
npx vite-node src/db/verify-supabase-setup.ts
```

### Step 2: Create the Subscriptions Table

If the verification fails, you need to create the table:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (URL: https://hwwqacwadszubjqlhtse.supabase.co)
3. Navigate to **SQL Editor** in the left sidebar
4. Copy the SQL from `src/db/setup-supabase-table.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute the SQL

### Step 3: Verify Setup Again

After creating the table, run the verification script again:

```bash
npx vite-node src/db/verify-supabase-setup.ts
```

You should see:
```
✅ Successfully connected to Supabase
✅ Table structure is correct
✅ Found X existing subscription(s)
✅ Insert operation successful
✅ Delete operation successful
🎉 All checks passed! Supabase is set up correctly.
```

### Step 4: Run the Tests

Once verification passes, you can run the Supabase adapter tests:

```bash
# Run all Supabase adapter tests
npm run test:run -- src/db/__tests__/supabase-adapter.test.ts

# Or run all database tests
npm run test:run -- src/db/__tests__/
```

## What the Tests Cover

The test suite validates all CRUD operations against the real Supabase database:

### Insert (Add) Operations
- ✅ Insert subscription with all fields
- ✅ Insert subscription with minimal required fields
- ✅ Insert multiple subscriptions

### Update (Modify) Operations
- ✅ Update all fields of a subscription
- ✅ Update specific fields only
- ✅ Toggle is_active status
- ✅ Handle non-existent subscription updates

### Delete Operations
- ✅ Delete existing subscription
- ✅ Delete multiple subscriptions
- ✅ Handle non-existent subscription deletions

### Read Operations
- ✅ Get all subscriptions (ordered by date)
- ✅ Get subscription by ID
- ✅ Handle non-existent subscription retrieval

### Utility Operations
- ✅ Check database connection
- ✅ Get table statistics (total, active, inactive counts)

## Test Data Cleanup

The tests automatically clean up all test data in the `afterEach` hook, so your Supabase database won't be polluted with test subscriptions.

## Troubleshooting

### Error: "Could not find the table 'public.subscriptions'"

This means the table hasn't been created yet. Follow Steps 1-3 above.

### Error: "Failed to fetch subscriptions"

Check your `.env` file to ensure the Supabase credentials are correct:
```
VITE_SUPABASE_URL=https://hwwqacwadszubjqlhtse.supabase.co
VITE_SUPABASE_API_KEY=your-api-key-here
```

### Tests are slow

The tests run against a real Supabase database, so network latency affects test speed. This is expected for integration tests.

## Next Steps

After the tests pass:
1. ✅ Mark task "Test add, delete, modify subscription against supabase data" as complete
2. ⏭️ Move to next task: "Modify tests to support supabase connection"
