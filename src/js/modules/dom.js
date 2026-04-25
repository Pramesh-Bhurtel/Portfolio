export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

export function on(element, event, handler, options = {}) {
  if (!element) return;
  element.addEventListener(event, handler, options);
}

export function off(element, event, handler, options = {}) {
  if (!element) return;
  element.removeEventListener(event, handler, options);
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getEnvVar(key, fallback = '') {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return fallback;
}
export function smoothScrollTo(element, offset = 0) {
  const target = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
  
  if (!target) return;
  
  const position = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: position, behavior: 'smooth' });
}

export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit = 100) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}



