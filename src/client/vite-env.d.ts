// biome-ignore-all lint/correctness/noUnusedVariables: import and export distructs ImportMetaEnv type extension

interface ImportMetaEnv {
  readonly VITE_APP_ID: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_KEYWORDS: string;
  readonly VITE_APP_HOSTNAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
