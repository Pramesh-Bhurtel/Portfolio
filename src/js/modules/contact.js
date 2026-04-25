import { $, on } from './dom.js';
import { showSuccess, showError } from './toast.js';
import { Config } from './config.js';

let emailjsLoadPromise = null;

export async function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  // Pre-load but don't block
  loadEmailJS();

  on(form, 'submit', async (e) => {
    e.preventDefault();
    
    if (submitBtn.disabled) return; // Prevent duplicate submissions

    const originalText = submitBtn.textContent;
    
    if (!validateForm(form)) {
      showError('Please fill in all required fields correctly.', 3000);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Preparing...';

    try {
      await loadEmailJS(); // Ensure it's loaded before trying to send

      if (typeof emailjs !== 'undefined') {
        submitBtn.textContent = 'Sending...';
        await emailjs.sendForm(
          Config.emailjs.serviceId,
          Config.emailjs.templateId,
          form
        );
        showSuccess('Message sent successfully! I will get back to you soon.', 4000);
        form.reset();
        // Clear valid states
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => clearError(input));
      } else {
        showError('Email service is blocked or unavailable. Please email directly.', 5000);
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      showError('Failed to send message. Please try again or email directly.', 5000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = originalText;
    }
  });

  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    on(input, 'blur', () => validateField(input));
    on(input, 'input', () => clearError(input));
  });
}

function loadEmailJS() {
  if (emailjsLoadPromise) return emailjsLoadPromise;

  if (typeof emailjs !== 'undefined') {
    if (typeof emailjs.init === 'function') {
      emailjs.init(Config.emailjs.publicKey);
    }
    emailjsLoadPromise = Promise.resolve();
    return emailjsLoadPromise;
  }

  emailjsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      if (typeof emailjs.init === 'function') {
        emailjs.init(Config.emailjs.publicKey);
      }
      resolve();
    };
    script.onerror = () => {
      emailjsLoadPromise = null;
      import('./toast.js').then(module => {
        module.showError('Email service blocked by browser or network.');
      });
      reject(new Error('Failed to load EmailJS'));
    };
    document.head.appendChild(script);
  });

  return emailjsLoadPromise;
}

function validateForm(form) {
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(input) {
  const value = input.value.trim();
  let isValid = true;

  if (input.required && !value) {
    isValid = false;
  }

  if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
    }
  }

  if (!isValid) {
    input.classList.add('error');
  } else {
    input.classList.remove('error');
  }

  return isValid;
}

function clearError(input) {
  input.classList.remove('error');
}
