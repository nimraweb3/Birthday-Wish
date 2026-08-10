import { useEffect, useState } from "react";

const Navbar = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  /*
   * =====================================
   * LIVE DATE + TIME
   * =====================================
   */

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      setDate(
        now.toLocaleDateString([], {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateDateTime();

    const interval =
      setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /*
   * =====================================
   * FULLSCREEN STATE
   * =====================================
   */

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement !== null
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  /*
   * =====================================
   * TOGGLE FULLSCREEN
   * =====================================
   */

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(
        "Fullscreen error:",
        error
      );
    }
  };

  return (
    <nav
      className="
        fixed

        left-0
        right-0
        top-0

        z-[90]

        px-5
        py-4

        sm:px-8
        sm:py-5
      "
    >
      <div
        className="
          mx-auto

          flex
          max-w-7xl

          items-center
          justify-between

          rounded-2xl

          border
          border-white/[0.08]

          bg-black/25

          px-4
          py-3

          shadow-[0_10px_40px_rgba(0,0,0,0.2)]

          backdrop-blur-xl
        "
      >

        {/* =================================
            DATE + TIME
        ================================= */}

        <div
          className="
            flex
            items-center

            gap-3
          "
        >

          <div className="hidden sm:block">
            <p
              className="
                text-[9px]

                uppercase

                tracking-[0.25em]

                text-white/30
              "
            >
              Date
            </p>

            <p
              className="
                mt-0.5

                text-xs

                text-white/70
              "
            >
              {date}
            </p>
          </div>

          <div
            className="
              hidden
              h-7
              w-px

              bg-white/[0.08]

              sm:block
            "
          />

          <div>
            <p
              className="
                text-[9px]

                uppercase

                tracking-[0.25em]

                text-white/30
              "
            >
              Time
            </p>

            <p
              className="
                mt-0.5

                text-xs

                tabular-nums

                text-white/70
              "
            >
              {time}
            </p>
          </div>

        </div>


        {/* =================================
            RIGHT SIDE
        ================================= */}

        <div
          className="
            flex

            items-center

            gap-2
          "
        >

          {/* INSTAGRAM */}

          <a
            href="https://instagram.com/YOUR_FRIEND_ID"
            target="_blank"
            rel="noreferrer"

            className="
              flex

              h-9
              w-9

              items-center
              justify-center

              rounded-full

              border
              border-white/[0.08]

              bg-white/[0.03]

              text-xs

              text-white/50

              transition-all
              duration-300

              hover:border-white/[0.16]

              hover:bg-white/[0.08]

              hover:text-white

              hover:scale-105
            "
            aria-label="Instagram"
          >
            ◎
          </a>


          {/* =================================
              FULLSCREEN
          ================================= */}

          <button
            type="button"

            onClick={toggleFullscreen}

            className="
              flex

              h-9
              w-9

              items-center
              justify-center

              rounded-full

              border
              border-white/[0.08]

              bg-white/[0.03]

              text-white/50

              transition-all
              duration-300

              hover:border-white/[0.16]

              hover:bg-white/[0.08]

              hover:text-white

              hover:scale-105

              active:scale-90
            "

            aria-label={
              isFullscreen
                ? "Exit fullscreen"
                : "Enter fullscreen"
            }

            title={
              isFullscreen
                ? "Exit fullscreen"
                : "Fullscreen"
            }
          >
            {isFullscreen ? "⛶" : "⛶"}
          </button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;