'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; type: ToastType; title: string; description?: string };

type ToastCtx = {
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => void;
};

const ToastContext = React.createContext<ToastCtx | null>(null);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-card',
              t.type === 'success' && 'border-emerald-200',
              t.type === 'error' && 'border-rose-200',
              t.type === 'info' && 'border-brand-100'
            )}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
            ) : t.type === 'error' ? (
              <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-600" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{t.title}</p>
              {t.description ? (
                <p className="mt-0.5 text-xs text-muted">{t.description}</p>
              ) : null}
            </div>
            <button
              aria-label="Dismiss"
              onClick={() =>
                setToasts((prev) => prev.filter((x) => x.id !== t.id))
              }
              className="rounded-md p-1 text-muted transition hover:bg-brand-50 hover:text-brand-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToasterProvider');
  return ctx;
}
