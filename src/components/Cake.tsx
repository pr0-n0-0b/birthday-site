import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Wind, Sparkles } from "lucide-react";
import { Reveal, Kicker } from "./Reveal";

const CANDLE_X = [14, 32, 50, 68, 86]; // % across cake top

export function Cake() {
  const [state, setState] = useState<"lit" | "blowing" | "blown">("lit");
  const [progress, setProgress] = useState(0);
  const [micOn, setMicOn] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const holding = useRef(false);
  const micRef = useRef<{ stream: MediaStream; ctx: AudioContext } | null>(null);

  /* ---- hold to blow ---- */
  useEffect(() => {
    if (state !== "blowing") return;
    const iv = setInterval(() => {
      if (holding.current) {
        setProgress((p) => {
          const np = Math.min(1, p + 0.028);
          if (np >= 1) setState("blown");
          return np;
        });
      }
    }, 40);
    return () => clearInterval(iv);
  }, [state]);

  /* ---- mic blow ---- */
  const stopMic = useCallback(() => {
    if (micRef.current) {
      micRef.current.stream.getTracks().forEach((t) => t.stop());
      void micRef.current.ctx.close();
      micRef.current = null;
    }
    setMicOn(false);
  }, []);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);
      micRef.current = { stream, ctx };
      setMicOn(true);
      setState("blowing");
      const buf = new Uint8Array(analyser.fftSize);
      const loop = () => {
        if (!micRef.current) return;
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        if (rms > 0.18) {
          setProgress((p) => {
            const np = Math.min(1, p + rms * 0.09);
            if (np >= 1) {
              setState("blown");
              stopMic();
            }
            return np;
          });
        }
        requestAnimationFrame(loop);
      };
      loop();
    } catch {
      setMicDenied(true);
    }
  };

  useEffect(() => stopMic, [stopMic]);

  const blown = state === "blown";
  const flameScale = blown ? 0 : state === "blowing" ? Math.max(0.15, 1 - progress * 0.9) : 1;

  return (
    <section id="act-i" className="relative overflow-hidden py-28 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(255,190,107,0.07),transparent_70%)]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal><Kicker>act i · a ritual first</Kicker></Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-serif text-4xl sm:text-6xl font-light">
            Before the words — <span className="italic text-ember-300">make a wish.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-md font-serif text-base italic text-slate-300/80 sm:text-lg">
            The candles are lit. Press and hold below, or truly blow into your microphone — either way, the flame will listen.
          </p>
        </Reveal>

        {/* ---- the cake ---- */}
        <div
          className="relative mx-auto mt-16 w-full max-w-md select-none"
          onPointerDown={() => { if (!blown) { holding.current = true; if (state === "lit") setState("blowing"); } }}
          onPointerUp={() => { holding.current = false; if (!blown) setState((s) => (s === "blowing" && !micOn ? "lit" : s)); }}
          onPointerLeave={() => { holding.current = false; }}
        >
          {/* candle flames + glow */}
          <div className="relative mx-auto h-40 w-full">
            {CANDLE_X.map((x, i) => (
              <div key={i} className="absolute bottom-0" style={{ left: `${x}%`, transform: "translateX(-50%)" }}>
                {/* ambient glow */}
                <div
                  className="absolute -top-14 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(circle, rgba(255,190,107,.35), rgba(255,140,60,.12) 45%, transparent 70%)",
                    opacity: blown ? 0 : 0.9 * flameScale,
                  }}
                />
                {/* flame */}
                <div
                  className="flame absolute -top-8 left-1/2 h-9 w-4 -translate-x-1/2"
                  style={{
                    transform: `translateX(-50%) scale(${flameScale})`,
                    transition: state === "blown" ? "transform .35s ease-in" : "transform .1s linear",
                    background: "radial-gradient(ellipse at 50% 75%, #fff7d6 0%, #ffd166 35%, #ff9d3c 65%, #ff6a3c 100%)",
                    borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
                    boxShadow: "0 0 20px 6px rgba(255,170,60,.45), 0 0 60px 24px rgba(255,120,40,.15)",
                  }}
                />
                {/* smoke on blow-out */}
                {blown && (
                  <>
                    {[0, 1, 2].map((s) => (
                      <span
                        key={s}
                        className="smoke-puff absolute -top-6 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-slate-300/40 blur-[3px]"
                        style={{ animationDelay: `${i * 0.08 + s * 0.55}s` }}
                      />
                    ))}
                  </>
                )}
                {/* candle stick */}
                <div className="h-24 w-3 rounded-sm mx-auto" style={{ background: `repeating-linear-gradient(45deg, ${i % 2 ? "#e57f9a" : "#a98fe0"} 0 6px, #f5efe3 6px 12px)`, boxShadow: "inset -2px 0 3px rgba(0,0,0,.35)" }} />
              </div>
            ))}
          </div>

          {/* cake body */}
          <div className="relative">
            {/* top tier */}
            <div className="relative mx-auto h-20 w-56 overflow-hidden rounded-t-2xl bg-gradient-to-b from-[#f6d9e2] to-[#eab8c9] shadow-inner">
              <div className="absolute inset-x-0 top-0 h-5 bg-[#fff4ef]" style={{ borderRadius: "0 0 50% 50% / 0 0 100% 100%" }} />
              <div className="absolute left-6 top-4 h-7 w-3 rounded-b-full bg-[#fff4ef]" />
              <div className="absolute left-24 top-4 h-9 w-3 rounded-b-full bg-[#fff4ef]" />
              <div className="absolute right-8 top-4 h-6 w-3 rounded-b-full bg-[#fff4ef]" />
              {[...Array(5)].map((_, i) => (
                <span key={i} className="absolute bottom-2 h-1.5 w-1.5 rounded-full" style={{ left: `${12 + i * 18}%`, background: ["#ffd9a0", "#e57f9a", "#a98fe0"][i % 3] }} />
              ))}
            </div>
            {/* bottom tier */}
            <div className="relative mx-auto -mt-0.5 h-24 w-80 overflow-hidden rounded-t-2xl bg-gradient-to-b from-[#c9b8f0] to-[#9d86cf]">
              <div className="absolute inset-x-0 top-0 h-5 bg-[#f2ecff]" style={{ borderRadius: "0 0 50% 50% / 0 0 100% 100%" }} />
              <div className="absolute left-10 top-4 h-9 w-3 rounded-b-full bg-[#f2ecff]" />
              <div className="absolute left-40 top-4 h-7 w-3 rounded-b-full bg-[#f2ecff]" />
              <div className="absolute right-12 top-4 h-10 w-3 rounded-b-full bg-[#f2ecff]" />
              {[...Array(7)].map((_, i) => (
                <span key={i} className="absolute bottom-3 h-2 w-2 rounded-full" style={{ left: `${8 + i * 13}%`, background: ["#ffd9a0", "#e57f9a", "#fff"][i % 3] }} />
              ))}
            </div>
            {/* plate */}
            <div className="mx-auto -mt-1 h-4 w-[22rem] rounded-[50%] bg-gradient-to-b from-[#3a3168] to-[#221d4a] shadow-[0_20px_60px_rgba(0,0,0,.6)]" />

            {/* happy birthday topper */}
            <AnimatePresence>
              {blown && (
                <motion.div
                  initial={{ opacity: 0, y: -14, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute -top-64 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <span className="font-script text-4xl text-ember-300 text-glow-warm">wish made.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ---- controls ---- */}
        <div className="mt-14 flex flex-col items-center gap-5">
          {!blown ? (
            <>
              <button
                onPointerDown={() => { holding.current = true; if (state === "lit") setState("blowing"); }}
                onPointerUp={() => { holding.current = false; if (!micOn) setState("lit"); }}
                onPointerLeave={() => { holding.current = false; }}
                className="group relative grid h-24 w-24 cursor-pointer place-items-center rounded-full border border-ember-400/50 bg-night-800/70 text-ember-300 backdrop-blur transition hover:border-ember-300 hover:shadow-[0_0_40px_rgba(255,190,107,.35)] active:scale-95"
              >
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="3" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#ffbe6b" strokeWidth="3" strokeLinecap="round" strokeDasharray={289} strokeDashoffset={289 * (1 - progress)} style={{ transition: "stroke-dashoffset .1s linear", filter: "drop-shadow(0 0 6px rgba(255,190,107,.8))" }} />
                </svg>
                <div className="flex flex-col items-center gap-1">
                  <Wind className="h-6 w-6" />
                  <span className="text-[8px] uppercase tracking-[0.3em]">hold</span>
                </div>
              </button>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-slate-400/80">
                <span className="h-px w-8 bg-white/10" />
                <span>or</span>
                <span className="h-px w-8 bg-white/10" />
              </div>
              <button
                onClick={micOn ? stopMic : startMic}
                className={`flex items-center gap-2 rounded-full border px-6 py-3 text-[11px] uppercase tracking-[0.3em] backdrop-blur transition ${micOn ? "border-rose-2-400/70 bg-rose-2-500/15 text-rose-2-300" : "border-white/15 bg-white/5 text-slate-300 hover:border-lilac-400/50"}`}
              >
                {micOn ? <Mic className="h-4 w-4 animate-pulse" /> : <MicOff className="h-4 w-4" />}
                {micOn ? "blow now — I'm listening" : micDenied ? "mic blocked — use hold" : "allow mic & really blow"}
              </button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col items-center gap-4">
              <Sparkles className="h-5 w-5 text-ember-300" />
              <p className="max-w-lg font-serif text-xl italic leading-relaxed text-ember-300/95 sm:text-2xl text-glow-warm">
                “May your every wish come true”
              </p>
              <button
                onClick={() => { setState("lit"); setProgress(0); }}
                className="mt-2 text-[10px] uppercase tracking-[0.35em] text-slate-500 transition hover:text-rose-2-300"
              >
                relight the candles
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
