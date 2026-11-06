import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/** A scratch card hiding the one thing never said. */
export function ScratchTruth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const scratching = useRef(false);
  const moved = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const w = (canvas.width = canvas.offsetWidth * 2);
    const h = (canvas.height = canvas.offsetHeight * 2);

    // metallic coating
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#6d6395");
    g.addColorStop(0.3, "#8f83b8");
    g.addColorStop(0.5, "#5b527f");
    g.addColorStop(0.75, "#8276a8");
    g.addColorStop(1, "#665c8e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // sheen streaks
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.05})`;
      ctx.lineWidth = 4 + Math.random() * 22;
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, 0);
      ctx.lineTo(Math.random() * w, h);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(20,16,45,.85)";
    ctx.font = `${Math.floor(h * 0.09)}px Manrope, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH GENTLY", w / 2, h / 2 - 8);
    ctx.font = `italic ${Math.floor(h * 0.075)}px "Cormorant Garamond", serif`;
    ctx.fillStyle = "rgba(20,16,45,.6)";
    ctx.fillText("wo jo mai ny aj tk nhi kaha", w / 2, h / 2 + h * 0.12);

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 46, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    };

    const check = () => {
      moved.current++;
      if (moved.current % 14 !== 0) return;
      const data = ctx.getImageData(0, 0, w, h).data;
      let clear = 0;
      for (let i = 3; i < data.length; i += 16) if (data[i] === 0) clear++;
      if (clear / (data.length / 16) > 0.42) setDone(true);
    };

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * 2, y: (e.clientY - r.top) * 2 };
    };

    const down = (e: PointerEvent) => { scratching.current = true; const p = pos(e); scratch(p.x, p.y); };
    const up = () => { scratching.current = false; };
    const move = (e: PointerEvent) => { if (!scratching.current) return; const p = pos(e); scratch(p.x, p.y); check(); };

    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    canvas.addEventListener("pointermove", move);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div className="relative mx-auto mt-16 w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-2xl border border-rose-2-400/30 bg-night-800/60 px-8 py-16 text-center sm:px-14 sm:py-20">
        <p className="text-[10px] uppercase tracking-[0.45em] text-rose-2-400/90">the hidden line</p>
        <p className="mt-6 font-serif text-3xl font-light italic leading-snug text-ember-300 text-glow-warm sm:text-4xl">
          “Tum ny kabhi kuch galat nhi kia.<br />Ye hamesha mai he galat tha.”
        </p>
        <p className="mt-6 font-serif text-sm italic text-slate-400">— Wo alfaaz jo kabhi kah na saka</p>

        {/* scratch surface */}
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          animate={done ? { opacity: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ pointerEvents: done ? "none" : "auto" }}
        />
        {!done && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2" style={{ animation: "scratch-hint 1.6s ease-in-out infinite" }}>
            <div className="h-6 w-10 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm" />
          </div>
        )}
      </div>
    </div>
  );
}
