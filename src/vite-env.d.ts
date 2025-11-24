/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_FEATURE_FLAGS_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
