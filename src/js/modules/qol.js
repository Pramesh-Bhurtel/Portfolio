import { $, $$, prefersReducedMotion } from './dom.js';

export function initQoL() {
  if (prefersReducedMotion()) return;
  initMagneticButtons();
}

function initMagneticButtons() {
  const magneticElements = $$('.glow-genz-button, .social-link, .orbit-icon, .nav-link, .skill-tag, .contact-item');

  magneticElements.forEach(el => {
    let ticking = false;
    let rect = null;

    // Cache the rect on mouseenter to avoid layout thrashing on mousemove
    el.addEventListener('mouseenter', () => {
      rect = el.getBoundingClientRect();
    }, { passive: true });

    el.addEventListener('mousemove', (e) => {
      if (!rect) {
        rect = el.getBoundingClientRect();
      }
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!rect) return;
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          // Magnetic pull: 20% of movement
          el.style.setProperty('--mag-x', `${x * 0.2}px`);
          el.style.setProperty('--mag-y', `${y * 0.2}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      rect = null; // Reset cache
      requestAnimationFrame(() => {
        el.style.setProperty('--mag-x', `0px`);
        el.style.setProperty('--mag-y', `0px`);
      });
    });
  });
}
