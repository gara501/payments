import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { applyMigrations, needsMigration, validateSchema, isFreshDatabase } from './migrations';

export interface Database {
  exec(sql: string): void;
  prepare(sql: string): Statement;
  close(): void;
}

export interface Statement {
  bind(params: any[]): void;
  step(): boolean;
  get(options?: any): any;
  getColumnNames(): string[];
  finalize(): void;
}

let db: any = null;

export async function initializeDatabase(): Promise<Database> {
  if (db) {
    return db as Database;
  }

  try {
    const sqlite3 = await sqlite3InitModule({
      print: console.log,
      printErr: console.error,
    });

    // Create an in-memory database for the web app
    db = new sqlite3.oo1.DB(':memory:');

    // Apply database migrations
    await runMigrations();

    console.log('SQLite database initialized successfully');
    return db as Database;
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error);
    throw new Error('Database initialization failed');
  }
}

async function runMigrations(): Promise<void> {
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    console.log('Checking database migration status...');

    // Check if migrations are needed
    const migrationNeeded = needsMigration(db);

    if (migrationNeeded) {
      console.log('Database migrations required, applying...');
      applyMigrations(db);
    } else {
      console.log('Database is up to date');
    }

    // Validate the final schema
    const isValid = validateSchema(db);
    if (!isValid) {
      throw new Error('Database schema validation failed after migration');
    }

    // Check if this is a fresh database and seed with initial data if empty
    const isFresh = isFreshDatabase(db);
    if (isFresh) {
      console.log('Fresh database detected, seeding with initial data...');
      await seedInitialData();
    } else {
      console.log('Existing database detected, skipping initial data seed');
    }

    console.log('Database migration and setup completed successfully');
  } catch (error) {
    console.error('Failed to run database migrations:', error);
    throw error;
  }
}

async function seedInitialData(): Promise<void> {
  try {
    // Check if table has any data
    const checkDataStmt = db.prepare('SELECT COUNT(*) as count FROM subscriptions');
    checkDataStmt.step();
    const result = checkDataStmt.get({});
    checkDataStmt.finalize();

    if (result.count === 0) {
      console.log('Seeding database with initial subscription data...');

      // Insert sample subscriptions
      const insertStmt = db.prepare(`
        INSERT INTO subscriptions (name, subscription_date, value, is_active, background_image, category)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const sampleData = [
        ['Netflix', '2024-01-15', 15.99, 1, '/assets/subscriptions/netflix.svg', 'Entertainment'],
        ['Spotify Premium', '2024-02-01', 9.99, 1, '/assets/subscriptions/spotify.svg', 'Entertainment'],
        ['Adobe Creative Cloud', '2024-01-01', 52.99, 1, '/assets/subscriptions/adobe.svg', 'Productivity'],
        ['GitHub Pro', '2024-03-01', 4.00, 0, '/assets/subscriptions/github.svg', 'Productivity'],
        ['Microsoft 365', '2024-04-01', 12.99, 1, '/assets/subscriptions/microsoft.svg', 'Productivity'],
        ['Dropbox Plus', '2024-05-01', 9.99, 1, '/assets/subscriptions/dropbox.svg', 'Productivity'],
        ['Figma Professional', '2024-06-01', 12.00, 1, '/assets/subscriptions/figma.svg', 'Productivity'],
        ['Notion Pro', '2024-07-01', 8.00, 1, '/assets/subscriptions/notion.svg', 'Productivity'],
        ['Slack Pro', '2024-08-01', 6.67, 1, '/assets/subscriptions/slack.svg', 'Productivity'],
        ['Zoom Pro', '2024-09-01', 14.99, 1, '/assets/subscriptions/zoom.svg', 'Productivity'],
        ['Canva Pro', '2024-10-01', 12.99, 1, '/assets/subscriptions/canva.svg', 'Productivity'],
        ['LastPass Premium', '2024-11-01', 3.00, 0, '/assets/subscriptions/lastpass.svg', 'Finance'],
        ['Disney Plus', '2024-12-01', 7.99, 1, '/assets/subscriptions/disney.png', 'Entertainment'],
        ['Amazon Prime', '2025-01-01', 14.98, 1, '/assets/subscriptions/prime.png', 'General'],
        ['YouTube Premium', '2025-02-01', 11.99, 1, '/assets/subscriptions/youtube.png', 'Entertainment'],
      ];

      sampleData.forEach(([name, date, value, active, image, category]) => {
        insertStmt.bind([name, date, value, active, image, category]);
        insertStmt.step();
        insertStmt.reset();
      });

      insertStmt.finalize();
      console.log(`✓ Seeded database with ${sampleData.length} initial subscriptions`);
    } else {
      console.log('Database already contains data, skipping initial seed');
    }
  } catch (error) {
    console.error('Failed to seed initial data:', error);
    // Don't throw here - table creation succeeded, seeding is optional
  }
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db as Database;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}