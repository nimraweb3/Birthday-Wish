import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { wishes } from "../data/wishes";

const SWIPE_THRESHOLD = 80;

const cardVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 120 : -120,
    scale: 0.94,
    rotate: dir > 0 ? 6 : -6,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -120 : 120,
    scale: 0.94,
    rotate: dir > 0 ? -6 : 6,
  }),
};

export default function WishCards() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  function goNext() {
    setDirection(1);
    setIndex(function (prev) {
      return prev === wishes.length - 1 ? 0 : prev + 1;
    });
  }

  function goPrev() {
    setDirection(-1);
    setIndex(function (prev) {
      return prev === 0 ? wishes.length - 1 : prev - 1;
    });
  }

  function handleDragEnd(_e: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      goPrev();
    }
  }

  const current = wishes[index];

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center px-4">
      <div className="relative w-full h-[380px] sm:h-[420px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current.id}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            whileTap={{ cursor: "grabbing" }}
            className="absolute inset-0 cursor-grab rounded-3xl border border-white/10 bg-charcoal-900/40 backdrop-blur-md shadow-glow p-8 sm:p-10 flex flex-col justify-between touch-none select-none"
          >
            <div>
              <span className="font-sans text-xs tracking-[0.3em] text-rose-400/70">
                {current.number}
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-white mt-3">
                {current.title}
              </h3>
            </div>

            <p className="font-sans text-base sm:text-lg text-white/75 leading-relaxed">
              {current.message}
            </p>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6 mt-6">
        <button
          type="button"
          onPointerDown={function (e) {
            e.stopPropagation();
          }}
          onClick={function (e) {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous wish"
          className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-400/40 transition-colors duration-300"
        >
          <ChevronLeft size={18} className="text-white/80" />
        </button>

        <div className="flex gap-1.5">
          {wishes.map(function (w, i) {
            return (
              <span
                key={w.id}
                className={
                  "h-1.5 rounded-full transition-all duration-300 " +
                  (i === index ? "w-5 bg-rose-400" : "w-1.5 bg-white/25")
                }
              />
            );
          })}
        </div>

        <button
          type="button"
          onPointerDown={function (e) {
            e.stopPropagation();
          }}
          onClick={function (e) {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next wish"
          className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-400/40 transition-colors duration-300"
        >
          <ChevronRight size={18} className="text-white/80" />
        </button>
      </div>
    </div>
  );
}