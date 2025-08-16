import { useEffect, useRef } from "react";

export default function RunesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const runes = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞᛟ".split("");

    type Particle = {
      x: number;
      y: number;
      rune: string;
      size: number;
      alpha: number;
      dx: number;
      dy: number;
    };

    // Más runas para llenar la pantalla
    const runeCount = 100;
    const particles: Particle[] = Array.from({ length: runeCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      rune: runes[Math.floor(Math.random() * runes.length)],
      size: 18 + Math.random() * 32, // Tamaño más variado
      alpha: 0.15 + Math.random() * 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px 'Times New Roman', serif`; // Cambia a fuente decorativa si quieres
        ctx.fillStyle = "#0ff"; // celeste mágico
        ctx.fillText(p.rune, p.x, p.y);

        // Movimiento
        p.x += p.dx;
        p.y += p.dy;

        // Wrap-around para que vuelvan por el otro lado
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.globalAlpha = 1; // Reset
      });
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}
