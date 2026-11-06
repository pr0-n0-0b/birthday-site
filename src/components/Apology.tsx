import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal, Kicker } from "./Reveal";
import { ScratchTruth } from "./ScratchTruth";
import { useHer } from "../lib/name";

/** Rain canvas — soft streaks behind the apology. */
function Rain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type Drop = { x: number; y: number; v: number; len: number; o: number };
    let drops: Drop[] = [];
    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: Math.floor(w / 9) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        v: 4 + Math.random() * 5, len: 8 + Math.random() * 14, o: 0.05 + Math.random() * 0.16,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of drops) {
        d.y += d.v; d.x += 0.6;
        if (d.y > h) { d.y = -d.len; d.x = Math.random() * w; }
        ctx.strokeStyle = `rgba(150,170,255,${d.o})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 0.9, d.y - d.len);
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0" aria-hidden />;
}

export function Apology() {
  const { name } = useHer();
  const letterRef = useRef<HTMLDivElement>(null);
  const inView = useInView(letterRef, { once: true, margin: "-120px" });
  const [typed, setTyped] = useState("");
  const [finished, setFinished] = useState(false);

  const letter = `${name === "Her" ? "Dear you," : `Dear ${name},`}
Main dil se tum se maafi mangna chahta hoon. Mujhe afsoos hai ke main tum ko wo sachai aur imandari na de saka jo aap deserve karte thay, aur bina bataye chala gaya. 
Aap meri zindagi ka sab se haseen hissa thay, aur main khud ko sabit karne mein nakaam raha. Har us aam se din ke liye shukriya jise tum ne apni maujoodgi se khubsoorat banaya. 
Main dil se sharminda hoon aur teh-e-dil se aap se maafi ka talabgaar hoon.`;

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (i >= letter.length) { setFinished(true); return; }
      const ch = letter[i];
      i += 1;
      setTyped(letter.slice(0, i));
      const pause = /[.,—:!?]/.test(ch) ? 260 : ch === "\n" ? 340 : 17 + Math.random() * 14;
      timer = setTimeout(step, pause);
    };
    timer = setTimeout(step, 500);
    return () => clearTimeout(timer);
  }, [inView, letter]);

  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#05040f_0%,#0b0a22_40%,#070618_100%)]" />
      <Rain />

      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal className="text-center"><Kicker>act iii · long overdue</Kicker></Reveal>

        <div className="mt-10 text-center" aria-label="I'm sorry">
          {["I'm", "Sorry."].map((word, i) => (
            <motion.span
              key={word}
              className={`inline-block font-serif font-light ${i === 0 ? "text-5xl sm:text-7xl text-slate-200" : "ml-3 text-6xl italic sm:text-8xl text-rose-2-300 text-glow-rose"}`}
              initial={{ opacity: 0, y: 70, filter: "blur(14px)", letterSpacing: "0.3em" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0em" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, delay: 0.2 + i * 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </div>
        <Reveal delay={0.6} className="text-center">
          <p className="mt-6 text-[11px] uppercase tracking-[0.4em] text-slate-400/70">two words · carried like stones all this time</p>
        </Reveal>

        {/* typewriter letter */}
        <div
          ref={letterRef}
          className="relative mx-auto mt-20 max-w-2xl overflow-hidden rounded-sm border border-white/8 bg-[#f3ecdd] shadow-[0_40px_90px_rgba(0,0,0,.55)]"
        >
          <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 31px, rgba(120,100,80,.14) 31px 32px)" }} />
          <div className="relative px-8 py-12 sm:px-14 sm:py-16">
            <p className="whitespace-pre-line font-serif text-[17px] leading-[32px] text-night-900/90 sm:text-lg">
              {typed}
              {!finished && <span className="caret ml-0.5 inline-block h-5 w-[2px] translate-y-0.5 bg-rose-2-500" />}
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={finished ? { opacity: 1 } : {}}
              transition={{ duration: 1.4 }}
              className="mt-10 text-right font-script text-4xl text-rose-2-500"
            >
              — Haris
            </motion.p>
          </div>
          <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-rose-2-500/10 blur-2xl" />
        </div>

        <Reveal delay={0.1} className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">and below it — one truth, kept under foil</p>
        </Reveal>

        <ScratchTruth />
      </div>
    </section>
  );
}
