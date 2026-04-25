let container = null;

export function initToast() {
  if (container) return;
  
  container = document.createElement('div');
  container.className = 'toast-container';
  container.setAttribute('role', 'alert');
  container.setAttribute('aria-live', 'polite');
  document.body.appendChild(container);
}

const icons = {
  success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
};

export function showToast(message, type = 'info', duration = 3000) {
  if (!container) initToast();
  
  // Stacking limit: remove oldest if > 3
  while (container.children.length >= 3) {
    container.removeChild(container.firstChild);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || ''} <span>${message}</span>`;
  
  // CSS expects seconds for animation-delay
  toast.style.setProperty('--toast-duration', `${(duration / 1000).toFixed(2)}s`);
  
  container.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode === container) {
      toast.remove();
    }
  }, duration + 300);
}

export function showSuccess(message, duration = 3000) {
  showToast(message, 'success', duration);
}

export function showError(message, duration = 3000) {
  showToast(message, 'error', duration);
}

