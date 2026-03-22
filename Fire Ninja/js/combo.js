function handleCombo() {
  const S = window.GameState;
  const DOM = window.DOM.elements;
  const C = S.CONFIG;
  
  S.combo++;
  DOM.combo.textContent = `x${S.combo}`;
  DOM.comboContainer?.classList.remove('hidden');

  DOM.combo.style.transform = 'scale(1.5)';
  setTimeout(() => { DOM.combo.style.transform = 'scale(1)'; }, 100);

  clearTimeout(S._comboTimer);

  const timeout = C.COMBO_TIMEOUT * S.bellowsMultiplier;
  if (DOM.timerBar) {
    DOM.timerBar.style.transition = 'none';
    DOM.timerBar.style.transform = 'scaleX(1)';
    void DOM.timerBar.offsetWidth;
    DOM.timerBar.style.transition = `transform ${timeout / 1000}s linear`;
    DOM.timerBar.style.transform = 'scaleX(0)';
  }

  S._comboTimer = setTimeout(() => {
    S.combo = 0;
    DOM.comboContainer?.classList.add('hidden');
  }, timeout);

  if (S.combo === 15 && !S._ultimateOnCooldown) {
    S._ultimateOnCooldown = true;
    setTimeout(() => { S._ultimateOnCooldown = false; }, C.ULTIMATE_COOLDOWN);
    if (window.triggerSkill) window.triggerSkill('nova', true);
    createFloatingText(window.innerWidth / 2 - 80, window.innerHeight / 2 - 100, '🔥 FIRE ULTIMATE! 🔥', '#ff4500');
    playSound(1.0, 1.0, 'boom.mp3');
  }
}

function breakCombo() {
  const S = window.GameState;
  const DOM = window.DOM.elements;
  
  clearTimeout(S._comboTimer);
  S.combo = 0;
  DOM.comboContainer?.classList.add('hidden');

  DOM.missOverlay?.classList.remove('miss-flash');
  void DOM.missOverlay?.offsetWidth;
  DOM.missOverlay?.classList.add('miss-flash');
}

window.handleCombo = handleCombo;
window.breakCombo = breakCombo;
