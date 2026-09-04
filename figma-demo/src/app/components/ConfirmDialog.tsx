import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

type DialogType = "confirm" | "warning" | "success" | "error" | "info";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "confirm",
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "error":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "info":
        return <Info className="w-16 h-16 text-blue-500" />;
      default:
        return <AlertTriangle className="w-16 h-16" style={{ color: "var(--vaykae-pink)" }} />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "warning":
        return { background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)" };
      case "error":
        return { background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)" };
      case "success":
        return { background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)" };
      default:
        return { background: "var(--vaykae-gradient)" };
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        style={{ maxWidth: "430px", margin: "0 auto", left: 0, right: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        >
          {/* Icon */}
          <div className="flex justify-center pt-8 pb-4">
            {getIcon()}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 text-center">
            <h2 className="text-xl font-bold mb-3">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{message}</p>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-border flex gap-3">
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-full font-medium bg-muted hover:bg-muted/80 transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-full font-medium text-white transition-all hover:scale-105"
              style={getConfirmButtonStyle()}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
