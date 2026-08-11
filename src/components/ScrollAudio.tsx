import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, X } from "lucide-react";

const AUDIO_SRC = "/message.mp3";

export default function ScrollAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const triggeredRef = useRef(false);

  const [showControl, setShowControl] = useState(false);
  const [needsManualStart, setNeedsManualStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(function () {
    const audio = new Audio(AUDIO_SRC);
    audio.preload = "auto";
    audioRef.current = audio;

    function handleEnded() {
      setIsPlaying(false);
    }
    audio.addEventListener("ended", handleEnded);

    function attemptPlay() {
      if (triggeredRef.current) return;
      triggeredRef.current = true;

      audio
        .play()
        .then(function () {
          setIsPlaying(true);
          setShowControl(true);
        })
        .catch(function () {
          setNeedsManualStart(true);
          setShowControl(true);
        });

      window.removeEventListener("scroll", attemptPlay);
    }

    window.addEventListener("scroll", attemptPlay, { passive: true });

    return function () {
      window.removeEventListener("scroll", attemptPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  function handleManualStart() {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(function () {
        setIsPlaying(true);
        setNeedsManualStart(false);
      })
      .catch(function () {
        // still blocked, keep prompt visible
      });
  }

  function handleStop() {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setDismissed(true);
  }

  if (!showControl || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        {needsManualStart ? (
          <button
            type="button"
            onClick={handleManualStart}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-charcoal-900/80 backdrop-blur-md px-4 py-2.5 shadow-glow hover:bg-rose-500/20 hover:border-rose-400/40 transition-colors duration-300"
          >
            <Volume2 size={15} className="text-rose-300" />
            <span className="font-sans text-xs text-white/80">Tap to play</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-charcoal-900/80 backdrop-blur-md px-4 py-2.5 shadow-glow">
            <motion.span
              animate={isPlaying ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
              transition={{ duration: 1.6, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
              className="flex items-center"
            >
              <Volume2 size={15} className="text-rose-300" />
            </motion.span>
            <span className="font-sans text-xs text-white/70">
              {isPlaying ? "Playing for you" : "Paused"}
            </span>
            <button
              type="button"
              onClick={handleStop}
              aria-label="Stop audio"
              className="ml-1 p-1 rounded-full hover:bg-white/10 transition-colors duration-300 text-white/50 hover:text-rose-300"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}