import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Reveal, Kicker } from "./Reveal";

const WISHES = [
 "Khuda kare ke log aap se toot kar mohabbat karein — thik wese hi jese aap hamesha se deserve karte thay.",
 "Khuda kare ke aap ko kabhi bhi apni ahmiyat aur apne anmol hone par shak na ho.",
 "Dua hai ke aap ko khud par hamesha fakhar rahe ke aap kya ban gae hain. Mujhe to aap par hamesha se naaz tha.",
 "Dua hai ke aap ke labon ki muskurahat hamesha qaim rahe, aur aap ka chehra hamesha gulaab ki tarah khila rahe.",
 "Khuda kare ke aap ka naseeb aasmaan ke sitaron ki tarah chamke, aur har rasta aasaani ki taraf le jaye.",
 "Dua hai ke zindagi ke har morr par aap ko aese log milein jo aap ki rooh ko sukoon aur dil ko qaraar dein.",
 "Dua hai ke aap ka dil hamesha har qism ke gham se azaad rahe, aur aap ki dunya mein sirf sukoon ho.",
 "Dua hai ke ye naya saal aap ki zaat ke un sabhi hisson ko marham lagaye jo kabhi kisi ko dikhaaye nahi gae.",
 "Khuda kare ke aane wala har lamha aap ke liye koi nayi khushkhabri aur pur-sukoon yaad lekar aaye.",
 "Dua hai ke aap ko kisi aese modr par koi aesa dost mile, jo aap ki khamoshi ko bhi muskurahton se bhar de.",
];

const ROMAN = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

function FlipCard({ wish, idx, opened, onOpen }: { wish: string; idx: number; opened: boolean; onOpen: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (idx % 5) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="perspective-1000 group relative h-56 w-full cursor-pointer text-left sm:h-64"
      aria-label={opened ? wish : `Open wish ${idx + 1}`}
    >
      <div
        className="env-preserve relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(.3,.9,.3,1)]"
        style={{ transform: opened ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* front */}
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-lilac-400/20 bg-gradient-to-b from-night-700/80 to-night-900/90 shadow-[0_18px_50px_rgba(0,0,0,.4)] transition-colors group-hover:border-rose-2-400/50">
          <span className="font-serif text-4xl font-light italic text-lilac-300/60">{ROMAN[idx]}</span>
          <Heart className="h-5 w-5 text-rose-2-400/70 transition group-hover:scale-125 group-hover:text-rose-2-300" fill="currentColor" strokeWidth={0} />
          <span className="text-[9px] uppercase tracking-[0.35em] text-slate-400/70">a wish, sealed</span>
        </div>
        {/* back */}
        <div
          className="backface-hidden absolute inset-0 flex items-center justify-center rounded-2xl border border-ember-400/40 bg-gradient-to-b from-[#2a1f3e] to-[#171230] p-6 text-center shadow-[0_18px_50px_rgba(214,95,128,.15)]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <p className="font-serif text-[15px] italic leading-relaxed text-ember-300/95 sm:text-base">{wish}</p>
        </div>
      </div>
    </motion.button>
  );
}

export function Wishes() {
  const [opened, setOpened] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpened((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_40%,rgba(214,95,128,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="text-center"><Kicker>act iv · ten small wishes</Kicker></Reveal>
        <Reveal delay={0.12} className="text-center">
          <h2 className="mx-auto mt-6 max-w-2xl font-serif text-4xl font-light sm:text-6xl">
            Mai tumhy wo saal to wapis nhi kr sakta —<br />
            <span className="italic text-ember-300">isliye tumhary liye ye wishes agli baar k liye.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2} className="text-center">
          <p className="mt-5 text-[11px] uppercase tracking-[0.35em] text-slate-400/70">tap each card to unwrap it</p>
        </Reveal>

        {/* progress */}
        <Reveal delay={0.25}>
          <div className="mx-auto mt-10 flex max-w-xs items-center gap-4">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-2-500 to-ember-400"
                animate={{ width: `${(opened.size / WISHES.length) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ boxShadow: "0 0 12px rgba(214,95,128,.6)" }}
              />
            </div>
            <span className="whitespace-nowrap font-serif text-sm italic text-slate-300">
              {opened.size} of {WISHES.length} unwrapped
            </span>
          </div>
        </Reveal>
        {opened.size === WISHES.length && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center font-serif text-lg italic text-rose-2-300 text-glow-rose"
          >
            You opened all. Every single one — I meant.
          </motion.p>
        )}

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {WISHES.map((w, i) => (
            <FlipCard key={i} wish={w} idx={i} opened={opened.has(i)} onOpen={() => toggle(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
