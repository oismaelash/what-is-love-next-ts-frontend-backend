import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { logger } from '../utils/logger';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadToS3(imageUrl: string, key: string): Promise<string> {
  try {
    // Baixa a imagem da URL
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Faz upload para o S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: Buffer.from(buffer),
        ContentType: 'image/png',
        ACL: 'public-read',
      })
    );

    // Retorna a URL pública do S3
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    logger.error('Erro ao fazer upload para S3:', error);
    throw error;
  }
} 