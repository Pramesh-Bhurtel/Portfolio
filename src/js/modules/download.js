import { $, on } from './dom.js';
import { showSuccess } from './toast.js';

export function initDownload() {
  const btn = $('#download-cv-btn');
  const link = $('#cv-download-link');
  const overlay = $('#download-overlay');

  if (!btn || !link || !overlay) return;

  const startDownloadFlow = async () => {
    if (btn.disabled) return;
    
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    await new Promise(resolve => setTimeout(resolve, 700));
    link.click();
    showSuccess('CV downloaded successfully!');
    // Increment Firebase metrics counter (fire-and-forget, non-blocking)
    import('./firebaseSync.js').then(m => m.incrementMetric('cv_downloads')).catch(() => {});
    
    await new Promise(resolve => setTimeout(resolve, 900));
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
  };

  on(btn, 'click', (e) => {
    e.preventDefault();
    startDownloadFlow();
  });

}
