/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Vite environment variables
  readonly VITE_FEATURE_FLAGS_API_URL: string;
  readonly VITE_CONTACT_FORM_API_URL: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;

  // Build-time feature flags (from flipt.yaml via vite-plugin-feature-flags)
  // These enable Rollup to tree-shake disabled feature code
  readonly FEATURE_EMAIL_CONTACT_FORM: boolean;
  readonly FEATURE_DARK_MODE_TOGGLE: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
