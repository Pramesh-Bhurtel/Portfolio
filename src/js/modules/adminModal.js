import { $, on, $$ } from './dom.js';
import { showSuccess, showError } from './toast.js';

const LOCKOUT_KEY = 'cms_security_lockout_until';
const FAILED_COUNT_KEY = 'cms_failed_login_count';
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function initAdminModal() {
  const profileImg = $('#profile-img') || $('.sun-core img') || $('.sun-core');
  const modal = $('#admin-modal');
  if (!modal) return;

  const closeBtn = $('#admin-modal-close', modal);
  const overlay = modal;
  const form = $('#admin-login-form', modal);
  const usernameInput = $('#admin-username', modal);
  const passwordInput = $('#admin-password', modal);
  const errorMessage = $('#admin-error-message', modal);
  const submitBtn = $('button[type="submit"]', modal);
  const securityBanner = $('#admin-security-banner', modal);

  let lockoutTimer = null;

  if (!profileImg) return;

  const getLockoutUntil = () => {
    const val = localStorage.getItem(LOCKOUT_KEY);
    return val ? parseInt(val, 10) : 0;
  };

  const setLockoutUntil = (timestamp) => {
    localStorage.setItem(LOCKOUT_KEY, timestamp.toString());
  };

  const clearLockout = () => {
    localStorage.removeItem(LOCKOUT_KEY);
    localStorage.removeItem(FAILED_COUNT_KEY);
    if (lockoutTimer) clearInterval(lockoutTimer);
    lockoutTimer = null;
  };

  const checkLockoutStatus = () => {
    const lockoutUntil = getLockoutUntil();
    const now = Date.now();

    if (lockoutUntil && now < lockoutUntil) {
      startLockoutSequence(lockoutUntil);
      return true;
    } else if (lockoutUntil && now >= lockoutUntil) {
      clearLockout();
      unlockFields();
    }
    return false;
  };

  const lockFields = () => {
    if (usernameInput) usernameInput.disabled = true;
    if (passwordInput) passwordInput.disabled = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Locked Out';
    }
  };

  const unlockFields = () => {
    if (usernameInput) usernameInput.disabled = false;
    if (passwordInput) passwordInput.disabled = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
    if (securityBanner) securityBanner.style.display = 'none';
  };

  const startLockoutSequence = (untilTimestamp) => {
    lockFields();
    if (securityBanner) securityBanner.style.display = 'block';

    const updateTimer = () => {
      const remainingMs = untilTimestamp - Date.now();
      if (remainingMs <= 0) {
        clearLockout();
        unlockFields();
        if (errorMessage) {
          errorMessage.textContent = '';
          errorMessage.style.display = 'none';
        }
        showSuccess('Security lockdown expired. You may try logging in again.');
      } else {
        const totalSeconds = Math.ceil(remainingMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (securityBanner) {
          securityBanner.innerHTML = `
            <strong>🚨 Security Lockdown Active</strong><br>
            Too many failed attempts. Try again in <span class="lockout-countdown">${formatted}</span>
          `;
        }
      }
    };

    updateTimer();
    if (lockoutTimer) clearInterval(lockoutTimer);
    lockoutTimer = setInterval(updateTimer, 1000);
  };

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    const isLocked = checkLockoutStatus();
    if (!isLocked) {
      resetForm();
      setTimeout(() => {
        if (usernameInput) usernameInput.focus();
      }, 100);
    }
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lockoutTimer) clearInterval(lockoutTimer);
  };

  const resetForm = () => {
    if (form) form.reset();
    if (errorMessage) {
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    }
    if (usernameInput) usernameInput.classList.remove('error');
    if (passwordInput) passwordInput.classList.remove('error');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  };

  // ── Stealth Triple-Click Trigger (3 clicks within 800ms) ────────────
  // Uses no tooltip, no cursor change, no visible indicator — pure UX stealth.
  let _clickCount = 0;
  let _clickTimer = null;

  on(profileImg, 'click', (e) => {
    e.preventDefault();
    _clickCount++;
    clearTimeout(_clickTimer);
    _clickTimer = setTimeout(() => { _clickCount = 0; }, 800);
    if (_clickCount >= 3) {
      _clickCount = 0;
      clearTimeout(_clickTimer);
      openModal();
    }
  });

  // ── Honeypot Lockout Guard (anti-bot) ────────────────────────────────
  // If any code/bot fills the hidden honeypot field, trigger the security lockout.
  const honeypot = document.getElementById('admin-honeypot');
  if (honeypot) {
    on(honeypot, 'input', () => {
      if (honeypot.value.length > 0) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutUntil(lockoutTime);
        localStorage.setItem(FAILED_COUNT_KEY, '3');
        startLockoutSequence(lockoutTime);
      }
    });
  }

  // Close handlers
  if (closeBtn) {
    on(closeBtn, 'click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  on(overlay, 'click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Clear input error on typing
  [usernameInput, passwordInput].forEach((input) => {
    if (input) {
      on(input, 'input', () => {
        if (!getLockoutUntil()) {
          input.classList.remove('error');
          if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
          }
        }
      });
    }
  });

  // Authentication Logic & Security Guard Rate-Limiter
  if (form) {
    on(form, 'submit', async (e) => {
      e.preventDefault();

      if (checkLockoutStatus()) return;

      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      let hasError = false;

      if (!username) {
        if (usernameInput) usernameInput.classList.add('error');
        hasError = true;
      }
      if (!password) {
        if (passwordInput) passwordInput.classList.add('error');
        hasError = true;
      }

      if (hasError) {
        if (errorMessage) {
          errorMessage.textContent = 'Please fill in both fields.';
          errorMessage.style.display = 'block';
        }
        return;
      }

      // Check credentials (strict admin / password check)
      if (username === 'admin' && password === 'password') {
        localStorage.removeItem(FAILED_COUNT_KEY);
        clearLockout();

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Authenticating...';
        }

        showSuccess('Login successful! Launching Admin CMS Dashboard...');

        setTimeout(() => {
          closeModal();
          window.location.href = 'admin-dashboard.html';
        }, 1200);
      } else {
        // Increment failed attempt counter
        let currentFailedCount = parseInt(localStorage.getItem(FAILED_COUNT_KEY) || '0', 10) + 1;
        localStorage.setItem(FAILED_COUNT_KEY, currentFailedCount.toString());

        if (usernameInput) usernameInput.classList.add('error');
        if (passwordInput) passwordInput.classList.add('error');

        if (currentFailedCount >= 3) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
          setLockoutUntil(lockoutTime);
          startLockoutSequence(lockoutTime);
          showError('Security Alert: 3 failed attempts reached. System locked for 5 minutes.');
        } else {
          const remainingAttempts = 3 - currentFailedCount;
          if (errorMessage) {
            errorMessage.textContent = `Invalid credentials. (${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining before lockdown)`;
            errorMessage.style.display = 'block';
          }
          showError(`Invalid credentials. ${remainingAttempts} attempts remaining.`);
        }
      }
    });
  }
}
