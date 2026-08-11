import { motion } from "framer-motion";
import { wishes } from "../data/wishes";

function noteRotation(id: number, side: "left" | "right"): number {
  const seed = (id * 37) % 11;
  const base = (seed - 5) * 1.3;
  return side === "left" ? base - 1.5 : base + 1.5;
}

interface NoteProps {
  wish: (typeof wishes)[number];
  side: "left" | "right";
  delay: number;
}

function StickyNote({ wish, side, delay }: NoteProps) {
  const rotate = noteRotation(wish.id, side);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, rotate: rotate - 4, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ rotate: 0, scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, delay }}
      style={{ transformOrigin: "50% 0%" }}
      className="relative sticky-note px-6 pt-9 pb-6 w-full max-w-xs mx-auto flex flex-col justify-between select-none"
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center" aria-hidden="true">
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-rose-300 to-rose-600 shadow-[0_2px_6px_rgba(0,0,0,0.5)] border border-rose-200/40" />
        <div className="w-px h-3 bg-white/20" />
      </div>

      <div>
        <span className="font-sans text-xs tracking-[0.3em] text-rose-400/70">{wish.number}</span>
        <h3 className="font-display text-xl sm:text-2xl text-white mt-2 leading-tight">{wish.title}</h3>
      </div>

      <p className="font-sans text-sm sm:text-base text-white/75 leading-relaxed mt-3">{wish.message}</p>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-400/30 to-transparent mt-4" />
    </motion.article>
  );
}

export default function WishCards() {
  const leftWishes = wishes.slice(0, 4);
  const rightWishes = wishes.slice(4, 8);

  return (
    <section aria-label="Wishes" className="w-full">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 md:gap-y-14">
          <div className="flex flex-col gap-10 md:gap-14 md:pt-8">
            {leftWishes.map(function (w, i) {
              return <StickyNote key={w.id} wish={w} side="left" delay={i * 0.08} />;
            })}
          </div>

          <div className="flex flex-col gap-10 md:gap-14">
            {rightWishes.map(function (w, i) {
              return <StickyNote key={w.id} wish={w} side="right" delay={i * 0.08 + 0.15} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}