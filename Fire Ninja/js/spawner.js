function startSpawnerOnce() {
  const S = window.GameState;
  if (S._spawnerRunning) return;
  S._spawnerRunning = true;
  S._spawnerGen++;
  spawnerLoop(S._spawnerGen);
}

function spawnerLoop(gen) {
  const S = window.GameState;
  
  if (S.isGameOver || gen !== S._spawnerGen) { 
    if (gen !== S._spawnerGen) console.log('Old spawner loop killed.');
    return; 
  }
  
  if (!S.isPaused) {
    spawnFireball();
    const base = Math.max(400, 1500 - S.score / 100);
    S.spawnRate = (base + Math.random() * 500) * 0.95;
  }
  
  if (!S.isGameOver) setTimeout(() => spawnerLoop(gen), S.spawnRate); 
}

function resetSpawner() {
  const S = window.GameState;
  S._spawnerRunning = false;
  S._spawnerGen++;
}

window.startSpawnerOnce = startSpawnerOnce;
window.resetSpawner = resetSpawner;
