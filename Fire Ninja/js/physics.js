function spawnFireball(noBombs = false) {
  const S = window.GameState;
  const DOM = window.DOM.elements;
  
  const fireball = document.createElement('div');
  fireball.className = 'fireball-target';

  const rand = Math.random();
  let type = 'normal';
  let powerUpType = null;

  if (!noBombs && rand < 0.1) {
    type = 'bomb';
    fireball.classList.add('target-bomb');
  } else if (rand < 0.25) {
    type = 'star';
    fireball.classList.add('target-star');
  } else if (rand > 0.92 && !noBombs) {
    type = 'powerup';
    fireball.classList.add('target-powerup');
    
    const pRand = Math.random();
    if (pRand < 0.25) { powerUpType = 'fireBoost'; fireball.classList.add('pu-fire'); }
    else if (pRand < 0.5) { powerUpType = 'slowMo'; fireball.classList.add('pu-slow'); }
    else if (pRand < 0.75) { powerUpType = 'shield'; fireball.classList.add('pu-shield'); }
    else { powerUpType = 'burst'; fireball.classList.add('pu-burst'); }
  }

  const startX = Math.random() * (window.innerWidth - 120) + 10;
  let x = startX, y = window.innerHeight;

  let vx = (Math.random() - 0.5) * 8;
  let vy = -(Math.random() * 8 + 12);
  let g = 0.2;
  if (type === 'star') { vy = -(Math.random() * 5 + 18); g = 0.30; }
  if (type === 'bomb') { vy = -(Math.random() * 4 + 7); g = 0.08; }
  if (type === 'powerup') { vy = -(Math.random() * 3 + 10); g = 0.1; }

  fireball.style.left = `${x}px`;
  fireball.style.top = `${y}px`;
  DOM.playArea?.appendChild(fireball);

  let isHit = false;

  const hitAction = () => {
    if (isHit || S.isPaused || S.isGameOver) return;
    isHit = true;

    if (type === 'bomb') {
      if (S.shieldActive) {
        S.shieldActive = false;
        const shieldBtn = document.querySelector('#upg-shield .buy-btn');
        if (shieldBtn) shieldBtn.style.display = 'block';
        DOM.shieldStatus?.classList.add('hidden');
        if (window.updateShopUI) window.updateShopUI();
        playSound(1.0, 0.8, 'boomx.mp3');
        createFloatingText(x, y - 40, 'SHIELD BROKEN', '#00ffcc');
      } else {
        if (window.gameOver) window.gameOver();
      }
      fireball.remove();
      return;
    }

    if (type === 'powerup') {
      playSound(1.5, 1.0, 'click3.mp3');

      if (powerUpType === 'fireBoost') {
        const oldBase = S.baseScore;
        S.baseScore = oldBase * 5;
        createFloatingText(x, y - 40, '🔥 5x POWER BOOST 🔥', '#ff4500');
        DOM.playArea?.classList.add('fire-flash');
        setTimeout(() => { DOM.playArea?.classList.remove('fire-flash'); }, 500);
        setTimeout(() => { S.baseScore = oldBase; }, 10000);
      } else if (powerUpType === 'slowMo') {
        createFloatingText(x, y - 40, '⏳ SLOW MOTION', '#88ccff');
        if (window.triggerSkill) window.triggerSkill('freeze', true);
      } else if (powerUpType === 'shield') {
        createFloatingText(x, y - 40, '🛡️ FREE SHIELD', '#00ffcc');
        S.shieldActive = true;
        if (window.updateShopUI) window.updateShopUI();
      } else if (powerUpType === 'burst') {
        createFloatingText(x, y - 40, '💥 SCORE BURST', '#ffcc00');
        const burst = 500 * S.playerLevel;
        S.score += burst;
        S.number += burst;
        addXP(burst);
        saveGame();
      }

      createFireParticles(x, y, 5);
      createFireConfetti(x, y);
      handleCombo();
      updateRank();
      if (window.updateShopUI) window.updateShopUI();
      fireball.remove();
      return;
    }

    const multiplier = type === 'star' ? 5 : 1;
    const pointsGained = Math.floor(S.baseScore * Math.max(1, S.combo) * multiplier);
    S.score += pointsGained;
    S.number += pointsGained;
    addXP(pointsGained);
    updateProgressionUI();

    if (type === 'star') {
      playSound(1.0, 1.0, 'click2.mp3');
    } else {
      const pitch = 1 + Math.min(S.combo, 20) * 0.05;
      playSound(pitch, 1.0, 'click.mp3');
    }

    triggerHitEffects(x, y, pointsGained);
    fireball.remove();
  };

  fireball.addEventListener('mousedown', hitAction);
  fireball.addEventListener('mouseenter', (e) => { if (e.buttons === 1) hitAction(); });

  function tick() {
    if (isHit || S.isGameOver) return;

    if (!S.isPaused && !S.isTimeFrozen) {
      vy += g;
      x += vx;
      y += vy;
      fireball.style.left = `${x}px`;
      fireball.style.top = `${y}px`;

      if (S.autoSlashActive && type !== 'bomb' && type !== 'powerup' && vy > 0) {
        hitAction();
        return;
      }

      if (y > window.innerHeight + 120) {
        fireball.remove();
        if (type !== 'bomb') breakCombo();
        return;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

window.spawnFireball = spawnFireball;
