import { motion } from "framer-motion";

interface BirthdayBackgroundProps {
  visible: boolean;
}

const BirthdayBackground = ({
  visible,
}: BirthdayBackgroundProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 1.05,
      }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 1.05,
      }}
      transition={{
        duration: 1.4,
        ease: "easeInOut",
      }}
      className="
        fixed
        inset-0
        z-0

        overflow-hidden

        bg-[#12090d]
      "
    >
      {/* Friend's image */}

      <motion.img
        src="/friend.jpeg"
        alt=""
        initial={{
          scale: 1.08,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          duration: 8,
          ease: "easeOut",
        }}
        className="
          absolute
          inset-0

          h-full
          w-full

          object-cover
        "
      />

      {/* Dark cinematic overlay */}

      <div
        className="
          absolute
          inset-0

          bg-black/45
        "
      />

      {/* Rose tint */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-b
          from-[#16090e]/55
          via-transparent
          to-[#10070a]/80
        "
      />

      {/* Center glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2

          h-[500px]
          w-[500px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-rose-300/[0.08]

          blur-[120px]
        "
      />

      {/* Soft vignette */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          bg-[radial-gradient(
            circle_at_center,
            transparent_20%,
            rgba(0,0,0,0.55)_100%
          )]
        "
      />
    </motion.div>
  );
};

export default BirthdayBackground;