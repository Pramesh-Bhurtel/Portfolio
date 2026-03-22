import { $, on } from './dom.js';

export function initPhotoModal() {
  const sun = $('.sun-core');
  const modal = $('#photo-modal');
  const closeBtn = $('.close', modal);
  const randomPhoto = $('#random-photo');

  if (!sun || !modal || !closeBtn || !randomPhoto) return;

  const openModal = () => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    randomPhoto.src = `https://picsum.photos/600/400?random=${randomId}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  on(sun, 'click', openModal);
  on(closeBtn, 'click', closeModal);
  
  on(modal, 'click', (e) => {
    if (e.target === modal) closeModal();
  });

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
