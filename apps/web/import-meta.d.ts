interface ImportMetaEnv {
  readonly NEXT_PUBLIC_GRAPHQL_ENDPOINT?: string;
  readonly NEXT_PUBLIC_WORLD_API_ENDPOINT?: string;
  readonly NEXT_PUBLIC_WORLD_PACKAGE_ID?: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
