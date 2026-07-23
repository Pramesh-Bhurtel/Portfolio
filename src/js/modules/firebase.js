/**
 * Firebase Module — Centralized App Initialization
 * 
 * Configured & Active for: portfoliocms-22b8a
 * Realtime Database Region: asia-southeast1
 */
export const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCW2Nls3h1F1TP5RYCfI99-rX1a23FvTUM",
  authDomain:        "portfoliocms-22b8a.firebaseapp.com",
  databaseURL:       "https://portfoliocms-22b8a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "portfoliocms-22b8a",
  storageBucket:     "portfoliocms-22b8a.firebasestorage.app",
  messagingSenderId: "390165062886",
  appId:             "1:390165062886:web:32e88b072dc2a8942a0727",
  measurementId:     "G-4RPR63DRCG"
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
  if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
    console.warn(
      '[Firebase] Config not set. Open src/js/modules/firebase.js and replace the placeholder values.'
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
