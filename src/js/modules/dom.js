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


export function scrollTo(element, offset = 0) {
  const target = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
  
  if (!target) return;
  
  const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
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



