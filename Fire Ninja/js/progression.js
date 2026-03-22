function getXPNeeded(level) {
  const C = window.GameState.CONFIG;
  return Math.floor(C.XP_BASE * Math.pow(C.XP_EXPONENT, level - 1));
}

function updateXpUI() {
  const S = window.GameState;
  const DOM = window.DOM.elements;
  
  if (DOM.levelDisplay) DOM.levelDisplay.textContent = S.playerLevel;
  if (DOM.xpBarFill) {
    const xpNeeded = getXPNeeded(S.playerLevel);
    const xpPercent = Math.max(0, Math.min(100, (S.playerXP / xpNeeded) * 100));
    DOM.xpBarFill.style.width = `${xpPercent}%`;
  }
}

function updateProgressionUI() {
  const S = window.GameState;
  const DOM = window.DOM.elements;
  const C = S.CONFIG;
  
  DOM.score.innerHTML = `🔥 Power: ${S.score}`;
  const currentBest = Math.max(S.number, S.highScore);
  DOM.number.innerHTML = `${S.number} <span class="high-score-text">(Best: ${currentBest})</span>`;
  DOM.rankName.textContent = C.RANKS[S.currentRankIndex].name;
  updateXpUI();
}

function updateRank() {
  const S = window.GameState;
  const C = S.CONFIG;
  const DOM = window.DOM.elements;
  
  if (S.currentRankIndex < C.RANKS.length - 1) {
    if (S.score >= C.RANKS[S.currentRankIndex + 1].req) {
      S.currentRankIndex++;
      DOM.rankName.textContent = C.RANKS[S.currentRankIndex].name;

      if (C.RANKS[S.currentRankIndex].name === 'Maka Bosada Aag') {
        document.body.classList.add('maka-bosada-mode');
        playSound(1.0, 1.0, 'boom.mp3');
      }
    }
  }
}

function addXP(amount) {
  const S = window.GameState;
  const DOM = window.DOM.elements;
  let leveledUp = false;

  S.playerXP += amount;

  while (S.playerXP >= getXPNeeded(S.playerLevel)) {
    S.playerXP -= getXPNeeded(S.playerLevel);
    S.playerLevel++;
    leveledUp = true;
  }

  if (leveledUp) {
    playSound(1.0, 1.0, 'click2.mp3');
    createFloatingText(window.innerWidth / 2 - 50, window.innerHeight / 2 - 50, 'LEVEL UP!', '#00ffcc');
    DOM.playArea?.classList.add('level-up-flash');
    setTimeout(() => DOM.playArea?.classList.remove('level-up-flash'), 500);
    saveGame();
    if (window.updateShopUI) window.updateShopUI();
  }

  updateXpUI();
}

window.getXPNeeded = getXPNeeded;
window.updateXpUI = updateXpUI;
window.updateProgressionUI = updateProgressionUI;
window.updateRank = updateRank;
window.addXP = addXP;
