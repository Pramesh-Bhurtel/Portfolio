import { $, $$, on } from './dom.js';

export function initNavigation() {
  const hamburger = $('.hamburger');
  const navMenu = $('.nav-menu');
  const navLinks = $$('.nav-link');
  const navbar = $('#navbar');
  
  if (!hamburger || !navMenu || !navbar) return;

  const toggleMenu = (isOpen) => {
    const isActivating = isOpen ?? !navMenu.classList.contains('active');
    hamburger.classList.toggle('active', isActivating);
    navMenu.classList.toggle('active', isActivating);
    hamburger.setAttribute('aria-expanded', isActivating ? 'true' : 'false');
    
    if (isActivating) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      // Optional: focus the first link
      if (navLinks.length) navLinks[0].focus();
    } else {
      document.body.style.overflow = '';
      hamburger.focus(); // Return focus to hamburger
    }
  };

  on(hamburger, 'click', () => toggleMenu());

  // Close menu on link click
  navLinks.forEach(link => {
    on(link, 'click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  });

  // Handle escape key
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // Trap focus within mobile menu when open
  on(navMenu, 'keydown', (e) => {
    if (e.key === 'Tab' && navMenu.classList.contains('active')) {
      const focusable = $$('a[href]', navMenu);
      if (focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Navbar scroll effect
  let lastScroll = 0;
  on(window, 'scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Intersection Observer for Active Link
  const sections = $$('section[id]');
  
  if (sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      let maxRatio = 0;
      let activeId = null;
      
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          activeId = entry.target.getAttribute('id');
        }
      });

      if (activeId) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    }, {
      threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
      rootMargin: '-50px 0px -50px 0px'
    });

    sections.forEach(section => observer.observe(section));
  }
}
