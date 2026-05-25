[worker.js](https://github.com/user-attachments/files/27862447/worker.js)
/**
 * JIIB$CORE SYNC — Cloudflare Worker entry
 * Serves the same index.html for any path so the in-page JS can read the
 * URL slug (e.g. /nakyessa) and load the right school.
 *
 * Bind your static assets in wrangler.toml:
 *
 *   name = "jiibscoresync"
 *   main = "worker.js"
 *   compatibility_date = "2025-01-01"
 *   [assets]
 *   directory = "./public"
 *   not_found_handling = "single-page-application"
 *
 * With `not_found_handling = "single-page-application"` Cloudflare already
 * does SPA fallback automatically and you don't even need this worker —
 * but keeping it gives you a place to add headers/redirects later.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Try real asset first (index.html, /jiib.png, /manifest.json, /assets/*)
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return assetResponse;

    // SPA fallback: any unknown path returns index.html
    return env.ASSETS.fetch(new Request(new URL("/", url), request));
  },
};
