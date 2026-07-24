/**
 * Cloudflare Worker — Portfolio Edge Handler
 *
 * This Worker serves two purposes:
 *  1. Dynamically exposes Firebase configuration from encrypted Worker Secrets
 *     at the /firebase-config.js endpoint (secrets never committed to source).
 *  2. Passes all other requests through to static assets in the dist/ directory.
 *
 * Worker Secrets are set via:
 *   - Cloudflare Dashboard → Workers & Pages → portfolio → Settings → Variables & Secrets
 *   - OR: wrangler secret put FIREBASE_API_KEY  (and repeat for each var)
 *
 * Required secrets (add all in Cloudflare dashboard as type "Secret"):
 *   FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL,
 *   FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET,
 *   FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── Serve Firebase config from Worker Secrets ──────────────────────
    // This endpoint is fetched at runtime by the frontend firebase.js module.
    // Secrets are injected by Cloudflare at runtime — never stored in source code.
    if (url.pathname === '/firebase-config.js') {
      const config = JSON.stringify({
        apiKey:            env.FIREBASE_API_KEY            ?? '',
        authDomain:        env.FIREBASE_AUTH_DOMAIN        ?? '',
        databaseURL:       env.FIREBASE_DATABASE_URL       ?? '',
        projectId:         env.FIREBASE_PROJECT_ID         ?? '',
        storageBucket:     env.FIREBASE_STORAGE_BUCKET     ?? '',
        messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID ?? '',
        appId:             env.FIREBASE_APP_ID             ?? '',
        measurementId:     env.FIREBASE_MEASUREMENT_ID     ?? '',
      });

      return new Response(`export default ${config};`, {
        status: 200,
        headers: {
          'Content-Type':           'application/javascript; charset=utf-8',
          'Cache-Control':          'no-store, no-cache, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
          'X-Robots-Tag':           'noindex',
        },
      });
    }

    // ── All other requests → static assets ────────────────────────────
    return env.ASSETS.fetch(request);
  },
};
