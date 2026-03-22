import { $ } from './dom.js';

export function initCursorTrail() {
  const playArea = $('#play-area');
  if (!playArea) return;

  let lastTrailTime = 0;
  const throttleMs = 30;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < throttleMs) return;
    lastTrailTime = now;

    if (Math.random() > 0.45) return;

    const trail = document.createElement('div');
    trail.className = 'cursor-fire';
    trail.style.left = `${e.clientX - 7}px`;
    trail.style.top = `${e.clientY - 7}px`;
    playArea.appendChild(trail);

    setTimeout(() => trail.remove(), 400);
  });
}

export function initImageLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}
