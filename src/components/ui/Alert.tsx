import type { ReactNode } from 'react';

interface AlertProps {
  variant?: 'error' | 'success' | 'info';
  children: ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<AlertProps['variant']>, string> = {
  error:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
  info: 'border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300',
};

export function Alert({ variant = 'error', children }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </div>
  );
}

