const GameState = {
  score: 0,
  number: 0,
  combo: 0,
  highScore: 0,
  playerLevel: 1,
  playerXP: 0,
  baseScore: 1,
  autoSparkValue: 0,
  bellowsMultiplier: 1,
  currentRankIndex: 0,
  isPaused: true,
  isGameOver: false,
  isTimeFrozen: false,
  autoSlashActive: false,
  shieldActive: false,
  _comboTimer: null,
  _ultimateOnCooldown: false,
  _spawnerRunning: false,
  _spawnerGen: 0,
  spawnRate: 1500,
  costs: {
    baseFire: 25,
    autoSpark: 100,
    bellows: 800,
    shield: 2500,
    nova: 500,
    freeze: 1000,
    meteor: 1500,
    spirit: 4000
  },
  CONFIG: {
    SAVE_KEY: 'fireNinjaData_v3',
    VERSION: 3,
    RANKS: [
      { name: 'Spark', req: 0 },
      { name: 'Ember', req: 500 },
      { name: 'Blaze', req: 2000 },
      { name: 'Inferno', req: 10000 },
      { name: 'Maka Bosada Aag', req: 50000 }
    ],
    XP_BASE: 100,
    XP_EXPONENT: 1.5,
    COMBO_TIMEOUT: 2000,
    ULTIMATE_COOLDOWN: 3000,
    INITIAL_COSTS: {
      baseFire: 25,
      autoSpark: 100,
      bellows: 800,
      shield: 2500,
      nova: 500,
      freeze: 1000,
      meteor: 1500,
      spirit: 4000
    }
  }
};

Object.defineProperty(window, 'GameState', {
  value: GameState,
  writable: false,
  configurable: false
});
