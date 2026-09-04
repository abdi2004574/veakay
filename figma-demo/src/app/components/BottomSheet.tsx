import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxHeight?: string;
  showHandle?: boolean;
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxHeight = "85vh",
  showHandle = true 
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
        onClick={onClose}
        style={{ maxWidth: "430px", margin: "0 auto", left: 0, right: 0 }}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-t-3xl w-full overflow-hidden shadow-2xl"
          style={{ maxHeight }}
        >
          {/* Handle */}
          {showHandle && (
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted rounded-full" />
            </div>
          )}

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-lg font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: title ? `calc(${maxHeight} - 60px)` : `calc(${maxHeight} - 32px)` }}>
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
