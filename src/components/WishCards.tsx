import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

interface Wish {
  id: number;
  title: string;
  message: string;
}

const wishes: Wish[] = [
  {
    id: 1,
    title: "Happy Birthday 🤍",
    message:
      "I hope this year brings you more happiness, more peace, and a lot of moments worth remembering.",
  },
  {
    id: 2,
    title: "For You ✨",
    message:
      "May you always find reasons to smile, people who genuinely care, and little moments that make life beautiful.",
  },
  {
    id: 3,
    title: "Keep Shining 🌙",
    message:
      "Never forget how far you've come. There is so much more waiting for you ahead.",
  },
  {
    id: 4,
    title: "A Little Reminder 🫶",
    message:
      "You deserve good things, soft days, unexpected happiness, and people who make life feel lighter.",
  },
  {
    id: 5,
    title: "One More Year 🎂",
    message:
      "Here's to another chapter, another collection of memories, and hopefully a lot of reasons to laugh.",
  },
];

const WishCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [direction, setDirection] =
    useState<1 | -1>(1);

  const [isDragging, setIsDragging] =
    useState(false);

  const currentWish =
    wishes[currentIndex];

  /*
   * =====================================
   * CHANGE CARD
   * =====================================
   */

  const changeCard = (
    nextDirection: 1 | -1
  ) => {
    setDirection(nextDirection);

    setCurrentIndex((previous) => {
      if (nextDirection === 1) {
        return (
          (previous + 1) %
          wishes.length
        );
      }

      return (
        (previous - 1 + wishes.length) %
        wishes.length
      );
    });
  };

  /*
   * =====================================
   * CARD CLICK
   * =====================================
   */

  const handleCardClick = () => {
    /*
     * If the user dragged the card,
     * don't treat it as a click.
     */

    if (isDragging) {
      return;
    }

    changeCard(1);
  };

  /*
   * =====================================
   * DRAG START
   * =====================================
   */

  const handleDragStart = () => {
    setIsDragging(true);
  };

  /*
   * =====================================
   * DRAG END
   * =====================================
   */

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: {
        x: number;
      };

      velocity: {
        x: number;
      };
    }
  ) => {
    /*
     * Give React a moment before allowing
     * click to fire.
     */

    setTimeout(() => {
      setIsDragging(false);
    }, 50);

    const distance =
      Math.abs(info.offset.x);

    const velocity =
      Math.abs(info.velocity.x);

    /*
     * Small movement = don't change card.
     */

    if (
      distance < 80 &&
      velocity < 400
    ) {
      return;
    }

    /*
     * Drag right = next.
     */

    if (info.offset.x > 0) {
      changeCard(1);
      return;
    }

    /*
     * Drag left = previous.
     */

    changeCard(-1);
  };

  return (
    <section
      className="
        relative

        flex
        min-h-screen

        items-center
        justify-center

        px-5

        pb-28
        pt-28
      "
    >
      {/* =====================================
          CARD CONTAINER
      ====================================== */}

      <div
        className="
          relative

          w-full
          max-w-[620px]

          overflow-visible
        "
      >

        <AnimatePresence
          initial={false}
          custom={direction}
          mode="wait"
        >

          <motion.div
            key={currentWish.id}

            custom={direction}

            variants={{
              enter: (
                direction: number
              ) => ({
                x:
                  direction > 0
                    ? 120
                    : -120,

                opacity: 0,

                scale: 0.96,

                rotate:
                  direction > 0
                    ? 2
                    : -2,
              }),

              center: {
                x: 0,

                opacity: 1,

                scale: 1,

                rotate: 0,
              },

              exit: (
                direction: number
              ) => ({
                x:
                  direction > 0
                    ? -120
                    : 120,

                opacity: 0,

                scale: 0.96,

                rotate:
                  direction > 0
                    ? -2
                    : 2,
              }),
            }}

            initial="enter"

            animate="center"

            exit="exit"

            transition={{
              duration: 0.42,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}

            drag="x"

            dragConstraints={{
              left: 0,
              right: 0,
            }}

            dragElastic={0.35}

            dragDirectionLock

            dragMomentum={false}

            onDragStart={
              handleDragStart
            }

            onDragEnd={
              handleDragEnd
            }

            onClick={
              handleCardClick
            }

            whileTap={{
              scale: 0.985,
            }}

            className="
              relative

              flex

              h-[330px]
              sm:h-[360px]

              w-full

              cursor-grab

              flex-col

              justify-between

              overflow-hidden

              rounded-[30px]

              border
              border-white/[0.13]

              bg-black/50

              p-7
              sm:p-10

              shadow-[0_35px_90px_rgba(0,0,0,0.55)]

              backdrop-blur-xl

              will-change-transform

              active:cursor-grabbing
            "
          >

            {/* =================================
                BACKGROUND GLOW
            ================================= */}

            <div
              className="
                pointer-events-none

                absolute

                -right-24
                -top-24

                h-72
                w-72

                rounded-full

                bg-rose-300/[0.09]

                blur-[90px]
              "
            />

            <div
              className="
                pointer-events-none

                absolute

                -bottom-32
                -left-20

                h-64
                w-64

                rounded-full

                bg-pink-300/[0.05]

                blur-[80px]
              "
            />

            {/* =================================
                TOP
            ================================= */}

            <div
              className="
                relative
                z-10
              "
            >

              <div
                className="
                  flex

                  items-center

                  justify-between
                "
              >

                <p
                  className="
                    text-[9px]

                    uppercase

                    tracking-[0.35em]

                    text-rose-200/55
                  "
                >
                  {String(
                    currentIndex + 1
                  ).padStart(2, "0")}

                  {" / "}

                  {String(
                    wishes.length
                  ).padStart(2, "0")}
                </p>

                <span
                  className="
                    text-lg

                    text-white/20
                  "
                >
                  ♡
                </span>

              </div>

              <h2
                className="
                  mt-5

                  text-3xl
                  sm:text-4xl

                  font-semibold

                  tracking-[-0.035em]

                  text-white
                "
              >
                {currentWish.title}
              </h2>

            </div>

            {/* =================================
                MESSAGE
            ================================= */}

            <p
              className="
                relative
                z-10

                max-w-xl

                text-sm
                sm:text-base

                leading-7

                text-white/60
              "
            >
              {currentWish.message}
            </p>

            {/* =================================
                BOTTOM
            ================================= */}

            <div
              className="
                relative
                z-10

                flex

                items-center

                justify-between
              "
            >

              <span
                className="
                  text-[9px]

                  uppercase

                  tracking-[0.3em]

                  text-white/25
                "
              >
                tap to continue
              </span>

              <div
                className="
                  flex

                  items-center

                  gap-2
                "
              >

                <span
                  className="
                    h-px

                    w-10

                    bg-white/[0.08]
                  "
                />

                <span
                  className="
                    text-xs

                    text-white/30
                  "
                >
                  →
                </span>

              </div>

            </div>

          </motion.div>

        </AnimatePresence>

      </div>

      {/* =====================================
          NAVIGATION
      ====================================== */}

      <div
        className="
          absolute

          bottom-8

          left-1/2

          flex

          -translate-x-1/2

          items-center

          gap-5
        "
      >

        {/* =================================
            PREVIOUS BUTTON
        ================================= */}

        <button
          type="button"

          onClick={() => {
            changeCard(-1);
          }}

          className="
            flex

            h-11
            w-11

            items-center
            justify-center

            rounded-full

            border
            border-white/[0.10]

            bg-black/30

            text-white/60

            backdrop-blur-xl

            transition-all
            duration-300

            hover:scale-105

            hover:border-white/[0.18]

            hover:bg-white/[0.08]

            hover:text-white

            active:scale-90
          "
          aria-label="Previous wish"
        >
          ←
        </button>

        {/* =================================
            DOTS
        ================================= */}

        <div
          className="
            flex

            items-center

            gap-1.5
          "
        >

          {wishes.map(
            (wish, index) => (
              <motion.span
                key={wish.id}

                animate={{
                  width:
                    index ===
                    currentIndex
                      ? 20
                      : 6,

                  opacity:
                    index ===
                    currentIndex
                      ? 0.7
                      : 0.25,
                }}

                transition={{
                  duration: 0.25,
                }}

                className="
                  h-1.5

                  rounded-full

                  bg-white
                "
              />
            )
          )}

        </div>

        {/* =================================
            NEXT BUTTON
        ================================= */}

        <button
          type="button"

          onClick={() => {
            changeCard(1);
          }}

          className="
            flex

            h-11
            w-11

            items-center
            justify-center

            rounded-full

            border
            border-white/[0.10]

            bg-black/30

            text-white/60

            backdrop-blur-xl

            transition-all
            duration-300

            hover:scale-105

            hover:border-white/[0.18]

            hover:bg-white/[0.08]

            hover:text-white

            active:scale-90
          "
          aria-label="Next wish"
        >
          →
        </button>

      </div>

    </section>
  );
};

export default WishCards;