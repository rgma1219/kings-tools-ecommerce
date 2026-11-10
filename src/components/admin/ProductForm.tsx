import { useState, type ChangeEvent, type FormEvent } from 'react';
import { uploadProductImage } from '../../services/storage.service';
import {
  PRODUCT_CATEGORIES,
  type CategoryId,
  type Product,
  type ProductFormData,
} from '../../types';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const DEFAULT_PLACEHOLDER_IMAGE =
  'https://i.ibb.co/G4ttxzN3/kingstools-imagen-producto.png';

interface ProductFormProps {
  initialProduct?: Product | null;
  isSubmitting: boolean;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({
  initialProduct = null,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState<string>(initialProduct?.name ?? '');
  const [categoryId, setCategoryId] = useState<CategoryId>(
    initialProduct?.categoryId ?? PRODUCT_CATEGORIES[0].id
  );
  const [price, setPrice] = useState<string>(
    initialProduct ? String(initialProduct.price) : ''
  );
  const [stock, setStock] = useState<string>(
    initialProduct ? String(initialProduct.stock) : ''
  );
  const [description, setDescription] = useState<string>(
    initialProduct?.description ?? ''
  );
  const [imageUrl, setImageUrl] = useState<string>(
    initialProduct?.imageUrl ?? DEFAULT_PLACEHOLDER_IMAGE
  );

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFormError(null);
    setUploadSuccess(null);
    setIsUploadingImage(true);

    try {
      const uploadedPublicUrl = await uploadProductImage(file);
      setImageUrl(uploadedPublicUrl);
      setUploadSuccess('Imagen subida correctamente a AWS S3.');
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Error al subir la imagen a AWS S3.'
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedImageUrl = imageUrl.trim();
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (trimmedName.length < 3) {
      setFormError('El nombre del producto debe tener al menos 3 caracteres.');
      return;
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setFormError('El precio debe ser un número mayor a 0.');
      return;
    }

    if (
      Number.isNaN(numericStock) ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setFormError('El stock debe ser un número entero mayor o igual a 0.');
      return;
    }

    if (trimmedDescription.length < 10) {
      setFormError('La descripción debe tener al menos 10 caracteres.');
      return;
    }

    if (!trimmedImageUrl.startsWith('http')) {
      setFormError('Ingresá una URL de imagen válida o subí un archivo a S3.');
      return;
    }

    try {
      await onSubmit({
        name: trimmedName,
        categoryId,
        price: numericPrice,
        stock: numericStock,
        description: trimmedDescription,
        imageUrl: trimmedImageUrl,
      });
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el producto en Firestore.'
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isEditing
              ? `Modificando ID: ${initialProduct?.id}`
              : 'Completá los datos técnicos y subí la fotografía a AWS S3.'}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting || isUploadingImage}
        >
          Cancelar
        </Button>
      </div>

      {formError && <Alert variant="error">{formError}</Alert>}
      {uploadSuccess && <Alert variant="success">{uploadSuccess}</Alert>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre del producto"
          placeholder="Ej: Taladro Percutor Inalámbrico 20V"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="product-category"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Categoría
          </label>
          <select
            id="product-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as CategoryId)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Precio (ARS)"
          type="number"
          min="1"
          step="1"
          placeholder="Ej: 145000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={isSubmitting}
          required
        />

        <Input
          label="Stock disponible (unidades)"
          type="number"
          min="0"
          step="1"
          placeholder="Ej: 15"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="product-description"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Descripción técnica
        </label>
        <textarea
          id="product-description"
          rows={3}
          placeholder="Detallá potencia, medidas, materiales e implementos incluidos..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-[1fr_140px] dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="product-image-file"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Subir imagen a AWS S3 (Presigned URL)
            </label>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Formatos JPG, PNG o WEBP (máx. 5 MB). Se sube directo al bucket{' '}
              <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-[11px] dark:bg-zinc-800">
                kings-tools-s3
              </code>
              .
            </p>
            <input
              id="product-image-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploadingImage || isSubmitting}
              className="mt-2 block w-full text-xs text-zinc-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-yellow-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-950 hover:file:bg-yellow-400 disabled:opacity-50 dark:text-zinc-300"
            />
            {isUploadingImage && (
              <p className="mt-2 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                Firmando URL y subiendo imagen a AWS S3...
              </p>
            )}
          </div>

          <Input
            label="URL de imagen resultante"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isUploadingImage || isSubmitting}
            required
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-1.5">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Vista previa
          </span>
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <img
              src={imageUrl || DEFAULT_PLACEHOLDER_IMAGE}
              alt="Vista previa del producto"
              className="h-full w-full object-contain p-1"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting || isUploadingImage}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isUploadingImage}
        >
          {isEditing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  );
}

