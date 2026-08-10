import { motion } from "framer-motion";
import { ExternalLink, Music2 } from "lucide-react";

import { useClock } from "../hooks/useClock";
import { spotifyConfig } from "../data/spotify";

const Navbar = () => {
  const { time, date } = useClock();

  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="
        fixed
        left-0
        right-0
        top-0
        z-50

        px-4
        pt-4

        sm:px-6
        sm:pt-6

        lg:px-8
      "
    >
      <nav
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between

          rounded-full

          border
          border-white/[0.10]

          bg-black/[0.28]

          px-4
          py-3

          shadow-[0_12px_40px_rgba(0,0,0,0.25)]

          backdrop-blur-xl

          sm:px-6
          sm:py-3.5
        "
      >
        {/* =====================================
            LEFT — BRAND MARK
        ====================================== */}

        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center

              rounded-full

              border
              border-white/[0.12]

              bg-white/[0.06]

              text-sm

              text-white/80

              shadow-inner
              shadow-white/[0.04]
            "
          >
            ✦
          </div>

          <span
            className="
              hidden

              text-sm
              font-medium
              tracking-[0.18em]

              text-white/70

              sm:block
            "
          >
            A
          </span>
        </div>

        {/* =====================================
            CENTER — DATE + TIME
        ====================================== */}

        <div
          className="
            absolute
            left-1/2
            -translate-x-1/2

            text-center
          "
        >
          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.28em]

              text-white/40

              sm:text-[10px]
            "
          >
            {date}
          </p>

          <motion.p
            key={time}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="
              mt-0.5

              whitespace-nowrap

              text-xs
              font-medium

              tabular-nums

              text-white/80

              sm:text-sm
            "
          >
            {time}
          </motion.p>
        </div>

        {/* =====================================
            RIGHT — SPOTIFY
        ====================================== */}

        <a
          href={spotifyConfig.playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group

            flex
            items-center
            gap-2

            rounded-full

            border
            border-white/[0.10]

            bg-white/[0.05]

            px-3
            py-2

            text-xs
            font-medium

            text-white/70

            transition-all
            duration-300

            hover:border-white/[0.20]
            hover:bg-white/[0.10]
            hover:text-white

            sm:px-4
          "
        >
          <span
            className="
              flex
              h-5
              w-5
              items-center
              justify-center

              rounded-full

              bg-white/[0.08]

              transition-transform
              duration-300

              group-hover:scale-110
            "
          >
            <Music2 size={11} />
          </span>

          <span className="hidden sm:block">
            Spotify
          </span>

          <ExternalLink
            size={12}
            className="
              opacity-50

              transition-transform
              duration-300

              group-hover:translate-x-0.5
              group-hover:-translate-y-0.5
            "
          />
        </a>
      </nav>
    </motion.header>
  );
};

export default Navbar;