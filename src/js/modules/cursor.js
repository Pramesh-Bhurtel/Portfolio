import { prefersReducedMotion } from './dom.js';

export function initCursor() {
  if (prefersReducedMotion() || isTouchDevice()) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  
  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';
  
  document.body.appendChild(cursor);
  document.body.appendChild(follower);
  document.body.classList.add('has-custom-cursor');

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let followerX = 0;
  let followerY = 0;
  let rafId = null;
  let isVisible = true;

  const updateCursor = () => {
    if (!isVisible) return;

    // Smooth trailing effect
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

    rafId = requestAnimationFrame(updateCursor);
  };

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Initialize position immediately on first move
    if (cursorX === 0 && cursorY === 0) {
      cursorX = mouseX;
      cursorY = mouseY;
      followerX = mouseX;
      followerY = mouseY;
    }
  });

  // Event delegation for interactive elements (supports dynamic elements like toasts)
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, textarea, .orbit-icon, .skill-tag')) {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input, textarea, .orbit-icon, .skill-tag')) {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    }
  });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      rafId = requestAnimationFrame(updateCursor);
    } else if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  rafId = requestAnimationFrame(updateCursor);
}

function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}
