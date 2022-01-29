/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare-workers/globals" />
/// <reference types="@cloudflare/workers-types" />
export type Film = {
  title: string;
  slug: string;
  releaseDate: Date;
};

declare global {
  const GRAPHQL_ENDPOINT: string;
  const GRAPHQL_TOKEN: string;
}
