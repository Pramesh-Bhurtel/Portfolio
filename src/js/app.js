import { initTypingEffect } from './modules/typing.js';
import { initGrains } from './modules/grains.js';
import { initOrbitAnimations } from './modules/orbit.js';
import { initNavigation } from './modules/navigation.js';
import { initScrollReveal, initScrollProgress, initScrollAnimations, initScrollTop } from './modules/scroll.js';
import { initContactForm } from './modules/contact.js';
import { initDownload } from './modules/download.js';
import { initAdminModal } from './modules/adminModal.js';
import { initCmsSync } from './modules/cmsSync.js';
import { initQoL } from './modules/qol.js';
import { initCursor } from './modules/cursor.js';
import { prefersReducedMotion } from './modules/dom.js';
import { showError } from './modules/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  if (prefersReducedMotion()) {
    document.body.classList.add('reduced-motion');
  }

  const safeInit = (name, fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`Module initialization failed: ${name}`, err);
    }
  };

  safeInit('CMS Sync', initCmsSync);
  safeInit('QoL', initQoL);
  safeInit('Cursor', initCursor);
  safeInit('Navigation', initNavigation);
  safeInit('Typing', initTypingEffect);
  safeInit('Grains', initGrains);
  safeInit('Orbit', initOrbitAnimations);
  
  safeInit('Scroll Reveal', initScrollReveal);
  safeInit('Scroll Progress', initScrollProgress);
  safeInit('Scroll Animations', initScrollAnimations);
  safeInit('Scroll Top', initScrollTop);
  
  safeInit('Contact', initContactForm);
  safeInit('Download', initDownload);
  safeInit('Admin Modal', initAdminModal);

  // Fire page-view metric to Firebase (lazy, non-blocking — never impacts LCP)
  import('./modules/firebaseSync.js')
    .then(m => m.incrementMetric('total_visits'))
    .catch(() => {}); // silently ignore if Firebase not yet configured
});

// Global Image Fallback (Code-based fallback for broken images)
document.addEventListener('error', function(e) {
  if (e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
    console.warn('Image failed to load:', e.target.src);
    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%231a1a1a" width="100" height="100"/><text fill="%23e11d48" font-family="sans-serif" font-size="12" x="50" y="50" text-anchor="middle">Image Missing</text></svg>';
  }
}, true); // Use capture phase to catch network errors

// Fallback for unexpected global errors
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  showError('Something went wrong. Please try again later.');
});
