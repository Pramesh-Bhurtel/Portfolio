import { $, $$, prefersReducedMotion } from './dom.js';

export function initQoL() {
  if (prefersReducedMotion()) return;
  initMagneticButtons();
}

function initMagneticButtons() {
  const magneticElements = $$('.glow-genz-button, .social-link, .orbit-icon, .nav-link, .skill-tag, .contact-item');

  magneticElements.forEach(el => {
    let ticking = false;

    el.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const { left, top, width, height } = el.getBoundingClientRect();
          const x = e.clientX - left - width / 2;
          const y = e.clientY - top - height / 2;

          // Magnetic pull: 20% of movement
          el.style.setProperty('--mag-x', `${x * 0.2}px`);
          el.style.setProperty('--mag-y', `${y * 0.2}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        el.style.setProperty('--mag-x', `0px`);
        el.style.setProperty('--mag-y', `0px`);
      });
    });
  });
}
