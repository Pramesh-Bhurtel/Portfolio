import { $, $$, on, smoothScrollTo, prefersReducedMotion } from './dom.js';

export function initScrollReveal() {
  const revealElements = $$('.section-title, .project-card, .about-text, .about-visual, .contact-info, .contact-form');
  const reducedMotion = prefersReducedMotion();
  
  if (reducedMotion) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

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
  
  let ticking = false;
  on(window, 'scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
        
        if (scrolled > 0 && !document.body.classList.contains('scrolling-active')) {
          document.body.classList.add('scrolling-active');
        } else if (scrolled === 0 && document.body.classList.contains('scrolling-active')) {
          document.body.classList.remove('scrolling-active');
        }
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

export function initScrollAnimations() {
  const elements = $$('.slide-in-left, .slide-in-right, .slide-in-up');
  const reducedMotion = prefersReducedMotion();
  
  if (elements.length === 0) return;

  if (reducedMotion) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  let delayCounter = 0;
  let batchTime = 0;

  const observer = new IntersectionObserver((entries) => {
    // Reset delay counter for new batches
    if (entries.length > 0) {
      const entryTime = entries[0].time;
      if (entryTime - batchTime > 100) {
        delayCounter = 0;
        batchTime = entryTime;
      }
    }

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transitionDelay = `${delayCounter * 0.15}s`;
        el.classList.add('visible');
        delayCounter++;
        observer.unobserve(el);
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

  if (scrollBtn) {
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
  }

  if (logo) {
    on(logo, 'click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
