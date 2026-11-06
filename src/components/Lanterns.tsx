import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { Reveal, Kicker } from "./Reveal";
import { NightSky } from "./NightSky";

const HOPES = [
  "Raat ke pichle pehar ki khushiyan" ,
  "Ek aesi mohabbat jo hamesha rhy",
  "Hamesha narm aur pur-sukoon jagah",
  "Aesi hansi jo aap ko herat mein daal de",
  "Wo darwaze jo aasaani se khul jayein",
  "Maazi k sath ek mukammal sukoon",
  "light on your birthday, every year",
  "Aap ki saalgirah par hamesha umeedon ki roshni",
];

type Lantern = { id: number; x: number; hope: string };

let lid = 0;

function LanternEl({ x }: { x: number }) {
  const sway = (Math.random() - 0.5) * 90;
  return (
    <div className="lantern pointer-events-none absolute bottom-0" style={{ left: `${x}%`, ["--sway" as string]: `${sway}px` }}>
      <div className="relative" style={{ animation: "lantern-glow 2.4s ease-in-out infinite" }}>
        {/* glow */}
        <div className="absolute -inset-6 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,190,107,.5), rgba(255,140,60,.15) 55%, transparent 75%)" }} />
        {/* body */}
        <div
          className="relative h-16 w-11 sm:h-20 sm:w-14"
          style={{
            background: "linear-gradient(180deg, #ffe6b0 0%, #ffc86e 45%, #f59e50 100%)",
            borderRadius: "40% 40% 46% 46% / 30% 30% 60% 60%",
            boxShadow: "inset 0 -8px 14px rgba(180,60,20,.45), inset 0 6px 10px rgba(255,255,255,.35)",
          }}
        />
        {/* rim */}
        <div className="absolute -bottom-1 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-[#7c3f21]" />
      </div>
    </div>
  );
}

export function Lanterns() {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [toasts, setToasts] = useState<{ id: number; hope: string }[]>([]);
  const skyRef = useRef<HTMLDivElement>(null);
  const total = useRef(0);

  const release = (clientX?: number) => {
    const rect = skyRef.current?.getBoundingClientRect();
    let x = 20 + Math.random() * 60;
    if (rect && clientX != null) x = Math.min(88, Math.max(8, ((clientX - rect.left) / rect.width) * 100));
    const id = ++lid;
    const hope = HOPES[total.current % HOPES.length];
    total.current++;
    setLanterns((l) => [...l.slice(-14), { id, x, hope }]);
    setToasts((t) => [...t.slice(-2), { id, hope }]);
    setTimeout(() => setLanterns((l) => l.filter((ln) => ln.id !== id)), 15500);
    setTimeout(() => setToasts((t) => t.filter((tt) => tt.id !== id)), 2800);
  };

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Reveal><Kicker>act v · Chalo, aasmaan ki taraf ek paigham bhejein.</Kicker></Reveal>
        <Reveal delay={0.12}>
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-light sm:text-6xl">
            "Ek Lantern, har us umeed ke naam jo abhi bhi mere dil mein <span className="italic text-ember-300">tumhary liye baqi hai.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-md font-serif text-base italic text-slate-300/80 sm:text-lg">
            Kahi pr bhi click kro. "Yahan neechay, har ek lantern meri kisi khwahish ko liye jalti hai.", Yahan.
          </p>
        </Reveal>
      </div>

      {/* the sky */}
      <div
        ref={skyRef}
        onClick={(e) => release(e.clientX)}
        className="relative mx-auto mt-14 h-[520px] w-full max-w-6xl cursor-pointer overflow-hidden rounded-t-[3rem] border-t border-lilac-400/20 bg-[linear-gradient(180deg,#030210_0%,#0d0a24_55%,#1a1230_100%)] shadow-[inset_0_40px_120px_rgba(0,0,0,.6)] sm:rounded-t-[4rem]"
      >
        <NightSky density={1.3} />
        {/* horizon glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[radial-gradient(ellipse_70%_100%_at_50%_110%,rgba(255,160,80,.16),transparent_70%)]" />
        {/* distant rooftops silhouette */}
        <svg className="pointer-events-none absolute bottom-0 left-0 w-full" height="70" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden>
          <path d="M0 70 L0 45 L60 45 L60 30 L120 30 L120 50 L200 50 L200 20 L215 20 L215 50 L320 50 L320 38 L400 38 L400 55 L520 55 L520 25 L540 25 L540 55 L640 55 L640 42 L760 42 L760 58 L860 58 L860 32 L880 32 L880 58 L980 58 L980 44 L1080 44 L1080 60 L1200 60 L1200 70 Z" fill="#05030e" />
          {[90, 230, 360, 500, 700, 820, 950, 1100].map((x, i) => (
            <rect key={i} x={x} y={34 + (i % 3) * 8} width="5" height="6" fill="rgba(255,190,107,.5)" />
          ))}
        </svg>

        {lanterns.map((l) => (
          <LanternEl key={l.id} x={l.x} />
        ))}

        {/* floating hope text */}
        <div className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.span
                key={t.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="font-serif text-lg italic text-ember-300/95 text-glow-warm"
              >
                {t.hope}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {lanterns.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400/70">
            <Flame className="h-6 w-6 animate-pulse text-ember-400/80" />
            <span className="text-[10px] uppercase tracking-[0.4em]">tap the sky to light the first one</span>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <span className="font-serif text-sm italic text-slate-400">
          {total.current === 0 ? "none yet — the sky is patient" : `${total.current} hope${total.current > 1 ? "s" : ""} released into the dark`}
        </span>
      </div>
    </section>
  );
}
