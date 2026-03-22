// =========================================
// FIRE NINJA — effects.js  (Particles & VFX)
// =========================================

// ---- Floating Score Text ----
/**
 * @param {number} x
 * @param {number} y
 * @param {number|string} amount - number shows "+N", string shows raw
 * @param {string} [color='#ffcc00']
 */
function createFloatingText(x, y, amount, color = '#ffcc00') {
    const text = document.createElement('div');
    text.className    = 'floating-text';
    text.textContent  = typeof amount === 'number' ? `+${amount}` : amount;
    text.style.color  = color;
    // FIX: Clamp to viewport so text never goes off-screen
    text.style.left   = `${Math.min(x, window.innerWidth - 120)}px`;
    text.style.top    = `${Math.max(y, 10)}px`;
    DOM.playArea.appendChild(text); 
    setTimeout(() => text.remove(), 1000);
}

// ---- Cursor Fire Trail ----
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.45) return; // ~55% throttle

    const trail = document.createElement('div');
    trail.className   = 'cursor-fire';
    trail.style.left  = `${e.clientX - 7}px`;
    trail.style.top   = `${e.clientY - 7}px`;
    DOM.playArea.appendChild(trail); 
    setTimeout(() => trail.remove(), 400);
});

// ---- Fire Particles ----
function createFireParticles(x, y, intensity) {
    // Cap particle count to avoid frame-rate drops
    const count  = Math.min(10 + Math.floor(intensity * 3), 30);
    const colors = ['#ff4500', '#ff8c00', '#ffcc00', '#ff2a00'];

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 8 + 4;
        p.style.cssText = `width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};left:${x}px;top:${y}px;`;
        DOM.playArea.appendChild(p); 

        const dx = (Math.random() - 0.5) * 200;
        const dy = -Math.random() * 200 - 50;
        const anim = p.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${dx}px,${dy}px) scale(0)`, opacity: 0 }
        ], { duration: 800 + Math.random() * 400, easing: 'cubic-bezier(0,.9,.57,1)', fill: 'forwards' });
        anim.onfinish = () => p.remove();
    }
}

// ---- Fire Confetti ----
function createFireConfetti(x, y) {
    const colors = ['#ff4500', '#ff8c00', '#ffcc00', '#ff2a00', '#ffffff'];
    for (let i = 0; i < 10; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        const w = Math.random() * 8 + 4, h = Math.random() * 4 + 2;
        c.style.cssText = `width:${w}px;height:${h}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.5 ? '2px' : '50%'};left:${x}px;top:${y}px;`;
        DOM.playArea.appendChild(c); 

        const angle = Math.random() * Math.PI * 2;
        const vel   = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * vel, vy = Math.sin(angle) * vel - 5;
        const anim = c.animate([
            { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${vx * 20}px,${vy * 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], { duration: 1000 + Math.random() * 500, easing: 'cubic-bezier(0.1,1,0.1,1)', fill: 'forwards' });
        anim.onfinish = () => c.remove();
    }
}

// ---- Instagram-style Rising Flames ----
function createInstagramFlames(x, y) {
    for (let i = 0; i < 6; i++) {
        const f = document.createElement('div');
        f.className = 'flame flame-animation';
        const w = 15 + Math.random() * 15, h = 25 + Math.random() * 25;
        const offset = (i - 3) * 15;
        f.style.cssText = `width:${w}px;height:${h}px;left:${x + offset}px;top:${y}px;`;
        DOM.playArea.appendChild(f); 

        const anim = f.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: 'translateY(-60px) scale(0.5)', opacity: 0 }
        ], { duration: 500 + Math.random() * 300, easing: 'ease-out', fill: 'forwards' });
        anim.onfinish = () => f.remove();
    }
}

// ---- Master Hit Effect ----
/**
 * Call once on every successful target hit.
 * @param {number} x
 * @param {number} y
 * @param {number} pointsGained - already added to score before this call
 */
function triggerHitEffects(x, y, pointsGained) {
    // Floating text
    createFloatingText(x + (Math.random() * 40 - 20), y - 20, pointsGained);

    // Advance combo (counter only — no extra score)
    handleCombo();
    updateRank();

    // Visual fx (capped intensity)
    const intensity = Math.min(combo, 10);
    createFireParticles(x, y, intensity);
    createFireConfetti(x, y);
    createInstagramFlames(x, y);

    DOM.playArea.classList.remove('fire-flash');
    void DOM.playArea.offsetWidth;
    DOM.playArea.classList.add('fire-flash');
}
