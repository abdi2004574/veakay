import { ButtonHTMLAttributes } from "react";
import { motion } from "motion/react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
}

export function GradientButton({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled = false,
  ...props
}: GradientButtonProps) {
  if (variant === "outline") {
    return (
      <motion.button
        whileTap={disabled ? undefined : { scale: 0.98 }}
        className={`px-6 py-3.5 rounded-2xl border-2 font-semibold transition-all ${
          fullWidth ? "w-full" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        style={{
          borderColor: "var(--vaykae-pink)",
          color: "var(--vaykae-pink)",
        }}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`px-6 py-3.5 rounded-2xl text-white font-semibold shadow-lg transition-all ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={{
        background: "var(--vaykae-gradient)",
        boxShadow: "0 4px 16px var(--vaykae-shadow)",
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}