export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-zinc-500 sm:flex-row dark:text-zinc-400">
        <p>
          &copy; {new Date().getFullYear()} King&apos;s Tools. Ferretería
          Industrial &amp; Herramientas.
        </p>
        <p>Calidad profesional para taller y obra.</p>
      </div>
    </footer>
  );
}

