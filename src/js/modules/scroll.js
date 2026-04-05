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
  
  let ticking = false;
  on(window, 'scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

export function initScrollAnimations() {
  const elements = $$('.slide-in-left, .slide-in-right, .slide-in-up');
  
  if (elements.length === 0) return;

  let delayCounter = 0;
  let lastTime = 0;

  const observer = new IntersectionObserver((entries) => {
    const now = Date.now();
    
    // Reset delay counter if current batch is significantly separated in time from the previous
    if (now - lastTime > 100) {
      delayCounter = 0;
    }
    lastTime = now;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Apply staggered delay
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
  
  if (!scrollBtn) return;

  let ticking = false;
  on(window, 'scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 300) {
          scrollBtn.classList.add('visible');
        } else {
          scrollBtn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
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
