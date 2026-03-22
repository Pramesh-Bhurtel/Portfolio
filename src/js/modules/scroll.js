import { $, $$, on, scrollTo } from './dom.js';

export function initScrollReveal() {
  const revealElements = $$('.section-title, .project-card, .about-text, .about-visual, .contact-info, .contact-form');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal-init');
    revealObserver.observe(el);
  });
}

export function initScrollProgress() {
  const progressBar = $('#scroll-progress');
  if (!progressBar) return;
  
  on(window, 'scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  }, { passive: true });
}

export function initScrollAnimations() {
  const elements = $$('.slide-in-left, .slide-in-right, .slide-in-up');
  
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(element => observer.observe(element));
}

export function initScrollTop() {
  const scrollBtn = $('#scroll-top');
  const logo = $('#site-logo');
  
  if (!scrollBtn) return;

  on(window, 'scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  on(scrollBtn, 'click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (logo) {
    on(logo, 'click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
