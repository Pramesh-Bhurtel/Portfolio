import { $, debounce } from './dom.js';

let isGrainsInitialized = false;
let animationFrameId = null;

export function initGrains() {
  if (isGrainsInitialized) return;
  isGrainsInitialized = true;

  const canvas = $('#grain-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let isVisible = true;
  
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e11d48';

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  const debouncedResize = debounce(resize, 250);

  class Particle {
    constructor() {
      this.init();
    }

    init() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseX = this.x;
      this.baseY = this.y;
      
      // Physics properties
      this.size = Math.random() * 1.2 + 0.4;
      this.mass = Math.random() * 10 + 5; // Individual weight
      this.velocity = {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2
      };
      
      this.opacity = Math.random() * 0.3 + 0.1;
      this.color = accentColor;
      this.friction = 0.98;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    update() {
      // 1. Mouse Attraction/Separation
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      const maxDistance = 250;
      const minDistance = 50; // Non-attaching buffer

      if (distance < maxDistance && distance > minDistance) {
        // Soft Attraction based on mass
        let force = (maxDistance - distance) / maxDistance;
        let acceleration = force / this.mass;
        
        this.velocity.x += (dx / distance) * acceleration * 2;
        this.velocity.y += (dy / distance) * acceleration * 2;
      } else if (distance <= minDistance) {
        // Repulsion to prevent attachment
        let force = (minDistance - distance) / minDistance;
        this.velocity.x -= (dx / distance) * force * 1.5;
        this.velocity.y -= (dy / distance) * force * 1.5;
      }

      // 2. Elastic Return to Base
      let homeDx = this.baseX - this.x;
      let homeDy = this.baseY - this.y;
      let homeDist = Math.sqrt(homeDx * homeDx + homeDy * homeDy);
      
      if (homeDist > 1) {
        this.velocity.x += homeDx * 0.005;
        this.velocity.y += homeDy * 0.005;
      }

      // 3. Move with Momentum
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;
      
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // 4. Update core drift
      this.baseX += (Math.random() - 0.5) * 0.1;
      this.baseY += (Math.random() - 0.5) * 0.1;

      // Wrap core drift
      if (this.baseX < 0) this.baseX = canvas.width;
      if (this.baseX > canvas.width) this.baseX = 0;
      if (this.baseY < 0) this.baseY = canvas.height;
      if (this.baseY > canvas.height) this.baseY = 0;
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(150, (canvas.width * canvas.height) / 10000);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    if (!isVisible) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  const handleMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  const handleVisibilityChange = () => {
    isVisible = !document.hidden;
    if (isVisible) {
      animate();
    } else if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };

  window.addEventListener('resize', debouncedResize);
  window.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  resize();
  animate();
  
  // Return cleanup function just in case
  return () => {
    window.removeEventListener('resize', debouncedResize);
    window.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
