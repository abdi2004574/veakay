import { motion } from "motion/react";

interface GradientProgressProps {
  value: number;
  max?: number;
  showPercentage?: boolean;
  animate?: boolean;
}

export function GradientProgress({
  value,
  max = 100,
  showPercentage = true,
  animate = true,
}: GradientProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: "var(--vaykae-gradient)",
          }}
        />
      </div>
      {showPercentage && (
        <p className="text-sm text-muted-foreground mt-1">
          {percentage.toFixed(0)}% funded
        </p>
      )}
    </div>
  );
}