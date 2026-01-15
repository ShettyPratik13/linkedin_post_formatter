/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GTM_ID: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    __GTM_LOADED__: boolean;
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export {};
