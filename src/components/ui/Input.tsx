import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <input
        id={id}
        className={`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 disabled:opacity-60 dark:bg-zinc-950 dark:text-zinc-100 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-zinc-300 focus:border-yellow-500 focus:ring-yellow-500/20 dark:border-zinc-700'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

