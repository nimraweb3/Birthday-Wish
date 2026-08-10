import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import Fireworks from "./Fireworks";

interface BirthdayIntroProps {
  onComplete: () => void;
}

const BirthdayIntro = ({
  onComplete,
}: BirthdayIntroProps) => {
  const [visible, setVisible] = useState(true);
  const [fireworksActive, setFireworksActive] =
    useState(false);

  useEffect(() => {
    /*
     * ==============================
     * FIREWORKS START
     * ==============================
     *
     * The birthday message gets
     * some time on screen first.
     */

    const fireworksTimer =
      window.setTimeout(() => {
        setFireworksActive(true);
      }, 2800);

    /*
     * ==============================
     * INTRO EXIT
     * ==============================
     *
     * Keep the complete intro visible
     * for around 6.5 seconds.
     */

    const exitTimer =
      window.setTimeout(() => {
        setVisible(false);

        /*
         * Give Framer Motion time
         * to finish the fade/blur.
         */

        window.setTimeout(() => {
          setFireworksActive(false);
          onComplete();
        }, 1000);
      }, 6500);

    return () => {
      window.clearTimeout(
        fireworksTimer
      );

      window.clearTimeout(
        exitTimer
      );
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(12px)",
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="
            fixed
            inset-0
            z-[100]

            flex
            items-center
            justify-center

            overflow-hidden

            bg-[#0c0708]

            px-6
          "
        >
          {/* =====================================
              FIREWORKS
          ====================================== */}

          <Fireworks
            active={fireworksActive}
          />

          {/* =====================================
              MAIN BACKGROUND GLOW
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: [0.12, 0.28, 0.18],
              scale: [0.8, 1.15, 1],
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
            }}
            className="
              pointer-events-none

              absolute
              left-1/2
              top-1/2

              z-0

              h-[500px]
              w-[500px]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              bg-rose-300/[0.12]

              blur-[130px]
            "
          />

          {/* =====================================
              SECONDARY GLOW
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.12, 0],
            }}
            transition={{
              duration: 5,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              pointer-events-none

              absolute
              left-[20%]
              top-[25%]

              z-0

              h-[220px]
              w-[220px]

              rounded-full

              bg-pink-200/[0.08]

              blur-[100px]
            "
          />

          {/* =====================================
              FLOATING PARTICLES
          ====================================== */}

          <div
            className="
              pointer-events-none

              absolute
              inset-0

              z-[1]
            "
          >
            {Array.from({
              length: 28,
            }).map((_, index) => (
              <motion.span
                key={index}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: [
                    0,
                    0.45,
                    0,
                  ],
                  y: [
                    20,
                    -60,
                    -100,
                  ],
                }}
                transition={{
                  duration:
                    3 + (index % 4),

                  delay:
                    (index % 7) * 0.35,

                  repeat: Infinity,

                  ease: "easeOut",
                }}
                className="
                  absolute

                  h-[3px]
                  w-[3px]

                  rounded-full

                  bg-white/50
                "
                style={{
                  left: `${
                    (index * 37) % 100
                  }%`,

                  top: `${
                    (index * 61) % 100
                  }%`,
                }}
              />
            ))}
          </div>

          {/* =====================================
              MAIN CONTENT
          ====================================== */}

          <div
            className="
              relative
              z-10

              flex
              w-full
              max-w-5xl

              flex-col
              items-center

              text-center
            "
          >
            {/* =================================
                SMALL INTRO TEXT
            ================================== */}

            <motion.p
              initial={{
                opacity: 0,
                y: 12,
                letterSpacing: "0.2em",
              }}
              animate={{
                opacity: 1,
                y: 0,
                letterSpacing: "0.45em",
              }}
              transition={{
                delay: 0.6,
                duration: 1,
                ease: "easeOut",
              }}
              className="
                mb-7

                text-[9px]

                font-medium

                uppercase

                text-white/40

                sm:text-[10px]
              "
            >
              Today is a little more special
            </motion.p>

            {/* =================================
                HAPPY BIRTHDAY
            ================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                delay: 0.9,
                duration: 1.2,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="relative"
            >
              {/* Soft glow */}

              <div
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  scale-75

                  rounded-full

                  bg-rose-200/[0.08]

                  blur-[80px]
                "
              />

              <h1
                className="
                  relative

                  text-5xl

                  font-semibold

                  leading-none

                  tracking-[-0.045em]

                  text-white

                  drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]

                  sm:text-7xl

                  md:text-8xl

                  lg:text-9xl
                "
              >
                Happy Birthday
              </h1>
            </motion.div>

            {/* =================================
                AZEEN
            ================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.45,
                duration: 1.3,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                relative

                mt-3

                sm:mt-4
              "
            >
              {/* Animated glow */}

              <motion.div
                animate={{
                  opacity: [
                    0.12,
                    0.28,
                    0.12,
                  ],

                  scale: [
                    0.95,
                    1.08,
                    0.95,
                  ],
                }}
                transition={{
                  duration: 4,

                  repeat: Infinity,

                  ease: "easeInOut",
                }}
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  rounded-full

                  bg-rose-300/[0.10]

                  blur-[55px]
                "
              />

              <h2
                className="
                  relative

                  text-7xl

                  font-semibold

                  leading-none

                  tracking-[-0.06em]

                  text-rose-100

                  drop-shadow-[0_0_35px_rgba(255,190,210,0.16)]

                  sm:text-8xl

                  md:text-9xl

                  lg:text-[10rem]
                "
              >
                Azeen
              </h2>
            </motion.div>

            {/* =================================
                DECORATIVE LINE
            ================================== */}

            <motion.div
              initial={{
                opacity: 0,
                width: 0,
              }}
              animate={{
                opacity: 1,
                width: "100px",
              }}
              transition={{
                delay: 2.2,
                duration: 1,
                ease: "easeOut",
              }}
              className="
                mt-9

                h-px

                bg-gradient-to-r

                from-transparent

                via-rose-200/40

                to-transparent
              "
            />

            {/* =================================
                MESSAGE
            ================================== */}

            <motion.p
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 2.5,
                duration: 0.9,
              }}
              className="
                mt-5

                max-w-sm

                text-xs

                leading-relaxed

                tracking-[0.08em]

                text-white/35

                sm:text-sm
              "
            >
              A little celebration for someone
              who deserves a beautiful day.
            </motion.p>
          </div>

          {/* =====================================
              YEAR
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 3,
              duration: 1,
            }}
            className="
              absolute
              bottom-8
              left-1/2

              z-10

              -translate-x-1/2

              text-[9px]

              uppercase

              tracking-[0.45em]

              text-white/20
            "
          >
            2026
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default BirthdayIntro;