/**
 * Firebase Sync Module — Real-Time CRUD Pipeline
 *
 * Provides full Create / Read / Update / Delete operations
 * against Firebase Realtime Database with localStorage fallback.
 *
 * Storage layout:
 *   portfolio/
 *     projects/         ← ordered array of project objects
 *     config/           ← hero greeting, title, bio, skills
 *     metrics/
 *       total_visits    ← incremented on each portfolio page load
 *       cv_downloads    ← incremented on each CV download
 *       form_submissions← incremented on each contact form send
 *       active_sessions ← ephemeral connected-device count
 */

import { initFirebase } from './firebase.js';

const LS_PROJECTS = 'cms_projects';
const LS_CONFIG   = 'cms_config';
const LS_LOGS     = 'cms_logs';

const DB_ROOT = 'portfolio';

// ── Internal helpers ────────────────────────────────────────────────

/** Safe JSON parse with fallback */
function safeParse(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

/** Write to localStorage as offline fallback */
function lsSave(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Exported API ────────────────────────────────────────────────────

/**
 * Reads projects from Firebase. Falls back to localStorage if offline.
 * @returns {Promise<Array>}
 */
export async function fetchProjects() {
  const { db } = await initFirebase();
  if (db) {
    try {
      const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
      const snapshot = await get(ref(db, `${DB_ROOT}/projects`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Firebase stores arrays as objects — convert back to ordered array
        const arr = Array.isArray(data) ? data : Object.values(data);
        lsSave(LS_PROJECTS, arr); // sync to localStorage
        return arr;
      }
    } catch (err) {
      console.warn('[Firebase] fetchProjects failed, using localStorage:', err);
    }
  }
  return safeParse(localStorage.getItem(LS_PROJECTS), []);
}

/**
 * Saves the entire projects array to Firebase + localStorage (Dual-Write).
 * @param {Array} projects
 * @returns {Promise<boolean>} true on success
 */
export async function saveProjects(projects) {
  lsSave(LS_PROJECTS, projects); // always write locally first

  const { db } = await initFirebase();
  if (db) {
    try {
      const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
      await set(ref(db, `${DB_ROOT}/projects`), projects);
      return true;
    } catch (err) {
      console.error('[Firebase] saveProjects failed:', err);
    }
  }
  return false; // offline — localStorage only
}

/**
 * Reads global config from Firebase. Falls back to localStorage.
 * @returns {Promise<Object>}
 */
export async function fetchConfig() {
  const { db } = await initFirebase();
  if (db) {
    try {
      const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
      const snapshot = await get(ref(db, `${DB_ROOT}/config`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        lsSave(LS_CONFIG, data);
        return data;
      }
    } catch (err) {
      console.warn('[Firebase] fetchConfig failed, using localStorage:', err);
    }
  }
  return safeParse(localStorage.getItem(LS_CONFIG), {});
}

/**
 * Saves global config to Firebase + localStorage.
 * @param {Object} config
 * @returns {Promise<boolean>}
 */
export async function saveConfig(config) {
  lsSave(LS_CONFIG, config);

  const { db } = await initFirebase();
  if (db) {
    try {
      const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
      await set(ref(db, `${DB_ROOT}/config`), config);
      return true;
    } catch (err) {
      console.error('[Firebase] saveConfig failed:', err);
    }
  }
  return false;
}

/**
 * Binds a real-time listener to the projects node.
 * Calls `callback(projects[])` immediately and on every change.
 * @param {Function} callback
 * @returns {Promise<Function>} unsubscribe function
 */
export async function onProjectsChange(callback) {
  const { db } = await initFirebase();
  if (!db) {
    // Offline — fire once from localStorage and return no-op unsubscribe
    callback(safeParse(localStorage.getItem(LS_PROJECTS), []));
    return () => {};
  }

  // Firebase v10 modular: onValue() returns the unsubscribe function directly.
  // The compat off() API is NOT used in the modular SDK.
  const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
  const projectsRef = ref(db, `${DB_ROOT}/projects`);

  const detach = onValue(projectsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const arr = Array.isArray(data) ? data : Object.values(data);
      lsSave(LS_PROJECTS, arr);
      callback(arr);
    } else {
      const local = safeParse(localStorage.getItem(LS_PROJECTS), null);
      if (local && local.length) callback(local);
    }
  }, (err) => {
    console.error('[Firebase] onProjectsChange error:', err);
    callback(safeParse(localStorage.getItem(LS_PROJECTS), []));
  });

  return detach; // call detach() to stop listening
}

/**
 * Binds a real-time listener to the metrics node.
 * Calls `callback(metrics{})` immediately and on every change.
 * @param {Function} callback
 * @returns {Promise<Function>} unsubscribe function
 */
export async function onMetricsChange(callback) {
  const { db } = await initFirebase();
  if (!db) {
    callback({ total_visits: '—', cv_downloads: '—', form_submissions: '—', active_sessions: '—' });
    return () => {};
  }

  const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
  const metricsRef = ref(db, `${DB_ROOT}/metrics`);

  // Firebase v10 modular: onValue() returns the unsubscribe/detach function directly.
  const detach = onValue(metricsRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : {});
  }, (err) => {
    console.error('[Firebase] onMetricsChange error:', err);
    callback({});
  });

  return detach; // call detach() to stop listening
}

/**
 * Atomically increments a metric counter in Firebase.
 * Uses Firebase serverValue.increment for race-condition-safe counting.
 * @param {'total_visits'|'cv_downloads'|'form_submissions'} metric
 */
export async function incrementMetric(metric) {
  const { db } = await initFirebase();
  if (!db) return;

  try {
    const { ref, runTransaction } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
    const metricRef = ref(db, `${DB_ROOT}/metrics/${metric}`);
    await runTransaction(metricRef, (current) => (current || 0) + 1);
  } catch (err) {
    console.error(`[Firebase] incrementMetric(${metric}) failed:`, err);
  }
}

/**
 * Reads metrics once (for initial render).
 * @returns {Promise<Object>}
 */
export async function fetchMetrics() {
  const { db } = await initFirebase();
  if (!db) return {};

  try {
    const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
    const snapshot = await get(ref(db, `${DB_ROOT}/metrics`));
    return snapshot.exists() ? snapshot.val() : {};
  } catch (err) {
    console.error('[Firebase] fetchMetrics failed:', err);
    return {};
  }
}
