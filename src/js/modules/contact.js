import { $, on } from './dom.js';
import { showSuccess, showError } from './toast.js';
import { Config } from './config.js';

let emailjsLoaded = false;

export async function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  loadEmailJS();

  on(form, 'submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    if (!validateForm(form)) {
      showError('Please fill in all required fields correctly.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Sending...';

    try {
      if (typeof emailjs !== 'undefined') {
        await emailjs.sendForm(
          Config.emailjs.serviceId,
          Config.emailjs.templateId,
          form
        );
        showSuccess('Message sent successfully! I will get back to you soon.');
        form.reset();
      } else {
        showError('Email service is blocked or loading. Please email directly.');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      showError('Failed to send message. Please try again or email directly.');
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
  if (emailjsLoaded || typeof emailjs !== 'undefined') {
    emailjsLoaded = true;
    if (typeof emailjs.init === 'function') {
      emailjs.init(Config.emailjs.publicKey);
    }
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    emailjsLoaded = true;
    if (typeof emailjs.init === 'function') {
      emailjs.init(Config.emailjs.publicKey);
    }
  };
  script.onerror = () => {
    import('./toast.js').then(module => {
      module.showError('Email service blocked by browser or network.');
    });
  };
  document.head.appendChild(script);
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
