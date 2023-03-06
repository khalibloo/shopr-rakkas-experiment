import altConfig from "../.altrc";

export default {
  env: import.meta.env.RAKKAS_APP_ENV,
  apiEndpoint: import.meta.env.RAKKAS_API_URI,
  siteName: import.meta.env.RAKKAS_SITE_NAME,
  siteDescription: import.meta.env.RAKKAS_SITE_DESCRIPTION,
  sentryDSN: import.meta.env.RAKKAS_SENTRY_DSN,
  gtmEnabled: import.meta.env.RAKKAS_GTM_CODE,
  meiliSearchKey: import.meta.env.RAKKAS_MEILISEARCH_KEY,
  meiliSearchUrl: import.meta.env.RAKKAS_MEILISEARCH_URL ? new URL(import.meta.env.RAKKAS_MEILISEARCH_URL) : undefined,
  altConfig,
};
