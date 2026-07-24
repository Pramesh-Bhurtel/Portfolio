/**
 * Firebase Module — Centralized App Initialization
 *
 * Security Architecture:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  LOCAL DEV  → reads VITE_FIREBASE_* from .env (gitignored)     │
 * │  PRODUCTION → fetches /firebase-config.js served by the        │
 * │               Cloudflare Worker from encrypted Worker Secrets   │
 * │               (secrets never committed or visible in source)    │
 * └─────────────────────────────────────────────────────────────────┘
 */

// Singleton Firebase app + DB instance
let _app = null;
let _db  = null;

/**
 * Load Firebase config:
 *  - Production (Cloudflare Worker): fetches /firebase-config.js at runtime.
 *    Credentials are injected by the Worker from encrypted Worker Secrets.
 *  - Development (Vite dev server): reads VITE_FIREBASE_* from .env file.
 *    import.meta.env.DEV is replaced with `false` at build time → Rollup
 *    dead-code eliminates this branch so NO credentials appear in dist/.
 */
async function _loadConfig() {
  // import.meta.env.DEV === true only during Vite dev server.
  // Rollup replaces it with `false` in the production build and eliminates
  // the entire block below, so no VITE_* values ever reach dist/.
  if (import.meta.env.DEV) {
    return {
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };
  }

  // Production: fetch from the Cloudflare Worker endpoint.
  // The Worker reads secrets from Cloudflare encrypted Worker Secrets at runtime.
  try {
    const mod = await import('/firebase-config.js');
    return mod.default;
  } catch (err) {
    console.error('[Firebase] Failed to load runtime config from /firebase-config.js:', err);
    return null;
  }
}

/**
 * Lazy-loads Firebase SDK and initializes the app singleton.
 * Safe to call multiple times — returns cached instances after first call.
 * Only resolves after SDK modules are downloaded (never on main page load).
 */
export async function initFirebase() {
  if (_app && _db) return { app: _app, db: _db };

  const config = await _loadConfig();

  if (!config?.apiKey) {
    console.warn(
      '[Firebase] Config not available.\n' +
      '  Local dev: check your .env file has VITE_FIREBASE_* variables set.\n' +
      '  Production: check Worker Secrets are set in Cloudflare Dashboard.'
    );
    return { app: null, db: null };
  }

  try {
    // Dynamic CDN import — never loaded on the main portfolio page
    const { initializeApp, getApps } = await import(
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'
    );
    const { getDatabase } = await import(
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js'
    );

    // Prevent duplicate app initialization on hot-reloads
    _app = getApps().length ? getApps()[0] : initializeApp(config);
    _db  = getDatabase(_app);

    console.info('[Firebase] Connected ✓');
    return { app: _app, db: _db };
  } catch (err) {
    console.error('[Firebase] Initialization failed:', err);
    return { app: null, db: null };
  }
}

/** Returns the cached database instance (null if not yet initialized). */
export function getDB() { return _db; }

/** Returns the cached app instance (null if not yet initialized). */
export function getApp() { return _app; }
