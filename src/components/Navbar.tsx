import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";
import InstagramIcon from "./icons/InstagramIcon";
import { useFullscreen } from "../hooks/useFullscreen";

interface NavbarProps {
  instagramUrl: string;
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  return day + " " + month + " " + year;
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  const hh = hours.toString().padStart(2, "0");
  return hh + ":" + minutes + " " + ampm;
}

export default function Navbar(props: NavbarProps) {
  const instagramUrl = props.instagramUrl;
  const [now, setNow] = useState(new Date());
  const fullscreenState = useFullscreen();
  const isFullscreen = fullscreenState.isFullscreen;
  const toggleFullscreen = fullscreenState.toggleFullscreen;

  useEffect(function () {
    const interval = setInterval(function () {
      setNow(new Date());
    }, 1000);
    return function () {
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between rounded-2xl border border-white/10 bg-charcoal-900/50 backdrop-blur-md px-4 sm:px-5 py-2.5 shadow-glow">
        <div className="flex flex-col leading-tight select-none">
          <span className="text-[11px] sm:text-xs tracking-[0.15em] text-white/60 font-sans">
            {formatDate(now)}
          </span>
          <span className="text-sm sm:text-base font-display text-rose-400">
            {formatTime(now)}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Azeen's Instagram profile"
            className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-400/40 transition-colors duration-300"
          >
            <InstagramIcon size={16} className="text-white/80" />
          </a>

          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-400/40 transition-colors duration-300"
          >
            {isFullscreen ? <Minimize size={16} className="text-white/80" /> : <Maximize size={16} className="text-white/80" />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}