import { $, prefersReducedMotion } from './dom.js';
import { Config } from './config.js';

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typeInterval = null;
let isVisible = true;
let isTypingActive = false;

export function initTypingEffect() {
  const typingText = $('#typing-text');
  if (!typingText) return;

  if (prefersReducedMotion()) {
    typingText.textContent = Config.phrases[0];
    const cursor = $('.cursor');
    if (cursor) cursor.style.display = 'none';
    return;
  }

  function typeEffect() {
    if (!isVisible) return; // Pause if not visible
    
    const currentPhrase = Config.phrases[currentPhraseIndex];
    let currentSpeed = Config.typingSpeed;

    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
      currentCharIndex--;
      currentSpeed = Config.deletingSpeed;
    } else {
      typingText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
      currentCharIndex++;
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
      isDeleting = true;
      currentSpeed = Config.pauseBeforeDelete;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % Config.phrases.length;
      currentSpeed = Config.pauseBeforeNext;
    }

    if (typeInterval) clearTimeout(typeInterval);
    typeInterval = setTimeout(typeEffect, currentSpeed);
  }

  const handleVisibilityChange = () => {
    isVisible = !document.hidden;
    if (isVisible) {
      if (typeInterval) clearTimeout(typeInterval);
      typeInterval = setTimeout(typeEffect, Config.typingSpeed);
    } else {
      if (typeInterval) clearTimeout(typeInterval);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  typeEffect();
}

