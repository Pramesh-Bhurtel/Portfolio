const DOM = {
  get: function(id) {
    return document.getElementById(id);
  },
  getAll: function(selector) {
    return document.querySelectorAll(selector);
  },
  elements: {
    number: null,
    score: null,
    rankName: null,
    comboContainer: null,
    combo: null,
    timerBar: null,
    playArea: null,
    missOverlay: null,
    stateOverlay: null,
    stateTitle: null,
    stateDesc: null,
    menusContainer: null,
    pauseToggleBtn: null,
    shieldStatus: null,
    levelDisplay: null,
    xpBarFill: null,
    introGuide: null
  },
  init: function() {
    this.elements.number = this.get('number');
    this.elements.score = this.get('score');
    this.elements.rankName = this.get('rank-name');
    this.elements.comboContainer = this.get('combo-container');
    this.elements.combo = this.get('combo');
    this.elements.timerBar = this.get('combo-container')?.querySelector('.combo-timer-bar');
    this.elements.playArea = this.get('play-area');
    this.elements.missOverlay = this.get('miss-overlay');
    this.elements.stateOverlay = this.get('game-state-overlay');
    this.elements.stateTitle = this.get('state-title');
    this.elements.stateDesc = this.get('state-desc');
    this.elements.menusContainer = this.get('menus-container');
    this.elements.pauseToggleBtn = this.get('pause-toggle');
    this.elements.shieldStatus = this.get('shield-status');
    this.elements.levelDisplay = this.get('player-level-display');
    this.elements.xpBarFill = this.get('xp-bar-fill');
    this.elements.introGuide = this.get('intro-guide');
  }
};

window.DOM = DOM;
