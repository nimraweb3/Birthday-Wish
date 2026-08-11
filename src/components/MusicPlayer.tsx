import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PLAYER_WIDTH = 320;
const PLAYER_HEIGHT = 152;

const SPOTIFY_URL =
  "https://open.spotify.com/embed/playlist/566ebV0eFuOfNkvz5tVc9d?utm_source=generator";

const MusicPlayer = () => {
  const [position, setPosition] = useState({
    x: window.innerWidth - PLAYER_WIDTH - 24,
    y: window.innerHeight - PLAYER_HEIGHT - 24,
  });

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem(
      "birthday-spotify-position"
    );

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      setPosition({
        x: parsed.x,
        y: parsed.y,
      });
    } catch {
      localStorage.removeItem(
        "birthday-spotify-position"
      );
    }
  }, []);

  // Keep player inside viewport
  const clampPosition = (
    x: number,
    y: number
  ) => {
    const maxX =
      window.innerWidth -
      PLAYER_WIDTH -
      10;

    const maxY =
      window.innerHeight -
      PLAYER_HEIGHT -
      10;

    return {
      x: Math.max(
        10,
        Math.min(x, maxX)
      ),

      y: Math.max(
        10,
        Math.min(y, maxY)
      ),
    };
  };

  // Save new position after dragging
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: {
        x: number;
        y: number;
      };
    }
  ) => {
    const nextPosition =
      clampPosition(
        position.x + info.offset.x,
        position.y + info.offset.y
      );

    setPosition(nextPosition);

    localStorage.setItem(
      "birthday-spotify-position",
      JSON.stringify(nextPosition)
    );
  };

  // Reset to bottom-right
  const resetPosition = () => {
    const nextPosition = {
      x:
        window.innerWidth -
        PLAYER_WIDTH -
        24,

      y:
        window.innerHeight -
        PLAYER_HEIGHT -
        24,
    };

    setPosition(nextPosition);

    localStorage.removeItem(
      "birthday-spotify-position"
    );
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}

      dragConstraints={{
        left: 10,
        right:
          window.innerWidth -
          PLAYER_WIDTH -
          10,

        top: 10,
        bottom:
          window.innerHeight -
          PLAYER_HEIGHT -
          10,
      }}

      onDragEnd={handleDragEnd}

      animate={{
        left: position.x,
        top: position.y,
      }}

      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        mass: 0.6,
      }}

      style={{
        position: "fixed",
        width: `${PLAYER_WIDTH}px`,
      }}

      className="
        group
        z-[100]

        cursor-grab
        active:cursor-grabbing

        select-none

        touch-none
      "
    >
      <div
        className="
          relative

          overflow-hidden

          rounded-[14px]

          border
          border-white/[0.12]

          bg-black/70

          shadow-[0_20px_60px_rgba(0,0,0,0.55)]

          backdrop-blur-xl
        "
      >
        {/* Drag handle */}

        <div
          className="
            absolute
            left-1/2
            top-1.5

            z-20

            -translate-x-1/2

            h-1
            w-8

            rounded-full

            bg-white/20

            opacity-0

            transition

            group-hover:opacity-100
          "
        />

        {/* Spotify */}

        <iframe
          title="Azeen Birthday Playlist"

          src={SPOTIFY_URL}

          width="100%"

          height="152"

          frameBorder="0"

          allowFullScreen

          allow="
            autoplay;
            clipboard-write;
            encrypted-media;
            fullscreen;
            picture-in-picture
          "

          loading="lazy"

          className="
            block

            w-full

            rounded-[12px]

            border-0
          "
        />

        {/* Reset button */}

        <button
          type="button"

          onClick={resetPosition}

          className="
            absolute

            right-2
            top-2

            z-30

            rounded-full

            bg-black/70

            px-2
            py-1

            text-[8px]

            uppercase

            tracking-[0.15em]

            text-white/40

            opacity-0

            transition-all

            hover:bg-black/90

            hover:text-white

            group-hover:opacity-100
          "
        >
          reset
        </button>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;