import { $, $$ } from './dom.js';

/**
 * Initializes Quality of Life (QoL) features like magnetic buttons and custom interactions.
 */
export function initQoL() {
  initMagneticButtons();
}

function initMagneticButtons() {
  const magneticElements = $$('.glow-genz-button, .social-link, .orbit-icon, .nav-link, .skill-tag, .contact-item');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;

      // Magnetic pull: 30% of movement
      el.style.setProperty('--mag-x', `${x * 0.3}px`);
      el.style.setProperty('--mag-y', `${y * 0.3}px`);
    });

    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--mag-x', `0px`);
      el.style.setProperty('--mag-y', `0px`);
    });
  });
}
