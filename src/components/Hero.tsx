import { motion } from "framer-motion";
import WishCards from "./WishCards";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-8 sm:mb-10"
      >
        <p className="font-sans text-xs tracking-[0.3em] text-white/50 mb-2">
          A FEW WORDS
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          For You, Azeen
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        <WishCards />
      </motion.div>
    </section>
  );
}