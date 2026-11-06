import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; tw: number; ph: number; hue: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number };

type Props = {
  density?: number;
  meteors?: boolean;
  className?: string;
};

/** Twinkling starfield with occasional shooting stars. */
export function NightSky({ density = 1, meteors = true, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let shots: Meteor[] = [];
    let nextShot = performance.now() + 1600 + Math.random() * 3000;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((w * h) / 1400 * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.92,
        r: Math.random() * 1.3 + 0.3,
        tw: 0.5 + Math.random() * 2,
        ph: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.12 ? 340 : Math.random() < 0.2 ? 40 : 230,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 1000 * s.tw + s.ph));
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 70%, 88%, ${a * 0.9})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.1) {
          ctx.globalAlpha = a * 0.25;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      if (meteors && t > nextShot) {
        nextShot = t + 3500 + Math.random() * 5500;
        const sx = Math.random() * w * 0.7;
        shots.push({ x: sx, y: Math.random() * h * 0.25, vx: 5 + Math.random() * 3, vy: 2.4 + Math.random() * 1.6, life: 0, max: 60 + Math.random() * 30 });
      }
      shots = shots.filter((m) => m.life < m.max);
      for (const m of shots) {
        m.life++;
        m.x += m.vx;
        m.y += m.vy;
        const p = 1 - m.life / m.max;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
        grad.addColorStop(0, `rgba(255,240,225,${0.85 * p})`);
        grad.addColorStop(1, "rgba(255,240,225,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density, meteors]);

  return <canvas ref={ref} className={className ?? "absolute inset-0"} aria-hidden />;
}
