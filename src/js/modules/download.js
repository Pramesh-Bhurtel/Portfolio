import { $, on } from './dom.js';
import { showSuccess } from './toast.js';

export function initDownloadCV() {
  const btn = $('#download-cv-btn');
  const link = $('#cv-download-link');
  const overlay = $('#download-overlay');

  if (!btn || !link || !overlay) return;

  const startDownloadFlow = () => {
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      try {
        link.click();
        showSuccess('CV downloaded successfully!');
      } catch (err) {
        window.open(link.href, '_blank');
        showSuccess('CV opened in new tab!');
      }
    }, 700);

    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    }, 1600);
  };

  on(btn, 'click', (e) => {
    e.preventDefault();
    startDownloadFlow();
  });

  on(btn, 'keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startDownloadFlow();
    }
  });
}
