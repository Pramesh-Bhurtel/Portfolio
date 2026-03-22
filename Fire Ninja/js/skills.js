function triggerSkill(type, isFree = false) {
  const S = window.GameState;
  const DOM = window.DOM.elements;
  
  if (S.isPaused || S.isGameOver) return;
  
  if (!isFree) {
    if (S.score < S.costs[type]) return;
    S.score -= S.costs[type];
    updateProgressionUI();
    if (window.updateShopUI) window.updateShopUI();
  }

  switch (type) {
    case 'nova': {
      const targets = document.querySelectorAll('.fireball-target:not(.target-bomb)');
      if (targets.length === 0) {
        if (!isFree) { 
          S.score += S.costs[type]; 
          updateProgressionUI();
          if (window.updateShopUI) window.updateShopUI();
        } 
        return; 
      } 

      DOM.playArea?.classList.add('maka-bosada-mode');
      setTimeout(() => DOM.playArea?.classList.remove('maka-bosada-mode'), 500);
      playSound(1.0, 1.0, 'boom.mp3');

      let totalPts = 0;
      let midX = 0, midY = 0;
      targets.forEach(fb => {
        const rect = fb.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        midX += cx; midY += cy;
        const pts = Math.floor(S.baseScore * Math.max(1, S.combo));
        S.score += pts;
        S.number += pts;
        totalPts += pts;
        fb.remove();
      });

      addXP(totalPts);
      const avgX = midX / targets.length;
      const avgY = midY / targets.length;
      createFloatingText(avgX, avgY - 30, totalPts);
      createFireParticles(avgX, avgY, 10);
      createFireConfetti(avgX, avgY);
      handleCombo();
      updateRank();

      updateProgressionUI();
      saveGame();
      break;
    }

    case 'freeze': {
      if (S.isTimeFrozen) return;
      S.isTimeFrozen = true;
      DOM.playArea.style.filter = 'hue-rotate(180deg)';
      playSound(1.0, 1.0, 'click3.mp3');
      createFloatingText(window.innerWidth / 2 - 60, window.innerHeight / 2, '❄ FREEZE ❄', '#88ccff');
      setTimeout(() => {
        S.isTimeFrozen = false;
        DOM.playArea.style.filter = 'none';
        playSound(1.0, 0.6, 'click3.mp3');
      }, 5000);
      break;
    }

    case 'meteor': {
      playSound(1.0, 1.0, 'boom.mp3');
      DOM.playArea?.classList.add('fire-flash');
      setTimeout(() => DOM.playArea?.classList.remove('fire-flash'), 200);
      createFloatingText(window.innerWidth / 2 - 60, window.innerHeight / 2, '☄ METEOR!', '#ffcc00');
      for (let i = 0; i < 10; i++) {
        setTimeout(() => spawnFireball(true), i * 120);
      }
      break;
    }

    case 'spirit': {
      S.autoSlashActive = true;
      playSound(1.0, 1.0, 'click2.mp3');
      createFloatingText(window.innerWidth / 2 - 80, window.innerHeight / 2, '⚔ SPIRIT BLADE ⚔', '#00ffcc');
      setTimeout(() => {
        S.autoSlashActive = false;
        createFloatingText(window.innerWidth / 2 - 60, window.innerHeight / 2 + 50, 'Blade faded', '#888');
      }, 5000);
      break;
    }
  }
}

window.triggerSkill = triggerSkill;
