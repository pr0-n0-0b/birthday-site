import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Heart } from "lucide-react";
import { HerNameProvider } from "./lib/name";
import { music } from "./lib/music";
import { Cursor } from "./components/Cursor";
import { Envelope } from "./components/Envelope";
import { Hero } from "./components/Hero";
import { Cake } from "./components/Cake";
import { Chapters } from "./components/Chapters";
import { Apology } from "./components/Apology";
import { Wishes } from "./components/Wishes";
import { Lanterns } from "./components/Lanterns";
import { Finale } from "./components/Finale";

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-rose-2-500 via-ember-400 to-lilac-400"
      style={{ scaleX, boxShadow: "0 0 14px rgba(214,95,128,.5)" }}
    />
  );
}

function MusicToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => setOn(music.playing), 400);
    return () => clearInterval(iv);
  }, []);
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.2 }}
      onClick={() => music.toggle()}
      aria-label={on ? "Mute the music" : "Play the music"}
      className="fixed bottom-6 right-6 z-[70] grid h-12 w-12 place-items-center rounded-full border border-white/12 bg-night-800/80 text-lilac-300 shadow-[0_8px_30px_rgba(0,0,0,.5)] backdrop-blur transition hover:border-ember-400/60 hover:text-ember-300 active:scale-90"
    >
      {on ? (
        <span className="relative grid place-items-center">
          <Volume2 className="h-4 w-4" />
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full border border-ember-400/40" />
        </span>
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </motion.button>
  );
}

function Divider() {
  return (
    <div className="relative mx-auto flex max-w-xs items-center gap-5 py-4 opacity-70">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-lilac-400/40" />
      <Heart className="h-3.5 w-3.5 text-rose-2-400 pulse-soft" fill="currentColor" strokeWidth={0} />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-lilac-400/40" />
    </div>
  );
}

function Experience() {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    music.start();
  };

  return (
    <div className={`relative min-h-svh bg-night-950 grain ${opened ? "" : "h-svh overflow-hidden"}`}>
      <Cursor />
      <Envelope onOpen={handleOpen} />

      <AnimatePresence>
        {opened && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <ProgressBar />
            <MusicToggle />

            {/* floating monogram */}
            <motion.a
              href="#finale"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6 }}
              className="fixed left-6 top-6 z-[70] flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-400 transition hover:text-ember-300"
            >
              <Heart className="h-3 w-3 text-rose-2-500" fill="currentColor" strokeWidth={0} />
              Made for You 🤜🏻🤛🏻
            </motion.a>

            <Hero />
            <Cake />
            <Divider />
            <Chapters />
            <Apology />
            <Divider />
            <Wishes />
            <Lanterns />
            <Finale />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <HerNameProvider>
      <Experience />
    </HerNameProvider>
  );
}
