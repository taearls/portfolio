/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FEATURE_FLAGS_API_URL: string;
  readonly VITE_CONTACT_FORM_API_URL: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
