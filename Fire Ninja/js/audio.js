// =========================================
// FIRE NINJA — audio.js  (Sound Engine)
// =========================================

const pools = {};
const AUDIO_POOL_SIZE = 5;

/**
 * Play an audio file at a dynamic pitch and volume.
 * @param {number} pitch  - playbackRate (0.1 = very low boom, 3.0 = high squeak)
 * @param {number} volume - 0.0 to 1.0
 * @param {string} soundName - the filename of the sound to play (required)
 */
function playSound(pitch = 1.0, volume = 1.0, soundName) {
    if (!soundName) {
        console.warn("playSound called without soundName! Defaulting to click.mp3");
        soundName = 'click.mp3';
    }
    if (!pools[soundName]) {
        pools[soundName] = { pool: [], index: 0 };
        for (let i = 0; i < AUDIO_POOL_SIZE; i++) {
            const a = new Audio(`assets/audio/${soundName}`);
            a.preload = 'auto';
            pools[soundName].pool.push(a);
        }
    }
    
    const poolData = pools[soundName];
    const sound = poolData.pool[poolData.index];
    poolData.index = (poolData.index + 1) % AUDIO_POOL_SIZE;

    sound.currentTime  = 0;
    sound.preservesPitch = false;
    sound.playbackRate = Math.max(0.1, Math.min(pitch, 4.0)); // clamp to safe range
    sound.volume       = Math.max(0, Math.min(volume, 1.0));
    sound.play().catch(() => {});
}
