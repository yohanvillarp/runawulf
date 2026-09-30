/**
 * @file RunicBackground.tsx
 * @description Dynamic ambient canvas particle field with subtle floating runes reflecting active posture accent.
 */

import { useEffect, useRef } from 'react';
import { useOperationMode } from '@/app/providers/ModeProvider';
import { ELDER_FUTHARK_RUNES } from '@/shared/lib/runes';

interface Particle {
  x: number;
  y: number;
  rune: string;
  size: number;
  alpha: number;
  dx: number;
  dy: number;
}

export function RunicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { operationMode } = useOperationMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const runeCount = 45;
    const particles: Particle[] = Array.from({ length: runeCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      rune: ELDER_FUTHARK_RUNES[Math.floor(Math.random() * ELDER_FUTHARK_RUNES.length)],
      size: 14 + Math.random() * 20,
      alpha: 0.04 + Math.random() * 0.12,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = operationMode.accentColor;
        ctx.fillText(p.rune, p.x, p.y);

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [operationMode.accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 transition-opacity duration-700"
    />
  );
}
