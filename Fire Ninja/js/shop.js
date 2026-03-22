function updateShopUI() {
  const S = window.GameState;
  const DOM = window.DOM.elements;
  
  const upgradeIds = ['base-fire', 'auto-spark', 'bellows', 'nova', 'freeze', 'meteor', 'spirit', 'shield'];
  const costMap = {
    'base-fire': 'baseFire', 
    'auto-spark': 'autoSpark', 
    'bellows': 'bellows',
    'nova': 'nova', 
    'freeze': 'freeze', 
    'meteor': 'meteor', 
    'spirit': 'spirit', 
    'shield': 'shield'
  };

  upgradeIds.forEach(id => {
    const el = document.getElementById(`cost-${id}`);
    if (el) el.textContent = S.costs[costMap[id]];
    
    const btn = document.querySelector(`#${id.includes('skill') || id === 'nova' || id === 'freeze' || id === 'meteor' || id === 'spirit' ? 'skill' : 'upg'}-${id} .buy-btn`);
    if (btn) btn.disabled = S.score < S.costs[costMap[id]];
  });

  const shieldBtn = document.querySelector('#upg-shield .buy-btn');
  if (shieldBtn) {
    if (S.shieldActive) {
      shieldBtn.style.display = 'none';
      DOM.shieldStatus?.classList.remove('hidden');
    } else {
      shieldBtn.style.display = 'block';
      shieldBtn.disabled = S.score < S.costs.shield;
      DOM.shieldStatus?.classList.add('hidden');
    }
  }

  document.querySelectorAll('.skills-panel .upgrade-item').forEach(item => {
    const reqLevel = item.getAttribute('data-req-level');
    if (reqLevel) {
      item.classList.toggle('locked', S.playerLevel < parseInt(reqLevel));
    }
  });
}

function buyUpgrade(type) {
  const S = window.GameState;
  
  if (S.score < S.costs[type]) return;
  S.score -= S.costs[type];

  switch (type) {
    case 'baseFire':
      S.baseScore++;
      S.costs.baseFire = Math.floor(S.costs.baseFire * 1.5);
      break;
    case 'autoSpark':
      S.autoSparkValue++;
      S.costs.autoSpark = Math.floor(S.costs.autoSpark * 1.5);
      break;
    case 'bellows':
      S.bellowsMultiplier = Math.min(S.bellowsMultiplier + 0.5, 4.0);
      S.costs.bellows = Math.floor(S.costs.bellows * 2.0);
      createFloatingText(window.innerWidth / 2 - 80, window.innerHeight / 2, '⏱ COMBO WINDOW EXTENDED!', '#ffcc00');
      break;
    case 'shield':
      S.shieldActive = true;
      S.costs.shield = Math.floor(S.costs.shield * 1.5);
      break;
  }

  updateProgressionUI();
  updateShopUI();
  saveGame();
}

window.updateShopUI = updateShopUI;
window.buyUpgrade = buyUpgrade;
