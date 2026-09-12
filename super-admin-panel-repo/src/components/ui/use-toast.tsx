import * as React from "react";

type ToastVariant = "default" | "destructive" | "success";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
}

const listeners: Array<(state: { toasts: Toast[] }) => void> = [];
let state: { toasts: Toast[] } = { toasts: [] };

export function toast({ ...props }: Omit<Toast, "id">) {
  const id = `toast-${Math.random().toString(36).slice(2, 9)}`;

  const update = (newState: { toasts: Toast[] }) => {
    state = newState;
    listeners.forEach((l) => l(state));
  };

  const addToast: Toast = { id, ...props };
  update({ toasts: [...state.toasts, addToast] });

  const timeout = setTimeout(() => {
    update({ toasts: state.toasts.filter((t) => t.id !== id) });
  }, 4000);

  return {
    id,
    dismiss: () => {
      clearTimeout(timeout);
      update({ toasts: state.toasts.filter((t) => t.id !== id) });
    },
  };
}

export function useToast() {
  const [toasts, setToasts] = React.useState(state.toasts);

  React.useEffect(() => {
    setToasts(state.toasts);
    const handleChange = (newState: { toasts: Toast[] }) => {
      setToasts(newState.toasts);
    };
    listeners.push(handleChange);
    return () => {
      const idx = listeners.indexOf(handleChange);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    toasts,
    toast,
  };
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-h-screen w-full flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="group pointer-events-auto relative flex w-full max-w-[400px] items-start gap-3 overflow-hidden rounded-md border p-4 pr-12 shadow-lg bg-background text-foreground"
          onAnimationEnd={() => {
            state = { toasts: state.toasts.filter((toast) => toast.id !== t.id) };
            listeners.forEach((l) => l(state));
          }}
        >
          {t.title && <div className="text-sm font-semibold">{t.title}</div>}
          {t.description && <div className="text-sm opacity-90">{t.description}</div>}
          {t.actionLabel && t.onAction && (
            <button
              className="absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium hover:underline"
              onClick={t.onAction}
            >
              {t.actionLabel}
            </button>
          )}
          <button
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 hover:text-foreground"
            onClick={() => {
              state = { toasts: state.toasts.filter((toast) => toast.id !== t.id) };
              listeners.forEach((l) => l(state));
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
