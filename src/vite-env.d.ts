/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_API_KEY: string;
  // Add more environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
