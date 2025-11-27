/**
 * Environment variables configuration
 * 
 * Vite exposes env variables through import.meta.env
 * Only variables prefixed with VITE_ are exposed to the client
 */

declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_API_KEY: string;
    readonly VITE_JIRA_API_TOKEN: string;
    // Add more environment variables here as needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Export typed environment variables
export const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    apiKey: import.meta.env.VITE_SUPABASE_API_KEY || '',
  },
  jira: {
    apiToken: import.meta.env.VITE_JIRA_API_TOKEN || '',
  },
} as const;

// Validation function to ensure required env vars are present
export function validateEnv(): void {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_API_KEY',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `Warning: Missing environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file.'
    );
  }
}

// Run validation in development
if (import.meta.env.DEV) {
  validateEnv();
}
