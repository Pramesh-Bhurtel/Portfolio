import { $$ } from './dom.js';

/**
 * Initializes orbiting animations for tech icons.
 * Uses CSS variables for perf and fluid rem scaling.
 * Optimized for mobile viewports to prevent horizontal overflow.
 */
export function initOrbitAnimations() {
  const planets = $$('.random-orbit');
  if (!planets.length) return;

  const isMobile = window.innerWidth < 768;
  const isSmallMobile = window.innerWidth < 480;

  // Base radius and step adjusted for mobile to prevent overflow
  const baseRadius = isSmallMobile ? 3.5 : (isMobile ? 4.5 : 7.5);
  const radiusStep = isSmallMobile ? 1.0 : (isMobile ? 1.5 : 2.5);
  
  // Inject a single universal orbiting keyframe set if not exists
  if (!document.getElementById('orbit-keyframes')) {
    const style = document.createElement('style');
    style.id = 'orbit-keyframes';
    style.textContent = `
      @keyframes universal-orbit {
        from { transform: rotate(var(--start-angle)) translateX(var(--radius)) rotate(calc(-1 * var(--start-angle))); }
        to { transform: rotate(calc(var(--start-angle) + 360deg)) translateX(var(--radius)) rotate(calc(-1 * (var(--start-angle) + 360deg))); }
      }
    `;
    document.head.appendChild(style);
  }

  planets.forEach((planet, index) => {
    const startAngle = Math.floor(Math.random() * 360);
    const radius = (baseRadius + (index * radiusStep)).toFixed(2); // rem
    const duration = (20 + (Math.random() * 10)).toFixed(1); // slow and smooth
    const direction = Math.random() > 0.5 ? 'normal' : 'reverse';

    // Set CSS variables for the universal-orbit keyframes
    planet.style.setProperty('--start-angle', `${startAngle}deg`);
    planet.style.setProperty('--radius', `${radius}rem`);
    
    // Apply smooth hardware-accelerated animation
    planet.style.animation = `universal-orbit ${duration}s linear infinite ${direction}`;
    planet.style.willChange = 'transform';

    // Interaction stability
    planet.addEventListener('mouseenter', () => {
      planet.style.animationPlayState = 'paused';
    });

    planet.addEventListener('mouseleave', () => {
      planet.style.animationPlayState = 'running';
    });
  });

  // Re-initialize on resize to ensure radius remains responsive
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initOrbitAnimations();
    }, 250);
  });
}
