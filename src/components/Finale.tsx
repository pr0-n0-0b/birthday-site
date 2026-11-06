import { useEffect, useRef, useState, useCallback } from "react";
import { RotateCcw, Sparkle, Heart } from "lucide-react";
import { Reveal } from "./Reveal";
import { useHer } from "../lib/name";

const PALETTE = ["#ffbe6b", "#e57f9a", "#a98fe0", "#ffd9a0", "#f7ede2", "#7fd4d0"];

type P = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; color: string; size: number;
  rocket?: boolean; targetY?: number;
  confetti?: boolean; rot?: number; vr?: number; shape?: number;
};

export function Finale() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partsRef = useRef<P[]>([]);
  const runningRef = useRef(false);
  const autoRef = useRef<number>(0);
  const [celebrated, setCelebrated] = useState(false);
  const { name } = useHer();

  const burst = useCallback((x: number, y: number, colorOverride?: string) => {
    const color = colorOverride ?? PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const count = 60 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2 + Math.random() * 0.2;
      const sp = 1.4 + Math.random() * 4.2;
      partsRef.current.push({
        x, y,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        life: 0, max: 70 + Math.random() * 50,
        color: Math.random() < 0.75 ? color : PALETTE[Math.floor(Math.random() * PALETTE.length)],
        size: 1 + Math.random() * 2,
      });
    }
  }, []);

  const confetti = useCallback((w: number) => {
    for (let i = 0; i < 130; i++) {
      partsRef.current.push({
        x: Math.random() * w, y: -20 - Math.random() * 160,
        vx: (Math.random() - 0.5) * 1.4, vy: 1 + Math.random() * 1.8,
        life: 0, max: 400 + Math.random() * 200,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        size: 4 + Math.random() * 5, confetti: true,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2,
        shape: Math.random(),
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const launch = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.height) return;
      const x = r.width * (0.15 + Math.random() * 0.7);
      const targetY = r.height * (0.12 + Math.random() * 0.3);
      partsRef.current.push({
        x, y: r.height + 6, vx: (Math.random() - 0.5) * 1.1, vy: -(7.5 + Math.random() * 2.5),
        life: 0, max: 200, color: "#ffd9a0", size: 2, rocket: true, targetY,
      });
    };

    const io = new IntersectionObserver(
      ([e]) => {
        runningRef.current = e.isIntersecting;
        if (e.isIntersecting && !celebrated) {
          setCelebrated(true);
          launch(); setTimeout(launch, 300); setTimeout(launch, 650);
          setTimeout(() => confetti(w), 400);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(canvas);

    autoRef.current = window.setInterval(() => {
      if (runningRef.current && Math.random() < 0.8) launch();
    }, 1300);

    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      burst(e.clientX - r.left, e.clientY - r.top);
      // small echo burst
      setTimeout(() => burst(e.clientX - r.left + (Math.random() - 0.5) * 120, e.clientY - r.top - 40 - Math.random() * 60), 180);
    };
    canvas.addEventListener("click", onClick);

    const tick = () => {
      // fade trails
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "rgba(0,0,0,0.88)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const parts = partsRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life++;
        if (p.life > p.max || (p.confetti && p.y > h + 30)) { parts.splice(i, 1); continue; }

        if (p.rocket) {
          p.vy += 0.09;
          p.x += p.vx; p.y += p.vy;
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          // spark trail
          if (Math.random() < 0.5) parts.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 0.6, vy: 0.5, life: 0, max: 26, color: "#ffbe6b", size: 0.8 });
          if (p.targetY != null && p.y <= p.targetY) {
            parts.splice(i, 1);
            burst(p.x, p.y);
          }
          continue;
        }

        if (p.confetti) {
          p.vy += 0.015; p.vx *= 0.995;
          p.x += p.vx + Math.sin(p.life / 14) * 0.7; p.y += p.vy;
          p.rot! += p.vr!;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot!);
          ctx.globalAlpha = Math.min(1, (p.max - p.life) / 90);
          ctx.fillStyle = p.color;
          if (p.shape! < 0.5) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
          ctx.globalAlpha = 1;
          continue;
        }

        p.vy += 0.035; p.vx *= 0.988; p.vy *= 0.988;
        p.x += p.vx; p.y += p.vy;
        const fade = 1 - p.life / p.max;
        ctx.globalAlpha = Math.max(0, fade);
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.size * (0.5 + fade * 0.7), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(autoRef.current);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("click", onClick);
    };
  }, [burst, confetti, celebrated]);

  const salvo = () => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => burst(r.width * (0.2 + Math.random() * 0.6), r.height * (0.2 + Math.random() * 0.25)), i * 240);
    }
    confetti(r.width);
  };

  return (
    <section id="finale" className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,#141031_0%,#05040f_70%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-pointer" />

      <div className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.5em] text-lilac-300/80">finale · and always</p>
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="mt-8 font-serif text-[12vw] font-light leading-none sm:text-8xl lg:text-9xl">
            <span className="italic text-ember-300 text-glow-warm">Happy</span>
            <br />
            <span className="text-white text-glow-rose">Birthday</span>
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-4 font-script text-4xl sm:text-6xl text-rose-2-300 text-glow-rose">
            {name === "Laiba" ? "my once-upon-a-time" : name}
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mx-auto mt-8 max-w-xl font-serif text-lg italic leading-relaxed text-slate-300/90 sm:text-xl">
            Kuch log chaly jaty hain lekin apna kuch hissa humary under chor jaty hain.
            jaisy tum apna kuch hissa mujh mai chor gai — mai bs ye kabhi kah nhi saka .
            <span className="mt-2 block text-ember-300/90">So: thank you. And happy birthday, ek mehfooz duri sy.</span>
          </p>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="pointer-events-auto mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={salvo}
              className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-rose-2-500 to-ember-400 px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-white shadow-[0_10px_40px_rgba(214,95,128,.4)] transition hover:scale-105 hover:shadow-[0_10px_60px_rgba(255,190,107,.5)] active:scale-95"
            >
              <Sparkle className="h-4 w-4 transition group-hover:rotate-90" />
              light the sky again
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-slate-200 backdrop-blur transition hover:border-lilac-400/60 hover:text-white active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              read it once more
            </button>
          </div>
        </Reveal>
        <Reveal delay={0.7}>
          <p className="mt-8 text-[10px] uppercase tracking-[0.35em] text-slate-500">Screen pe Kahi pr bhi click kro</p>
        </Reveal>
      </div>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/8 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <span className="flex items-center gap-2 font-serif text-sm italic text-slate-400">
            written in light <Heart className="h-3.5 w-3.5 text-rose-2-400" fill="currentColor" strokeWidth={0} /> for {name === "Laiba" ? "Laiba" : name}
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
            a birthday · an apology · HAPPY BIRTHDAY AND SORRY
          </span>
        </div>
      </footer>
    </section>
  );
}
