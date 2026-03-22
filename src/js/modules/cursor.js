import { $ } from './dom.js';

/**
 * Initializes the interactive cursor glow effect.
 */
export function initCursorGlow() {
  const glow = $('#cursor-glow');
  if (!glow) return;

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // Smooth trailing effect (lerp)
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}
