import { $$ } from './dom.js';

/**
 * Initializes orbiting animations for tech icons.
 * Uses CSS variables for perf and fluid rem scaling.
 * Optimized for mobile viewports to prevent horizontal overflow.
 */
export function initOrbitAnimations() {
  const wrappers = $$('.orbit-wrapper');
  if (!wrappers.length) return;

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
      @keyframes float-wiggle {
        0%, 100% { transform: translateY(0) rotate(0) scale(1); }
        33% { transform: translateY(-10px) rotate(2deg) scale(1.05); }
        66% { transform: translateY(5px) rotate(-2deg) scale(0.95); }
      }
    `;
    document.head.appendChild(style);
  }

  wrappers.forEach((wrapper, index) => {
    const icon = wrapper.querySelector('.orbit-icon');
    const startAngle = Math.floor(Math.random() * 360);
    
    // Smart Slots for distribution
    const radius = (baseRadius + (index * radiusStep)).toFixed(2); 
    const orbitDuration = (18 + (Math.random() * 15)).toFixed(1); 
    const floatDuration = (4 + (Math.random() * 3)).toFixed(1);
    const direction = Math.random() > 0.5 ? 'normal' : 'reverse';

    // Set CSS variables on wrapper for orbit
    wrapper.style.setProperty('--start-angle', `${startAngle}deg`);
    wrapper.style.setProperty('--radius', `${radius}rem`);
    wrapper.style.animation = `universal-orbit ${orbitDuration}s linear infinite ${direction}`;
    
    // Apply float animation to the icon itself
    if (icon) {
      icon.style.animation = `float-wiggle ${floatDuration}s ease-in-out infinite alternate`;
      icon.style.animationDelay = `-${Math.random() * 5}s`; // Random start point for float
    }

    wrapper.style.willChange = 'transform';
    if (icon) icon.style.willChange = 'transform';

    // Interaction stability
    wrapper.addEventListener('mouseenter', () => {
      wrapper.style.animationPlayState = 'paused';
      if (icon) icon.style.animationPlayState = 'paused';
    });

    wrapper.addEventListener('mouseleave', () => {
      wrapper.style.animationPlayState = 'running';
      if (icon) icon.style.animationPlayState = 'running';
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
