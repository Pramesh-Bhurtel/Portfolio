function saveGame() {
  const S = window.GameState;
  const C = S.CONFIG;
  const data = {
    version: C.VERSION,
    score: S.score,
    highScore: S.highScore,
    playerLevel: S.playerLevel,
    playerXP: S.playerXP,
    costs: S.costs,
    baseScore: S.baseScore,
    autoSparkValue: S.autoSparkValue,
    currentRankIndex: S.currentRankIndex,
    bellowsMultiplier: S.bellowsMultiplier,
    shieldActive: S.shieldActive
  };
  try {
    localStorage.setItem(C.SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save game:', e);
  }
}

function loadGame() {
  const S = window.GameState;
  const C = S.CONFIG;
  const saved = localStorage.getItem(C.SAVE_KEY);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (data.version !== C.VERSION) {
      console.warn('Save version mismatch. Resetting progress.');
      localStorage.removeItem(C.SAVE_KEY);
      return;
    }

    S.score = data.score ?? S.score;
    S.highScore = data.highScore ?? S.highScore;
    S.playerLevel = data.playerLevel ?? S.playerLevel;
    S.playerXP = data.playerXP ?? S.playerXP;
    S.currentRankIndex = data.currentRankIndex ?? S.currentRankIndex;
    S.bellowsMultiplier = data.bellowsMultiplier ?? S.bellowsMultiplier;
    S.shieldActive = data.shieldActive ?? S.shieldActive;

    if (data.costs) S.costs = { ...S.costs, ...data.costs };
    S.baseScore = data.baseScore ?? S.baseScore;
    S.autoSparkValue = data.autoSparkValue ?? S.autoSparkValue;
  } catch (e) {
    console.error('Failed to load save data:', e);
    localStorage.removeItem(C.SAVE_KEY);
  }
}

function resetProgress() {
  if (confirm("Are you sure you want to reset all your progress? This cannot be undone!")) {
    localStorage.removeItem(window.GameState.CONFIG.SAVE_KEY);
    window.location.reload();
  }
}

window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetProgress = resetProgress;
