/**
 * Firebase Module — Centralized App Initialization
 *
 * Firebase credentials are loaded from environment variables at build time
 * via Vite's import.meta.env (VITE_* prefix).
 *
 * Local development: set values in `.env` (gitignored)
 * Production:        set in Cloudflare Pages → Settings → Environment Variables
 */
export const FIREBASE_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Singleton Firebase app + DB instance
let _app = null;
let _db  = null;

/**
 * Lazy-loads Firebase SDK and initializes the app singleton.
 * Safe to call multiple times — returns cached instances after first call.
 * Only resolves after SDK modules are downloaded (never on main page load).
 */
export async function initFirebase() {
  if (_app && _db) return { app: _app, db: _db };

  // Validate config before attempting to connect
  if (!FIREBASE_CONFIG.apiKey) {
    console.warn(
      '[Firebase] Config not set. Add VITE_FIREBASE_* variables to your .env file ' +
      'and to Cloudflare Pages → Settings → Environment Variables.'
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
    _app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
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
