import { $$, prefersReducedMotion } from './dom.js';

let observer = null;

export function initOrbitAnimations() {
  const wrappers = $$('.orbit-wrapper');
  if (!wrappers.length) return;

  const reducedMotion = prefersReducedMotion();

  if (!document.getElementById('orbit-keyframes')) {
    const style = document.createElement('style');
    style.id = 'orbit-keyframes';
    style.textContent = `
      @keyframes universal-orbit {
        from { transform: rotate(var(--start-angle)) translateX(var(--radius)) rotate(calc(-1 * var(--start-angle))); }
        to { transform: rotate(calc(var(--start-angle) + 360deg)) translateX(var(--radius)) rotate(calc(-1 * (var(--start-angle) + 360deg))); }
      }
      @keyframes float-wiggle {
        0%, 100% { transform: translate(var(--mag-x, 0px), var(--mag-y, 0px)) translateY(0) rotate(0) scale(1); }
        33% { transform: translate(var(--mag-x, 0px), var(--mag-y, 0px)) translateY(-10px) rotate(2deg) scale(1.05); }
        66% { transform: translate(var(--mag-x, 0px), var(--mag-y, 0px)) translateY(5px) rotate(-2deg) scale(0.95); }
      }
    `;
    document.head.appendChild(style);
  }

  wrappers.forEach((wrapper, index) => {
    const icon = wrapper.querySelector('.orbit-icon');
    
    if (!wrapper.dataset.initialized) {
      const startAngle = Math.floor(Math.random() * 360);
      // More variance to prevent clustering
      const orbitDuration = (15 + (Math.random() * 25) + (index * 2)).toFixed(1); 
      const floatDuration = (3 + (Math.random() * 4)).toFixed(1);
      const direction = Math.random() > 0.5 ? 'normal' : 'reverse';
      
      wrapper.style.setProperty('--start-angle', `${startAngle}deg`);
      wrapper.dataset.angle = startAngle;
      
      if (!reducedMotion) {
        wrapper.style.animation = `universal-orbit ${orbitDuration}s linear infinite ${direction}`;
        if (icon) {
          icon.style.animation = `float-wiggle ${floatDuration}s ease-in-out infinite alternate`;
          icon.style.animationDelay = `-${Math.random() * 5}s`;
        }
      } else {
        wrapper.style.transform = `rotate(${startAngle}deg) translateX(var(--radius)) rotate(-${startAngle}deg)`;
      }
      
      wrapper.dataset.initialized = 'true';

      if (!reducedMotion) {
        wrapper.addEventListener('mouseenter', () => {
          wrapper.style.animationPlayState = 'paused';
          if (icon) icon.style.animationPlayState = 'paused';
        });

        wrapper.addEventListener('mouseleave', () => {
          wrapper.style.animationPlayState = 'running';
          if (icon) icon.style.animationPlayState = 'running';
        });
      }
    }
  });

  const updateRadii = () => {
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;

    const baseRadius = isSmallMobile ? 3.5 : (isMobile ? 4.5 : 7.5);
    const radiusStep = isSmallMobile ? 1.0 : (isMobile ? 1.5 : 2.5);

    wrappers.forEach((wrapper, index) => {
      const radius = (baseRadius + (index * radiusStep)).toFixed(2); 
      wrapper.style.setProperty('--radius', `${radius}rem`);
      
      if (reducedMotion) {
        const startAngle = wrapper.dataset.angle;
        wrapper.style.transform = `rotate(${startAngle}deg) translateX(${radius}rem) rotate(-${startAngle}deg)`;
      }
    });
  };

  updateRadii();

  if (!observer) {
    observer = new ResizeObserver(() => {
      window.requestAnimationFrame(updateRadii);
    });
    const container = document.querySelector('.avatar-container');
    if (container) observer.observe(container);
  }
  
  return () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };
}
