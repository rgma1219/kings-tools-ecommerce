const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB para cuidar la capa gratuita de S3

interface PresignResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Seleccioná un archivo de imagen válido (JPG, PNG, WEBP).');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('La imagen no puede superar los 5 MB de tamaño.');
  }

  const presignRes = await fetch('/api/presign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
    }),
  });

  if (!presignRes.ok) {
    let errorMessage = 'No se pudo obtener autorización para subir la imagen.';
    try {
      const errData = (await presignRes.json()) as { error?: string };
      if (errData.error) {
        errorMessage = errData.error;
      }
    } catch {
      // Mantiene el mensaje por defecto si la respuesta no es JSON
    }
    throw new Error(errorMessage);
  }

  const { uploadUrl, publicUrl } =
    (await presignRes.json()) as PresignResponse;

  const s3UploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!s3UploadRes.ok) {
    throw new Error(
      'Falló la carga del archivo hacia AWS S3. Verificá la configuración de CORS del bucket.'
    );
  }

  return publicUrl;
}

