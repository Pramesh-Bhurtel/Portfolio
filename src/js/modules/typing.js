import { $ } from './dom.js';
import { Config } from './config.js';

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typeInterval = null;

export function initTypingEffect() {
  const typingText = $('#typing-text');
  if (!typingText) return;

  function typeEffect() {
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

    typeInterval = setTimeout(typeEffect, currentSpeed);
  }

  typeEffect();
}

export function destroyTypingEffect() {
  if (typeInterval) {
    clearTimeout(typeInterval);
    typeInterval = null;
  }
}
