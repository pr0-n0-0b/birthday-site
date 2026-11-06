import { motion } from "framer-motion";
import { Reveal, Kicker } from "./Reveal";

const CHAPTERS = [
  {
    numeral: "I",
    title: "The First Hello",
    body: "Mujhy aj bhi yaad hai jb us raat mai ny tumsyy pehli dafa baat ki thi...",
    tone: "text-lilac-300",
  },
  {
    numeral: "II",
    title: "The Good Days",
    body: "WO Achy lamhy jb mai tumhary sath hota tha. Wo isliye achy thy Q ky mai tumhary sath hota tha.",
    tone: "text-ember-300",
  },
  {
    numeral: "III",
    title: "Where I Faltered",
    body: "Phir mujhy pta nhi kia huwa Q mai tumsy dur hona chahta tha. Mera dil kisi or ki taraf kheecha chala gaya.",
    tone: "text-rose-2-400",
  },
  {
    numeral: "IV",
    title: "The Silence After",
    body: "Mai tumhy sb bta na chahta tha lekin mai bta nhi saka mere mai itni himmat nhi thi k tumhy bta pata..",
    tone: "text-slate-300",
  },
  {
    numeral: "V",
    title: "Today — Your Day",
    body: "Lekin aj khushi ka din hai Q ky aj tumhara birthday hai. Meri dua hai k tumhy zindagi ki tamam khushian milein.",
    tone: "text-ember-300",
  },
];

function ChapterCard({ c, i }: { c: (typeof CHAPTERS)[number]; i: number }) {
  const left = i % 2 === 0;
  return (
    <div className={`relative flex ${left ? "justify-start" : "justify-end"}`}>
      <motion.div
        initial={{ opacity: 0, x: left ? -56 : 56, rotate: left ? -1.5 : 1.5 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8, rotate: left ? -0.6 : 0.6 }}
        className="group relative w-full max-w-xl rounded-2xl border border-white/8 bg-gradient-to-b from-night-800/70 to-night-900/70 p-8 backdrop-blur-sm shadow-[0_24px_60px_rgba(0,0,0,.45)] sm:p-10"
      >
        <span className={`pointer-events-none absolute -top-10 ${left ? "-left-4" : "-right-4"} font-serif text-[9rem] leading-none outline-text opacity-60 transition-opacity duration-700 group-hover:opacity-100 select-none`}>
          {c.numeral}
        </span>
        <p className={`text-[10px] uppercase tracking-[0.45em] ${c.tone}`}>chapter {c.numeral.toLowerCase()}</p>
        <h3 className="mt-3 font-serif text-3xl font-medium italic text-white/95 sm:text-4xl">{c.title}</h3>
        <p className="mt-5 font-serif text-[17px] leading-relaxed text-slate-300/90 sm:text-lg">{c.body}</p>
        <div className="mt-7 h-px w-full shimmer-line opacity-50" />
      </motion.div>
    </div>
  );
}

export function Chapters() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_15%_20%,rgba(169,143,224,0.06),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_85%_80%,rgba(214,95,128,0.05),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal className="text-center"><Kicker>act ii · us, in five small chapters</Kicker></Reveal>
        <Reveal delay={0.15} className="text-center">
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-light sm:text-6xl">
            Hr kahani k kuch apny <span className="italic text-rose-2-300">zakham</span> hoty hain .
          </h2>
        </Reveal>

        {/* timeline spine */}
        <div className="relative mt-24 flex flex-col gap-16 sm:gap-24">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-lilac-400/25 to-transparent md:block" />
          {CHAPTERS.map((c, i) => (
            <ChapterCard key={c.numeral} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
