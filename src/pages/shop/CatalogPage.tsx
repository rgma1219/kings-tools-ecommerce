import { EmptyState } from '../../components/ui/EmptyState';

export function CatalogPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Catálogo de Herramientas
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Equipamiento profesional e industrial para taller y obra.
        </p>
      </div>

      <EmptyState
        title="Catálogo listo para conectar"
        description="En el Paso 5 conectaremos el listado de los 60 productos de Firestore con búsqueda con debounce, filtro por categoría y paginación."
      />
    </section>
  );
}

