import { EmptyState } from '../../components/ui/EmptyState';

export function AdminProductsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gestión de Productos (CRUD)
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Alta, edición, baja y subida de imágenes a AWS S3.
        </p>
      </div>
      <EmptyState
        title="Panel Admin de Productos protegido por rol"
        description="Solo usuarios con role === 'admin' pueden visualizar este layout y gestionar el catálogo."
      />
    </section>
  );
}

