import { motion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import { NightSky } from "./NightSky";

export function Hero() {
  // Permanently locked to her name
  const name = "Laiba";

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden">
      {/* aurora wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#151238_0%,#0a0819_55%,#05040f_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_30%_at_20%_80%,rgba(214,95,128,0.09),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_30%_at_85%_70%,rgba(169,143,224,0.08),transparent_70%)]" />
      <NightSky />

      {/* floating hearts */}
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute text-rose-2-400/30"
          style={{
            left: `${8 + ((i * 41) % 86)}%`,
            bottom: `-4%`,
            animation: `drift-heart ${11 + (i % 4) * 3}s linear ${i * 1.7}s infinite`,
            ["--heart-x" as string]: `${(i % 3 - 1) * 60}px`,
            ["--heart-r" as string]: `${(i % 2 ? 1 : -1) * 40}deg`,
            ["--heart-o" as string]: 0.35,
          }}
        >
          <Heart size={7 + (i % 3) * 4} fill="currentColor" strokeWidth={0} />
        </span>
      ))}

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          className="mb-6 text-[10px] sm:text-[11px] uppercase tracking-[0.5em] text-lilac-300/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          tonight, the sky playing its quiet song
        </motion.p>

        <motion.h1
          className="font-serif text-[13vw] leading-[0.95] sm:text-7xl md:text-8xl lg:text-[7.5rem] font-light text-glow-rose"
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.8, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="italic text-rose-2-300">Happy</span>{" "}
          <span className="text-ember-300">Birthday</span>
        </motion.h1>

        <motion.div
          className="mt-6 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.2 }}
        >
          <span className="font-script text-4xl sm:text-6xl text-rose-2-400 text-glow-warm">
            to you, my dearest Laiba
          </span>
        </motion.div>

        <motion.p
          className="mt-10 max-w-xl font-serif text-lg italic leading-relaxed text-slate-300/90 sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.4 }}
        >
          No gifts. No excuses. Sirf Alfaaz jo mere pass hain —<br className="hidden sm:block" />
          Scroll when you're ready.
        </motion.p>
      </div>

      <motion.a
        href="#act-i"
        className="absolute bottom-10 z-10 flex flex-col items-center gap-3 text-lilac-300/60 transition hover:text-ember-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">begin the letter</span>
        <span className="grid h-10 w-6 place-items-start justify-center rounded-full border border-current p-1.5">
          <span className="scroll-dot block h-1.5 w-1.5 rounded-full bg-current" />
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </motion.a>
    </section>
  );
}
