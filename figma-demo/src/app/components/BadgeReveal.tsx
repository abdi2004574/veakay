import { motion } from "motion/react";
import { Award } from "lucide-react";

interface BadgeRevealProps {
  badge: string;
  onClose: () => void;
}

export function BadgeReveal({ badge, onClose }: BadgeRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-card rounded-3xl p-8 text-center max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{
            background: "var(--veakey-gradient)",
            boxShadow: "0 8px 32px var(--veakey-shadow)",
          }}
        >
          <Award className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-2xl mb-2">Badge Unlocked!</h2>
        <p className="text-lg mb-6">{badge}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-2xl"
          style={{
            background: "var(--veakey-gradient)",
            color: "white",
          }}
        >
          Awesome!
        </button>
      </motion.div>
    </motion.div>
  );
}
