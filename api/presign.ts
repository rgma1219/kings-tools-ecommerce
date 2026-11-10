import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PresignRequestBody {
  fileName?: string;
  contentType?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usá POST.' });
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET;

  if (!accessKeyId || !secretAccessKey || !region || !bucket) {
    return res.status(500).json({
      error:
        'Faltan variables de entorno de AWS S3 en el servidor (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET).',
    });
  }

  const body = (req.body ?? {}) as PresignRequestBody;
  const { fileName, contentType } = body;

  if (!fileName || !contentType) {
    return res.status(400).json({
      error: 'Los campos fileName y contentType son obligatorios.',
    });
  }

  if (!contentType.startsWith('image/')) {
    return res.status(400).json({
      error: 'Solo se permite la subida de archivos de imagen.',
    });
  }

  const cleanFileName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const objectKey = `products/${Date.now()}-${cleanFileName}`;

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${objectKey}`;

    return res.status(200).json({
      uploadUrl,
      publicUrl,
      key: objectKey,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error al generar la URL pre-firmada de S3.';
    return res.status(500).json({ error: message });
  }
}

