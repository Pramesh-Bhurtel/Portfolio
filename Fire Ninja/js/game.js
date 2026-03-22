const S = window.GameState;
const DOM = window.DOM.elements;
const C = S.CONFIG;

DOM.init();

function closeIntro() {
  DOM.introGuide?.classList.add('hidden');
  loadGame();
  updateProgressionUI();
  S.isPaused = false;
  startSpawnerOnce();
}

function togglePause() {
  if (S.isGameOver) return;
  if (!DOM.introGuide?.classList.contains('hidden')) return;

  S.isPaused = !S.isPaused;
  DOM.menusContainer?.classList.toggle('open', S.isPaused);

  if (S.isPaused) {
    DOM.stateOverlay?.classList.remove('hidden');
    DOM.stateTitle.textContent = 'PAUSED';
    DOM.stateTitle.style.color = '#ffcc00';
    DOM.stateDesc.textContent = 'Press Space to resume.';
    DOM.pauseToggleBtn.textContent = '▶ Resume [Space]';
    DOM.pauseToggleBtn?.classList.add('active');
  } else {
    DOM.stateOverlay?.classList.add('hidden');
    DOM.pauseToggleBtn.textContent = '⏸ Pause & Shop [Space]';
    DOM.pauseToggleBtn?.classList.remove('active');
    startSpawnerOnce();
  }
}

function gameOver() {
  playSound(1.0, 1.0, 'boom.mp3');
  S.isGameOver = true;

  DOM.stateOverlay?.classList.remove('hidden');
  DOM.stateTitle.textContent = 'GAME OVER';
  DOM.stateTitle.style.color = '#ff0000';
  DOM.stateDesc.textContent = 'You hit a Bomb! Click anywhere to restart.';

  DOM.playArea?.classList.add('maka-bosada-mode');
  setTimeout(() => DOM.playArea?.classList.remove('maka-bosada-mode'), 1000);

  DOM.stateOverlay.onclick = restartGame;
}

function restartGame() {
  if (S.number > S.highScore) S.highScore = S.number;

  S.score = 0;
  S.number = 0;
  S.combo = 0;
  S.playerLevel = 1;
  S.playerXP = 0;
  S.currentRankIndex = 0;
  S.baseScore = 1;
  S.autoSparkValue = 0;
  S.bellowsMultiplier = 1;
  S.costs = { ...C.INITIAL_COSTS };
  S.shieldActive = false;
  S.isGameOver = false;
  S.isPaused = false;
  S.isTimeFrozen = false;
  S.autoSlashActive = false;
  S._ultimateOnCooldown = false;

  saveGame();

  document.body.classList.remove('maka-bosada-mode');
  DOM.stateOverlay?.classList.add('hidden');
  DOM.stateOverlay.onclick = null;

  updateProgressionUI();
  DOM.comboContainer?.classList.add('hidden');
  DOM.pauseToggleBtn.textContent = '⏸ Pause & Shop [Space]';
  DOM.pauseToggleBtn?.classList.remove('active');
  DOM.menusContainer?.classList.remove('open');

  document.querySelectorAll('.fireball-target').forEach(t => t.remove());

  resetSpawner();
  updateShopUI();
  startSpawnerOnce();
}

setInterval(() => {
  if (S.isPaused || S.isGameOver || S.autoSparkValue === 0) return;
  S.score += S.autoSparkValue;
  S.number += S.autoSparkValue;
  addXP(S.autoSparkValue);
  updateRank();
  updateProgressionUI();
  if (DOM.menusContainer?.classList.contains('open')) updateShopUI();
}, 1000);

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && e.target === document.body) {
    e.preventDefault();
    togglePause();
  } else if (!S.isPaused && !S.isGameOver) {
    const keyMap = { 'a': 'nova', 's': 'freeze', 'd': 'meteor', 'w': 'spirit' };
    const type = keyMap[e.key.toLowerCase()];
    if (!type) return;

    const reqs = { nova: 1, freeze: 5, meteor: 10, spirit: 15 };
    if (S.playerLevel < reqs[type]) {
      createFloatingText(window.innerWidth / 2 - 80, window.innerHeight / 2, `🔒 Reach Level ${reqs[type]}!`, '#ff4500');
      return;
    }
    triggerSkill(type);
  }
});

window.closeIntro = closeIntro;
window.togglePause = togglePause;
window.gameOver = gameOver;
window.restartGame = restartGame;
