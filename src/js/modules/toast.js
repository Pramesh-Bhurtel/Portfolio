let container = null;
export function initToast() {
  if (container) return;
  
  container = document.createElement('div');
  container.className = 'toast-container';
  container.setAttribute('role', 'alert');
  container.setAttribute('aria-live', 'polite');
  document.body.appendChild(container);
}

export function showToast(message, type = 'info', duration = 3000) {
  if (!container) initToast();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.setProperty('--toast-duration', `${duration}ms`);
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, duration + 300);
}

export function showSuccess(message, duration) {
  showToast(message, 'success', duration);
}

export function showError(message, duration) {
  showToast(message, 'error', duration);
}

