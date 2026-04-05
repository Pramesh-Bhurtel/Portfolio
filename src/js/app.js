import { initNavigation } from './modules/navigation.js';
import { initTypingEffect } from './modules/typing.js';
import { initOrbitAnimations } from './modules/orbit.js';
import { initScrollAnimations, initScrollTop, initScrollProgress, initScrollReveal } from './modules/scroll.js';
import { initContactForm } from './modules/contact.js';
import { initDownloadCV } from './modules/download.js';
import { initToast } from './modules/toast.js';
import { initQoL } from './modules/qol.js';
import { initGrains } from './modules/grains.js';

export function initApp() {
  initToast();
  initNavigation();
  initTypingEffect();
  initOrbitAnimations();
  initScrollAnimations();
  initScrollTop();
  initScrollProgress();
  initScrollReveal();
  initContactForm();
  initDownloadCV();
  initQoL();
  initGrains();
}

document.addEventListener('DOMContentLoaded', initApp);
