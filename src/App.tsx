import { useState } from "react";
import { PRODUCT_CATEGORIES } from "./types";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkPreview = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="King's Tools Logo"
              className="h-10 w-10 rounded object-contain"
              onError={(e) => {
                e.currentTarget.src = "/images/product-placeholder.svg";
              }}
            />
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                KING&apos;S <span className="text-yellow-500">TOOLS</span>
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ferretería Industrial y Herramientas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleDarkPreview}
            className="rounded-md border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            {isDark ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="inline-block rounded bg-yellow-500/15 px-2.5 py-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
              Setup Inicial Verificado
            </span>
            <h2 className="mt-3 text-xl font-semibold">
              Arquitectura Base y Categorías Definidas
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Categorías tipadas en TypeScript para el catálogo de King&apos;s
              Tools:
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PRODUCT_CATEGORIES.map((category) => (
                <li
                  key={category.id}
                  className="rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
                >
                  {category.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Vista previa del Placeholder de Producto
            </p>
            <img
              src="/images/product-placeholder.png"
              alt="Placeholder de producto"
              className="h-48 w-48 rounded-lg border border-zinc-200 object-cover dark:border-zinc-800"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
