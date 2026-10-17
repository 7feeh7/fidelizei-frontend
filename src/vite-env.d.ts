/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_MOCK_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
