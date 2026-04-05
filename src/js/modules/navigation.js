import { $, $$, on, scrollTo, throttle } from './dom.js';

export function initNavigation() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navMenu = $('#nav-menu');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  on(hamburger, 'click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    on(link, 'click', (e) => {
      e.preventDefault();
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      
      const href = link.getAttribute('href');
      scrollTo(href, 80);
    });
  });

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-100px 0px -100px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = $(`a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  const handleScroll = throttle(() => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });
}

export function scrollToSection(sectionId, offset = 80) {
  scrollTo(`#${sectionId}`, offset);
}
