import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images: string[] = ["/memory1.png", "/memory2.png", "/memory3.png"];

const loopImages = [...images, ...images];

export default function MemoryTicker() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(function () {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setHoveredId(null);
      }
    }
    window.addEventListener("keydown", handleKey);
    return function () {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const hoveredSrc = loopImages.find(function (_src, i) {
    return "ticker-image-" + i === hoveredId;
  });

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-charcoal-900/60 backdrop-blur-md py-5">
      <div className="absolute inset-y-0 left-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-charcoal-950 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-charcoal-950 to-transparent pointer-events-none" />

      <div className="flex w-max animate-ticker-scroll">
        {loopImages.map(function (src, i) {
          const layoutId = "ticker-image-" + i;
          return (
            <div key={i} className="mx-3 sm:mx-4 flex-shrink-0">
              <motion.img
                layoutId={layoutId}
                src={src}
                alt=""
                onMouseEnter={function () {
                  setHoveredId(layoutId);
                }}
                onMouseLeave={function () {
                  setHoveredId(function (current) {
                    return current === layoutId ? null : current;
                  });
                }}
                className="w-64 h-36 sm:w-96 sm:h-52 rounded-2xl object-cover border border-white/10 shadow-glow cursor-pointer"
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              />
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {hoveredId && hoveredSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onMouseLeave={function () {
              setHoveredId(null);
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/85 backdrop-blur-md px-6 pointer-events-none"
          >
            <motion.img
              layoutId={hoveredId}
              src={hoveredSrc}
              alt=""
              onMouseEnter={function () {
                setHoveredId(hoveredId);
              }}
              onMouseLeave={function () {
                setHoveredId(null);
              }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-3xl border border-white/10 shadow-glow object-contain pointer-events-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}