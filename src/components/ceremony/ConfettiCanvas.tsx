import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  trigger: boolean;
  origin?: { x: number; y: number } | null;
}

type ConfettiShape = 'ribbon' | 'circle' | 'star' | 'petal';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: ConfettiShape;
  rotation: number;
  rotationSpeed: number;
  tilt: number;
  tiltSpeed: number;
  gravity: number;
  drag: number;
  opacity: number;
  fadeRate: number;
  life: number;
  maxLife: number;
}

// Light-pink romantic & royal birthday palette
const CONFETTI_PALETTE = [
  '#B98575', // Rose Gold
  '#F7E7CE', // Champagne
  '#EFA7C4', // Rose Pink
  '#F8C8DC', // Soft Blush
  '#FFFAFC', // Pearl White
  '#54263D', // Deep Berry
  '#E6C280', // Sparkling Gold
  '#D89B8C', // Antique Blush
];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ trigger, origin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Retina-resolution setup
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    // Burst origin coordinates (defaults to cake center area if not provided)
    const burstX = origin ? origin.x : width / 2;
    const burstY = origin ? origin.y : height * 0.52;

    const particles: Particle[] = [];

    const createParticle = (ox: number, oy: number, powerScale = 1.0): Particle => {
      const angle = isReducedMotion
        ? Math.random() * Math.PI * 2
        : -Math.PI / 2 + (Math.random() - 0.5) * 1.95; // Upward-fanning cone (-145deg to -35deg)

      const speed = isReducedMotion
        ? Math.random() * 2 + 1
        : (Math.random() * 14 + 8) * powerScale;

      const shapes: ConfettiShape[] = ['ribbon', 'ribbon', 'circle', 'star', 'petal'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)];
      const maxLife = isReducedMotion ? 90 : Math.floor(Math.random() * 60 + 130);

      return {
        x: ox + (Math.random() - 0.5) * 30,
        y: oy + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed,
        size: shape === 'ribbon' ? Math.random() * 6 + 6 : Math.random() * 4 + 4,
        color,
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.18,
        tilt: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.12 + 0.05,
        gravity: Math.random() * 0.12 + 0.32,
        drag: 0.975,
        opacity: 1,
        fadeRate: 1 / maxLife,
        life: 0,
        maxLife,
      };
    };

    // Primary explosion wave: 130 energetic celebration particles
    const primaryCount = isReducedMotion ? 25 : 130;
    for (let i = 0; i < primaryCount; i++) {
      particles.push(createParticle(burstX, burstY, 1.0));
    }

    // Secondary burst: sparkling glitter shower at +180ms
    let secondaryTimeout: number | undefined;
    if (!isReducedMotion) {
      secondaryTimeout = window.setTimeout(() => {
        for (let i = 0; i < 45; i++) {
          particles.push(createParticle(burstX + (Math.random() - 0.5) * 50, burstY - 20, 0.85));
        }
      }, 180);
    }

    // Draw helper for 5-pointed celebration star
    const drawStar = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        c.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * size, -Math.sin(((18 + i * 72) * Math.PI) / 180) * size);
        c.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (size * 0.45), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (size * 0.45));
      }
      c.closePath();
      c.fill();
    };

    // Draw helper for romantic rose petal
    const drawPetal = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, -size);
      c.bezierCurveTo(size * 0.8, -size * 0.5, size * 0.8, size * 0.5, 0, size);
      c.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.8, -size * 0.5, 0, -size);
      c.fill();
    };

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let activeParticles = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        // Apply physics
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.rotationSpeed;
        p.tilt += p.tiltSpeed;

        // Fade out in second half of life
        if (p.life > p.maxLife * 0.45) {
          p.opacity = Math.max(0, p.opacity - p.fadeRate * 1.5);
        }

        if (p.opacity <= 0.01 || p.y > height + 40) {
          continue;
        }

        activeParticles++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'ribbon') {
          // 3D Perspective Flip along the tilt axis
          const tiltScale = Math.cos(p.tilt);
          ctx.scale(1, tiltScale);
          ctx.fillRect(-p.size * 0.7, -p.size * 1.4, p.size * 1.4, p.size * 2.8);
          // Highlight shine edge
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = p.opacity * 0.35;
          ctx.fillRect(-p.size * 0.7, -p.size * 1.4, p.size * 0.35, p.size * 2.8);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
          // Micro sparkle center
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = p.opacity * 0.6;
          ctx.beginPath();
          ctx.arc(-1, -1, p.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, p.size * 1.2);
        } else if (p.shape === 'petal') {
          drawPetal(ctx, p.size * 1.1);
        }

        ctx.restore();
      }

      // Keep rendering as long as particles are active
      if (activeParticles > 0) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(secondaryTimeout);
      cancelAnimationFrame(animationId);
    };
  }, [trigger, origin]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
};
