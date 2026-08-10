import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

const PLAYER_WIDTH = 290;
const PLAYER_HEIGHT = 90;

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isExpanded, setIsExpanded] =
    useState(false);

  const [progress, setProgress] =
    useState(35);

  /*
   * Position is stored as actual screen
   * coordinates instead of relative movement.
   */

  const [position, setPosition] =
    useState({
      x: window.innerWidth - PLAYER_WIDTH - 20,
      y: window.innerHeight - PLAYER_HEIGHT - 30,
    });

  /*
   * =====================================
   * LOAD SAVED POSITION
   * =====================================
   */

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "birthday-player-position"
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
        "birthday-player-position"
      );
    }
  }, []);

  /*
   * =====================================
   * KEEP PLAYER INSIDE SCREEN
   * =====================================
   */

  const clampPosition = (
    x: number,
    y: number
  ) => {
    const width =
      window.innerWidth;

    const height =
      window.innerHeight;

    const playerWidth =
      isExpanded
        ? PLAYER_WIDTH
        : PLAYER_WIDTH;

    const playerHeight =
      isExpanded
        ? 180
        : PLAYER_HEIGHT;

    return {
      x: Math.max(
        0,
        Math.min(
          x,
          width - playerWidth
        )
      ),

      y: Math.max(
        0,
        Math.min(
          y,
          height - playerHeight
        )
      ),
    };
  };

  /*
   * =====================================
   * DRAG END
   * =====================================
   */

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: {
      point: {
        x: number;
        y: number;
      };
    }
  ) => {
    const nextPosition =
      clampPosition(
        info.point.x -
          PLAYER_WIDTH / 2,

        info.point.y - 25
      );

    setPosition(nextPosition);

    localStorage.setItem(
      "birthday-player-position",
      JSON.stringify(nextPosition)
    );
  };

  /*
   * =====================================
   * RESET
   * =====================================
   */

  const resetPosition = () => {
    const nextPosition = {
      x:
        window.innerWidth -
        PLAYER_WIDTH -
        20,

      y:
        window.innerHeight -
        PLAYER_HEIGHT -
        30,
    };

    setPosition(nextPosition);

    localStorage.setItem(
      "birthday-player-position",
      JSON.stringify(nextPosition)
    );
  };

  /*
   * =====================================
   * RENDER
   * =====================================
   */

  return (
    <motion.div
      drag

      dragMomentum={false}

      dragElastic={0}

      dragConstraints={{
        left: 0,
        top: 0,
        right:
          window.innerWidth -
          PLAYER_WIDTH,

        bottom:
          window.innerHeight -
          PLAYER_HEIGHT,
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
      }}

      className="
        z-[100]

        w-[260px]
        sm:w-[290px]

        cursor-grab

        active:cursor-grabbing

        select-none
      "
    >

      {/* =====================================
          PLAYER
      ===================================== */}

      <div
        className="
          overflow-hidden

          rounded-[22px]

          border
          border-white/[0.12]

          bg-black/65

          shadow-[0_20px_60px_rgba(0,0,0,0.55)]

          backdrop-blur-2xl
        "
      >

        {/* =================================
            MAIN PLAYER
        ================================= */}

        <div
          className="
            flex

            items-center

            gap-3

            p-3
          "
        >

          {/* Album */}

          <div
            className="
              flex

              h-11
              w-11

              shrink-0

              items-center
              justify-center

              overflow-hidden

              rounded-xl

              bg-white/[0.07]

              text-lg
            "
          >
            🎵
          </div>


          {/* Song */}

          <button
            type="button"

            onClick={() => {
              setIsExpanded(
                (value) => !value
              );
            }}

            className="
              min-w-0

              flex-1

              text-left
            "
          >

            <p
              className="
                truncate

                text-xs

                font-medium

                text-white
              "
            >
              A little song for you
            </p>

            <p
              className="
                mt-1

                truncate

                text-[10px]

                text-white/40
              "
            >
              Your playlist
            </p>

          </button>


          {/* Play */}

          <button
            type="button"

            onClick={() => {
              setIsPlaying(
                (value) => !value
              );
            }}

            className="
              flex

              h-9
              w-9

              shrink-0

              items-center
              justify-center

              rounded-full

              bg-white

              text-xs

              text-black

              transition

              hover:scale-105

              active:scale-90
            "
          >
            {isPlaying
              ? "Ⅱ"
              : "▶"}
          </button>

        </div>


        {/* =================================
            EXPANDED
        ================================= */}

        {isExpanded && (
          <div
            className="
              border-t

              border-white/[0.07]

              px-4

              pb-4

              pt-3
            "
          >

            {/* Progress */}

            <input
              type="range"

              min="0"

              max="100"

              value={progress}

              onChange={(event) => {
                setProgress(
                  Number(
                    event.target.value
                  )
                );
              }}

              className="
                h-1

                w-full

                cursor-pointer

                appearance-none

                rounded-full

                bg-white/[0.10]

                accent-white
              "
            />


            <div
              className="
                mt-1

                flex

                justify-between

                text-[8px]

                text-white/30
              "
            >
              <span>
                1:24
              </span>

              <span>
                3:42
              </span>
            </div>


            {/* Controls */}

            <div
              className="
                mt-3

                flex

                items-center

                justify-center

                gap-5
              "
            >

              <button
                type="button"

                className="
                  text-xs

                  text-white/40

                  hover:text-white
                "
              >
                ↶
              </button>


              <button
                type="button"

                onClick={() => {
                  setIsPlaying(
                    (value) => !value
                  );
                }}

                className="
                  flex

                  h-9
                  w-9

                  items-center
                  justify-center

                  rounded-full

                  bg-white

                  text-xs

                  text-black
                "
              >
                {isPlaying
                  ? "Ⅱ"
                  : "▶"}
              </button>


              <button
                type="button"

                className="
                  text-xs

                  text-white/40

                  hover:text-white
                "
              >
                ↷
              </button>

            </div>


            {/* Reset */}

            <button
              type="button"

              onClick={resetPosition}

              className="
                mx-auto

                mt-4

                block

                text-[8px]

                uppercase

                tracking-[0.2em]

                text-white/20

                hover:text-white/50
              "
            >
              reset position
            </button>

          </div>
        )}

      </div>

    </motion.div>
  );
};

export default MusicPlayer;