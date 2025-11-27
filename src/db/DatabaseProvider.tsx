import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { DatabaseAdapter } from './adapter';

interface DatabaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  adapter: DatabaseAdapter | null;
  retry: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const databaseState = useDatabase();

  return (
    <DatabaseContext.Provider value={databaseState}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabaseContext(): DatabaseContextType {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
}

// Loading component for database initialization
export function DatabaseLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Initializing Database
        </h2>
        <p className="text-gray-600">
          Setting up your subscription data...
        </p>
      </div>
    </div>
  );
}

// Error component for database initialization failures
export function DatabaseErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Database Error
        </h2>
        <p className="text-gray-600 mb-4">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}