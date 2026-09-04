import { motion, AnimatePresence } from "motion/react";
import { LucideIcon } from "lucide-react";

interface ActionSheetOption {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "danger" | "primary";
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  options: ActionSheetOption[];
  showCancel?: boolean;
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  options,
  showCancel = true,
}: ActionSheetProps) {
  if (!isOpen) return null;

  const getOptionStyle = (variant?: "default" | "danger" | "primary") => {
    switch (variant) {
      case "danger":
        return "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20";
      case "primary":
        return "hover:bg-muted";
      default:
        return "hover:bg-muted";
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end p-4"
        onClick={onClose}
        style={{ maxWidth: "430px", margin: "0 auto", left: 0, right: 0 }}
      >
        <div className="w-full space-y-3">
          {/* Main Sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl w-full overflow-hidden shadow-2xl"
          >
            {/* Title */}
            {title && (
              <div className="px-4 py-3 border-b border-border text-center">
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
              </div>
            )}

            {/* Options */}
            <div className="divide-y divide-border">
              {options.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      option.onClick();
                      onClose();
                    }}
                    className={`w-full px-4 py-4 flex items-center justify-center gap-3 transition-colors ${getOptionStyle(option.variant)}`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Cancel Button */}
          {showCancel && (
            <motion.button
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300, delay: 0.05 }}
              onClick={onClose}
              className="w-full h-14 bg-card rounded-3xl font-semibold shadow-lg hover:scale-[0.98] transition-transform"
            >
              Cancel
            </motion.button>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
