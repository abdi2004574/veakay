import { Star } from "lucide-react";
import { motion } from "motion/react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showNumber?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  size = "md",
  readonly = false,
  showNumber = false,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const handleClick = (index: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.button
          key={index}
          type="button"
          onClick={() => handleClick(index)}
          disabled={readonly}
          whileHover={!readonly ? { scale: 1.1 } : {}}
          whileTap={!readonly ? { scale: 0.95 } : {}}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300"
            }`}
          />
        </motion.button>
      ))}
      {showNumber && (
        <span className="ml-2 text-sm font-bold text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
