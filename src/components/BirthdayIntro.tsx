import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fireworks from "./Fireworks";

interface BirthdayIntroProps {
  name: string;
  onComplete: () => void;
  durationMs?: number;
}

interface Particle {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 6,
    });
  }
  return particles;
}

export default function BirthdayIntro({ name, onComplete, durationMs = 6500 }: BirthdayIntroProps) {
  const [visible, setVisible] = useState(true);
  const [fireworksActive, setFireworksActive] = useState(true);
  const [particles] = useState<Particle[]>(function () {
    return generateParticles(22);
  });

  useEffect(function () {
    const stopFireworksTimer = setTimeout(function () {
      setFireworksActive(false);
    }, durationMs - 1200);

    const hideTimer = setTimeout(function () {
      setVisible(false);
    }, durationMs);

    return function () {
      clearTimeout(stopFireworksTimer);
      clearTimeout(hideTimer);
    };
  }, [durationMs]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="birthday-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950 overflow-hidden"
        >
          <Fireworks active={fireworksActive} />

          <div className="absolute inset-0 pointer-events-none">
            {particles.map(function (p) {
              return (
                <span
                  key={p.id}
                  className="absolute rounded-full bg-rose-400/30 blur-[1px] animate-float-up"
                  style={{
                    left: p.left + "%",
                    width: p.size + "px",
                    height: p.size + "px",
                    bottom: "-20px",
                    animationDelay: p.delay + "s",
                    animationDuration: p.duration + "s",
                  }}
                />
              );
            })}
          </div>

          <div className="absolute inset-0 bg-gradient-radial-glow pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="relative text-center px-4 w-full z-10"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="font-display leading-none text-white tracking-tight drop-shadow-glow"
              style={{
                fontSize: "clamp(2.5rem, 12vw, 9rem)",
                textShadow: "0 0 50px rgba(251, 113, 133, 0.35)",
              }}
            >
              Happy Birthday
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
              className="font-display leading-none text-rose-400 tracking-tight drop-shadow-glow mt-2 sm:mt-4"
              style={{
                fontSize: "clamp(3.5rem, 18vw, 13rem)",
                textShadow: "0 0 60px rgba(251, 113, 133, 0.45)",
              }}
            >
              {name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
              className="mx-auto mt-6 sm:mt-8 h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}