interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SIZE_CLASSES: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

export function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-8"
    >
      <div
        className={`${SIZE_CLASSES[size]} animate-spin rounded-full border-zinc-300 border-t-yellow-500 dark:border-zinc-700 dark:border-t-yellow-500`}
      />
      {label && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      )}
    </div>
  );
}

