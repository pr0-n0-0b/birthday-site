import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useHer } from "../lib/name";

type Props = { onOpen: () => void };

export function Envelope({ onOpen }: Props) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "gone">("sealed");
  const { name } = useHer();

  const open = () => {
    if (phase !== "sealed") return;
    setPhase("opening");
    setTimeout(() => {
      setPhase("gone");
      onOpen();
    }, 2100);
  };

  return (
    <AnimatePresence>
      {phase !== "gone" && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-night-950 overflow-hidden"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          {/* ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(214,95,128,0.14),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_50%_30%,rgba(169,143,224,0.08),transparent_70%)]" />

          {/* floating dust hearts */}
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="pointer-events-none absolute text-rose-2-400/40"
              style={{
                left: `${6 + (i * 67) % 90}%`,
                bottom: `-5%`,
                animation: `drift-heart ${9 + (i % 5) * 2.2}s linear ${i * 0.9}s infinite`,
                ["--heart-x" as string]: `${(i % 3 - 1) * 40}px`,
                ["--heart-r" as string]: `${(i % 2 ? 1 : -1) * 30}deg`,
                ["--heart-o" as string]: 0.5,
              }}
            >
              <Heart size={8 + (i % 4) * 3} fill="currentColor" strokeWidth={0} />
            </span>
          ))}

          <motion.div
            className="relative flex flex-col items-center px-6"
            animate={phase === "opening" ? { y: 0 } : { y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: phase === "sealed" ? Infinity : 0, ease: "easeInOut" }}
          >
            <p className="mb-3 text-[10px] uppercase tracking-[0.5em] text-lilac-300/70">a letter · long unsent</p>
            <p className="mb-10 font-script text-4xl sm:text-5xl text-ember-300/95 text-glow-warm">for {name === "Her" ? "her" : name}</p>

            {/* envelope */}
            <div className="perspective-1000 relative">
              <motion.div
                className="env-preserve relative h-52 w-80 sm:h-60 sm:w-96"
                animate={phase === "opening" ? { scale: 1.06 } : {}}
                transition={{ duration: 0.8 }}
              >
                {/* letter inside */}
                <motion.div
                  className="absolute left-4 right-4 top-2 bottom-2 rounded-sm bg-[#f5efe3] shadow-[0_0_40px_rgba(255,217,160,.25)]"
                  initial={{ y: 26, opacity: 0.0 }}
                  animate={phase === "opening" ? { y: -190, opacity: 1, rotateZ: -2 } : {}}
                  transition={{ delay: 0.75, duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                    <span className="font-script text-3xl text-rose-2-500">Happy Birthday</span>
                    <span className="h-px w-16 bg-rose-2-500/40" />
                    <span className="font-serif text-[13px] italic text-night-800/70">Piyari Laiba.</span>
                  </div>
                </motion.div>

                {/* body */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-night-700 to-night-800 border border-lilac-400/25 shadow-[0_30px_80px_rgba(0,0,0,.6),inset_0_1px_0_rgba(255,255,255,.06)]" />
                {/* pocket folds */}
                <div className="absolute inset-0 rounded-lg" style={{ clipPath: "polygon(0 100%, 50% 46%, 100% 100%)", background: "linear-gradient(180deg,#221d4a,#171338)", borderTop: "1px solid rgba(201,184,240,.2)" }} />
                <div className="absolute inset-0 rounded-lg opacity-70" style={{ clipPath: "polygon(0 0, 50% 55%, 0 100%)", background: "linear-gradient(90deg,#1a1540,#221d4a)" }} />
                <div className="absolute inset-0 rounded-lg opacity-70" style={{ clipPath: "polygon(100% 0, 50% 55%, 100% 100%)", background: "linear-gradient(-90deg,#1a1540,#221d4a)" }} />

                {/* flap */}
                <motion.div
                  className="env-preserve absolute inset-x-0 top-0 h-[55%] origin-top"
                  animate={phase === "opening" ? { rotateX: 180, zIndex: 0 } : {}}
                  transition={{ duration: 0.9, ease: [0.5, 0, 0.3, 1] }}
                  style={{ zIndex: 20 }}
                >
                  <div className="backface-hidden absolute inset-0" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: "linear-gradient(180deg,#2b2458,#1d184a)", borderBottom: "1px solid rgba(201,184,240,.25)" }} />
                </motion.div>

                {/* wax seal */}
                <motion.button
                  onClick={open}
                  aria-label="Open the letter"
                  className="group absolute left-1/2 top-[44%] z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  animate={phase === "opening" ? { scale: 0, rotate: 160, opacity: 0 } : { scale: [1, 1.05, 1] }}
                  transition={phase === "opening" ? { duration: 0.5 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.12, rotate: -4 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-rose-2-500 via-[#b03a5e] to-[#7c2244] shadow-[0_10px_30px_rgba(214,95,128,.45),inset_0_2px_6px_rgba(255,255,255,.25),inset_0_-4px_8px_rgba(0,0,0,.35)]">
                    <span className="absolute inset-1.5 rounded-full border border-white/25" />
                    <Heart className="h-7 w-7 text-rose-100 drop-shadow" fill="currentColor" strokeWidth={1} />
                  </span>
                </motion.button>
              </motion.div>
            </div>

            <motion.p
              className="mt-12 flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-rose-2-300/80"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.6, repeat: Infinity }}
            >
              tap the seal to open
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
