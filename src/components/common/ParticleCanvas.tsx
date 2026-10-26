import React, { useEffect, useRef } from 'react';
import type { CelebrationStage } from '../../types';

interface ParticleCanvasProps {
  density?: number;
  stage?: CelebrationStage;
  isFinale?: boolean;
}

type ConfettiShape = 'ribbon' | 'circle' | 'star' | 'petal';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  width: number;
  height: number;
  color: string;
  shape: ConfettiShape;
  rotation: number;
  vRot: number;
  tilt: number;
  vTilt: number;
  wobble: number;
  vWobble: number;
  gravity: number;
  drag: number;
  opacity: number;
  decay: number;
  shimmer: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  wobble: number;
  opacity: number;
  fadeSpeed: number;
}

const CONFETTI_PALETTE = [
  '#B98575', // Rose Gold
  '#F7E7CE', // Champagne
  '#EFA7C4', // Rose Pink
  '#F8C8DC', // Soft Blush
  '#FFFAFC', // Pearl White
  '#E6C280', // Sparkling Gold
  '#54263D', // Deep Wine
  '#D89B8C', // Antique Blush
];

const PETAL_COLORS = [
  'rgba(248, 200, 220, 0.65)', // light pink #F8C8DC
  'rgba(239, 167, 196, 0.55)', // rose pink #EFA7C4
  'rgba(247, 231, 206, 0.70)', // champagne #F7E7CE
  'rgba(185, 133, 117, 0.45)', // rose gold #B98575
  'rgba(255, 250, 252, 0.75)', // pearl white #FFFAFC
];

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  density = 35,
  stage,
  isFinale = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiPiecesRef = useRef<ConfettiPiece[]>([]);
  const hasExplodedRef = useRef<boolean>(false);

  const shouldTriggerFinale = isFinale || stage === 'FINAL_FINALE';

  // Handle triggering confetti explosion specifically upon entering FINAL_FINALE
  useEffect(() => {
    if (shouldTriggerFinale && !hasExplodedRef.current) {
      hasExplodedRef.current = true;
      triggerConfettiExplosion();
    } else if (!shouldTriggerFinale) {
      // Reset trigger so replaying allows the explosion to fire again
      hasExplodedRef.current = false;
      confettiPiecesRef.current = [];
    }
  }, [shouldTriggerFinale]);

  const triggerConfettiExplosion = () => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const shapes: ConfettiShape[] = ['ribbon', 'ribbon', 'circle', 'star', 'petal'];

    const createPiece = (
      originX: number,
      originY: number,
      angleMin: number,
      angleMax: number,
      power: number
    ): ConfettiPiece => {
      const angle = angleMin + Math.random() * (angleMax - angleMin);
      const speed = isReducedMotion
        ? Math.random() * 3 + 1
        : Math.random() * (power * 0.7) + power * 0.4;

      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)];
      const baseSize = Math.random() * 8 + 6;

      return {
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: baseSize,
        width: shape === 'ribbon' ? baseSize * (Math.random() * 0.7 + 1.2) : baseSize,
        height: shape === 'ribbon' ? baseSize * 0.6 : baseSize,
        color,
        shape,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.18,
        tilt: Math.random() * Math.PI,
        vTilt: Math.random() * 0.12 + 0.05,
        wobble: Math.random() * Math.PI * 2,
        vWobble: Math.random() * 0.08 + 0.03,
        gravity: isReducedMotion ? 0.08 : Math.random() * 0.08 + 0.16,
        drag: isReducedMotion ? 0.98 : Math.random() * 0.02 + 0.94,
        opacity: 1,
        decay: Math.random() * 0.003 + 0.002,
        shimmer: Math.random() > 0.4,
      };
    };

    const newPieces: ConfettiPiece[] = [];

    // 1. Central primary explosion: Upward 360-degree fountain
    const centerCount = isReducedMotion ? 40 : 130;
    for (let i = 0; i < centerCount; i++) {
      newPieces.push(
        createPiece(width * 0.5, height * 0.45, -Math.PI * 0.95, -Math.PI * 0.05, 22)
      );
    }

    // 2. Left corner cannon launching inward and upward
    const leftCount = isReducedMotion ? 25 : 75;
    for (let i = 0; i < leftCount; i++) {
      newPieces.push(
        createPiece(width * 0.1, height * 0.85, -Math.PI * 0.45, -Math.PI * 0.15, 24)
      );
    }

    // 3. Right corner cannon launching inward and upward
    const rightCount = isReducedMotion ? 25 : 75;
    for (let i = 0; i < rightCount; i++) {
      newPieces.push(
        createPiece(width * 0.9, height * 0.85, -Math.PI * 0.85, -Math.PI * 0.55, 24)
      );
    }

    confettiPiecesRef.current.push(...newPieces);

    // 4. Secondary celebratory wave 350ms later for continuous grandeur
    setTimeout(() => {
      if (!canvasRef.current) return;
      const wavePieces: ConfettiPiece[] = [];
      const waveCount = isReducedMotion ? 20 : 60;
      for (let i = 0; i < waveCount; i++) {
        wavePieces.push(
          createPiece(width * 0.5, height * 0.35, -Math.PI * 0.85, -Math.PI * 0.15, 18)
        );
      }
      confettiPiecesRef.current.push(...wavePieces);
    }, 350);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial floating romantic petals
    const petals: Petal[] = [];
    for (let i = 0; i < density; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        wobble: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.6 + 0.3,
        fadeSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const drawStar = (context: CanvasRenderingContext2D, size: number) => {
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.4;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        context.lineTo(Math.cos(rot) * outerRadius, Math.sin(rot) * outerRadius);
        rot += step;
        context.lineTo(Math.cos(rot) * innerRadius, Math.sin(rot) * innerRadius);
        rot += step;
      }
      context.lineTo(0, -outerRadius);
      context.closePath();
      context.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render ambient floating petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.wobble += 0.025;
        p.rotation += p.vRot;
        p.x += p.vx + Math.sin(p.wobble) * 0.5;
        p.y += p.vy;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.85 || p.opacity < 0.2) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));
        ctx.fillStyle = p.color;

        // Draw soft romantic petal curve
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.6, p.size * 0.8, p.size * 0.3, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.3, -p.size * 0.6, -p.size * 0.6, 0, -p.size);
        ctx.fill();

        ctx.restore();
      }

      // 2. Render celebration confetti explosion pieces
      const confetti = confettiPiecesRef.current;
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];

        // Apply physical forces
        c.vx *= c.drag;
        c.vy *= c.drag;
        c.vy += c.gravity;

        c.wobble += c.vWobble;
        c.x += c.vx + Math.sin(c.wobble) * 0.7;
        c.y += c.vy;

        c.rotation += c.vRot;
        c.tilt += c.vTilt;
        c.opacity -= c.decay;

        // Cull faded or offscreen particles
        if (c.opacity <= 0 || c.y > height + 50) {
          confetti.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);

        // 3D perspective tumbling illusion via cosine scaling
        const scaleX = Math.cos(c.tilt);
        ctx.scale(scaleX, 1);

        const currentAlpha = Math.max(
          0,
          Math.min(1, c.shimmer ? c.opacity * (0.8 + 0.2 * Math.sin(c.tilt * 2)) : c.opacity)
        );
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = c.color;

        switch (c.shape) {
          case 'ribbon':
            ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
            break;

          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'star':
            drawStar(ctx, c.size * 0.8);
            break;

          case 'petal':
            ctx.beginPath();
            ctx.moveTo(0, -c.size);
            ctx.bezierCurveTo(c.size * 0.6, -c.size * 0.6, c.size * 0.8, c.size * 0.3, 0, c.size);
            ctx.bezierCurveTo(
              -c.size * 0.8,
              c.size * 0.3,
              -c.size * 0.6,
              -c.size * 0.6,
              0,
              -c.size
            );
            ctx.fill();
            break;
        }

        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none transition-all duration-700 ${
        shouldTriggerFinale ? 'z-30 opacity-95' : 'z-0 opacity-80'
      }`}
      aria-hidden="true"
    />
  );
};
