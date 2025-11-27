import type { Database } from './sqlite';

export interface Migration {
  version: number;
  name: string;
  up: (db: Database) => void;
  down?: (db: Database) => void;
}

// Database schema version tracking
const CURRENT_SCHEMA_VERSION = 2;

// Migration definitions
const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: (db: Database) => {
      // Create subscriptions table
      db.exec(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          subscription_date TEXT NOT NULL,
          value REAL NOT NULL,
          is_active INTEGER NOT NULL DEFAULT 1,
          background_image TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create index for performance
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_subscriptions_date 
        ON subscriptions(subscription_date DESC);
      `);

      console.log('✓ Applied migration: initial_schema (v1)');
    },
    down: (db: Database) => {
      db.exec('DROP INDEX IF EXISTS idx_subscriptions_date;');
      db.exec('DROP TABLE IF EXISTS subscriptions;');
    }
  },
  {
    version: 2,
    name: 'add_category_column',
    up: (db: Database) => {
      // Add category column with default value 'General'
      db.exec(`ALTER TABLE subscriptions ADD COLUMN category TEXT DEFAULT 'General';`);
      
      // Update existing records to have 'General' category if null
      db.exec(`UPDATE subscriptions SET category = 'General' WHERE category IS NULL;`);
      
      console.log('✓ Applied migration: add_category_column (v2)');
    },
    down: (_db: Database) => {
      // SQLite doesn't support DROP COLUMN directly
      // Would need to recreate table without category column
      console.log('Note: SQLite does not support dropping columns. Manual intervention required for rollback.');
    }
  }
];

/**
 * Initialize or create the schema_version table to track migrations
 */
function initializeVersionTable(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
      migration_name TEXT NOT NULL
    );
  `);
}

/**
 * Get the current database schema version
 */
function getCurrentVersion(db: Database): number {
  try {
    const stmt = db.prepare('SELECT MAX(version) as version FROM schema_version');
    stmt.step();
    const result = stmt.get({});
    stmt.finalize();
    
    return result.version || 0;
  } catch (error) {
    // Table doesn't exist yet, return 0
    return 0;
  }
}

/**
 * Record a migration as applied
 */
function recordMigration(db: Database, migration: Migration): void {
  const stmt = db.prepare(`
    INSERT INTO schema_version (version, migration_name)
    VALUES (?, ?)
  `);
  
  stmt.bind([migration.version, migration.name]);
  stmt.step();
  stmt.finalize();
}

/**
 * Check if database needs migration
 */
export function needsMigration(db: Database): boolean {
  try {
    initializeVersionTable(db);
    const currentVersion = getCurrentVersion(db);
    return currentVersion < CURRENT_SCHEMA_VERSION;
  } catch (error) {
    console.error('Error checking migration status:', error);
    return true; // Assume migration needed if we can't check
  }
}

/**
 * Apply all pending migrations
 */
export function applyMigrations(db: Database): void {
  try {
    initializeVersionTable(db);
    const currentVersion = getCurrentVersion(db);
    
    console.log(`Current database version: ${currentVersion}, target version: ${CURRENT_SCHEMA_VERSION}`);
    
    if (currentVersion >= CURRENT_SCHEMA_VERSION) {
      console.log('✓ Database is up to date, no migrations needed');
      return;
    }
    
    // Apply migrations in order
    const pendingMigrations = migrations.filter(m => m.version > currentVersion);
    
    if (pendingMigrations.length === 0) {
      console.log('✓ No pending migrations found');
      return;
    }
    
    console.log(`Applying ${pendingMigrations.length} pending migration(s)...`);
    
    // Sort migrations by version to ensure correct order
    pendingMigrations.sort((a, b) => a.version - b.version);
    
    for (const migration of pendingMigrations) {
      console.log(`Applying migration: ${migration.name} (v${migration.version})`);
      
      try {
        // Apply the migration
        migration.up(db);
        
        // Record that this migration was applied
        recordMigration(db, migration);
        
        console.log(`✓ Successfully applied migration: ${migration.name} (v${migration.version})`);
      } catch (error) {
        console.error(`✗ Failed to apply migration: ${migration.name} (v${migration.version})`, error);
        throw new Error(`Migration failed: ${migration.name} - ${error}`);
      }
    }
    
    console.log('✓ All migrations applied successfully');
  } catch (error) {
    console.error('Migration process failed:', error);
    throw error;
  }
}

/**
 * Get migration history
 */
export function getMigrationHistory(db: Database): Array<{version: number, name: string, appliedAt: string}> {
  try {
    initializeVersionTable(db);
    
    const stmt = db.prepare(`
      SELECT version, migration_name as name, applied_at as appliedAt
      FROM schema_version 
      ORDER BY version ASC
    `);
    
    const history: Array<{version: number, name: string, appliedAt: string}> = [];
    
    while (stmt.step()) {
      const row = stmt.get({});
      history.push({
        version: row.version,
        name: row.name,
        appliedAt: row.appliedAt
      });
    }
    
    stmt.finalize();
    return history;
  } catch (error) {
    console.error('Failed to get migration history:', error);
    return [];
  }
}

/**
 * Validate database schema matches expected structure
 */
export function validateSchema(db: Database): boolean {
  try {
    // Check if subscriptions table exists with correct structure
    const stmt = db.prepare(`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='subscriptions'
    `);
    
    if (!stmt.step()) {
      console.error('Subscriptions table not found');
      stmt.finalize();
      return false;
    }
    
    const result = stmt.get({});
    stmt.finalize();
    
    const tableSql = result.sql;
    
    // Check for required columns
    const requiredColumns = ['id', 'name', 'subscription_date', 'value', 'is_active', 'category'];
    const hasAllColumns = requiredColumns.every(col => 
      tableSql.toLowerCase().includes(col.toLowerCase())
    );
    
    if (!hasAllColumns) {
      console.error('Subscriptions table missing required columns');
      return false;
    }
    
    // Check if index exists
    const indexStmt = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND name='idx_subscriptions_date'
    `);
    
    const hasIndex = indexStmt.step();
    indexStmt.finalize();
    
    if (!hasIndex) {
      console.error('Required index idx_subscriptions_date not found');
      return false;
    }
    
    console.log('✓ Database schema validation passed');
    return true;
  } catch (error) {
    console.error('Schema validation failed:', error);
    return false;
  }
}

/**
 * Get current schema version
 */
export function getSchemaVersion(): number {
  return CURRENT_SCHEMA_VERSION;
}

/**
 * Check if database is fresh (no data)
 */
export function isFreshDatabase(db: Database): boolean {
  try {
    // Check if schema_version table exists and has any records
    const versionStmt = db.prepare(`
      SELECT COUNT(*) as count FROM sqlite_master 
      WHERE type='table' AND name='schema_version'
    `);
    versionStmt.step();
    const versionTableExists = versionStmt.get({}).count > 0;
    versionStmt.finalize();
    
    if (!versionTableExists) {
      return true; // No version table = fresh database
    }
    
    // Check if subscriptions table has any data
    const dataStmt = db.prepare('SELECT COUNT(*) as count FROM subscriptions');
    dataStmt.step();
    const hasData = dataStmt.get({}).count > 0;
    dataStmt.finalize();
    
    return !hasData; // Fresh if no data
  } catch (error) {
    // If we can't check, assume it's fresh
    return true;
  }
}