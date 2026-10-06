/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_EMERGENCY_NUMBER?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
