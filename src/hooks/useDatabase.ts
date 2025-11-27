import { useState, useEffect, useCallback } from 'react';
import { DatabaseAdapter } from '../db';

interface DatabaseState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  adapter: DatabaseAdapter | null;
}

export function useDatabase() {
  const [state, setState] = useState<DatabaseState>({
    isInitialized: false,
    isLoading: true,
    error: null,
    adapter: null,
  });

  const initialize = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Create Supabase adapter
      const adapter = new DatabaseAdapter();
      
      // Verify the connection and table structure
      const isConnected = await adapter.checkConnection();
      if (!isConnected) {
        throw new Error('Database connection verification failed');
      }
      
      const isStructureValid = await adapter.verifyTableStructure();
      if (!isStructureValid) {
        throw new Error('Database table structure verification failed');
      }
      
      // Validate schema
      const isSchemaValid = await adapter.validateDatabaseSchema();
      if (!isSchemaValid) {
        throw new Error('Database schema validation failed');
      }
      
      // Log database info
      const dbInfo = await adapter.getDatabaseInfo();
      console.log(`Database ready: ${dbInfo.stats.totalCount} subscriptions (${dbInfo.stats.activeCount} active, ${dbInfo.stats.inactiveCount} inactive)`);
      
      setState({
        isInitialized: true,
        isLoading: false,
        error: null,
        adapter,
      });
      
      console.log('Database initialized and ready');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      setState({
        isInitialized: false,
        isLoading: false,
        error: errorMessage,
        adapter: null,
      });
      console.error('Database initialization failed:', error);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const retry = useCallback(() => {
    initialize();
  }, [initialize]);

  return {
    ...state,
    retry,
  };
}