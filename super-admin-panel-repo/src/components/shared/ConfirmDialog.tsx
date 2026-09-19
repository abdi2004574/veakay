import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface ConfirmDialogProps {
  title: string;
  description?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => void;
  isPending?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  messageLabel,
  messagePlaceholder,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "destructive",
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ConfirmDialogProps) {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    onConfirm(message || undefined);
    setMessage("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {messageLabel && (
          <div className="space-y-2 py-4">
            <label className="text-sm font-medium">{messageLabel}</label>
            <Textarea
              placeholder={messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            confirmVariant={confirmVariant}
          >
            {isPending ? "Confirming..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
