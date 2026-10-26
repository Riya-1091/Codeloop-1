import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toastConfig: Record<ToastType, { icon: typeof CheckCircle2; color: string }> = {
  success: { icon: CheckCircle2, color: 'text-success' },
  info: { icon: Info, color: 'text-accent-400' },
  warning: { icon: AlertTriangle, color: 'text-warning' },
  error: { icon: XCircle, color: 'text-danger' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => {
          const config = toastConfig[t.type];
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-lg border border-line surface px-4 py-3 shadow-float animate-fade-up"
              style={{ animationDuration: '0.3s' }}
            >
              <config.icon className={`h-4 w-4 shrink-0 ${config.color}`} />
              <span className="text-sm text-ink-primary">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-2 text-ink-muted hover:text-ink-primary"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
